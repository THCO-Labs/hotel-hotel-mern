import { LogOut, ShieldCheck, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { reservationsApi } from "@/api/reservations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/app-config";
import { useAuth } from "@/features/auth/auth.context";
import { useAsync } from "@/hooks/use-async";
import { formatDateRange, formatPrice } from "@/lib/format";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: bookings, loading, error } = useAsync(() => reservationsApi.mine(), []);

  async function handleSignOut() {
    await logout();
    navigate(routes.home);
  }

  // `RequireAuth` wraps this route, so the only way here without a user is a
  // render during sign-out; bail rather than optional-chain every field below.
  if (!user) return null;

  return (
    <div data-builder-id="account.bookings" className="container max-w-3xl py-12">
      <h1 className="text-3xl font-semibold">Your account</h1>
      <p className="text-muted-foreground mt-2">Your JWT session is active and linked to your database account.</p>

      <Card className="mt-8">
        <CardHeader>
          <span className="bg-secondary text-primary mb-2 grid size-11 place-items-center rounded-xl">
            <ShieldCheck className="size-5" />
          </span>
          <CardTitle>Signed in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Email</p>
            <p className="mt-1 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Account role</p>
            <p className="mt-1 capitalize">{user.role}</p>
          </div>
          <div className="flex flex-wrap gap-3 border-t pt-5">
            <Button asChild>
              <Link to={routes.lookup}>
                <Ticket className="size-4" />
                Find a booking
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={handleSignOut}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : !bookings?.length ? (
            <p className="text-muted-foreground text-sm">No bookings yet.</p>
          ) : (
            <ul className="divide-y">
              {bookings.map(({ reservation, hotel, room }) => (
                <li
                  key={reservation.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{hotel.name}</p>
                    <p className="text-muted-foreground text-sm">{room.name}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatDateRange(reservation.check_in_date, reservation.check_out_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{reservation.status}</Badge>
                    <p className="font-medium">{formatPrice(reservation.total_amount)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
