import { z } from "zod";

/**
 * Loose SearchAPI property schema — many fields are frequently missing.
 */
export const searchApiPropertySchema = z
  .object({
    property_token: z.string().optional(),
    data_id: z.string().optional(),
    name: z.string().optional(),
    link: z.string().optional(),
    description: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    hotel_class: z.string().optional(),
    extracted_hotel_class: z.number().optional(),
    rating: z.number().optional(),
    reviews: z.number().optional(),
    amenities: z.array(z.string()).optional(),
    price_per_night: z
      .object({
        price: z.string().optional(),
        extracted_price: z.number().optional(),
      })
      .optional(),
    total_price: z
      .object({
        price: z.string().optional(),
        extracted_price: z.number().optional(),
      })
      .optional(),
    images: z
      .array(
        z.object({
          thumbnail: z.string().optional(),
          original: z.string().optional(),
        }),
      )
      .optional(),
  })
  .passthrough();

export const searchApiResponseSchema = z
  .object({
    properties: z.array(searchApiPropertySchema).optional(),
    pagination: z
      .object({
        next_page_token: z.string().optional(),
        records_from: z.number().optional(),
        records_to: z.number().optional(),
      })
      .optional(),
    search_information: z
      .object({
        total_results: z.number().optional(),
      })
      .optional(),
    error: z.string().optional(),
  })
  .passthrough();

export type SearchApiProperty = z.infer<typeof searchApiPropertySchema>;
export type SearchApiResponse = z.infer<typeof searchApiResponseSchema>;
