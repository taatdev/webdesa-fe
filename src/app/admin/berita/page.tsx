/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/DataTable";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface News {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  excerpt: string;
  content?: string;
  is_show: boolean;
}

export default function BeritaAdminPage() {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    date: "",
    excerpt: "",
    content: "",
    is_show: true,
    image: "" as string | null, // URL hasil upload
    file: null as File | null, // file sebelum upload
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const columns = [
    { key: "title", label: "Judul" },
    { key: "slug", label: "Slug" },
    { key: "date", label: "Tanggal" },
    {
      key: "is_show",
      label: "Status",
      render: (row: News) =>
        row.is_show ? (
          <span className="text-green-600 font-medium">Ditampilkan</span>
        ) : (
          <span className="text-red-500 font-medium">Disembunyikan</span>
        ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/news");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat berita");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: News) => {
    if (item) {
      setEditing(item);
      setForm({
        title: item.title,
        slug: item.slug,
        date: item.date.split("T")[0],
        excerpt: item.excerpt,
        content: item.content ?? "",
        is_show: item.is_show,
        image: item.image,
        file: null,
      });
      setPreview(item.image ? `${baseUrl}${item.image}` : null);
    } else {
      setEditing(null);
      setForm({
        title: "",
        slug: "",
        date: new Date().toISOString().split("T")[0],
        excerpt: "",
        content: "",
        is_show: true,
        image: "",
        file: null,
      });
      setPreview(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  /** 🔹 Upload file ke backend /upload/image */
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const url = res.data.data.url;
      setForm((f) => ({ ...f, image: url }));
      toast.success("Gambar berhasil diupload");
      return url;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload gagal");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload file kalau ada
      let imageUrl = form.image;
      if (form.file) {
        const uploaded = await handleImageUpload(form.file);
        if (!uploaded) return;
        imageUrl = uploaded;
      }

      const payload = {
        title: form.title,
        slug: form.slug,
        date: form.date,
        excerpt: form.excerpt,
        content: form.content,
        is_show: form.is_show,
        image: imageUrl,
      };

      if (editing) {
        await api.patch(`/news/${editing.id}`, payload);
        toast.success("Berita berhasil diperbarui");
      } else {
        await api.post("/news", payload);
        toast.success("Berita berhasil ditambahkan");
      }

      fetchData();
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus berita ini?")) {
      try {
        await api.delete(`/news/${id}`);
        toast.success("Berita dihapus");
        fetchData();
      } catch {
        toast.error("Gagal menghapus berita");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Manajemen Berita</CardTitle>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={18} /> Tambah
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data.map((item) => ({
                ...item,
                actions: (
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal(item)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={item.is_show ? "outline" : "default"}
                      onClick={async () => {
                        await api.patch(`/news/${item.id}`, {
                          is_show: !item.is_show,
                        });
                        fetchData();
                      }}
                    >
                      {item.is_show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                ),
              }))}
            />
          )}
        </CardContent>
      </Card>

      {/* 🔹 Modal Tambah / Edit */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Berita" : "Tambah Berita"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Judul</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                Thumbnail <Upload size={16} />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-48 h-32 object-cover rounded-md border mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setForm({ ...form, file });
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Isi Berita</label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_show}
                onChange={(e) =>
                  setForm({ ...form, is_show: e.target.checked })
                }
              />
              <span className="text-sm">Tampilkan berita</span>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit">
                {editing ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
