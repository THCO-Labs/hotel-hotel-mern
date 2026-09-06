import { Building2, Flower2, Home, Mountain, Trees, Waves, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
const styles: Record<string, [LucideIcon, string, string]> = {
  pine: [Trees, "from-brand-600 via-brand-700 to-brand-950", "text-brand-200"],
  canopy: [Trees, "from-brand-400 via-brand-600 to-brand-900", "text-brand-100"],
  cabin: [Home, "from-amber-600 via-amber-800 to-brand-950", "text-amber-100"],
  meadow: [Flower2, "from-lime-300 via-brand-500 to-brand-800", "text-brand-50"],
  stone: [Building2, "from-stone-400 via-stone-600 to-stone-900", "text-stone-100"],
  lake: [Waves, "from-teal-400 via-brand-700 to-brand-950", "text-teal-50"],
};
export function HotelArt({ art, alt, className }: { art?: string; alt?: string; className?: string }) {
  const [Icon, gradient, color] = styles[art ?? ""] ?? [
    Mountain,
    "from-brand-500 via-brand-700 to-brand-950",
    "text-brand-100",
  ];
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative grid min-h-48 place-items-center overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <span className="absolute -top-10 -right-8 size-36 rounded-full bg-white/15 blur-2xl" />
      <Icon className={cn("relative size-14 drop-shadow-md", color)} />
    </div>
  );
}
