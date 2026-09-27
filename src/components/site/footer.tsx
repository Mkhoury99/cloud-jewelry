import { Link } from "@tanstack/react-router";

import { instagramHandle, instagramUrl, tiktokUrl } from "@/lib/brand";

const linkClass = "text-sm text-rose/85 transition-colors hover:text-rose";

export function SiteFooter() {
  return (
    <footer className="bg-burgundy text-rose">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:justify-between md:px-10">
        <div>
          <p className="font-serif text-3xl tracking-[0.18em]">CLOUD</p>
          <p className="mt-2 text-[11px] tracking-[0.42em]">JEWELRY</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-rose/75">
            Handmade in Lebanon, one piece at a time.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-rose/60">Visit</p>
            <div className="flex flex-col gap-2">
              <Link to="/shop" search={{ category: "all" }} className={linkClass}>
                Shop
              </Link>
              <Link to="/shop" search={{ category: "customized" }} className={linkClass}>
                Custom pieces
              </Link>
              <Link to="/" hash="story" className={linkClass}>
                Our story
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-rose/60">Message us</p>
            <div className="flex flex-col gap-2">
              <a href={instagramUrl} target="_blank" rel="noreferrer" className={linkClass}>
                Instagram {instagramHandle}
              </a>
              <a href={tiktokUrl} target="_blank" rel="noreferrer" className={linkClass}>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-rose/15 px-6 py-6 text-[10px] uppercase tracking-[0.14em] text-rose/50 md:flex-row md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Cloud Jewelry</p>
        <p>Stainless steel & 18K gold plated</p>
      </div>
    </footer>
  );
}
