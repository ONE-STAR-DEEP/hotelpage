import type { Hotel, HotelSortBy } from "@/types";

export function sortHotels(
  hotels: Hotel[],
  sortBy: HotelSortBy = "relevance",
): Hotel[] {
  const copy = [...hotels];

  switch (sortBy) {
    case "price_asc":
      return copy.sort(
        (a, b) => (a.pricePerNight ?? Number.POSITIVE_INFINITY) - (b.pricePerNight ?? Number.POSITIVE_INFINITY),
      );
    case "price_desc":
      return copy.sort(
        (a, b) => (b.pricePerNight ?? Number.NEGATIVE_INFINITY) - (a.pricePerNight ?? Number.NEGATIVE_INFINITY),
      );
    case "rating":
      return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "relevance":
    default:
      return copy;
  }
}
