import { Outlet } from "react-router-dom";
import { DashboardNav } from "@/components/dashboard-nav";
import { siteChrome } from "@/config/app-config";

/** Presentation only — the staff check the old layout ran now lives in the router's `RequireStaff` wrapper. */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardNav />
      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center border-b bg-background px-6">
          <p className="font-medium">{siteChrome.dashboard.workspaceLabel}</p>
        </header>
        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
