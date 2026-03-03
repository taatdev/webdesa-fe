"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

interface Perangkat {
  id: number;
  jabatan: string;
  nama: string;
}

interface ProfileData {
  id: number;
  nama_desa: string;
  kepala_desa: string;
  sejarah: string;
  visi: string;
  misi: string[];
  perangkat?: Perangkat[];
}

export const ProfileSection = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <section className="py-20 bg-card">
        <Container>
          <p className="text-center text-muted-foreground">
            Memuat data profil...
          </p>
        </Container>
      </section>
    );

  if (!data) return null;

  return (
    <section className="py-20 bg-card">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Profil Desa
          </h2>
          <p className="text-muted-foreground text-lg">
            Mengenal lebih dekat {data.nama_desa}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-4">Sejarah Singkat</h3>
            <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {data.sejarah}
            </p>

            <h3 className="text-2xl font-semibold mb-3">Visi</h3>
            <p className="italic text-primary mb-6">{data.visi}</p>

            <h3 className="text-2xl font-semibold mb-3">Misi</h3>
            {Array.isArray(data.misi) && data.misi.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {data.misi.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Belum ada data misi.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Struktur Pemerintahan Desa
              </h3>
              {Array.isArray(data.perangkat) && data.perangkat.length > 0 ? (
                <ul className="divide-y divide-border">
                  {data.perangkat.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between">
                      <span className="text-muted-foreground">
                        {item.jabatan}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.nama}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Belum ada data perangkat desa.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
