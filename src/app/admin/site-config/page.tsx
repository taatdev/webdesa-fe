/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Settings,
  Save,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface SiteConfig {
  id: number;
  site_name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url: string | null;
  instagram_url: string | null;
  author: string;
  latitude: number | null;
  longitude: number | null;
}

const initialFormState: Omit<SiteConfig, "id"> = {
  site_name: "",
  description: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  facebook_url: "",
  instagram_url: "",
  author: "",
  latitude: null,
  longitude: null,
};

export default function SiteConfigAdminPage() {
  const [configId, setConfigId] = useState<number | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get("/site-config");
      const data = res.data as SiteConfig;

      const config = data;
      setConfigId(config.id);
      setForm({
        site_name: config.site_name,
        description: config.description,
        contact_email: config.contact_email,
        contact_phone: config.contact_phone,
        address: config.address,
        facebook_url: config.facebook_url || "",
        instagram_url: config.instagram_url || "",
        author: config.author,
        latitude: config.latitude || null,
        longitude: config.longitude || null,
      });
    } catch {
      toast.error("Gagal memuat konfigurasi situs.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof form,
    value: string | number | null
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      // Pastikan koordinat dikirim sebagai angka atau null
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      // Pastikan string kosong dikirim sebagai null untuk field nullable
      facebook_url: form.facebook_url || null,
      instagram_url: form.instagram_url || null,
    };

    try {
      if (configId) {
        // Menggunakan PATCH untuk update
        await api.patch(`/site-config/${configId}`, payload);
        toast.success("Konfigurasi situs berhasil diperbarui.");
      } else {
        // Menggunakan POST untuk create
        await api.post("/site-config", payload);
        toast.success("Konfigurasi situs berhasil dibuat.");
      }
      fetchConfig();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gagal menyimpan konfigurasi."
      );
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
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings size={24} /> Pengaturan Situs Global
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seksi Dasar */}
              <div className="border p-4 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Informasi Dasar Situs
                </h3>
                <div>
                  <label className="text-sm font-medium">Nama Situs/Desa</label>
                  <Input
                    value={form.site_name}
                    onChange={(e) =>
                      handleInputChange("site_name", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Deskripsi Singkat Situs
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User size={16} /> Author/Pengelola
                  </label>
                  <Input
                    value={form.author}
                    onChange={(e) =>
                      handleInputChange("author", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Seksi Kontak */}
              <div className="border p-4 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Detail Kontak & Alamat
                </h3>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} /> Email Kontak
                  </label>
                  <Input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone size={16} /> Telepon Kontak
                  </label>
                  <Input
                    type="tel"
                    value={form.contact_phone}
                    onChange={(e) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin size={16} /> Alamat Lengkap
                  </label>
                  <Textarea
                    value={form.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Seksi Social Media */}
              <div className="border p-4 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Media Sosial (Opsional)
                </h3>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Facebook size={16} /> Facebook URL
                  </label>
                  <Input
                    value={form.facebook_url || ""}
                    onChange={(e) =>
                      handleInputChange("facebook_url", e.target.value)
                    }
                    placeholder="https://facebook.com/namadesa"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Instagram size={16} /> Instagram URL
                  </label>
                  <Input
                    value={form.instagram_url || ""}
                    onChange={(e) =>
                      handleInputChange("instagram_url", e.target.value)
                    }
                    placeholder="https://instagram.com/namadesa"
                  />
                </div>
              </div>

              {/* Seksi Koordinat */}
              <div className="border p-4 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Koordinat Peta (Opsional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Latitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={form.latitude === null ? "" : form.latitude}
                      onChange={(e) =>
                        handleInputChange(
                          "latitude",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="-6.1754"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Longitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={form.longitude === null ? "" : form.longitude}
                      onChange={(e) =>
                        handleInputChange(
                          "longitude",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="106.8272"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save size={18} className="mr-2" />{" "}
                  {configId ? "Simpan Perubahan" : "Buat Konfigurasi"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
