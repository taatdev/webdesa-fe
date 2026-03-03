"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";

interface SiteConfig {
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url?: string;
  instagram_url?: string;
  latitude?: number;
  longitude?: number;
}

export const ContactSection = () => {
  const [data, setData] = useState<SiteConfig | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/site-config`
        );
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load site config:", err);
      }
    }
    fetchData();
  }, []);

  if (!data) return null;

  const mapUrl =
    data.latitude && data.longitude
      ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}&hl=id&z=15&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          data.address
        )}&hl=id&z=15&output=embed`;

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
            Hubungi Kami
          </h2>
          <p className="text-muted-foreground text-lg">
            Kami siap melayani Anda di{" "}
            <span className="text-primary font-medium">{data.site_name}</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    Alamat Kantor
                  </h4>
                  <p className="text-muted-foreground">{data.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-primary w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    Nomor Telepon
                  </h4>
                  <Link
                    href={`tel:${data.contact_phone}`}
                    className="text-primary hover:underline"
                  >
                    {data.contact_phone}
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-primary w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <Link
                    href={`mailto:${data.contact_email}`}
                    className="text-primary hover:underline"
                  >
                    {data.contact_email}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                {data.facebook_url && (
                  <Link
                    href={data.facebook_url}
                    target="_blank"
                    className="p-3 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                )}
                {data.instagram_url && (
                  <Link
                    href={data.instagram_url}
                    target="_blank"
                    className="p-3 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl overflow-hidden shadow-md border border-border h-[350px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
