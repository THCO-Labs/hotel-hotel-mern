import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { reservationsApi } from "@/api/reservations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReservationDetails } from "@/features/booking/ReservationDetails";
import { useAsync } from "@/hooks/use-async";

export default function LookupPage() {
  // The query string stays the source of truth so a result is linkable and the
  // confirmation page's "Manage booking" link lands on a filled-in search.
  const [searchParams, setSearchParams] = useSearchParams();
  const reference = searchParams.get("reference") ?? "";
  const email = searchParams.get("email") ?? "";
  const submitted = Boolean(reference && email);

  const { data, loading, error } = useAsync(
    () => (submitted ? reservationsApi.lookup(reference, email) : Promise.resolve(null)),
    [reference, email],
  );

  const message =
    error || (submitted && !loading && !data ? "No reservation was found with that reference and email." : "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSearchParams({
      reference: String(form.get("reference") ?? ""),
      email: String(form.get("email") ?? ""),
    });
  }

  return (
    <div data-builder-id="lookup.form" className="container max-w-2xl py-14">
      <h1 className="text-3xl font-semibold">Find my booking</h1>
      <p className="text-muted-foreground mt-2">Enter the reference and email used for the reservation.</p>
      <Card className="mt-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" name="reference" defaultValue={reference} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={email} required />
            </div>
            <Button type="submit">
              <Search className="size-4" />
              Look up
            </Button>
          </form>
        </CardContent>
      </Card>
      {message && <p className="text-destructive mt-5 text-sm">{message}</p>}
      {data && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{data.reference}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReservationDetails reservation={data} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
