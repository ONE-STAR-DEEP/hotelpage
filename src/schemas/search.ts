import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
};

const optionalDateField = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
    .optional(),
);

const optionalIntField = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number" && Number.isNaN(value)) return undefined;
  const num = typeof value === "string" ? Number(value) : value;
  return num;
}, z.number().int().min(0).max(16).optional());

/**
 * Assignment form schema.
 * City (q) is mandatory. All other fields are optional.
 * If both dates are provided, check-out must be after check-in.
 */
export const searchFormSchema = z
  .object({
    q: z
      .string()
      .trim()
      .min(1, "City name is required")
      .max(100, "City name is too long"),
    checkInDate: optionalDateField,
    checkOutDate: optionalDateField,
    adults: optionalIntField,
    children: optionalIntField,
    currency: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{3}$/, "Use a 3-letter currency code (e.g. USD)")
        .optional(),
    ),
    hl: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z]{2}(-[a-z]{2})?$/, "Use a language code (e.g. en)")
        .optional(),
    ),
  })
  .superRefine((value, ctx) => {
    const checkIn = value.checkInDate;
    const checkOut = value.checkOutDate;

    if (checkIn && checkOut) {
      const inDate = new Date(`${checkIn}T00:00:00`);
      const outDate = new Date(`${checkOut}T00:00:00`);

      if (Number.isNaN(inDate.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["checkInDate"],
          message: "Invalid check-in date",
        });
        return;
      }

      if (Number.isNaN(outDate.getTime())) {
        ctx.addIssue({
          code: "custom",
          path: ["checkOutDate"],
          message: "Invalid check-out date",
        });
        return;
      }

      if (outDate <= inDate) {
        ctx.addIssue({
          code: "custom",
          path: ["checkOutDate"],
          message: "Check-out date must be later than check-in date",
        });
      }
    }
  });

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const hotelSearchQuerySchema = z.object({
  q: z.string().trim().min(1, "City name is required"),
  check_in_date: z.string().min(1).optional(),
  check_out_date: z.string().min(1).optional(),
  adults: z.coerce.number().int().min(1).max(16).optional(),
  children: z.coerce.number().int().min(0).max(16).optional(),
  currency: z.string().trim().toUpperCase().optional(),
  hl: z.string().trim().toLowerCase().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "rating", "relevance"])
    .optional()
    .default("relevance"),
  next_page_token: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type HotelSearchQuery = z.infer<typeof hotelSearchQuerySchema>;
