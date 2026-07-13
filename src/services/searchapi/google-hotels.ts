import axios, { type AxiosError } from "axios";

import { getServerEnv } from "@/lib/env";
import {
  getDefaultStayDates,
  mapSearchApiPropertiesToHotels,
  sortHotels,
} from "@/lib/business";
import {
  searchApiResponseSchema,
  type HotelSearchQuery,
} from "@/schemas";
import type { HotelSearchResult } from "@/types";

/**
 * API in use (assignment PDF):
 *   GET https://www.searchapi.io/api/v1/search
 *   engine=google_hotels
 *
 * This provider scrapes Google Hotels live — typical latency is 3–10+ seconds.
 * We cache identical searches briefly to make repeat queries feel faster.
 */
const SEARCH_API_URL = "https://www.searchapi.io/api/v1/search";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  result: HotelSearchResult;
};

const searchCache = new Map<string, CacheEntry>();

export type SearchApiRequestParams = {
  engine: "google_hotels";
  q: string;
  api_key: string;
  check_in_date?: string;
  check_out_date?: string;
  adults?: string;
  children?: string;
  currency?: string;
  next_page_token?: string;
};

function cacheKey(query: HotelSearchQuery): string {
  return JSON.stringify({
    q: query.q,
    check_in_date: query.check_in_date ?? "",
    check_out_date: query.check_out_date ?? "",
    adults: query.adults ?? "",
    children: query.children ?? "",
    currency: "INR",
    next_page_token: query.next_page_token ?? "",
  });
}

/**
 * Build SearchAPI params.
 * Optional form fields are only included when the user provided them.
 */
export function buildSearchApiParams(
  query: HotelSearchQuery,
  apiKey: string,
): SearchApiRequestParams {
  const defaults = getDefaultStayDates();

  const params: SearchApiRequestParams = {
    engine: "google_hotels",
    q: query.q,
    api_key: apiKey,
    // Google Hotels needs dates for priced results
    currency: "INR",
    check_in_date: query.check_in_date || defaults.checkIn,
    check_out_date: query.check_out_date || defaults.checkOut,
  };

  if (query.adults !== undefined) params.adults = String(query.adults);
  if (query.children !== undefined) params.children = String(query.children);
  if (query.next_page_token) params.next_page_token = query.next_page_token;

  return params;
}

/**
 * Calls SearchAPI Google Hotels (server-side only).
 */
export async function fetchHotelsFromSearchApi(
  query: HotelSearchQuery,
): Promise<HotelSearchResult> {
  const env = getServerEnv();
  const key = cacheKey(query);
  const cached = searchCache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    console.info(`[SearchAPI] cache hit for q="${query.q}"`);
    return {
      ...cached.result,
      data: sortHotels(cached.result.data, query.sortBy ?? "relevance"),
    };
  }

  const params = buildSearchApiParams(query, env.API_KEY);
  const started = Date.now();

  try {
    const response = await axios.get(SEARCH_API_URL, {
      params,
      timeout: env.API_TIMEOUT_MS,
      headers: { Accept: "application/json" },
    });

    const elapsed = Date.now() - started;
    console.info(
      `[SearchAPI] upstream responded in ${elapsed}ms for q="${query.q}"`,
    );

    const parsed = searchApiResponseSchema.safeParse(response.data);

    if (!parsed.success) {
      throw {
        code: "VALIDATION_ERROR" as const,
        message: "Received an unexpected response from SearchAPI.",
        details: parsed.error.flatten(),
      };
    }

    if (parsed.data.error) {
      throw {
        code: "SERVER_ERROR" as const,
        message: parsed.data.error,
      };
    }

    const hotels = mapSearchApiPropertiesToHotels(parsed.data.properties);
    const total =
      parsed.data.search_information?.total_results ?? hotels.length;
    const pageSize = query.pageSize ?? (hotels.length || 20);
    const page = query.page ?? 1;

    const result: HotelSearchResult = {
      data: hotels,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      nextPageToken: parsed.data.pagination?.next_page_token,
    };

    searchCache.set(key, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      result,
    });

    return {
      ...result,
      data: sortHotels(result.data, query.sortBy ?? "relevance"),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw normalizeSearchApiAxiosError(error);
    }
    throw error;
  }
}

function normalizeSearchApiAxiosError(error: AxiosError) {
  const status = error.response?.status;
  const payload = error.response?.data as
    | { error?: string; message?: string }
    | undefined;

  const message =
    payload?.error ??
    payload?.message ??
    error.message ??
    "Failed to fetch hotels from SearchAPI.";

  if (error.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT" as const,
      message: "The hotel search timed out. Please try again.",
      status,
    };
  }

  if (!error.response) {
    return {
      code: "NETWORK_ERROR" as const,
      message: "Unable to reach SearchAPI. Check your connection.",
    };
  }

  if (status === 401 || status === 403) {
    return {
      code: "UNAUTHORIZED" as const,
      message:
        "SearchAPI rejected the API key. Check API_KEY in .env.local.",
      status,
    };
  }

  if (status === 400 || status === 422) {
    return {
      code: "VALIDATION_ERROR" as const,
      message,
      status,
      details: payload,
    };
  }

  return {
    code: "SERVER_ERROR" as const,
    message,
    status,
    details: payload,
  };
}
