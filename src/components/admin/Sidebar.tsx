"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Newspaper,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Users,
  Wallet,
  Settings,
  TrendingUp,
  Briefcase,
  User,
  Building,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Berita", href: "/admin/berita", icon: Newspaper },
  { label: "Galeri", href: "/admin/galeri", icon: ImageIcon },
  { label: "Pengaduan", href: "/admin/pengaduan", icon: MessageSquare },

  { label: "Data Wilayah", href: "/admin/data-wilayah", icon: Globe },
  { label: "Data Penduduk", href: "/admin/data-penduduk", icon: Users },
  { label: "Data Keuangan", href: "/admin/data-keuangan", icon: Wallet },

  { label: "Profil", href: "/admin/profile", icon: User },
  { label: "Layanan", href: "/admin/services", icon: Briefcase },
  { label: "Section Setting", href: "/admin/section-setting", icon: Settings },
  { label: "SEO Config", href: "/admin/seo-config", icon: TrendingUp },
  { label: "Site Config", href: "/admin/site-config", icon: Building },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-primary flex flex-col p-4">
      <h2 className="text-lg font-bold mb-8 text-white">Admin Desa</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isDashboard = item.href === "/admin" && pathname === "/admin";
          const isActive =
            isDashboard ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition",
                isActive
                  ? "bg-primary-foreground text-primary"
                  : "hover:bg-primary-foreground/10"
              )}
            >
              <Icon
                size={18}
                color={isActive ? "hsl(210, 40%, 98%)" : "white"}
              />
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-primary-foreground" : "text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
