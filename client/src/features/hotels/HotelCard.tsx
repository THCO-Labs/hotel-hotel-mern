import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { HotelArt } from "@/components/hotel-art";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { HotelSearchHit } from "@/types";

interface HotelCardProps {
  hit: HotelSearchHit;
  /** Already-serialised search querystring, carried onto the hotel link so dates and party size survive the click. */
  query?: string;
}

export function HotelCard({ hit, query }: HotelCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[300px_1fr]">
        <HotelArt art={hit.hotel.images[0]} alt={hit.hotel.name} className="h-full rounded-none" />
        <CardContent className="flex flex-col p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{hit.hotel.name}</h2>
            <StarRating rating={hit.hotel.star_rating} />
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {hit.hotel.city}, {hit.hotel.country}
          </p>
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{hit.hotel.description}</p>
          <div className="mt-auto flex items-end justify-between border-t pt-5">
            <div>
              <strong className="text-xl text-primary">{formatPrice(hit.priceFrom)}</strong>
              <span className="text-sm text-muted-foreground"> / night</span>
              <p className="text-xs text-muted-foreground">{hit.availableCount} rooms available</p>
            </div>
            <Button asChild>
              <Link to={`/hotels/${hit.hotel.slug}${query ? `?${query}` : ""}`}>
                View stays <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
