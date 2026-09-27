import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

import { formatMoney, getProduct } from "./catalog";
import { checkoutSchema, type PlaceOrderResult } from "./checkout";

const CUSTOMER_ERROR =
  "We couldn't send your order. Please try again, or message @cloud_jewlery_lb on Instagram.";

const attempts = new Map<string, number[]>();

function readEnv(name: string): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  const value = env?.[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function tooManyAttempts(phone: string): boolean {
  const key = phone.replace(/\D/g, "");
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 5) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);
  return false;
}

function createOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CJ-${time}-${suffix}`;
}

type OrderLine = {
  name: string;
  quantity: number;
  lineTotal: number;
  priceFrom: boolean;
};

async function sendWithResend(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = readEnv("RESEND_API_KEY");
  if (!key) return false;

  const from = readEnv("RESEND_FROM") ?? "Cloud Jewelry <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    console.error("Resend rejected the order email", response.status);
    throw new Error("Resend failed");
  }

  return true;
}

async function sendWithFormSubmit(input: {
  to: string;
  subject: string;
  fields: Record<string, string>;
  replyTo?: string;
}): Promise<void> {
  const origin = requestOrigin();
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(input.to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(origin
        ? {
            Origin: origin,
            Referer: `${origin}/checkout`,
          }
        : {}),
    },
    body: JSON.stringify({
      _subject: input.subject,
      _template: "table",
      _captcha: "false",
      ...(input.replyTo ? { _replyto: input.replyTo } : {}),
      ...input.fields,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;

  const success = payload?.success === true || payload?.success === "true";
  const needsActivation = Boolean(payload?.message && /activat/i.test(payload.message));

  if (!response.ok || !success || needsActivation) {
    console.error("Order email was not delivered", response.status, payload?.message ?? "");
    throw new Error("Email failed");
  }
}

function requestOrigin(): string | undefined {
  try {
    return new URL(getRequestUrl()).origin;
  } catch {
    return undefined;
  }
}

export const placeOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<PlaceOrderResult> => {
    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, message: "Please check the form and try again." };
    }

    const order = parsed.data;
    if (order.honey.trim().length > 0) {
      return { ok: true, orderId: createOrderId(), total: 0 };
    }

    if (tooManyAttempts(order.phone)) {
      return {
        ok: false,
        message: "Please wait a little while before sending another order, or message us on Instagram.",
      };
    }

    const quantities = new Map<string, number>();
    for (const item of order.items) {
      const next = Math.min(5, (quantities.get(item.id) ?? 0) + item.quantity);
      quantities.set(item.id, next);
    }

    const lines: OrderLine[] = [];
    for (const [id, quantity] of quantities) {
      const product = getProduct(id);
      if (!product) {
        return {
          ok: false,
          message: "One piece in your bag is no longer listed. Review your bag and try again.",
        };
      }
      lines.push({
        name: product.name,
        quantity,
        lineTotal: product.price * quantity,
        priceFrom: product.priceFrom === true,
      });
    }

    const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const orderId = createOrderId();
    const placed = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Beirut",
    }).format(new Date());

    const itemText = lines
      .map((line) => {
        const starting = line.priceFrom ? " (starting price — confirm the final amount)" : "";
        return `${line.name} × ${line.quantity} — ${formatMoney(line.lineTotal)}${starting}`;
      })
      .join("\n");

    const text = [
      `New Cloud Jewelry order ${orderId}`,
      `Placed: ${placed}`,
      "",
      `Name: ${order.name}`,
      `Phone: ${order.phone}`,
      `Area: ${order.city}`,
      `Address: ${order.address}`,
      `Email: ${order.email || "Not provided"}`,
      `Note: ${order.note || "None"}`,
      "",
      "Items:",
      itemText,
      "",
      `Listed total: ${formatMoney(total)} USD`,
      "",
      "No payment was taken on the website. Call to confirm the pieces, the total, and payment.",
    ].join("\n");

    const inbox = readEnv("ORDER_INBOX") ?? "mansour99khoury@gmail.com";
    const replyTo = order.email.length > 0 ? order.email : undefined;
    const subject = `New Cloud Jewelry order ${orderId}`;

    try {
      const sentWithResend = await sendWithResend({
        to: inbox,
        subject,
        text,
        ...(replyTo ? { replyTo } : {}),
      });

      if (!sentWithResend) {
        await sendWithFormSubmit({
          to: inbox,
          subject,
          ...(replyTo ? { replyTo } : {}),
          fields: {
            Name: order.name,
            Phone: order.phone,
            Area: order.city,
            Address: order.address,
            Email: order.email || "Not provided",
            Note: order.note || "None",
            Items: itemText,
            Total: `${formatMoney(total)} USD`,
            "Order ID": orderId,
            Placed: placed,
            Payment: "Not taken. Call to confirm the pieces, the total, and payment.",
          },
        });
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Order email failed");
      return { ok: false, message: CUSTOMER_ERROR };
    }

    console.info(`Order ${orderId} emailed`);
    return { ok: true, orderId, total };
  });
