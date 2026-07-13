"use client";

import { useCallback, useState } from "react";

import type { ApiError, Hotel } from "@/types";

/**
 * Detail fetching is outside assignment scope.
 * Kept as a stub so imports remain stable.
 */
export function useHotel(_id: string | null): {
  hotel: Hotel | null;
  error: ApiError | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
} {
  const [error] = useState<ApiError | null>({
    code: "NOT_FOUND",
    message: "Hotel detail is not part of the search assignment.",
  });

  const refetch = useCallback(async () => undefined, []);

  return {
    hotel: null,
    error,
    isLoading: false,
    refetch,
  };
}
