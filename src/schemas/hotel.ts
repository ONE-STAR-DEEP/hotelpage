import { z } from "zod";

/**
 * Normalized search result returned by our BFF.
 * Fields on each hotel are optional because SearchAPI omits data often.
 */
export const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().optional(),
  stars: z.number().optional(),
  hotelClass: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  priceLabel: z.string().optional(),
  pricePerNight: z.number().optional(),
  currency: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  link: z.string().optional(),
  propertyToken: z.string().optional(),
});

export const hotelSearchResultSchema = z.object({
  data: z.array(hotelSchema),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
  nextPageToken: z.string().optional(),
});

export {
  searchApiPropertySchema,
  searchApiResponseSchema,
  type SearchApiProperty,
  type SearchApiResponse,
} from "./searchapi";
