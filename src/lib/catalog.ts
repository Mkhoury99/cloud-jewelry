/**
 * Shop catalog. Prices are listed in USD.
 * Edit a price here and the shop, bag, checkout, and order email all use it.
 * Custom pieces use a starting price; the final amount is confirmed by phone.
 */

export const categories = [
  {
    id: "jewelries",
    label: "Jewelries",
    blurb: "Bracelets and necklaces, handmade one piece at a time.",
  },
  {
    id: "anklets",
    label: "Anklets",
    blurb: "Thread anklets made to the size you leave in the order note.",
  },
  {
    id: "customized",
    label: "Customized",
    blurb: "A piece built around your colors, initials, or a small story.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  material: string;
  description: string;
  priceFrom?: boolean;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "rose-charm-bracelet",
    name: "Rose Charm Bracelet",
    price: 12,
    category: "jewelries",
    material: "Handmade thread · 18K gold plated charm",
    description:
      "A blush thread bracelet with a small gold-plated charm. Adjustable, and made by hand.",
  },
  {
    id: "morning-mist-bracelet",
    name: "Morning Mist Bracelet",
    price: 10,
    category: "jewelries",
    material: "Handmade thread · gold plated beads",
    description: "Braided blush and cream thread, finished with tiny gold-plated beads.",
  },
  {
    id: "pearl-trio",
    name: "Pearl Trio Set",
    price: 28,
    category: "jewelries",
    material: "Handmade thread · freshwater pearls",
    description: "Three matching blush bracelets, each finished with a single pearl.",
  },
  {
    id: "butterfly-necklace",
    name: "Butterfly Necklace",
    price: 22,
    category: "jewelries",
    material: "18K gold plated · stainless steel",
    description: "A fine gold-plated chain with a small butterfly pendant.",
  },
  {
    id: "thread-anklet",
    name: "Blush Thread Anklet",
    price: 10,
    category: "anklets",
    material: "Handmade thread · gold plated beads",
    description:
      "An adjustable thread anklet, woven for you. Leave your size in the order note.",
    badge: "Made to order",
  },
  {
    id: "pearl-anklet",
    name: "Pearl Anklet",
    price: 14,
    category: "anklets",
    material: "Handmade thread · freshwater pearl",
    description: "A single pearl on a soft thread anklet. Leave your size in the order note.",
    badge: "Made to order",
  },
  {
    id: "custom-piece",
    name: "Custom Piece",
    price: 25,
    category: "customized",
    material: "Stainless steel & 18K gold plated · handmade",
    description:
      "Colors, initials, or a charm that means something to you. This is a starting price — we confirm the final amount by phone.",
    priceFrom: true,
    badge: "Made to order",
  },
];

const productById = new Map(products.map((product) => [product.id, product]));

export function getProduct(id: string): Product | undefined {
  return productById.get(id);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(product: Product): string {
  const amount = formatMoney(product.price);
  return product.priceFrom ? `From ${amount}` : amount;
}
