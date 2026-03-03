/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Clipboard,
  Link,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/admin/DataTable";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  slug: string;
  is_show: boolean;
}

export default function ServicesAdminPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
    slug: "",
    is_show: true,
  });

  const columns = [
    {
      key: "icon",
      label: "Ikon",
      render: (row: Service) => (
        <span className="text-xl">{row.icon || "❓"}</span>
      ),
    },
    { key: "title", label: "Judul" },
    {
      key: "description",
      label: "Deskripsi Singkat",
      render: (row: Service) => row.description.substring(0, 50) + "...",
    },
    { key: "slug", label: "Slug" },
    {
      key: "is_show",
      label: "Status",
      render: (row: Service) =>
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
    setLoading(true);
    try {
      const res = await api.get("/services");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat data layanan");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: Service) => {
    if (item) {
      setEditing(item);
      setForm({
        title: item.title,
        description: item.description,
        icon: item.icon,
        slug: item.slug,
        is_show: item.is_show,
      });
    } else {
      setEditing(null);
      setForm({
        title: "",
        description: "",
        icon: "",
        slug: "",
        is_show: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      slug: form.slug || generateSlug(form.title),
      is_show: form.is_show,
    };

    try {
      if (editing) {
        await api.patch(`/services/${editing.id}`, payload);
        toast.success("Layanan berhasil diperbarui");
      } else {
        await api.post("/services", payload);
        toast.success("Layanan berhasil ditambahkan");
      }

      fetchData();
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus layanan ini?")) {
      try {
        await api.delete(`/services/${id}`);
        toast.success("Layanan dihapus");
        fetchData();
      } catch {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleToggleShow = async (item: Service) => {
    setSaving(true);
    try {
      await api.patch(`/services/${item.id}`, { is_show: !item.is_show });
      toast.success(
        `Layanan ${item.is_show ? "disembunyikan" : "ditampilkan"}`
      );
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah status");
    } finally {
      setSaving(false);
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
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Manajemen Layanan
          </CardTitle>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={18} /> Tambah Layanan
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
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
                      onClick={() => handleToggleShow(item)}
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

      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Layanan" : "Tambah Layanan Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Judul Layanan</label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title: newTitle,
                    slug: f.slug || generateSlug(newTitle),
                  }));
                }}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                Ikon <Zap size={14} />
              </label>
              <Input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                required
                placeholder="Contoh: 🛠️ atau kode dari library ikon (misal: lucide-react)"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                Slug <Link size={14} />
              </label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: generateSlug(e.target.value) })
                }
                placeholder="slug-otomatis-dari-judul"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_show}
                onChange={(e) =>
                  setForm({ ...form, is_show: e.target.checked })
                }
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-sm">
                Tampilkan Layanan ini di halaman publik
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Simpan Perubahan" : "Tambah Layanan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
