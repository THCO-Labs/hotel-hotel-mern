import { Check, MapPin } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ApiError } from "@/api/client";
import { hotelsApi } from "@/api/hotels";
import { HotelArt } from "@/components/hotel-art";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RoomCard } from "@/features/hotels/RoomCard";
import { useAsync } from "@/hooks/use-async";

export default function HotelDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  // The router has no equivalent of Next's not-found throw, so a 404 becomes
  // `null` data and every other failure still surfaces as an error.
  const { data: hotel, loading, error } = useAsync(
    () =>
      hotelsApi.get(slug).catch((cause: unknown) => {
        if (cause instanceof ApiError && cause.status === 404) return null;
        throw cause;
      }),
    [slug],
  );

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="min-h-72 rounded-2xl" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="mt-12 grid gap-5">
          {[0, 1].map((n) => (
            <Skeleton key={n} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-3 text-4xl font-bold">That page took a different trail</h1>
          <p className="mt-3 text-muted-foreground">The page you requested could not be found.</p>
          <Button asChild className="mt-6">
            <Link to="/">Return home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div data-builder-id="hotel.details" className="container py-10">
      <HotelArt art={hotel.images[0]} alt={hotel.name} className="min-h-72 rounded-2xl" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{hotel.name}</h1>
            <StarRating rating={hotel.star_rating} />
          </div>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {hotel.address}, {hotel.city}, {hotel.country}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{hotel.description}</p>
          <h2 className="mt-8 text-xl font-semibold">Property amenities</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hotel.amenities.map((a) => (
              <span key={a} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-primary" />
                {a}
              </span>
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold">Your stay</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a room below. You won’t be charged online.
            </p>
          </CardContent>
        </Card>
      </div>
      <h2 className="mt-12 text-2xl font-semibold">Rooms</h2>
      <div className="mt-5 grid gap-5">
        {hotel.rooms.map((room) => {
          const sp = new URLSearchParams({
            hotelId: hotel.id,
            roomId: room.id,
            checkIn: searchParams.get("checkIn") ?? "",
            checkOut: searchParams.get("checkOut") ?? "",
            guests: searchParams.get("guests") ?? "2",
          });
          return <RoomCard key={room.id} room={room} bookingHref={`/booking?${sp}`} />;
        })}
      </div>
    </div>
  );
}
