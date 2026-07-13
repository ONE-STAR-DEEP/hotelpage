"use client";

import { Select } from "@/components/ui";
import type { HotelSortBy } from "@/types";

const SORT_OPTIONS: ReadonlyArray<{ value: HotelSortBy; label: string }> = [
  { value: "relevance", label: "Best match" },
  { value: "rating", label: "Guest rating" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export interface HotelSortSelectProps {
  value: HotelSortBy;
  onChange: (value: HotelSortBy) => void;
  disabled?: boolean;
}

export function HotelSortSelect({
  value,
  onChange,
  disabled,
}: HotelSortSelectProps) {
  return (
    <Select
      label="Sort by"
      name="sortBy"
      value={value}
      disabled={disabled}
      options={SORT_OPTIONS}
      onChange={(event) => onChange(event.target.value as HotelSortBy)}
      className="min-w-[200px]"
    />
  );
}
