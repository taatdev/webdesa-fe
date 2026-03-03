/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff, X } from "lucide-react";
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

interface PerangkatDesa {
  id?: number;
  nama: string;
  jabatan: string;
  is_show: boolean;
}

interface ProfileData {
  id: number;
  nama_desa: string;
  kepala_desa: string;
  sejarah: string;
  visi: string;
  misi: string[];
  is_show: boolean;
  perangkat: PerangkatDesa[];
}

const initialFormState = {
  nama_desa: "",
  kepala_desa: "",
  sejarah: "",
  visi: "",
  misi: [""] as string[],
  is_show: true,
  perangkat: [] as PerangkatDesa[],
};

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const [perangkatForm, setPerangkatForm] = useState<PerangkatDesa[]>([]);
  const [newMisiText, setNewMisiText] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/profile");
      const data = res.data as ProfileData;
      setProfile(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfile(null);
        toast("Profile desa belum dibuat.", {
          action: { label: "Buat Sekarang", onClick: () => openModal() },
        });
      } else {
        toast.error("Gagal memuat profile desa");
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: ProfileData) => {
    if (item) {
      setForm({
        nama_desa: item.nama_desa,
        kepala_desa: item.kepala_desa,
        sejarah: item.sejarah,
        visi: item.visi,
        misi: item.misi.length > 0 ? item.misi : [""],
        is_show: item.is_show,
        perangkat: item.perangkat,
      });
      setPerangkatForm(item.perangkat);
    } else {
      setForm(initialFormState);
      setPerangkatForm([]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewMisiText("");
  };

  const handleAddMisi = () => {
    if (newMisiText.trim()) {
      setForm((f) => ({ ...f, misi: [...f.misi, newMisiText.trim()] }));
      setNewMisiText("");
    }
  };

  const handleRemoveMisi = (index: number) => {
    setForm((f) => ({
      ...f,
      misi: f.misi.filter((_, i) => i !== index),
    }));
  };

  const handleAddPerangkat = () => {
    setPerangkatForm((p) => [
      ...p,
      { id: undefined, nama: "", jabatan: "", is_show: true },
    ]);
  };

  const handleUpdatePerangkat = (
    index: number,
    field: keyof PerangkatDesa,
    value: string | boolean
  ) => {
    const updated = [...perangkatForm];
    (updated[index] as any)[field] = value;
    setPerangkatForm(updated);
  };

  const handleRemovePerangkat = (index: number) => {
    setPerangkatForm((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const cleanMisi = form.misi.filter((m) => m.trim() !== "");
    const cleanPerangkat = perangkatForm.filter(
      (p) => p.nama.trim() && p.jabatan.trim()
    );

    const payload = {
      ...form,
      misi: cleanMisi,
      perangkat: cleanPerangkat,
    };

    try {
      if (profile) {
        await api.patch(`/profile/${profile.id}`, payload);
        toast.success("Profile Desa berhasil diperbarui");
      } else {
        await api.post("/profile", payload);
        toast.success("Profile Desa berhasil dibuat");
      }

      await fetchProfileData();
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleShow = async (id: number, currentStatus: boolean) => {
    setSaving(true);
    try {
      await api.patch(`/profile/${id}`, { is_show: !currentStatus });
      toast.success(
        `Profile ${!currentStatus ? "ditampilkan" : "disembunyikan"}`
      );
      await fetchProfileData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah status");
    } finally {
      setSaving(false);
    }
  };

  const perangkatColumns = [
    { key: "nama", label: "Nama" },
    { key: "jabatan", label: "Jabatan" },
    {
      key: "is_show",
      label: "Status",
      render: (row: PerangkatDesa) =>
        row.is_show ? (
          <span className="text-green-600">Aktif</span>
        ) : (
          <span className="text-red-500">Nonaktif</span>
        ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

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
            Manajemen Profile Desa
          </CardTitle>
          <div className="flex gap-2">
            {profile && (
              <Button
                variant={profile.is_show ? "outline" : "default"}
                onClick={() => handleToggleShow(profile.id, profile.is_show)}
                disabled={saving}
                className="gap-2"
              >
                {profile.is_show ? <EyeOff size={18} /> : <Eye size={18} />}
                {profile.is_show ? "Sembunyikan" : "Tampilkan"}
              </Button>
            )}
            <Button
              onClick={() => openModal(profile || undefined)}
              className="gap-2"
            >
              <Edit size={18} /> {profile ? "Edit Profile" : "Buat Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {profile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Desa</p>
                  <p className="text-lg font-medium">{profile.nama_desa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kepala Desa</p>
                  <p className="text-lg font-medium">{profile.kepala_desa}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Visi</p>
                  <p className="text-lg font-medium">{profile.visi}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Misi</p>
                  <ul className="list-disc list-inside text-lg">
                    {profile.misi.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Sejarah</p>
                  <p className="text-base text-justify">{profile.sejarah}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mt-6">
                Perangkat Desa ({profile.perangkat.length})
              </h3>
              {profile.perangkat.length > 0 ? (
                <DataTable
                  columns={perangkatColumns}
                  data={profile.perangkat}
                />
              ) : (
                <p className="text-muted-foreground">
                  Belum ada data perangkat desa.
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">
                Belum ada Profile Desa yang terdaftar.
              </p>
              <Button onClick={() => openModal()} className="mt-4 gap-2">
                <Plus size={18} /> Buat Profile Baru
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {profile ? "Edit Profile Desa" : "Buat Profile Desa Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nama Desa</label>
                <Input
                  value={form.nama_desa}
                  onChange={(e) =>
                    setForm({ ...form, nama_desa: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kepala Desa</label>
                <Input
                  value={form.kepala_desa}
                  onChange={(e) =>
                    setForm({ ...form, kepala_desa: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Visi</label>
              <Textarea
                value={form.visi}
                onChange={(e) => setForm({ ...form, visi: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Misi (Misi Desa)
              </label>
              <div className="space-y-2">
                {form.misi.map((m, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={m}
                      onChange={(e) => {
                        const updatedMisi = [...form.misi];
                        updatedMisi[index] = e.target.value;
                        setForm({ ...form, misi: updatedMisi });
                      }}
                      placeholder={`Misi ke-${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveMisi(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newMisiText}
                  onChange={(e) => setNewMisiText(e.target.value)}
                  placeholder="Tambah Misi baru..."
                />
                <Button
                  type="button"
                  onClick={handleAddMisi}
                  disabled={!newMisiText.trim()}
                >
                  Tambah
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Sejarah</label>
              <Textarea
                value={form.sejarah}
                onChange={(e) => setForm({ ...form, sejarah: e.target.value })}
                required
                rows={5}
              />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold flex justify-between items-center">
                Data Perangkat Desa
                <Button
                  type="button"
                  onClick={handleAddPerangkat}
                  size="sm"
                  className="gap-1"
                >
                  <Plus size={16} /> Tambah Perangkat
                </Button>
              </h3>

              {perangkatForm.length === 0 && (
                <p className="text-muted-foreground text-center">
                  Tekan tombol &apos;Tambah Perangkat&apos; untuk menambahkan
                  data.
                </p>
              )}

              {perangkatForm.map((perangkat, index) => (
                <motion.div
                  key={index}
                  className="p-3 border rounded-md grid grid-cols-4 gap-3 bg-muted/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="col-span-2">
                    <label className="text-xs font-medium">Nama</label>
                    <Input
                      value={perangkat.nama}
                      onChange={(e) =>
                        handleUpdatePerangkat(index, "nama", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Jabatan</label>
                    <Input
                      value={perangkat.jabatan}
                      onChange={(e) =>
                        handleUpdatePerangkat(index, "jabatan", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={perangkat.is_show}
                        onChange={(e) =>
                          handleUpdatePerangkat(
                            index,
                            "is_show",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm">Tampilkan</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemovePerangkat(index)}
                      className="mt-2"
                    >
                      Hapus
                    </Button>
                  </div>
                </motion.div>
              ))}
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
                Tampilkan Profile ini di halaman publik
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {profile ? "Simpan Perubahan" : "Buat Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
