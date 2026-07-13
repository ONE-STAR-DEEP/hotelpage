import { NextResponse } from "next/server";

import { hotelSearchQuerySchema } from "@/schemas";
import { fetchHotelsFromSearchApi } from "@/services/searchapi";
import type { ApiError } from "@/types";

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

/**
 * BFF proxy for SearchAPI Google Hotels.
 *
 * Browser → GET /api/hotels/search?q=New+York&...
 * Server  → GET https://www.searchapi.io/api/v1/search?engine=google_hotels&api_key=...
 *
 * api_key stays on the server (never sent to the browser).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const raw = {
      q: searchParams.get("q") ?? "",
      check_in_date: searchParams.get("check_in_date") || undefined,
      check_out_date: searchParams.get("check_out_date") || undefined,
      adults: searchParams.get("adults") || undefined,
      children: searchParams.get("children") || undefined,
      currency: searchParams.get("currency") || undefined,
      hl: searchParams.get("hl") || undefined,
      sortBy: searchParams.get("sortBy") || "relevance",
      next_page_token: searchParams.get("next_page_token") || undefined,
      page: searchParams.get("page") || "1",
      pageSize: searchParams.get("pageSize") || "20",
    };

    if (!raw.q.trim()) {
      return NextResponse.json(
        { message: "City name (q) is required" },
        { status: 400 },
      );
    }

    const parsed = hotelSearchQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid search parameters",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { check_in_date, check_out_date } = parsed.data;
    if (check_in_date && check_out_date) {
      const checkIn = new Date(`${check_in_date}T00:00:00`);
      const checkOut = new Date(`${check_out_date}T00:00:00`);
      if (!(checkOut > checkIn)) {
        return NextResponse.json(
          { message: "Check-out date must be later than check-in date" },
          { status: 400 },
        );
      }
    }

    console.info(
      `[SearchAPI] Searching hotels q="${parsed.data.q}" dates=${parsed.data.check_in_date ?? "default"}→${parsed.data.check_out_date ?? "default"}`,
    );

    const result = await fetchHotelsFromSearchApi(parsed.data);

    console.info(
      `[SearchAPI] OK — ${result.data.length} hotels (total ${result.meta.total})`,
    );

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[GET /api/hotels/search] SearchAPI failed:", error);

    if (isApiError(error)) {
      const status =
        error.status ??
        (error.code === "UNAUTHORIZED"
          ? 401
          : error.code === "VALIDATION_ERROR"
            ? 400
            : error.code === "TIMEOUT" || error.code === "NETWORK_ERROR"
              ? 504
              : 502);

      return NextResponse.json(
        { message: error.message, code: error.code, details: error.details },
        { status },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to search hotels";

    return NextResponse.json({ message }, { status: 500 });
  }
}
