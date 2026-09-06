import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nightsBetween } from "@/lib/dates";
import { formatPrice } from "@/lib/format";
import type { HotelWithRooms, Room } from "@/types";

interface ReservationSummaryProps {
  hotel: HotelWithRooms;
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
}

/** Read-only price recap beside the checkout form. */
export function ReservationSummary({ hotel, room, checkIn, checkOut, guests }: ReservationSummaryProps) {
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Stay summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-medium">{hotel.name}</p>
          <p className="text-muted-foreground">{room.name}</p>
        </div>
        <div className="border-t pt-3">
          <p>
            {checkIn || "Select dates"} → {checkOut || "Select dates"}
          </p>
          <p className="text-muted-foreground">
            {nights || 0} nights · {guests} guests
          </p>
        </div>
        <div className="flex justify-between border-t pt-3 font-semibold">
          <span>Estimated total</span>
          <span>{formatPrice(room.price_per_night * nights)}</span>
        </div>
        <p className="text-muted-foreground text-xs">
          Pay at the property. Taxes and property charges may apply.
        </p>
      </CardContent>
    </Card>
  );
}
