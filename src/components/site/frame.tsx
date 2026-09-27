import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-blush font-sans text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-rose focus:px-4 focus:py-2 focus:text-burgundy"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
