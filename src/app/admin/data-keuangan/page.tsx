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
import { DataTable } from "@/components/admin/DataTable";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface DataKeuangan {
  id: number;
  tahun: string;
  jenis_anggaran: string;
  jumlah: number;
  keterangan: string;
  is_show: boolean;
}

export default function DataKeuanganAdminPage() {
  const [data, setData] = useState<DataKeuangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DataKeuangan | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    tahun: String(new Date().getFullYear()),
    jenis_anggaran: "",
    jumlah: 0,
    keterangan: "",
    is_show: true,
  });

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const columns = [
    { key: "tahun", label: "Tahun" },
    { key: "jenis_anggaran", label: "Jenis Anggaran" },
    {
      key: "jumlah",
      label: "Jumlah",
      render: (row: DataKeuangan) => (
        <span className="font-semibold">{formatRupiah(row.jumlah)}</span>
      ),
    },
    { key: "keterangan", label: "Keterangan" },
    {
      key: "is_show",
      label: "Status",
      render: (row: DataKeuangan) =>
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
      const res = await api.get("/keuangan");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat data keuangan");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: DataKeuangan) => {
    if (item) {
      setEditing(item);
      setForm({
        tahun: item.tahun,
        jenis_anggaran: item.jenis_anggaran,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
        is_show: item.is_show,
      });
    } else {
      setEditing(null);
      setForm({
        tahun: String(new Date().getFullYear()),
        jenis_anggaran: "",
        jumlah: 0,
        keterangan: "",
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

    const payload = {
      tahun: form.tahun,
      jenis_anggaran: form.jenis_anggaran,
      jumlah: Number(form.jumlah),
      keterangan: form.keterangan,
      is_show: form.is_show,
    };

    try {
      if (editing) {
        await api.put(`/keuangan/${editing.id}`, payload);
        toast.success("Data Keuangan berhasil diperbarui");
      } else {
        await api.post("/keuangan", payload);
        toast.success("Data Keuangan berhasil ditambahkan");
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
    if (confirm("Yakin ingin menghapus data keuangan ini?")) {
      try {
        await api.delete(`/keuangan/${id}`);
        toast.success("Data keuangan dihapus");
        fetchData();
      } catch {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleToggleShow = async (item: DataKeuangan) => {
    try {
      await api.put(`/keuangan/${item.id}`, { is_show: !item.is_show });
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
            Manajemen Data Keuangan
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
              {editing ? "Edit Data Keuangan" : "Tambah Data Keuangan"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Tahun Anggaran</label>
              <Input
                type="number"
                value={form.tahun}
                onChange={(e) => setForm({ ...form, tahun: e.target.value })}
                required
                placeholder="Contoh: 2024"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Jenis Anggaran</label>
              <Input
                value={form.jenis_anggaran}
                onChange={(e) =>
                  setForm({ ...form, jenis_anggaran: e.target.value })
                }
                required
                placeholder="Contoh: Pendapatan, Belanja Desa, Dana Transfer..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Jumlah Anggaran (IDR)
              </label>
              <Input
                type="number"
                step="0.01"
                value={form.jumlah}
                onChange={(e) =>
                  setForm({ ...form, jumlah: Number(e.target.value) })
                }
                required
                placeholder="Contoh: 50000000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Keterangan</label>
              <textarea
                value={form.keterangan}
                onChange={(e) =>
                  setForm({ ...form, keterangan: e.target.value })
                }
                required
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <span className="text-sm">Tampilkan di laporan publik</span>
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
