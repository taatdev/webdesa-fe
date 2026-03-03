"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

interface DataKeuangan {
  id: number;
  tahun: string;
  jenis_anggaran: string;
  jumlah: number;
  keterangan: string;
}

export default function DataKeuanganPage() {
  const [data, setData] = useState<DataKeuangan[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/data/keuangan`
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load keuangan data:", err);
      }
    }
    fetchData();
  }, []);

  const total = data.reduce((sum, d) => sum + Number(d.jumlah), 0);

  // ✅ Fungsi format ke Rupiah
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <main className="py-20 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Data Keuangan Desa
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparansi anggaran dan realisasi keuangan{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full border-collapse text-center">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-3 border">Tahun</th>
                <th className="p-3 border">Jenis Anggaran</th>
                <th className="p-3 border">Jumlah (Rp)</th>
                <th className="p-3 border">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="p-3 border">{row.tahun}</td>
                  <td className="p-3 border">{row.jenis_anggaran}</td>
                  <td className="p-3 border">{formatRupiah(row.jumlah)}</td>
                  <td className="p-3 border">{row.keterangan}</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-semibold">
                <td className="p-3 border" colSpan={2}>
                  Total
                </td>
                <td className="p-3 border">{formatRupiah(total)}</td>
                <td className="p-3 border"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}
