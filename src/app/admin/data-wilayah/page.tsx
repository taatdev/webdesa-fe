/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/DataTable"; // Sesuaikan path jika perlu
import { toast } from "sonner";
import { api } from "@/utils/api"; // Sesuaikan path jika perlu

interface DataWilayah {
  id: number;
  dusun: string;
  luas_km2: number;
  batas_utara: string;
  batas_selatan: string;
  batas_timur: string;
  batas_barat: string;
  is_show: boolean;
}

export default function DataWilayahAdminPage() {
  const [data, setData] = useState<DataWilayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DataWilayah | null>(null);
  const [saving, setSaving] = useState(false); // State untuk loading saat submit

  const [form, setForm] = useState({
    dusun: "",
    luas_km2: 0,
    batas_utara: "",
    batas_selatan: "",
    batas_timur: "",
    batas_barat: "",
    is_show: true,
  });

  const columns = [
    { key: "dusun", label: "Dusun" },
    { key: "luas_km2", label: "Luas (km²)" },
    { key: "batas_utara", label: "Batas Utara" },
    { key: "batas_selatan", label: "Batas Selatan" },
    { key: "batas_timur", label: "Batas Timur" },
    { key: "batas_barat", label: "Batas Barat" },
    {
      key: "is_show",
      label: "Status",
      render: (row: DataWilayah) =>
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
      // Endpoint disesuaikan dengan controller backend: '/wilayah'
      const res = await api.get("/wilayah");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat data wilayah");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: DataWilayah) => {
    if (item) {
      setEditing(item);
      setForm({
        dusun: item.dusun,
        luas_km2: item.luas_km2,
        batas_utara: item.batas_utara,
        batas_selatan: item.batas_selatan,
        batas_timur: item.batas_timur,
        batas_barat: item.batas_barat,
        is_show: item.is_show,
      });
    } else {
      setEditing(null);
      setForm({
        dusun: "",
        luas_km2: 0,
        batas_utara: "",
        batas_selatan: "",
        batas_timur: "",
        batas_barat: "",
        is_show: true,
      });
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

    // Payload data yang akan dikirim ke API
    const payload = {
      dusun: form.dusun,
      luas_km2: Number(form.luas_km2), // Pastikan ini dikirim sebagai number
      batas_utara: form.batas_utara,
      batas_selatan: form.batas_selatan,
      batas_timur: form.batas_timur,
      batas_barat: form.batas_barat,
      is_show: form.is_show,
    };

    try {
      if (editing) {
        // Menggunakan PUT untuk update (sesuai controller backend)
        await api.put(`/wilayah/${editing.id}`, payload);
        toast.success("Data Wilayah berhasil diperbarui");
      } else {
        await api.post("/wilayah", payload);
        toast.success("Data Wilayah berhasil ditambahkan");
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
    if (confirm("Yakin ingin menghapus data wilayah ini?")) {
      try {
        await api.delete(`/wilayah/${id}`);
        toast.success("Data wilayah dihapus");
        fetchData();
      } catch {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleToggleShow = async (item: DataWilayah) => {
    try {
      await api.put(`/wilayah/${item.id}`, { is_show: !item.is_show });
      toast.success(`Data ${item.is_show ? "disembunyikan" : "ditampilkan"}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah status");
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
            Manajemen Data Wilayah
          </CardTitle>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={18} /> Tambah
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

      {/* Modal Tambah / Edit */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Data Wilayah" : "Tambah Data Wilayah"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Nama Dusun</label>
              <Input
                value={form.dusun}
                onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Luas Wilayah (km²)</label>
              <Input
                type="number"
                step="0.01"
                value={form.luas_km2}
                onChange={(e) =>
                  setForm({ ...form, luas_km2: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Batas Utara</label>
              <Input
                value={form.batas_utara}
                onChange={(e) =>
                  setForm({ ...form, batas_utara: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Batas Selatan</label>
              <Input
                value={form.batas_selatan}
                onChange={(e) =>
                  setForm({ ...form, batas_selatan: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Batas Timur</label>
              <Input
                value={form.batas_timur}
                onChange={(e) =>
                  setForm({ ...form, batas_timur: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Batas Barat</label>
              <Input
                value={form.batas_barat}
                onChange={(e) =>
                  setForm({ ...form, batas_barat: e.target.value })
                }
                required
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
              <span className="text-sm">Tampilkan di halaman publik</span>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
