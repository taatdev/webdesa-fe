"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  excerpt: string;
  content?: string;
}

export default function BeritaDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [berita, setBerita] = useState<NewsItem | null>(null);

  useEffect(() => {
    async function fetchBerita() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news/slug/${slug}`
        );
        if (res.ok) {
          const json = await res.json();
          setBerita(json);
        } else {
          notFound();
        }
      } catch (err) {
        console.error("Failed to load news:", err);
        notFound();
      }
    }
    fetchBerita();
  }, [slug]);

  if (!berita) return null;

  return (
    <main className="py-20 bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border mb-10"
        >
          <Image
            src={berita.image}
            alt={berita.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {berita.title}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Diterbitkan pada{" "}
            {new Date(berita.date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {berita.excerpt}
          </p>

          {berita.content && (
            <div
              className="prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: berita.content }}
            />
          )}
        </motion.article>
      </Container>
    </main>
  );
}
