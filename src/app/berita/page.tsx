"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  excerpt: string;
}

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`);
        if (res.ok) {
          const json = await res.json();
          setNews(json.filter((n: NewsItem) => n));
        }
      } catch (err) {
        console.error("Failed to load news:", err);
      }
    }
    fetchNews();
  }, []);

  if (!news.length) return null;

  return (
    <main className="py-20 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Berita Desa
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kumpulan informasi, kegiatan, dan pengumuman terbaru dari{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-1">
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </Container>
    </main>
  );
}
