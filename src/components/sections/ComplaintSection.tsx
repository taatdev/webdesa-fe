"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

const ComplaintSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  message: z.string().min(10, "Pesan terlalu singkat"),
});

type ComplaintForm = z.infer<typeof ComplaintSchema>;

export const ComplaintSection = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintForm>({
    resolver: zodResolver(ComplaintSchema),
  });

  const onSubmit = async (data: ComplaintForm) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        reset();
      } else throw new Error();
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section className="py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Formulir Pengaduan
          </h2>
          <p className="text-muted-foreground text-lg">
            Sampaikan keluhan, masukan, atau saran Anda untuk kemajuan{" "}
            <span className="text-primary font-medium">Desa Suka Maju</span>.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-card border border-border rounded-xl p-8 shadow-sm space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Masukkan nama Anda"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="email@contoh.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Pesan / Keluhan
            </label>
            <textarea
              {...register("message")}
              rows={5}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Tuliskan pesan atau keluhan Anda di sini..."
            />
            {errors.message && (
              <p className="text-sm text-destructive mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
          >
            {status === "loading"
              ? "Mengirim..."
              : status === "success"
              ? "Terkirim ✅"
              : status === "error"
              ? "Gagal Mengirim ❌"
              : "Kirim Pengaduan"}
          </button>
        </motion.form>
      </Container>
    </section>
  );
};
