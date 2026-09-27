import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { SiteFrame } from "@/components/site/frame";
import { QtyControl } from "@/components/site/qty-control";
import { fieldClass, onBurgundyButton, primaryButton } from "@/components/site/styles";
import { instagramUrl } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { formatMoney, formatPrice } from "@/lib/catalog";
import { checkoutSchema, cities, type PlaceOrderResult } from "@/lib/checkout";
import { placeOrder } from "@/lib/place-order";
import { sendOrderFromBrowser } from "@/lib/send-order-browser";

const CONFIRM_KEY = "cloud-jewelry-confirmation";

type Confirmation = {
  orderId: string;
  total: number;
  name: string;
};

type FormState = {
  name: string;
  phone: string;
  city: string;
  address: string;
  email: string;
  note: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  city: "",
  address: "",
  email: "",
  note: "",
};

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Cloud Jewelry" },
      {
        name: "description",
        content: "Send your Cloud Jewelry order. We confirm by phone before anything is made.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function readConfirmation(): Confirmation | null {
  try {
    const raw = sessionStorage.getItem(CONFIRM_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const orderId = "orderId" in value ? value.orderId : undefined;
    const name = "name" in value ? value.name : undefined;
    const total = "total" in value ? value.total : undefined;
    if (typeof orderId !== "string" || typeof name !== "string" || typeof total !== "number") {
      return null;
    }
    return { orderId, name, total };
  } catch {
    return null;
  }
}

function CheckoutPage() {
  const cart = useCart();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [confirmReady, setConfirmReady] = useState(false);

  useEffect(() => {
    setConfirmation(readConfirmation());
    setConfirmReady(true);
  }, []);

  if (!cart.ready || !confirmReady) {
    return (
      <SiteFrame>
        <p className="px-6 py-24 text-center text-burgundy/60">Loading your bag…</p>
      </SiteFrame>
    );
  }

  if (confirmation && cart.lines.length === 0) {
    return (
      <SiteFrame>
        <ThankYou
          confirmation={confirmation}
          onAnother={() => {
            sessionStorage.removeItem(CONFIRM_KEY);
            setConfirmation(null);
          }}
        />
      </SiteFrame>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <SiteFrame>
        <section className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="font-serif text-5xl text-burgundy">Your bag is empty</h1>
          <p className="mt-4 text-burgundy/70">
            Choose a few pieces and send them together in one order.
          </p>
          <Link to="/shop" search={{ category: "all" }} className={`${primaryButton} mt-8`}>
            Browse the shop
          </Link>
        </section>
      </SiteFrame>
    );
  }

  const hasStartingPrice = cart.lines.some((line) => line.product.priceFrom === true);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const payload = {
      ...form,
      honey,
      items: cart.lines.map((line) => ({ id: line.id, quantity: line.quantity })),
    };
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError("Please fill in the missing details.");
      return;
    }

    setPending(true);
    try {
      const result: PlaceOrderResult =
        import.meta.env["VITE_STATIC_HOST"] === "true"
          ? await sendOrderFromBrowser(parsed.data)
          : await placeOrder({ data: parsed.data });
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      const next = { orderId: result.orderId, total: result.total, name: parsed.data.name };
      sessionStorage.setItem(CONFIRM_KEY, JSON.stringify(next));
      setConfirmation(next);
      cart.clear();
    } catch {
      setFormError(
        "We couldn't send your order. Please try again, or message us on Instagram.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteFrame>
      <section className="px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)]">
          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-burgundy/50">Checkout</p>
              <h1 className="mt-3 font-serif text-5xl text-burgundy">Tell us where to reach you.</h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-burgundy/70">
                We use this only to confirm your order. Nothing is charged on this page.
              </p>
            </div>

            {formError ? (
              <p role="alert" className="rounded-2xl bg-petal px-4 py-3 text-sm text-burgundy">
                {formError}{" "}
                <a href={instagramUrl} className="underline" target="_blank" rel="noreferrer">
                  Message us on Instagram
                </a>
              </p>
            ) : null}

            <Field label="Name" error={errors["name"]}>
              <input
                className={fieldClass}
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </Field>
            <Field label="Phone" error={errors["phone"]}>
              <input
                className={fieldClass}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="03 123 456"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </Field>
            <Field label="Area" error={errors["city"]}>
              <select
                className={fieldClass}
                name="city"
                autoComplete="address-level1"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
              >
                <option value="">Choose an area</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Address" error={errors["address"]}>
              <input
                className={fieldClass}
                name="address"
                autoComplete="street-address"
                placeholder="Street, building, and floor"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
              />
            </Field>
            <Field label="Email, if you want a copy" error={errors["email"]}>
              <input
                className={fieldClass}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Optional"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </Field>
            <Field label="Note" error={errors["note"]}>
              <textarea
                className={`${fieldClass} min-h-28 resize-y`}
                name="note"
                placeholder="Anklet size, colors, initials, or anything we should know"
                value={form.note}
                onChange={(event) => update("note", event.target.value)}
              />
            </Field>

            <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
              <label>
                Leave this empty
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honey}
                  onChange={(event) => setHoney(event.target.value)}
                />
              </label>
            </div>

            <button type="submit" className={primaryButton} disabled={pending}>
              {pending ? "Sending your order…" : "Place order"}
            </button>
          </form>

          <aside className="h-fit rounded-[1.5rem] bg-white p-6 ring-1 ring-burgundy/10 lg:sticky lg:top-28">
            <h2 className="font-serif text-3xl text-burgundy">Your order</h2>
            <ul className="mt-6 space-y-5">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-burgundy">{line.product.name}</p>
                    <p className="mt-1 text-sm text-burgundy/55">{formatPrice(line.product)}</p>
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
            <div className="mt-6 flex items-baseline justify-between border-t border-burgundy/10 pt-5">
              <span className="text-[11px] uppercase tracking-[0.18em] text-burgundy/50">Total</span>
              <span className="font-serif text-3xl text-burgundy">{formatMoney(cart.total)}</span>
            </div>
            {hasStartingPrice ? (
              <p className="mt-3 text-sm text-burgundy/65">
                Custom pieces use a starting price. We'll confirm the final amount when we call.
              </p>
            ) : null}
            <Link
              to="/shop"
              search={{ category: "all" }}
              className="mt-5 inline-block text-sm text-burgundy/70 underline decoration-rose underline-offset-4"
            >
              Add more pieces
            </Link>
          </aside>
        </div>
      </section>
    </SiteFrame>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-burgundy/55">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span className="mt-2 block text-sm text-burgundy" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ThankYou({
  confirmation,
  onAnother,
}: {
  confirmation: Confirmation;
  onAnother: () => void;
}) {
  const first = confirmation.name.trim().split(/\s+/)[0] ?? confirmation.name;

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-xl rounded-[1.75rem] bg-burgundy px-8 py-14 text-center text-rose md:px-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rose/70">Order received</p>
        <h1 className="mt-4 font-serif text-5xl text-rose">Thank you, {first}.</h1>
        <p className="mt-5 text-base leading-relaxed text-rose/85">
          Your order <span className="font-medium">{confirmation.orderId}</span> is with us. We'll
          call to confirm the pieces
          {confirmation.total > 0 ? ` and the ${formatMoney(confirmation.total)} total` : ""} before
          anything is made.
        </p>
        <p className="mt-4 text-sm text-rose/70">Keep the order number if you message us.</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link to="/shop" search={{ category: "all" }} className={onBurgundyButton}>
            Back to the shop
          </Link>
          <button
            type="button"
            onClick={onAnother}
            className="text-[11px] uppercase tracking-[0.18em] text-rose/80 underline decoration-rose/40 underline-offset-4"
          >
            Place another order
          </button>
        </div>
      </div>
    </section>
  );
}
