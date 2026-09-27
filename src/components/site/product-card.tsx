import { toast } from "sonner";

import { AnkletArt } from "@/components/site/anklet-art";
import { primaryButton } from "@/components/site/styles";
import { QtyControl } from "@/components/site/qty-control";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/catalog";
import { productMedia } from "@/lib/product-media";

export function ProductVisual({ product }: { product: Product }) {
  const media = productMedia[product.id];

  if (media === "beads" || media === "pearl") {
    return <AnkletArt variant={media} />;
  }

  if (!media) {
    return <div className="h-full w-full bg-petal" />;
  }

  return (
    <img
      src={media.src}
      alt={product.name}
      width={media.width}
      height={media.height}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  );
}

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const line = cart.lines.find((item) => item.id === product.id);
  const quantity = line?.quantity ?? 0;

  function addToBag() {
    const result = cart.add(product.id);
    if (result === "max-items") {
      toast("You can add up to 8 different pieces in one order.");
      return;
    }
    if (result === "max-qty") {
      toast("That's the most of this piece we can take in one order.");
      return;
    }
    if (quantity === 0) {
      toast(`${product.name} added to your bag`);
    }
  }

  return (
    <article id={`product-${product.id}`} className="flex flex-col">
      <div className="relative overflow-hidden rounded-[1.25rem] bg-petal ring-1 ring-burgundy/10">
        <div className="aspect-[4/5]">
          <ProductVisual product={product} />
        </div>
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-burgundy/90 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-rose">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="font-serif text-2xl leading-tight text-burgundy">{product.name}</h3>
        <p className="shrink-0 font-serif text-xl text-burgundy">{formatPrice(product)}</p>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-burgundy/50">
        {product.material}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-burgundy/75">{product.description}</p>
      <div className="mt-5">
        {quantity > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <QtyControl
              quantity={quantity}
              label={product.name}
              onChange={(next) => cart.setQuantity(product.id, next)}
            />
            <span className="text-[11px] uppercase tracking-[0.16em] text-burgundy/50">
              In your bag
            </span>
          </div>
        ) : (
          <button type="button" className={primaryButton} onClick={addToBag}>
            Add to bag
          </button>
        )}
      </div>
    </article>
  );
}
