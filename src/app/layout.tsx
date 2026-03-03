import type { Metadata } from "next";
import { getSiteConfig, getSeoConfig } from "@/lib/data-fetching";
import "./globals.css";
import { LayoutWrapper } from "./LayoutWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const [siteConfig, seoConfig] = await Promise.all([
    getSiteConfig(),
    getSeoConfig(pathname),
  ]);

  console.log("SEO CONFIG :", seoConfig);

  const defaultSiteName = siteConfig?.site_name || "Web Desa";
  const defaultDescription =
    siteConfig?.description || "Website resmi Desa Suka Maju.";

  const metaTitle = seoConfig?.title || defaultSiteName;
  const metaDesc = seoConfig?.description || defaultDescription;
  const ogImage = seoConfig?.og_image || "/default-og-image.jpg";

  return {
    title: {
      default: metaTitle,
      template: `%s | ${defaultSiteName}`,
    },
    description: metaDesc,
    openGraph: {
      title: seoConfig?.og_title || metaTitle,
      description: seoConfig?.og_description || metaDesc,
      url: seoConfig?.og_url || "https://desasukamaju.id",
      siteName: defaultSiteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: seoConfig?.og_locale || "id_ID",
      type: seoConfig?.og_type || "website",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
