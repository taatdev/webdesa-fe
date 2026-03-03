"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export const HeroSection = () => {
  const [data, setData] = useState<{
    is_show_hero: boolean;
    hero_title: string;
    hero_subtitle: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/section-setting`
        );
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to load section setting:", e);
      }
    }
    fetchData();
  }, []);

  if (!data?.is_show_hero) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background py-20 md:py-32">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance text-foreground mb-4">
              {data.hero_title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-prose">
              {data.hero_subtitle}
            </p>

            <div className="flex gap-4">
              <Link
                href="/profil"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
              >
                Tentang Desa
              </Link>
              <Link
                href="/layanan"
                className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent/20 transition"
              >
                Layanan Masyarakat
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-[90%] md:w-[420px] aspect-square rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
              <Image
                src="/images/hero-desa.jpg"
                alt="Pemandangan Desa"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute -bottom-16 -left-10 w-[300px] h-[300px] bg-green-300 rounded-full blur-3xl dark:bg-green-800"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-10 -right-20 w-[300px] h-[300px] bg-green-400 rounded-full blur-3xl dark:bg-green-700"
      />
    </section>
  );
};
