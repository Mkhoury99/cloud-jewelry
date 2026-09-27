import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { BagSheet } from "@/components/site/bag-sheet";
import { Wordmark } from "@/components/site/wordmark";

const linkClass =
  "text-[11px] uppercase tracking-[0.2em] text-rose/80 transition-colors hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const search = useRouterState({ select: (state) => state.location.search });
  const category =
    search &&
    typeof search === "object" &&
    "category" in search &&
    search["category"] === "customized"
      ? "customized"
      : "other";

  useEffect(() => {
    setOpen(false);
  }, [pathname, category]);

  const customActive = pathname === "/shop" && category === "customized";
  const shopActive = (pathname === "/shop" && !customActive) || pathname === "/checkout";
  const homeActive = pathname === "/";

  const renderLinks = () => (
    <>
      <Link
        to="/"
        aria-current={homeActive ? "page" : undefined}
        className={`${linkClass} ${homeActive ? "text-rose" : ""}`}
      >
        Home
      </Link>
      <Link
        to="/shop"
        search={{ category: "all" }}
        aria-current={shopActive ? "page" : undefined}
        className={`${linkClass} ${shopActive ? "text-rose" : ""}`}
      >
        Shop
      </Link>
      <Link
        to="/shop"
        search={{ category: "customized" }}
        aria-current={customActive ? "page" : undefined}
        className={`${linkClass} ${customActive ? "text-rose" : ""}`}
      >
        Custom
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-rose/15 bg-burgundy text-rose">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
        <Wordmark />
        <div className="hidden items-center gap-8 md:flex">{renderLinks()}</div>
        <div className="flex items-center gap-1">
          <BagSheet />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {open ? (
        <div id="mobile-menu" className="border-t border-rose/20 px-5 py-4 md:hidden">
          <div className="flex flex-col items-start gap-4 [&_a]:py-1">{renderLinks()}</div>
        </div>
      ) : null}
    </header>
  );
}
