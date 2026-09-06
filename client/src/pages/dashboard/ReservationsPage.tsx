import { useState } from "react";
import { toast } from "sonner";
import { reservationsApi } from "@/api/reservations";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsync } from "@/hooks/use-async";
import { formatDateRange, formatPrice } from "@/lib/format";
import type { ReservationStatus } from "@/types";

const statuses: ReservationStatus[] = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"];

export default function ReservationsPage() {
  const { data, loading, error, reload } = useAsync(() => reservationsApi.list(), []);
  // Which row is mid-request, so only that row's select is disabled.
  const [pendingId, setPendingId] = useState("");

  const rows = data ?? [];

  async function handleStatusChange(id: string, status: ReservationStatus) {
    setPendingId(id);
    try {
      await reservationsApi.updateStatus(id, status);
      toast.success("Status updated.");
      reload();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to update status.");
    } finally {
      setPendingId("");
    }
  }

  return (
    <div data-builder-id="dashboard.reservations">
      <h1 className="text-3xl font-semibold">Reservations</h1>
      <p className="mt-2 text-muted-foreground">Review stays and keep their operational status current.</p>
      {error && (
        <p className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</p>
      )}
      <Card className="mt-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Stay</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ reservation: r, hotel, room }) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="font-medium">{r.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{r.reference}</p>
                  </TableCell>
                  <TableCell>{formatDateRange(r.check_in_date, r.check_out_date)}</TableCell>
                  <TableCell>
                    {hotel.name}
                    <p className="text-xs text-muted-foreground">{room.name}</p>
                  </TableCell>
                  <TableCell>{formatPrice(r.total_amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        name="status"
                        value={r.status}
                        disabled={pendingId === r.id}
                        onChange={(event) => handleStatusChange(r.id, event.target.value as ReservationStatus)}
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {loading && (
            <div className="space-y-3 p-6">
              {[0, 1, 2].map((n) => (
                <Skeleton key={n} className="h-10 w-full" />
              ))}
            </div>
          )}
          {!loading && !error && !rows.length && (
            <p className="p-8 text-center text-sm text-muted-foreground">No reservations yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
