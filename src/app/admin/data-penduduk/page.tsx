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

interface DataPenduduk {
  id: number;
  nik: string;
  nama: string;
  jenis_kelamin: "L" | "P";
  tanggal_lahir: string; // Format YYYY-MM-DD
  alamat: string;
  dusun: string | null;
  rt_rw: string | null;
  pekerjaan: string;
  status_kawin: string;
  is_show: boolean;
}

export default function DataPendudukAdminPage() {
  const [data, setData] = useState<DataPenduduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DataPenduduk | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jenis_kelamin: "L" as "L" | "P",
    tanggal_lahir: "", // YYYY-MM-DD
    alamat: "",
    dusun: "",
    rt_rw: "",
    pekerjaan: "",
    status_kawin: "",
    is_show: true,
  });

  const columns = [
    { key: "nik", label: "NIK" },
    { key: "nama", label: "Nama" },
    { key: "jenis_kelamin", label: "JK" },
    { key: "tanggal_lahir", label: "Tgl Lahir" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "dusun", label: "Dusun" },
    { key: "rt_rw", label: "RT/RW" },
    {
      key: "is_show",
      label: "Status",
      render: (row: DataPenduduk) =>
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
      // Endpoint disesuaikan dengan controller backend: '/penduduk'
      const res = await api.get("/penduduk");
      setData(res.data);
    } catch {
      toast.error("Gagal memuat data penduduk");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: DataPenduduk) => {
    if (item) {
      setEditing(item);
      setForm({
        nik: item.nik,
        nama: item.nama,
        jenis_kelamin: item.jenis_kelamin,
        tanggal_lahir: item.tanggal_lahir,
        alamat: item.alamat,
        dusun: item.dusun || "",
        rt_rw: item.rt_rw || "",
        pekerjaan: item.pekerjaan,
        status_kawin: item.status_kawin,
        is_show: item.is_show,
      });
    } else {
      setEditing(null);
      setForm({
        nik: "",
        nama: "",
        jenis_kelamin: "L",
        tanggal_lahir: "",
        alamat: "",
        dusun: "",
        rt_rw: "",
        pekerjaan: "",
        status_kawin: "",
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
      nik: form.nik,
      nama: form.nama,
      jenis_kelamin: form.jenis_kelamin,
      tanggal_lahir: form.tanggal_lahir,
      alamat: form.alamat,
      dusun: form.dusun || null, // Kirim null jika kosong
      rt_rw: form.rt_rw || null, // Kirim null jika kosong
      pekerjaan: form.pekerjaan,
      status_kawin: form.status_kawin,
      is_show: form.is_show,
    };

    try {
      if (editing) {
        // Menggunakan PUT untuk update (sesuai controller backend)
        await api.put(`/penduduk/${editing.id}`, payload);
        toast.success("Data Penduduk berhasil diperbarui");
      } else {
        await api.post("/penduduk", payload);
        toast.success("Data Penduduk berhasil ditambahkan");
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
    if (confirm("Yakin ingin menghapus data penduduk ini?")) {
      try {
        await api.delete(`/penduduk/${id}`);
        toast.success("Data penduduk dihapus");
        fetchData();
      } catch {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleToggleShow = async (item: DataPenduduk) => {
    try {
      await api.put(`/penduduk/${item.id}`, { is_show: !item.is_show });
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
            Manajemen Data Penduduk
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
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Data Penduduk" : "Tambah Data Penduduk"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-2">
              <label className="text-sm font-medium">NIK</label>
              <Input
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                required
                maxLength={16}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Jenis Kelamin</label>
              {/* Asumsi Anda memiliki komponen Select/Dropdown */}
              <select
                value={form.jenis_kelamin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jenis_kelamin: e.target.value as "L" | "P",
                  })
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <Input
                type="date"
                value={form.tanggal_lahir}
                onChange={(e) =>
                  setForm({ ...form, tanggal_lahir: e.target.value })
                }
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Alamat Lengkap</label>
              <Input
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Dusun</label>
              <Input
                value={form.dusun}
                onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                placeholder="Contoh: Mekar Sari (Opsional)"
              />
            </div>

            <div>
              <label className="text-sm font-medium">RT/RW</label>
              <Input
                value={form.rt_rw}
                onChange={(e) => setForm({ ...form, rt_rw: e.target.value })}
                placeholder="Contoh: 001/002 (Opsional)"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Pekerjaan</label>
              <Input
                value={form.pekerjaan}
                onChange={(e) =>
                  setForm({ ...form, pekerjaan: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status Kawin</label>
              <Input
                value={form.status_kawin}
                onChange={(e) =>
                  setForm({ ...form, status_kawin: e.target.value })
                }
                required
              />
            </div>

            <div className="col-span-2 flex items-center gap-2 mt-2">
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

            <div className="col-span-2 flex justify-end gap-3 pt-4">
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
