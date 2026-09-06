import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { reservationsApi } from "@/api/reservations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/config/app-config";
import { ReservationDetails } from "@/features/booking/ReservationDetails";
import { useAsync } from "@/hooks/use-async";

export default function ConfirmationPage() {
  const { reference = "" } = useParams<{ reference: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  // Reference plus email is the guest's key: without the email there is
  // nothing to fetch, so the page shows the reference alone.
  const { data: reservation } = useAsync(
    () => (email ? reservationsApi.lookup(reference, email) : Promise.resolve(null)),
    [reference, email],
  );

  return (
    <div data-builder-id="booking.confirmation" className="container max-w-2xl py-16 text-center">
      <CheckCircle2 className="text-primary mx-auto size-16" />
      <h1 className="mt-6 text-3xl font-semibold">Reservation confirmed</h1>
      <p className="text-muted-foreground mt-2">
        Keep this reference safe. We’ve reserved your stay without charging a card.
      </p>
      <Card className="mt-8 text-left">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">Booking reference</p>
          <p className="text-primary mt-1 text-2xl font-bold tracking-wider">{reference}</p>
          {reservation && (
            <div className="mt-5 border-t pt-5">
              <ReservationDetails reservation={reservation} />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link to={routes.home}>Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`${routes.lookup}?reference=${reference}${email ? `&email=${encodeURIComponent(email)}` : ""}`}>
            Manage booking
          </Link>
        </Button>
      </div>
    </div>
  );
}
