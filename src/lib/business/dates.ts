/**
 * Pure date helpers for stay calculations — no I/O.
 */

export function parseIsoDate(value: string): Date {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date: ${value}`);
  }
  return date;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getDefaultStayDates(): { checkIn: string; checkOut: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    checkIn: toIsoDate(addDays(today, 7)),
    checkOut: toIsoDate(addDays(today, 10)),
  };
}
