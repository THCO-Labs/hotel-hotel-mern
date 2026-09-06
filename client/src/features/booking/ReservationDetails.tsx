import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatGuests, formatPrice } from "@/lib/format";
import type { Reservation } from "@/types";

/**
 * Definition grid for one booking, shared by the confirmation and lookup
 * pages. The Next.js version stringified untyped rows; a typed `Reservation`
 * lets each value be formatted for its own kind.
 */
export function ReservationDetails({ reservation }: { reservation: Reservation }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Guest", value: reservation.guest_name },
    { label: "Status", value: <Badge variant="secondary">{reservation.status}</Badge> },
    { label: "Check-in", value: formatDate(reservation.check_in_date) },
    { label: "Check-out", value: formatDate(reservation.check_out_date) },
    { label: "Guests", value: formatGuests(reservation.guests) },
    { label: "Total", value: formatPrice(reservation.total_amount) },
  ];

  return (
    <div data-builder-id="reservation.card" className="grid gap-3 text-sm sm:grid-cols-2">
      {rows.map(({ label, value }) => (
        <div key={label}>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      ))}
    </div>
  );
}
