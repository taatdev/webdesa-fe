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

interface Gallery {
  id: number;
  title: string;
  image: string;
  category: string;
  is_show: boolean;
}

export default function GaleriAdminPage() {
  const [data, setData] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    is_show: true,
    image: "" as string | null, // URL hasil upload
    file: null as File | null, // file sebelum upload
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const columns = [
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori" },
    {
      key: "is_show",
      label: "Status",
      render: (row: Gallery) =>
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
      const res = await api.get("/gallery");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: Gallery) => {
    if (item) {
      setEditing(item);
      setForm({
        title: item.title,
        category: item.category,
        is_show: item.is_show,
        image: item.image,
        file: null,
      });
      setPreview(item.image ? `${baseUrl}${item.image}` : null);
    } else {
      setEditing(null);
      setForm({
        title: "",
        category: "",
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
        category: form.category,
        is_show: form.is_show,
        image: imageUrl,
      };

      if (editing) {
        await api.patch(`/gallery/${editing.id}`, payload);
        toast.success("Galeri berhasil diperbarui");
      } else {
        await api.post("/gallery", payload);
        toast.success("Galeri berhasil ditambahkan");
      }

      fetchData();
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus gambar ini?")) {
      try {
        await api.delete(`/gallery/${id}`);
        toast.success("Gambar dihapus");
        fetchData();
      } catch {
        toast.error("Gagal menghapus data");
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
          <CardTitle className="text-2xl font-bold">Manajemen Galeri</CardTitle>
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
                        await api.patch(`/gallery/${item.id}`, {
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
              {editing ? "Edit Gambar" : "Tambah Gambar"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Judul</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kategori</label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Contoh: Acara, Kegiatan, Produk..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                Gambar <Upload size={16} />
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_show}
                onChange={(e) =>
                  setForm({ ...form, is_show: e.target.checked })
                }
              />
              <span className="text-sm">Tampilkan di galeri publik</span>
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
