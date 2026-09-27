import { z } from "zod";

export const cities = [
  "Beirut",
  "Mount Lebanon",
  "North Lebanon",
  "South Lebanon",
  "Bekaa",
  "Nabatieh",
  "Baalbek-Hermel",
  "Akkar",
  "Outside Lebanon",
] as const;

export type City = (typeof cities)[number];

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(6, "Enter your phone number")
    .max(24, "Phone number is too long")
    .regex(/^[0-9+()\-\s]+$/, "Use digits, spaces, or + only")
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 6 && digits <= 15;
    }, "Enter a phone number we can call"),
  city: z.enum(cities, {
    errorMap: () => ({ message: "Choose your area" }),
  }),
  address: z
    .string()
    .trim()
    .min(4, "Enter your street, building, and floor")
    .max(200, "Address is too long"),
  email: z
    .string()
    .trim()
    .max(120, "Email is too long")
    .refine(
      (value) => value.length === 0 || z.string().email().safeParse(value).success,
      "Enter a valid email, or leave it blank",
    ),
  note: z.string().trim().max(500, "Keep the note under 500 characters"),
  honey: z.string().max(200),
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        quantity: z.number().int().min(1).max(5),
      }),
    )
    .min(1, "Add at least one piece")
    .max(8, "You can order up to 8 different pieces at once"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type PlaceOrderResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; message: string };
