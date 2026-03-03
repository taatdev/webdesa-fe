"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

interface DataUsia {
  id: number;
  rentang_usia: string;
  jumlah: number;
  persentase: number;
}

export default function DataUsiaPage() {
  const [data, setData] = useState<DataUsia[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data/usia`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load usia data:", err);
      }
    }
    fetchData();
  }, []);

  const total = data.reduce((sum, d) => sum + d.jumlah, 0);

  return (
    <main className="py-20 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Data Usia</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Distribusi usia penduduk{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full border-collapse text-center">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-3 border">Usia</th>
                <th className="p-3 border">Jumlah</th>
                <th className="p-3 border">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="p-3 border">{row.rentang_usia}</td>
                  <td className="p-3 border">{row.jumlah}</td>
                  <td className="p-3 border">{row.persentase}%</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-semibold">
                <td className="p-3 border">Jumlah</td>
                <td className="p-3 border">{total}</td>
                <td className="p-3 border">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}
