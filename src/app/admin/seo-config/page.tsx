/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Save,
  Search,
  Settings,
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

interface SeoConfig {
  id: number;
  path: string;
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_image: string;
  og_locale: string;
  og_type: string;
}

const initialFormState: Omit<SeoConfig, "id"> = {
  path: "",
  title: "",
  description: "",
  keywords: "",
  og_title: "",
  og_description: "",
  og_url: "",
  og_image: "",
  og_locale: "id_ID",
  og_type: "website",
};

export default function SeoConfigAdminPage() {
  const [data, setData] = useState<SeoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SeoConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const columns = [
    { key: "path", label: "Path Halaman" },
    { key: "title", label: "SEO Title" },
    { key: "og_title", label: "OG Title" },
    {
      key: "description",
      label: "Deskripsi Singkat",
      render: (row: SeoConfig) => row.description.substring(0, 50) + "...",
    },
  ];

  useEffect(() => {
    fetchAllSeoConfigs();
  }, []);

  const fetchAllSeoConfigs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seo-config");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat konfigurasi SEO");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: SeoConfig) => {
    if (item) {
      setEditing(item);
      setForm({
        path: item.path,
        title: item.title,
        description: item.description,
        keywords: item.keywords,
        og_title: item.og_title,
        og_description: item.og_description,
        og_url: item.og_url,
        og_image: item.og_image,
        og_locale: item.og_locale,
        og_type: item.og_type,
      });
    } else {
      setEditing(null);
      setForm(initialFormState);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        await api.patch(`/seo-config/${editing.id}`, form);
        toast.success("Konfigurasi SEO berhasil diperbarui");
      } else {
        await api.post("/seo-config", form);
        toast.success("Konfigurasi SEO baru berhasil ditambahkan");
      }

      fetchAllSeoConfigs();
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus konfigurasi SEO ini?")) {
      try {
        await api.delete(`/seo-config/${id}`);
        toast.success("Konfigurasi SEO dihapus");
        fetchAllSeoConfigs();
      } catch {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const renderSection = (
    title: string,
    fields: (keyof Omit<SeoConfig, "id">)[]
  ) => (
    <div className="border p-4 rounded-lg space-y-3 bg-muted/10">
      <h3 className="text-lg font-semibold border-b pb-2">{title}</h3>
      {fields.map((key) => {
        const fieldKey = key as keyof typeof form;
        return (
          <div key={fieldKey}>
            <label className="text-sm font-medium capitalize">
              {fieldKey.replace(/_/g, " ")}
            </label>
            {fieldKey === "description" ||
            fieldKey === "og_description" ||
            fieldKey === "keywords" ? (
              <Textarea
                // Perbaikan di sini: Akses form menggunakan fieldKey yang sudah ditiped dengan benar
                value={form[fieldKey] as string}
                onChange={(e) =>
                  setForm({ ...form, [fieldKey]: e.target.value })
                }
                rows={3}
                required
              />
            ) : (
              <Input
                // Perbaikan di sini
                value={form[fieldKey] as string}
                onChange={(e) =>
                  setForm({ ...form, [fieldKey]: e.target.value })
                }
                required
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Search size={24} /> Manajemen Konfigurasi SEO
          </CardTitle>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={18} /> Tambah Konfigurasi
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
                  </div>
                ),
              }))}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? `Edit SEO untuk Path: ${editing.path}`
                : "Tambah Konfigurasi SEO Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-medium">
                Path Halaman (Unique)
              </label>
              <Input
                value={form.path}
                onChange={(e) => setForm({ ...form, path: e.target.value })}
                required
                placeholder="Contoh: /profile atau /berita/detail"
                disabled={!!editing}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {renderSection("Meta Tag (Google Search)", [
                "title",
                "description",
                "keywords",
              ])}
              {renderSection("Open Graph (Social Media Share)", [
                "og_title",
                "og_description",
                "og_url",
                "og_image",
                "og_type",
                "og_locale",
              ])}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save size={18} className="mr-2" />{" "}
                {editing ? "Simpan Perubahan" : "Tambah Konfigurasi"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
