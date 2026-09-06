/**
 * Display formatting shared by guest pages and the staff dashboard.
 * Dependency-free so any layer can import exactly what it needs.
 */

/** "$289" style price, dropping cents for whole values. */
export function formatPrice(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
}

/** Compact currency for dashboard tiles, e.g. "$12.4k". */
export function formatCompactPrice(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

/** "Jun 14, 2026" from an ISO date (yyyy-mm-dd). */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "Jun 14 - Jun 19, 2026" for a stay, collapsing a shared year. */
export function formatDateRange(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return "";
  const inDate = new Date(`${checkIn.slice(0, 10)}T00:00:00`);
  const outDate = new Date(`${checkOut.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return "";
  const sameYear = inDate.getFullYear() === outDate.getFullYear();
  const inPart = inDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
  const outPart = outDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${inPart} \u2013 ${outPart}`;
}

/** "Jun 14, 2026, 3:20 PM" from a timestamptz. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "2 guests" / "1 guest". */
export function formatGuests(count: number): string {
  return `${count} ${count === 1 ? "guest" : "guests"}`;
}

/** "3 nights" / "1 night". */
export function formatNights(count: number): string {
  return `${count} ${count === 1 ? "night" : "nights"}`;
}

/** First-letter initials for avatar fallbacks. */
export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
