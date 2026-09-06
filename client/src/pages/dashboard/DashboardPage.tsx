import { reservationsApi } from "@/api/reservations";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCards } from "@/features/dashboard/MetricCards";
import { useAsync } from "@/hooks/use-async";

export default function DashboardPage() {
  const { data, loading, error } = useAsync(() => reservationsApi.metrics(), []);

  return (
    <div data-builder-id="dashboard.overview">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">A live overview of hotel operations.</p>
      {error && (
        <p className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</p>
      )}
      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((n) => (
            <Card key={n}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-8 w-12" />
                </div>
                <Skeleton className="size-11 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        data && <MetricCards metrics={data} />
      )}
    </div>
  );
}
