import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/site/product-card";
import { SiteFrame } from "@/components/site/frame";
import { categories, products } from "@/lib/catalog";

const shopCategories = ["all", "jewelries", "anklets", "customized"] as const;
type ShopCategory = (typeof shopCategories)[number];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category: ShopCategory } => {
    const category = search["category"];
    if (typeof category === "string" && shopCategories.includes(category as ShopCategory)) {
      return { category: category as ShopCategory };
    }
    return { category: "all" };
  },
  head: () => ({
    meta: [
      { title: "Shop — Cloud Jewelry" },
      {
        name: "description",
        content:
          "Choose handmade bracelets, necklaces, anklets, and custom pieces from Cloud Jewelry. Add several to your bag and send one order.",
      },
      { property: "og:title", content: "Shop — Cloud Jewelry" },
      {
        property: "og:description",
        content: "Handmade stainless steel and 18K gold plated jewelry, made in Lebanon.",
      },
    ],
  }),
  component: ShopPage,
});

const filters: { id: ShopCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "jewelries", label: "Jewelries" },
  { id: "anklets", label: "Anklets" },
  { id: "customized", label: "Customized" },
];

function ShopPage() {
  const { category } = Route.useSearch();
  const visible =
    category === "all" ? categories : categories.filter((item) => item.id === category);

  return (
    <SiteFrame>
      <section className="bg-burgundy px-6 py-16 text-rose md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose/70">The collection</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-tight md:text-6xl">
            Choose a few pieces.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-rose/80">
            Add as many as you like. One checkout sends the whole order, and we call you to confirm
            before anything is made.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter the collection">
            {filters.map((filter) => {
              const selected = filter.id === category;
              return (
                <Link
                  key={filter.id}
                  to="/shop"
                  search={{ category: filter.id }}
                  role="tab"
                  aria-selected={selected}
                  className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                    selected ? "bg-burgundy text-rose" : "bg-white text-burgundy ring-1 ring-burgundy/10"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>

          {visible.map((group) => {
            const items = products.filter((product) => product.category === group.id);
            return (
              <div key={group.id} className="mt-14">
                <h2 className="font-serif text-4xl text-burgundy">{group.label}</h2>
                <p className="mt-2 max-w-lg text-sm text-burgundy/65">{group.blurb}</p>
                <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}

          <p className="mt-16 text-sm text-burgundy/55">
            Prices are in US dollars.{" "}
            {category === "customized" ? "Custom work starts at the listed price. " : ""}
            We confirm every order by phone. Nothing is charged on this page.
          </p>
        </div>
      </section>
    </SiteFrame>
  );
}
