import { DataTable } from "@/components/admin/DataTable";
import { complaintData } from "@/data/complaints";

export default function PengaduanAdminPage() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "message", label: "Pesan" },
    { key: "status", label: "Status" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Daftar Pengaduan Warga</h2>
      <DataTable columns={columns} data={complaintData} />
    </div>
  );
}
