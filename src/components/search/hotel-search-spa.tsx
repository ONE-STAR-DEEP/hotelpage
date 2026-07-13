"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  HotelEmptyState,
  HotelErrorState,
  HotelGrid,
  HotelSortSelect,
} from "@/components/hotel";
import { SearchForm } from "@/components/search";
import { Button, Container, Spinner } from "@/components/ui";
import { APP_NAME } from "@/constants";
import { sortHotels } from "@/lib/business";
import { isApiError, searchHotels } from "@/services";
import type { SearchFormValues } from "@/schemas";
import type {
  ApiError,
  HotelSearchParams,
  HotelSearchResult,
  HotelSortBy,
} from "@/types";

function toSearchParams(values: SearchFormValues): HotelSearchParams {
  const params: HotelSearchParams = {
    q: values.q,
  };

  if (values.checkInDate) params.checkInDate = values.checkInDate;
  if (values.checkOutDate) params.checkOutDate = values.checkOutDate;
  if (values.adults !== undefined) params.adults = values.adults;
  if (values.children !== undefined) params.children = values.children;
  if (values.currency) params.currency = values.currency;
  if (values.hl) params.hl = values.hl;

  return params;
}

/**
 * True SPA: form + results on one page.
 * Data source: SearchAPI Google Hotels (live Google scrape — often 3–10s).
 */
export function HotelSearchSpa() {
  const [lastValues, setLastValues] = useState<SearchFormValues | null>(null);
  const [sortBy, setSortBy] = useState<HotelSortBy>("relevance");
  const [rawResult, setRawResult] = useState<HotelSearchResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const displayedHotels = rawResult
    ? sortHotels(rawResult.data, sortBy)
    : [];

  const runSearch = useCallback(async (values: SearchFormValues) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastValues(values);
    setElapsedMs(null);

    const started = performance.now();

    try {
      const result = await searchHotels(
        toSearchParams(values),
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setRawResult(result);
      setElapsedMs(Math.round(performance.now() - started));
    } catch (err) {
      if (controller.signal.aborted) return;
      setRawResult(null);
      if (isApiError(err)) {
        setError(err);
      } else {
        setError({
          code: "UNKNOWN",
          message: "Something went wrong while searching hotels.",
        });
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleSubmit = (values: SearchFormValues) => {
    void runSearch(values);
  };

  const handleSortChange = (nextSort: HotelSortBy) => {
    // Instant — no second SearchAPI call
    setSortBy(nextSort);
  };

  const handleRetry = () => {
    if (lastValues) void runSearch(lastValues);
  };

  const handleLoadMore = async () => {
    if (!lastValues || !rawResult?.nextPageToken || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const more = await searchHotels({
        ...toSearchParams(lastValues),
        nextPageToken: rawResult.nextPageToken,
      });

      setRawResult({
        ...more,
        data: [...rawResult.data, ...more.data],
        meta: more.meta,
        nextPageToken: more.nextPageToken,
      });
    } catch (err) {
      if (isApiError(err)) setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_var(--primary-50),_transparent_70%)]"
      />

      <Container className="relative py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
            {APP_NAME}
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Hotel Search
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Live results from{" "}
            <span className="font-medium text-slate-800">
              SearchAPI Google Hotels
            </span>
            . First search can take a few seconds while Google data is fetched.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-5xl">
          <SearchForm
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            variant="hero"
          />
        </div>

        <section className="mx-auto mt-12 max-w-6xl" aria-live="polite">
          {!hasSearched ? (
            <p className="text-center text-sm text-slate-400">
              Enter a city (e.g. New York) and click Search.
            </p>
          ) : null}

          {hasSearched && error ? (
            <HotelErrorState error={error} onRetry={handleRetry} />
          ) : null}

          {hasSearched && !error ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {lastValues ? `Hotels in ${lastValues.q}` : "Results"}
                  </h2>
                  <div className="mt-1 text-sm text-slate-500">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Spinner size="sm" />
                        Calling SearchAPI Google Hotels… this often takes
                        3–10 seconds
                      </span>
                    ) : rawResult ? (
                      <>
                        Showing {displayedHotels.length} hotels
                        {rawResult.meta.total > displayedHotels.length
                          ? ` (of ${rawResult.meta.total.toLocaleString()})`
                          : null}
                        {elapsedMs !== null ? ` · ${elapsedMs}ms` : null}
                      </>
                    ) : null}
                  </div>
                </div>

                <HotelSortSelect
                  value={sortBy}
                  onChange={handleSortChange}
                  disabled={!rawResult}
                />
              </div>

              <HotelGrid
                hotels={displayedHotels}
                isLoading={isLoading && !rawResult}
              />

              {!isLoading && rawResult && displayedHotels.length === 0 ? (
                <HotelEmptyState destination={lastValues?.q} />
              ) : null}

              {!isLoading && rawResult?.nextPageToken ? (
                <div className="flex justify-center">
                  <Button onClick={() => void handleLoadMore()}>
                    Load more hotels
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </Container>
    </div>
  );
}
