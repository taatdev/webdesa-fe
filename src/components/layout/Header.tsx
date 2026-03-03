"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export const Header = () => {
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // State for the desktop dropdown (Data)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State for the mobile menu (Hamburger)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/profil", label: "Profil Desa" },
    { type: "dropdown", label: "Data" },
    { href: "/berita", label: "Berita" },
    { href: "/galeri", label: "Galeri" },
    { href: "/layanan", label: "Layanan" },
    { href: "/kontak", label: "Kontak" },
  ];

  const dataLinks = [
    { href: "/data/wilayah", label: "Data Wilayah" },
    { href: "/data/usia", label: "Data Usia" },
    { href: "/data/keuangan", label: "Data Keuangan" },
  ];

  // --- Dropdown Handlers (for Desktop) ---
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 250);
  };

  // --- Mobile Menu Handlers ---
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on navigation
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4 relative">
        {/* LOGO */}
        <Link href="/" className="font-semibold text-lg text-green-700">
          {siteConfig.name}
        </Link>

        {/* Hamburger Menu Button (Visible on mobile, hidden on large screens) */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:text-green-700 transition"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* --- DESKTOP MENU (Hidden on mobile, flex on large screens) --- */}
        <ul className="hidden lg:flex gap-6 items-center relative">
          {navLinks.map((link) => {
            if (link.type === "dropdown") {
              return (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 hover:text-green-700 transition-colors",
                      pathname.startsWith("/data")
                        ? "text-green-700 font-semibold"
                        : "text-gray-700"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <ul className="absolute top-8 left-0 bg-white shadow-lg border border-gray-100 rounded-lg overflow-hidden min-w-[180px] z-50">
                      {dataLinks.map((d) => (
                        <li key={d.href}>
                          <Link
                            href={d.href}
                            className={cn(
                              "block px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition",
                              pathname === d.href
                                ? "bg-green-50 text-green-700 font-medium"
                                : "text-gray-700"
                            )}
                            onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                          >
                            {d.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // Regular Link
            return (
              <li key={link.href}>
                <Link
                  href={link.href ?? ""}
                  className={cn(
                    "hover:text-green-700 transition-colors",
                    pathname === link.href ||
                      (pathname.startsWith(link.href ?? "") && link.href !== "/") // Handle active state better
                      ? "text-green-700 font-semibold"
                      : "text-gray-700"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* --- MOBILE MENU (Toggles based on isMenuOpen) --- */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-4 z-40"
        >
          <ul className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              if (link.type === "dropdown") {
                // Dropdown logic simplified for mobile: toggle on click
                return (
                  <li key={link.label} className="py-1">
                    <button
                      className={cn(
                        "w-full flex items-center justify-between hover:text-green-700 transition-colors text-lg",
                        pathname.startsWith("/data")
                          ? "text-green-700 font-semibold"
                          : "text-gray-700"
                      )}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle state
                    >
                      {link.label}
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <ul className="mt-2 pl-4 space-y-1 border-l-2 border-green-100">
                        {dataLinks.map((d) => (
                          <li key={d.href}>
                            <Link
                              href={d.href}
                              className={cn(
                                "block px-2 py-2 text-base hover:bg-green-50 hover:text-green-700 transition rounded-md",
                                pathname === d.href
                                  ? "bg-green-50 text-green-700 font-medium"
                                  : "text-gray-700"
                              )}
                              onClick={() => setIsMenuOpen(false)} // Close mobile menu on click
                            >
                              {d.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // Regular Link
              return (
                <li key={link.href} className="py-1">
                  <Link
                    href={link.href ?? ""}
                    className={cn(
                      "block text-lg hover:text-green-700 transition-colors",
                      pathname === link.href ||
                        (pathname.startsWith(link.href ?? "") && link.href !== "/")
                        ? "text-green-700 font-semibold"
                        : "text-gray-700"
                    )}
                    onClick={() => setIsMenuOpen(false)} // Close mobile menu on click
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};
