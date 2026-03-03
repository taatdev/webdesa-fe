export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  excerpt: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Gotong Royong Bersihkan Saluran Air",
    slug: "gotong-royong-bersihkan-saluran-air",
    image: "/images/news/gotong-royong.jpg",
    date: "2025-10-01",
    excerpt:
      "Warga Desa Suka Maju melaksanakan kegiatan gotong royong membersihkan saluran air untuk mencegah banjir saat musim hujan.",
  },
  {
    id: 2,
    title: "Pelatihan Digital untuk UMKM Desa",
    slug: "pelatihan-digital-umkm",
    image: "/images/news/pelatihan-umkm.jpg",
    date: "2025-09-20",
    excerpt:
      "Pemerintah desa bekerja sama dengan Dinas Kominfo mengadakan pelatihan digital marketing bagi pelaku UMKM lokal.",
  },
  {
    id: 3,
    title: "Peringatan Hari Kemerdekaan ke-80",
    slug: "peringatan-hari-kemerdekaan-80",
    image: "/images/news/kemerdekaan.jpg",
    date: "2025-08-17",
    excerpt:
      "Warga dengan antusias mengikuti lomba dan upacara memperingati Hari Kemerdekaan Republik Indonesia ke-80 di lapangan desa.",
  },
];
