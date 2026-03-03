export interface ComplaintItem {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  status: "baru" | "diproses" | "selesai";
}

export const complaintData: ComplaintItem[] = [
  {
    id: 1,
    name: "Andi Pratama",
    email: "andi@mail.com",
    message: "Lampu jalan di RT 03 mati sejak minggu lalu.",
    date: "2025-10-10",
    status: "baru",
  },
  {
    id: 2,
    name: "Rina Wulandari",
    email: "rina@mail.com",
    message: "Mohon perbaikan saluran air dekat balai desa.",
    date: "2025-10-09",
    status: "diproses",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@mail.com",
    message: "Saran: adakan pelatihan digital untuk pemuda desa.",
    date: "2025-10-05",
    status: "selesai",
  },
];
