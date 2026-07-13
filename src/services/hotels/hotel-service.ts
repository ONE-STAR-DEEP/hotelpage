import { hotelSearchResultSchema } from "@/schemas";
import { apiClient } from "@/services/api";
import type { HotelSearchParams, HotelSearchResult } from "@/types";

/**
 * Builds query string for our BFF.
 * Only includes optional params when they have values.
 */
function toQuery(params: HotelSearchParams): Record<string, string> {
  const query: Record<string, string> = {
    q: params.q,
  };

  if (params.checkInDate) query.check_in_date = params.checkInDate;
  if (params.checkOutDate) query.check_out_date = params.checkOutDate;
  if (params.adults !== undefined) query.adults = String(params.adults);
  if (params.children !== undefined) query.children = String(params.children);
  if (params.currency) query.currency = params.currency;
  if (params.hl) query.hl = params.hl;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.nextPageToken) query.next_page_token = params.nextPageToken;
  if (params.page !== undefined) query.page = String(params.page);
  if (params.pageSize !== undefined) query.pageSize = String(params.pageSize);

  return query;
}

/**
 * Client hotel search service — talks to our BFF only (never SearchAPI directly).
 */
export async function searchHotels(
  params: HotelSearchParams,
  signal?: AbortSignal,
): Promise<HotelSearchResult> {
  const { data } = await apiClient.get<unknown>("/api/hotels/search", {
    params: toQuery(params),
    signal,
  });

  // Soft validation — tolerate partial API payloads
  const parsed = hotelSearchResultSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data;
  }

  // Fallback if schema is strict about optional fields
  const fallback = data as HotelSearchResult;
  if (fallback && Array.isArray(fallback.data) && fallback.meta) {
    return fallback;
  }

  throw {
    code: "VALIDATION_ERROR" as const,
    message: "Received an unexpected search response.",
    details: parsed.error?.flatten(),
  };
}

export async function getHotelById(): Promise<never> {
  throw {
    code: "NOT_FOUND" as const,
    message: "Hotel detail is not part of the SearchAPI list assignment.",
  };
}
