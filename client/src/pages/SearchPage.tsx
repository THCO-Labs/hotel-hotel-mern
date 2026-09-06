import { SearchX } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { hotelsApi } from "@/api/hotels";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HotelCard } from "@/features/hotels/HotelCard";
import { useAsync } from "@/hooks/use-async";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const guests = searchParams.get("guests");
  const { data, loading, error } = useAsync(
    () =>
      hotelsApi.search({
        city: searchParams.get("city") ?? undefined,
        checkIn: searchParams.get("checkIn") ?? undefined,
        checkOut: searchParams.get("checkOut") ?? undefined,
        guests: guests ? Number(guests) : undefined,
      }),
    [searchParams.toString()],
  );

  const hits = data ?? [];
  // Blank params are dropped so an untouched field never travels onto the hotel link.
  const query = new URLSearchParams(
    [...searchParams].filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <div data-builder-id="search.results" className="container py-12">
      <h1 className="text-3xl font-semibold">
        {[...searchParams.values()].some(Boolean) ? "Search results" : "All stays"}
      </h1>
      <p className="mt-2 text-muted-foreground">Live room availability with no payment required to reserve.</p>
      {error && (
        <p className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</p>
      )}
      {loading ? (
        <div className="mt-8 space-y-6">
          {[0, 1, 2].map((n) => (
            <Card key={n} className="overflow-hidden">
              <div className="grid md:grid-cols-[300px_1fr]">
                <Skeleton className="h-full min-h-48 rounded-none" />
                <div className="flex flex-col gap-4 p-6">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-4 h-10 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : !error && hits.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed py-20 text-center">
          <SearchX className="size-12 text-primary" />
          <h2 className="mt-5 text-2xl font-semibold">No stays match that search</h2>
          <p className="mt-2 text-muted-foreground">Try another city, date range, or party size.</p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Refine search</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {hits.map((hit) => (
            <HotelCard key={hit.hotel.id} hit={hit} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}
