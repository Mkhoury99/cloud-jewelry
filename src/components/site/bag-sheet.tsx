import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { primaryButton } from "@/components/site/styles";
import { QtyControl } from "@/components/site/qty-control";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatMoney, formatPrice } from "@/lib/catalog";

export function BagSheet() {
  const cart = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative inline-flex size-11 items-center justify-center rounded-full text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
          aria-label={
            cart.count === 0
              ? "Open bag"
              : `Open bag, ${cart.count} ${cart.count === 1 ? "piece" : "pieces"}`
          }
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          {cart.ready && cart.count > 0 ? (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-rose text-[10px] font-medium text-burgundy">
              {cart.count}
            </span>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col overflow-hidden bg-blush p-0 text-ink sm:max-w-md">
        <SheetHeader className="border-b border-burgundy/10 px-6 py-6 pr-14 text-left">
          <SheetTitle className="font-serif text-3xl font-normal text-burgundy">Your bag</SheetTitle>
          <SheetDescription className="text-burgundy/60">
            Add as many pieces as you like, then send them in one order.
          </SheetDescription>
        </SheetHeader>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-6">
            <p className="font-serif text-2xl text-burgundy">Nothing here yet.</p>
            <SheetClose asChild>
              <Link to="/shop" search={{ category: "all" }} className={`${primaryButton} mt-6`}>
                Browse the shop
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-burgundy">{line.product.name}</p>
                    <p className="mt-1 text-sm text-burgundy/60">{formatPrice(line.product)}</p>
                    <div className="mt-3">
                      <QtyControl
                        quantity={line.quantity}
                        label={line.product.name}
                        onChange={(next) => cart.setQuantity(line.id, next)}
                      />
                    </div>
                  </div>
                  <p className="font-serif text-lg text-burgundy">{formatMoney(line.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-burgundy/10 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-burgundy/50">
                  Total
                </span>
                <span className="font-serif text-3xl text-burgundy">{formatMoney(cart.total)}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-burgundy/65">
                Nothing is charged now. We call to confirm the pieces and payment.
              </p>
              <SheetClose asChild>
                <Link to="/checkout" className={`${primaryButton} mt-5 w-full`}>
                  Checkout
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
