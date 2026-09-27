import { formatMoney, getProduct } from "./catalog";
import type { CheckoutInput, PlaceOrderResult } from "./checkout";

const INBOX = "mansour99khoury@gmail.com";
const CUSTOMER_ERROR =
  "We couldn't send your order. Please try again, or message @cloud_jewlery_lb on Instagram.";

function createOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CJ-${time}-${suffix}`;
}

export async function sendOrderFromBrowser(order: CheckoutInput): Promise<PlaceOrderResult> {
  if (order.honey.trim().length > 0) {
    return { ok: true, orderId: createOrderId(), total: 0 };
  }

  const quantities = new Map<string, number>();
  for (const item of order.items) {
    quantities.set(item.id, Math.min(5, (quantities.get(item.id) ?? 0) + item.quantity));
  }

  const lines: string[] = [];
  let total = 0;
  for (const [id, quantity] of quantities) {
    const product = getProduct(id);
    if (!product) {
      return {
        ok: false,
        message: "One piece in your bag is no longer listed. Review your bag and try again.",
      };
    }
    const lineTotal = product.price * quantity;
    total += lineTotal;
    const starting = product.priceFrom ? " (starting price — confirm the final amount)" : "";
    lines.push(`${product.name} × ${quantity} — ${formatMoney(lineTotal)}${starting}`);
  }

  const orderId = createOrderId();
  const placed = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Beirut",
  }).format(new Date());

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `New Cloud Jewelry order ${orderId}`,
        _template: "table",
        _captcha: "false",
        ...(order.email ? { _replyto: order.email } : {}),
        Name: order.name,
        Phone: order.phone,
        Area: order.city,
        Address: order.address,
        Email: order.email || "Not provided",
        Note: order.note || "None",
        Items: lines.join("\n"),
        Total: `${formatMoney(total)} USD`,
        "Order ID": orderId,
        Placed: placed,
        Payment: "Not taken. Call to confirm the pieces, the total, and payment.",
      }),
    });
    const payload = (await response.json().catch(() => null)) as {
      success?: string | boolean;
      message?: string;
    } | null;
    const success = payload?.success === true || payload?.success === "true";
    const needsActivation = Boolean(payload?.message && /activat/i.test(payload.message));
    if (!response.ok || !success || needsActivation) {
      return { ok: false, message: CUSTOMER_ERROR };
    }
    return { ok: true, orderId, total };
  } catch {
    return { ok: false, message: CUSTOMER_ERROR };
  }
}
