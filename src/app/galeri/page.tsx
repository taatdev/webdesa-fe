"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { X } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: string;
}

export default function GaleriPage() {
  const [data, setData] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      }
    }
    fetchGallery();
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(data.map((g) => g.category))),
  ];
  const filteredData =
    selectedCategory === "Semua"
      ? data
      : data.filter((g) => g.category === selectedCategory);

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
            Galeri Desa
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dokumentasi kegiatan, pembangunan, dan potensi di{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:bg-muted/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredData.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onClick={() => setPreviewImage(item.image)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={400}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3 text-white">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <span className="text-xs opacity-80">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-4xl w-full"
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white"
                >
                  <X size={20} />
                </button>
                <Image
                  src={previewImage}
                  alt="Preview Gambar"
                  width={1200}
                  height={800}
                  className="rounded-xl object-contain w-full max-h-[80vh]"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </main>
  );
}
