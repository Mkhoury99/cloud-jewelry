import { createFileRoute, Link } from "@tanstack/react-router";

import lineArtStory from "@/assets/line-art-story.jpg";
import lineArtToast from "@/assets/line-art-toast.jpg";
import logoLockup from "@/assets/logo-lockup.jpg";
import { AnkletArt } from "@/components/site/anklet-art";
import { ProductCard } from "@/components/site/product-card";
import { SiteFrame } from "@/components/site/frame";
import { onBurgundyButton, primaryButton, roseButton } from "@/components/site/styles";
import { instagramUrl } from "@/lib/brand";
import { products } from "@/lib/catalog";
import butterfly from "@/assets/product-butterfly.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cloud Jewelry — handmade with love" },
      {
        name: "description",
        content:
          "Cloud Jewelry makes handmade pieces in Lebanon, in stainless steel and 18K gold plate. Shop bracelets, necklaces, anklets, and custom work.",
      },
      { property: "og:title", content: "Cloud Jewelry — handmade with love" },
      {
        property: "og:description",
        content:
          "Little pieces that make people feel special. Handmade jewelry, stainless steel and 18K gold plated.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const highlights = [
  {
    label: "Jewelries",
    href: "/shop" as const,
    search: { category: "jewelries" as const },
    image: butterfly,
    alt: "Gold butterfly necklace",
  },
  {
    label: "Customized",
    href: "/shop" as const,
    search: { category: "customized" as const },
    image: lineArtStory,
    alt: "Line drawing of a face with a butterfly",
  },
  {
    label: "Exhibitions",
    href: instagramUrl,
    image: lineArtToast,
    alt: "Line drawing of two glasses raised together",
  },
  {
    label: "Anklets",
    href: "/shop" as const,
    search: { category: "anklets" as const },
  },
];

function Index() {
  const featured = products.filter((product) => product.category === "jewelries").slice(0, 3);

  return (
    <SiteFrame>
      <section className="bg-burgundy px-6 pb-16 pt-6 text-center text-rose md:pb-24 md:pt-8">
        <img
          src={logoLockup}
          alt="Cloud Jewelry"
          width={1024}
          height={1024}
          fetchPriority="high"
          className="mx-auto aspect-square w-full max-w-md"
        />
        <h1 className="mx-auto mt-2 max-w-xl font-serif text-4xl italic leading-tight text-rose md:text-5xl">
          Handmade with love
        </h1>
        <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-rose/75">
          Stainless steel & 18K gold plated
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/shop" search={{ category: "all" }} className={onBurgundyButton}>
            Shop the collection
          </Link>
          <Link to="/shop" search={{ category: "customized" }} className={roseButton}>
            Start a custom piece
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20" aria-label="Collections">
        <ul className="mx-auto grid max-w-3xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {highlights.map((item) => (
            <li key={item.label}>
              {"search" in item ? (
                <Link to={item.href} search={item.search} className="group block text-center">
                  <HighlightVisual item={item} />
                  <span className="mt-4 block font-serif text-xl text-burgundy group-hover:text-rose">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block text-center"
                >
                  <HighlightVisual item={item} />
                  <span className="mt-4 block font-serif text-xl text-burgundy group-hover:text-rose">
                    {item.label}
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="story" className="scroll-mt-24 px-6 py-8 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <img
            src={lineArtStory}
            alt="Line drawing of a face in profile with a butterfly"
            width={816}
            height={816}
            loading="lazy"
            className="aspect-square w-full rounded-[1.5rem] bg-[#fadeda] object-cover"
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-burgundy/45">The story</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-burgundy md:text-5xl">
              Cloud Jewelry began with a simple love for creating little things that make people
              feel special.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-burgundy/75">
              <p>
                What began as a small passion for handmade jewelry slowly became a space where
                every piece carries a little bit of creativity, personality, and love.
              </p>
              <p>
                From a simple thread bracelet to a meaningful custom piece, Cloud Jewelry is about
                making jewelry that feels like you.
              </p>
              <p className="font-serif text-2xl italic text-burgundy">
                A small dream, created with love, one piece at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-petal">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-10 md:py-8">
          <img
            src={lineArtToast}
            alt="Line drawing of two glasses raised together"
            width={682}
            height={1024}
            loading="lazy"
            className="mx-auto w-full max-w-xs"
          />
          <div>
            <h2 className="font-serif text-4xl leading-tight text-burgundy md:text-5xl">
              For the moments you want to keep.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-burgundy/75">
              Thread, pearls, and gold-plated charms, made slowly. Follow along for new pieces,
              custom work, and exhibitions.
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={`${primaryButton} mt-8`}
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-burgundy/45">In the shop</p>
              <h2 className="mt-3 font-serif text-4xl text-burgundy md:text-5xl">A few favorites</h2>
            </div>
            <Link
              to="/shop"
              search={{ category: "all" }}
              className="text-[11px] uppercase tracking-[0.18em] text-burgundy underline decoration-rose underline-offset-4"
            >
              View the collection
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] bg-burgundy px-8 py-14 text-rose md:px-16 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose/70">Custom pieces</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight md:text-6xl">
            Bring your own piece to life.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-rose/80">
            Colors, initials, a small charm, a length that fits you. Add a custom piece to your
            bag and tell us the story in the note.
          </p>
          <Link to="/shop" search={{ category: "customized" }} className={`${onBurgundyButton} mt-8`}>
            Order a custom piece
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}

function HighlightVisual({
  item,
}: {
  item: (typeof highlights)[number];
}) {
  return (
    <span className="mx-auto block size-28 overflow-hidden rounded-full bg-petal ring-1 ring-burgundy/10 transition-transform duration-500 group-hover:scale-[1.03] sm:size-32">
      {"image" in item ? (
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <AnkletArt variant="beads" />
      )}
    </span>
  );
}
