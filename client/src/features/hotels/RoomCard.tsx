import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { HotelArt } from "@/components/hotel-art";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  /** Prebuilt `/booking?…` link — the hotel page owns the dates and party size that go into it. */
  bookingHref: string;
}

export function RoomCard({ room, bookingHref }: RoomCardProps) {
  return (
    <Card>
      <CardContent className="grid gap-5 p-5 sm:grid-cols-[180px_1fr_auto] sm:items-center">
        <HotelArt art={room.images[0]} alt={room.name} className="min-h-32 rounded-xl" />
        <div>
          <h3 className="font-semibold">{room.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="size-4" />
            Up to {room.capacity} guests · {room.type}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span key={a} className="rounded-full bg-secondary px-2 py-1 text-xs">
                {a}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <strong className="text-xl text-primary">{formatPrice(room.price_per_night)}</strong>
          <p className="text-xs text-muted-foreground">per night</p>
          <Button asChild className="mt-4">
            <Link to={bookingHref}>Reserve room</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
