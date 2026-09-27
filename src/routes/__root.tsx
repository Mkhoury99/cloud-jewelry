import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "../components/ui/sonner";
import { CartProvider } from "../lib/cart";
import { reportLovableError } from "../lib/lovable-error-reporting";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-burgundy px-6 text-center">
      <p className="font-serif text-4xl tracking-[0.18em] text-rose">CLOUD</p>
      <p className="mt-2 text-[11px] tracking-[0.42em] text-rose">JEWELRY</p>
      <h1 className="mt-10 font-serif text-5xl text-rose">This page isn't here</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-rose/80">
        The link may be old. The collection is still on the shop page.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-rose px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-burgundy"
      >
        Back home
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-4xl text-burgundy">This page didn't load</h1>
        <p className="mt-3 text-sm leading-relaxed text-burgundy/70">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex rounded-full bg-burgundy px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-rose"
          >
            Try again
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex rounded-full border border-burgundy/20 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-burgundy"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cloud Jewelry" },
      {
        name: "description",
        content:
          "Handmade jewelry in Lebanon. Stainless steel and 18K gold plated bracelets, necklaces, anklets, and custom pieces.",
      },
      { name: "theme-color", content: "#580A1A" },
      { property: "og:title", content: "Cloud Jewelry" },
      {
        property: "og:description",
        content: "Handmade with love. Stainless steel and 18K gold plated.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Tenor+Sans&display=swap",
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="bottom-center" />
      </CartProvider>
    </QueryClientProvider>
  );
}
