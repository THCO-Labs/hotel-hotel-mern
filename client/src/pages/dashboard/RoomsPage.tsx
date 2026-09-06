import { hotelsApi } from "@/api/hotels";
import { roomsApi } from "@/api/rooms";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RoomForm } from "@/features/dashboard/RoomForm";
import { useAsync } from "@/hooks/use-async";
import type { Hotel, Room } from "@/types";

export default function RoomsPage() {
  // The page needs the full inventory and the hotel options together, so one
  // loader fetches both rather than two hooks racing each other.
  const { data, loading, error, reload } = useAsync(
    () => Promise.all([roomsApi.list(), hotelsApi.listAll()]),
    [],
  );

  const [rooms, hotels]: [Room[], Hotel[]] = data ?? [[], []];
  // The old page ordered both lists by name in SQL; keep that ordering here.
  const sortedRooms = [...rooms].sort((a, b) => a.name.localeCompare(b.name));
  const hotelOptions = hotels
    .map((hotel) => ({ id: hotel.id, name: hotel.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div data-builder-id="dashboard.rooms">
      <h1 className="text-3xl font-semibold">Rooms</h1>
      <p className="mt-2 text-muted-foreground">Maintain room types, capacity, rates, and amenities.</p>
      {error && (
        <p className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</p>
      )}
      {loading ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {[0, 1].map((n) => (
            <Card key={n}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {sortedRooms.map((room) => (
            <RoomForm key={room.id} room={room} hotels={hotelOptions} onSaved={reload} />
          ))}
          <RoomForm hotels={hotelOptions} onSaved={reload} />
        </div>
      )}
    </div>
  );
}
