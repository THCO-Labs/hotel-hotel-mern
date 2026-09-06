import { BedDouble, Building2, CalendarCheck, DoorOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "@/types";

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    { label: "Properties", value: metrics.total_hotels, icon: Building2 },
    { label: "Rooms", value: metrics.total_rooms, icon: BedDouble },
    { label: "Upcoming stays", value: metrics.upcoming_reservations, icon: CalendarCheck },
    { label: "In house", value: metrics.in_house, icon: DoorOpen },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
            <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
              <Icon className="size-5" />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
