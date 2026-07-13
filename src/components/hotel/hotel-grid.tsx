"use client";

import { HotelCard, HotelCardSkeleton } from "./hotel-card";
import type { Hotel } from "@/types";

export interface HotelGridProps {
  hotels: Hotel[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function HotelGrid({
  hotels,
  isLoading = false,
  skeletonCount = 6,
}: HotelGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy
        aria-label="Loading hotels"
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <HotelCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {hotels.map((hotel, index) => (
        <HotelCard key={hotel.id} hotel={hotel} index={index} />
      ))}
    </div>
  );
}
