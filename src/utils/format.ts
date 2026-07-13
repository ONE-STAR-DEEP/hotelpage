/**
 * Shared formatting helpers.
 */

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatReviewCount(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}

export function formatStaySummary(
  checkIn: string,
  checkOut: string,
  guests: number,
): string {
  const nights = Math.max(
    1,
    Math.round(
      (new Date(`${checkOut}T00:00:00`).getTime() -
        new Date(`${checkIn}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const guestLabel = guests === 1 ? "1 guest" : `${guests} guests`;
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;
  return `${nightLabel} · ${guestLabel}`;
}
