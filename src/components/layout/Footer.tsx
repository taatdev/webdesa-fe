import { siteConfig } from "@/constants/site";

export const Footer = () => {
  return (
    <footer className="bg-green-800 text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="text-sm opacity-80">{siteConfig.contact.address}</p>
          </div>
          <div className="text-sm opacity-80">
            © {new Date().getFullYear()} {siteConfig.name}. Semua hak
            dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
};
