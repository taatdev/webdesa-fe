"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

interface DataWilayah {
  id: number;
  wilayah: string;
  perempuan: number;
  laki_laki: number;
}

export default function DataWilayahPage() {
  const [data, setData] = useState<DataWilayah[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/data/wilayah`
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load wilayah data:", err);
      }
    }
    fetchData();
  }, []);

  const totalP = data.reduce((sum, d) => sum + d.perempuan, 0);
  const totalL = data.reduce((sum, d) => sum + d.laki_laki, 0);

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
            Data Wilayah
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Statistik populasi dan demografi penduduk{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full border-collapse text-center">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-3 border">Wilayah</th>
                <th className="p-3 border">Jenis Kelamin (P)</th>
                <th className="p-3 border">Jenis Kelamin (L)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="p-3 border">{row.wilayah}</td>
                  <td className="p-3 border">{row.perempuan}</td>
                  <td className="p-3 border">{row.laki_laki}</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-semibold">
                <td className="p-3 border">Jumlah</td>
                <td className="p-3 border">{totalP}</td>
                <td className="p-3 border">{totalL}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}
