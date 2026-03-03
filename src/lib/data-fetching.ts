import { api } from "@/utils/api";

export interface SiteConfigApi {
  site_name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url: string | null;
  instagram_url: string | null;
  author: string;
}

export async function getSiteConfig() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-config`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch site config");
  return res.json();
}

export async function getSeoConfig(path: string = "/") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo-config?path=${encodeURIComponent(
      path
    )}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    console.warn("No SEO config found for", path);
    return null;
  }
  return res.json();
}

export async function getSectionSetting() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/section-setting`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch section setting");
  return res.json();
}
