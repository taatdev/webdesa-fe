import { ComplaintSection } from "@/components/sections/ComplaintSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NewsSection />
      <GallerySection />
      <ProfileSection />
      <ServicesSection />
      <ComplaintSection />
      <ContactSection />
    </>
  );
}
