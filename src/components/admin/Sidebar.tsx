"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
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

// Constants
const SIDEBAR_WIDTH = "w-60";
const SIDEBAR_TITLE = "Admin Desa";
const ADMIN_ROUTE = "/admin";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
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

// Styling constants
const SIDEBAR_CLASSES = cn(
  SIDEBAR_WIDTH,
  "flex-shrink-0",
  "sticky top-0",
  "h-screen overflow-y-auto",
  "bg-primary flex flex-col",
  "p-4"
);

const TITLE_CLASSES = "text-lg font-bold mb-8 text-white";

const NAV_LINK_CLASSES = (isActive: boolean) =>
  cn(
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200",
    "hover:bg-primary-foreground/10",
    isActive && "bg-primary-foreground text-primary"
  );

const NAV_ICON_COLOR = (isActive: boolean) =>
  isActive ? "oklch(0.48 0.15 150)" : "white";

const NAV_TEXT_CLASSES = (isActive: boolean) =>
  cn("text-sm font-medium", isActive ? "text-primary" : "text-white");

/**
 * Determines if a navigation item is active based on current pathname
 */
const isNavItemActive = (pathname: string, href: string): boolean => {
  const isDashboard = href === ADMIN_ROUTE && pathname === ADMIN_ROUTE;
  return isDashboard || (href !== ADMIN_ROUTE && pathname.startsWith(href));
};

/**
 * SidebarNavLink component
 */
interface SidebarNavLinkProps {
  item: NavItem;
  isActive: boolean;
}

const SidebarNavLink = ({ item, isActive }: SidebarNavLinkProps) => {
  const Icon = item.icon;

  return (
    <Link href={item.href} className={NAV_LINK_CLASSES(isActive)}>
      <Icon size={18} color={NAV_ICON_COLOR(isActive)} />
      <span className={NAV_TEXT_CLASSES(isActive)}>{item.label}</span>
    </Link>
  );
};

/**
 * Sidebar component for admin layout
 * - Fixed width with sticky positioning
 * - Independent scroll for navigation items
 * - Active state indication for current page
 */
export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={SIDEBAR_CLASSES}>
      <h2 className={TITLE_CLASSES}>{SIDEBAR_TITLE}</h2>
      <nav className="space-y-2 flex-1">
        {NAV_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.href}
            item={item}
            isActive={isNavItemActive(pathname, item.href)}
          />
        ))}
      </nav>
    </aside>
  );
};
