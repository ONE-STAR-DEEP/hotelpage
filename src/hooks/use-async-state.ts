"use client";

import { useCallback, useState } from "react";

import type { AsyncStatus } from "@/types";

interface UseAsyncStateResult<T> {
  data: T | null;
  error: string | null;
  status: AsyncStatus;
  isLoading: boolean;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setStatus: (status: AsyncStatus) => void;
  reset: () => void;
}

/**
 * Lightweight async UI state helper for future data-fetching hooks.
 */
export function useAsyncState<T = unknown>(): UseAsyncStateResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus("idle");
  }, []);

  return {
    data,
    error,
    status,
    isLoading: status === "loading",
    setData,
    setError,
    setStatus,
    reset,
  };
}
