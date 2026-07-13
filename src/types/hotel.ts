import type { PaginatedResponse } from "./api";

/**
 * Normalized hotel model for UI.
 * All fields except id/name are optional — SearchAPI omits data often.
 */
export interface Hotel {
  id: string;
  name: string;
  imageUrl?: string;
  stars?: number;
  hotelClass?: string;
  rating?: number;
  reviewCount?: number;
  priceLabel?: string;
  pricePerNight?: number;
  currency?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  amenities?: string[];
  link?: string;
  propertyToken?: string;
}

export type HotelSortBy = "price_asc" | "price_desc" | "rating" | "relevance";

/**
 * Client search params aligned with the assignment form.
 * Maps to SearchAPI query params in the BFF layer.
 */
export interface HotelSearchParams {
  q: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
  currency?: string;
  hl?: string;
  page?: number;
  pageSize?: number;
  sortBy?: HotelSortBy;
  nextPageToken?: string;
}

export interface HotelSearchResult extends PaginatedResponse<Hotel> {
  nextPageToken?: string;
}
