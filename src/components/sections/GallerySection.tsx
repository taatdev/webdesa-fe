"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/layout/Container";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
}

export const GallerySection = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
        if (res.ok) {
          const json = await res.json();
          setGallery(json);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      }
    }
    fetchGallery();
  }, []);

  if (!gallery.length) return null;

  return (
    <section className="py-20 bg-muted/30 dark:bg-muted/10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Galeri Desa
          </h2>
          <p className="text-muted-foreground text-lg">
            Dokumentasi kegiatan, potensi, dan momen berharga di{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {gallery.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={400}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3 text-white">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <span className="text-xs opacity-80">{item.category}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
