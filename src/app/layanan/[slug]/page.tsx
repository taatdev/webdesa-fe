"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

interface ServiceDetail {
  id: number;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export default function LayananDetailPage() {
  const { slug } = useParams() as { slug: string };

  const [layanan, setLayanan] = useState<ServiceDetail | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services/slug/${slug}`
        );
        if (res.ok) {
          const json = await res.json();
          setLayanan(json);
        } else {
          setLayanan(null);
        }
      } catch {
        setLayanan(null);
      }
    }
    fetchDetail();
  }, [slug]);

  if (!layanan) return;

  return (
    <main className="py-20 bg-backgroun">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{layanan.icon}</span>
            <h1 className="text-3xl font-bold text-foreground">
              {layanan.title}
            </h1>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {layanan.description}
          </p>

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h2 className="font-semibold text-lg text-foreground">
              Cara Pengajuan
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Datang ke kantor desa atau isi formulir online (jika tersedia).
              </li>
              <li>
                Siapkan dokumen pendukung seperti KTP, KK, atau surat terkait.
              </li>
              <li>Proses verifikasi dilakukan oleh petugas desa.</li>
              <li>Surat akan diterbitkan maksimal 2–3 hari kerja.</li>
            </ul>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/layanan"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              ← Kembali ke Daftar Layanan
            </Link>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
