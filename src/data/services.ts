export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 1,
    title: "Surat Keterangan Domisili",
    description:
      "Pengajuan surat keterangan tempat tinggal resmi bagi warga Desa Suka Maju.",
    icon: "🏠",
    slug: "surat-domisili",
  },
  {
    id: 2,
    title: "Surat Keterangan Usaha",
    description:
      "Permohonan surat usaha bagi pelaku UMKM atau pedagang lokal desa.",
    icon: "💼",
    slug: "surat-usaha",
  },
  {
    id: 3,
    title: "Surat Pengantar Nikah",
    description:
      "Pengajuan surat pengantar pernikahan sebagai syarat administratif.",
    icon: "💍",
    slug: "surat-nikah",
  },
  {
    id: 4,
    title: "Layanan Pengaduan Warga",
    description:
      "Sampaikan keluhan, masukan, atau aspirasi Anda untuk kemajuan desa.",
    icon: "📢",
    slug: "pengaduan",
  },
  {
    id: 5,
    title: "Pembuatan Kartu Keluarga (KK)",
    description:
      "Layanan pembuatan atau perbaikan data Kartu Keluarga secara resmi.",
    icon: "📄",
    slug: "kartu-keluarga",
  },
  {
    id: 6,
    title: "Surat Keterangan Kelahiran",
    description:
      "Pembuatan surat keterangan kelahiran bayi yang baru lahir di desa.",
    icon: "👶",
    slug: "surat-kelahiran",
  },
];
