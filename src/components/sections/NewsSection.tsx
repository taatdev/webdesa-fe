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

interface SectionSetting {
  is_show_news: boolean;
  news_title: string;
  news_subtitle: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<SectionSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!API_URL) {
        console.error("NEXT_PUBLIC_API_URL is not set.");
        setLoading(false);
        return;
      }

      try {
        const settingsRes = await fetch(`${API_URL}/section-setting`);
        const settingsJson: SectionSetting = await settingsRes.json();
        setSettings(settingsJson);

        if (settingsJson && !settingsJson.is_show_news) {
          setLoading(false);
          return;
        }

        const newsRes = await fetch(`${API_URL}/news`);
        if (newsRes.ok) {
          const newsJson: NewsItem[] = await newsRes.json();
          setNews(newsJson.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load section data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !settings || !settings.is_show_news) {
    return null;
  }

  if (!news.length) return null;

  const getImageUrl = (imagePath: string): string => {
    return `${imagePath}`;
  };

  return (
    <section className="py-20 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            {settings.news_title || "Berita Terkini"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {settings.news_subtitle || "Informasi terbaru dari desa."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug}`}
              className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  // Menggunakan fungsi untuk mendapatkan URL gambar lengkap
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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

        <div className="text-center mt-10">
          <Link
            href="/berita"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Lihat semua berita →
          </Link>
        </div>
      </Container>
    </section>
  );
};
