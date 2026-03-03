/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Settings, Save, CheckSquare, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface SectionSetting {
  id: number;
  is_show_hero: boolean;
  hero_title: string;
  hero_subtitle: string;
  is_show_profile: boolean;
  profile_title: string;
  profile_subtitle: string;
  is_show_services: boolean;
  services_title: string;
  services_subtitle: string;
  is_show_news: boolean;
  news_title: string;
  news_subtitle: string;
  is_show_gallery: boolean;
  gallery_title: string;
  gallery_subtitle: string;
  is_show_contact: boolean;
  contact_title: string;
  contact_subtitle: string;
  is_show_complaint: boolean;
  complaint_title: string;
  complaint_subtitle: string;
}

const initialFormState: Omit<SectionSetting, "id"> = {
  is_show_hero: true,
  hero_title: "Selamat Datang di Website Desa Kami",
  hero_subtitle:
    "Portal informasi resmi yang menyediakan data dan layanan untuk masyarakat.",
  is_show_profile: true,
  profile_title: "Profile Desa",
  profile_subtitle:
    "Ketahui lebih dalam mengenai sejarah, visi, dan misi desa kami.",
  is_show_services: true,
  services_title: "Layanan Unggulan",
  services_subtitle:
    "Akses berbagai layanan dan informasi penting untuk kebutuhan Anda.",
  is_show_news: true,
  news_title: "Berita Terbaru",
  news_subtitle:
    "Dapatkan informasi terkini seputar kegiatan dan pengumuman desa.",
  is_show_gallery: true,
  gallery_title: "Galeri Kegiatan",
  gallery_subtitle:
    "Lihat dokumentasi visual dari setiap momen dan acara di desa.",
  is_show_contact: true,
  contact_title: "Hubungi Kami",
  contact_subtitle:
    "Sampaikan pertanyaan, kritik, atau saran kepada perangkat desa.",
  is_show_complaint: true,
  complaint_title: "Layanan Pengaduan",
  complaint_subtitle: "Salurkan aspirasi dan pengaduan Anda secara transparan.",
};

interface SectionConfig {
  key: keyof SectionSetting;
  titleKey: keyof SectionSetting;
  subtitleKey: keyof SectionSetting;
  label: string;
}

const sections: SectionConfig[] = [
  {
    key: "is_show_hero",
    titleKey: "hero_title",
    subtitleKey: "hero_subtitle",
    label: "Hero (Banner Utama)",
  },
  {
    key: "is_show_profile",
    titleKey: "profile_title",
    subtitleKey: "profile_subtitle",
    label: "Profile Desa",
  },
  {
    key: "is_show_services",
    titleKey: "services_title",
    subtitleKey: "services_subtitle",
    label: "Layanan",
  },
  {
    key: "is_show_news",
    titleKey: "news_title",
    subtitleKey: "news_subtitle",
    label: "Berita & Artikel",
  },
  {
    key: "is_show_gallery",
    titleKey: "gallery_title",
    subtitleKey: "gallery_subtitle",
    label: "Galeri",
  },
  {
    key: "is_show_contact",
    titleKey: "contact_title",
    subtitleKey: "contact_subtitle",
    label: "Kontak",
  },
  {
    key: "is_show_complaint",
    titleKey: "complaint_title",
    subtitleKey: "complaint_subtitle",
    label: "Pengaduan",
  },
];

export default function SectionSettingAdminPage() {
  const [form, setForm] = useState<Partial<SectionSetting>>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/section-setting");
      const data = res.data as SectionSetting;
      setForm(data);
    } catch {
      toast.error("Gagal memuat pengaturan seksi.");
      setForm(initialFormState);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof SectionSetting,
    value: string | boolean
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/section-setting", form);
      toast.success("Pengaturan seksi berhasil disimpan.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
      fetchSettings();
    }
  };

  const renderSectionField = (config: SectionConfig) => (
    <div
      key={config.key as string}
      className="border p-4 rounded-lg space-y-3 bg-muted/10"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{config.label}</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form[config.key] as boolean}
            onChange={(e) => handleInputChange(config.key, e.target.checked)}
            className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
          />
          <span className="text-sm font-medium">
            {form[config.key] ? "Tampilkan" : "Sembunyikan"}
          </span>
        </div>
      </div>

      {form[config.key] && (
        <>
          <div>
            <label className="text-sm font-medium">
              Judul Seksi ({config.label})
            </label>
            <Input
              value={form[config.titleKey] as string}
              onChange={(e) =>
                handleInputChange(config.titleKey, e.target.value)
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Subjudul/Deskripsi Singkat
            </label>
            <Textarea
              value={form[config.subtitleKey] as string}
              onChange={(e) =>
                handleInputChange(config.subtitleKey, e.target.value)
              }
              rows={2}
              required
            />
          </div>
        </>
      )}
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
            <Settings size={24} /> Pengaturan Seksi Halaman Depan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {sections.map(renderSectionField)}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save size={18} className="mr-2" /> Simpan Pengaturan
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
