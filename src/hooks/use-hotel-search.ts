"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isApiError, searchHotels } from "@/services";
import type { ApiError, HotelSearchParams, HotelSearchResult } from "@/types";

interface UseHotelSearchOptions {
  enabled?: boolean;
}

interface UseHotelSearchResult {
  data: HotelSearchResult | null;
  error: ApiError | null;
  isLoading: boolean;
  isFetching: boolean;
  search: (params: HotelSearchParams) => Promise<void>;
  reset: () => void;
}

function paramsKey(params: HotelSearchParams | null | undefined): string {
  if (!params) return "";
  return [
    params.q,
    params.checkInDate ?? "",
    params.checkOutDate ?? "",
    params.adults ?? "",
    params.children ?? "",
    params.currency ?? "",
    params.hl ?? "",
    params.page ?? 1,
    params.sortBy ?? "relevance",
    params.nextPageToken ?? "",
  ].join("|");
}

export function useHotelSearch(
  initialParams?: HotelSearchParams | null,
  options: UseHotelSearchOptions = {},
): UseHotelSearchResult {
  const { enabled = Boolean(initialParams) } = options;

  const [data, setData] = useState<HotelSearchResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(enabled && initialParams));
  const [isFetching, setIsFetching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsFetching(false);
  }, []);

  const search = useCallback(async (params: HotelSearchParams) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsFetching(true);
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchHotels(params, controller.signal);
      if (controller.signal.aborted) return;
      setData(result);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (isApiError(err)) {
        setError(err);
      } else {
        setError({
          code: "UNKNOWN",
          message: "Something went wrong while searching.",
        });
      }
      setData(null);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsFetching(false);
      }
    }
  }, []);

  const key = paramsKey(initialParams);

  useEffect(() => {
    if (!enabled || !initialParams) return;

    void search(initialParams);

    return () => {
      abortRef.current?.abort();
    };
  }, [enabled, key, initialParams, search]);

  return {
    data,
    error,
    isLoading,
    isFetching,
    search,
    reset,
  };
}
