import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { guestOptions } from "@/config/app-config";
import { todayIso } from "@/lib/dates";
export function SearchForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  return (
    <Card className="border-primary/10 shadow-soft-lg">
      <CardContent className="p-4 sm:p-6">
        <form data-builder-id="booking.search"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_.75fr_auto] lg:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const a = String(fd.get("checkIn") ?? ""),
              b = String(fd.get("checkOut") ?? "");
            if (a && b && b <= a) {
              setError("Check-out must be after check-in.");
              return;
            }
            navigate(
              `/search?${new URLSearchParams(Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]))).toString()}`,
            );
          }}
        >
          <Field label="City or area" name="city" placeholder="e.g. Vancouver" />
          <Field label="Check-in" name="checkIn" type="date" min={todayIso()} />
          <Field label="Check-out" name="checkOut" type="date" min={todayIso()} />
          <div className="space-y-1.5">
            <Label htmlFor="guests">Guests</Label>
            <select
              id="guests"
              name="guests"
              defaultValue="2"
              className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
            >
              {guestOptions.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" size="lg" className="gap-2">
            <Search className="size-4" />
            Search
          </Button>
        </form>
        {error && <p className="text-destructive mt-3 text-left text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
}
function Field({ label, name, ...props }: { label: string; name: string; [key: string]: unknown }) {
  return (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
