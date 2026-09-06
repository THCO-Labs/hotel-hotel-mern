/**
 * Date helpers. Every date crossing the wire is an ISO day string
 * (yyyy-mm-dd), which sorts and compares correctly with plain operators and
 * maps directly onto Postgres `date` columns.
 */

/** Local yyyy-mm-dd for a Date. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today as yyyy-mm-dd, in the viewer's timezone. */
export function todayIso(): string {
  return toIsoDate(new Date());
}

/** ISO date `days` from today (negative for the past). */
export function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** True when the half-open range [aStart, aEnd) overlaps [bStart, bEnd). */
export function isDateRangeOverlapping(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Nights between check-in and check-out (0 when invalid). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = Date.parse(checkOut) - Date.parse(checkIn);
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return Math.round(ms / 86_400_000);
}

/** True when check-out is strictly after check-in and both parse. */
export function isValidStay(checkIn: string, checkOut: string): boolean {
  return !Number.isNaN(Date.parse(checkIn)) && !Number.isNaN(Date.parse(checkOut)) && checkIn < checkOut;
}
