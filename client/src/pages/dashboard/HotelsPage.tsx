import { hotelsApi } from "@/api/hotels";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HotelForm } from "@/features/dashboard/HotelForm";
import { useAsync } from "@/hooks/use-async";

export default function HotelsPage() {
  // Staff edit unpublished properties too, so this is the `all` listing.
  const { data, loading, error, reload } = useAsync(() => hotelsApi.listAll(), []);
  const hotels = data ?? [];

  return (
    <div data-builder-id="dashboard.hotels">
      <h1 className="text-3xl font-semibold">Hotels</h1>
      <p className="mt-2 text-muted-foreground">Manage public property information and amenities.</p>
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
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {hotels.map((hotel) => (
            <HotelForm key={hotel.id} hotel={hotel} onSaved={reload} />
          ))}
          <HotelForm onSaved={reload} />
        </div>
      )}
    </div>
  );
}
