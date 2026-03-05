const TOPBAR_TITLE = "Panel Admin";
const SITE_NAME = "Desa Suka Maju";

/**
 * Topbar component for admin layout
 * - Sticky header with site branding and info
 */
export const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 h-14 border-b border-border flex items-center justify-between px-6 bg-card">
      <h1 className="font-semibold text-lg">{TOPBAR_TITLE}</h1>
      <div className="text-sm text-muted-foreground">{SITE_NAME}</div>
    </header>
  );
};
