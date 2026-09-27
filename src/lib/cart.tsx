import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { getProduct, type Product } from "./catalog";

const STORAGE_KEY = "cloud-jewelry-cart";

export type CartLine = {
  id: string;
  quantity: number;
};

export type DetailedLine = {
  id: string;
  quantity: number;
  product: Product;
  lineTotal: number;
};

type AddResult = "added" | "max-qty" | "max-items";

type CartContextValue = {
  ready: boolean;
  lines: DetailedLine[];
  count: number;
  total: number;
  add: (id: string) => AddResult;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const lines: CartLine[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const id = "id" in entry ? entry.id : undefined;
      const quantity = "quantity" in entry ? entry.quantity : undefined;
      if (typeof id !== "string" || typeof quantity !== "number" || !getProduct(id)) continue;
      lines.push({
        id,
        quantity: Math.min(5, Math.max(1, Math.floor(quantity))),
      });
      if (lines.length === 8) break;
    }
    return lines;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const linesRef = useRef<CartLine[]>([]);

  useEffect(() => {
    const stored = readStoredCart();
    linesRef.current = stored;
    setLines(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartContextValue>(() => {
    const detailed: DetailedLine[] = [];
    for (const line of lines) {
      const product = getProduct(line.id);
      if (!product) continue;
      detailed.push({
        id: line.id,
        quantity: line.quantity,
        product,
        lineTotal: product.price * line.quantity,
      });
    }

    const write = (next: CartLine[]) => {
      linesRef.current = next;
      setLines(next);
    };

    return {
      ready,
      lines: detailed,
      count: detailed.reduce((sum, line) => sum + line.quantity, 0),
      total: detailed.reduce((sum, line) => sum + line.lineTotal, 0),
      add: (id) => {
        if (!getProduct(id)) return "max-items";
        const current = linesRef.current;
        const existing = current.find((line) => line.id === id);
        if (existing) {
          if (existing.quantity >= 5) return "max-qty";
          write(
            current.map((line) =>
              line.id === id ? { ...line, quantity: existing.quantity + 1 } : line,
            ),
          );
          return "added";
        }
        if (current.length >= 8) return "max-items";
        write([...current, { id, quantity: 1 }]);
        return "added";
      },
      setQuantity: (id, quantity) => {
        const current = linesRef.current;
        if (quantity <= 0) {
          write(current.filter((line) => line.id !== id));
          return;
        }
        const nextQuantity = Math.min(5, quantity);
        const exists = current.some((line) => line.id === id);
        if (!exists) {
          if (current.length >= 8 || !getProduct(id)) return;
          write([...current, { id, quantity: nextQuantity }]);
          return;
        }
        write(
          current.map((line) => (line.id === id ? { ...line, quantity: nextQuantity } : line)),
        );
      },
      clear: () => write([]),
    };
  }, [lines, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within CartProvider");
  }
  return cart;
}
