"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { ToastProvider } from "@/components/ui/toast-provider";

const ADMIN_ROUTE_PREFIX = "/admin";
const LOGIN_ROUTE = "/admin/login";

/**
 * Determines if current pathname is an admin route (excluding login)
 */
const isAdminRoute = (path: string): boolean =>
  path.startsWith(ADMIN_ROUTE_PREFIX) && path !== LOGIN_ROUTE;

interface LayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * LayoutWrapper component
 * - Conditionally renders layout based on current route
 * - Admin routes: Sidebar + Topbar layout with fixed sidebar
 * - Login route: Minimal layout
 * - Public routes: Header + Footer layout
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdministrator = isAdminRoute(pathname);

  // Admin layout with sticky sidebar
  if (isAdministrator) {
    return (
      <div className="min-h-screen flex bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <ToastProvider />
      </div>
    );
  }

  // Login layout
  if (pathname === LOGIN_ROUTE) {
    return (
      <div className="min-h-screen flex bg-background text-foreground">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  }

  // Public layout
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
