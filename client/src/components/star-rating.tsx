import { Star } from "lucide-react";
export function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex" aria-label={`${rating} star hotel`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`size-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
      ))}
    </span>
  );
}
