export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
}

export const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Panen Raya Padi 2025",
    image: "/images/gallery/panen-raya.jpg",
    category: "Pertanian",
  },
  {
    id: 2,
    title: "Perbaikan Jalan Desa",
    image: "/images/gallery/perbaikan-jalan.jpg",
    category: "Pembangunan",
  },
  {
    id: 3,
    title: "Gotong Royong Bersama Warga",
    image: "/images/gallery/gotong-royong.jpg",
    category: "Kegiatan Sosial",
  },
  {
    id: 4,
    title: "Balai Desa Baru",
    image: "/images/gallery/balai-desa.jpg",
    category: "Infrastruktur",
  },
  {
    id: 5,
    title: "Festival Desa Sejahtera",
    image: "/images/gallery/festival.jpg",
    category: "Budaya",
  },
  {
    id: 6,
    title: "Pelatihan Pemuda Desa",
    image: "/images/gallery/pemuda.jpg",
    category: "Pendidikan",
  },
];
