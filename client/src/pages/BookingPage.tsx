import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { hotelsApi } from "@/api/hotels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/app-config";
import { ReservationSummary } from "@/features/booking/ReservationSummary";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { useAsync } from "@/hooks/use-async";
import type { HotelWithRooms, Reservation } from "@/types";

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests")) || 2;

  // Explicit type argument: the two branches are distinct promise types, so
  // inference alone would not settle on the nullable one.
  const { data: hotel, loading, error } = useAsync<HotelWithRooms | null>(
    () => (hotelId ? hotelsApi.get(hotelId) : Promise.resolve(null)),
    [hotelId],
  );
  const room = hotel?.rooms.find((r) => r.id === roomId);

  /** The server action used to redirect here; the client does it itself now. */
  function handleBooked(reservation: Reservation) {
    navigate(`${routes.confirmation(reservation.reference)}?email=${encodeURIComponent(reservation.guest_email)}`);
  }

  return (
    <div data-builder-id="booking.form" className="container max-w-5xl py-12">
      <h1 className="text-3xl font-semibold">Complete your reservation</h1>
      <p className="text-muted-foreground mt-2">No card needed. Your room is paid for at the hotel.</p>
      {error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive mt-6 flex gap-2 rounded-lg border p-4 text-sm">
          <AlertCircle className="size-4" />
          {error}
        </p>
      )}
      {loading ? (
        <Skeleton className="mt-8 h-96 w-full rounded-xl" />
      ) : !hotel || !room ? (
        <Card className="mt-8">
          <CardContent className="p-8 text-center">Choose a room from a hotel page to begin.</CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader>
              <CardTitle>Guest details</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm
                hotel={hotel}
                room={room}
                defaults={{ checkIn, checkOut, guests }}
                onBooked={handleBooked}
              />
            </CardContent>
          </Card>
          <ReservationSummary
            hotel={hotel}
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        </div>
      )}
    </div>
  );
}
