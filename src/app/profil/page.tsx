"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import Image from "next/image";

interface Perangkat {
  id: number;
  nama: string;
  jabatan: string;
}

interface Profile {
  id: number;
  nama_desa: string;
  kepala_desa: string;
  sejarah: string;
  visi: string;
  misi: string[];
  perangkat: Perangkat[];
}

export default function ProfilDesaPage() {
  const [data, setData] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    fetchProfile();
  }, []);

  if (!data) return null;

  return (
    <main className="py-20 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Profil Desa {data.nama_desa}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mengenal lebih dekat sejarah, visi, misi, dan perangkat pemerintahan{" "}
            <span className="text-primary font-medium">{data.nama_desa}</span>.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 items-start mb-16"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Sejarah Singkat
            </h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {data.sejarah}
            </p>
          </div>
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-border shadow-sm">
            <Image
              src="/images/hero-desa.jpg"
              alt="Foto Desa"
              fill
              className="object-cover"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Visi dan Misi
          </h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Visi</h3>
              <p className="italic text-muted-foreground">{data.visi}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Misi</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {data.misi.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Struktur Pemerintahan Desa
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.perangkat?.map((p) => (
              <div
                key={p.id}
                className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition"
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary">
                  {p.nama[0]}
                </div>
                <h3 className="font-semibold text-foreground">{p.nama}</h3>
                <p className="text-sm text-muted-foreground">{p.jabatan}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </Container>
    </main>
  );
}
