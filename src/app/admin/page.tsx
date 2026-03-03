"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return router.replace("/admin/login");

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) setAuthorized(true);
        else router.replace("/admin/login");
      } catch {
        router.replace("/admin/login");
      }
    })();
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Selamat Datang, Admin!</h2>
      <p className="text-muted-foreground">
        Gunakan panel ini untuk mengelola berita, galeri, dan pengaduan warga.
      </p>
      <button
        onClick={() => {
          localStorage.removeItem("admin_token");
          router.replace("/admin/login");
        }}
        className="mt-6 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
      >
        Keluar
      </button>
    </div>
  );
}
