import { BedDouble, Building2, CalendarCheck, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

import { routes, siteChrome } from "@/config/app-config";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Match nested routes too (e.g. /dashboard/hotels/new). */
  matchNested?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

/**
 * Staff dashboard navigation. Add a screen here to surface it in the sidebar;
 * `RequireStaff` in the router already guards everything under /dashboard.
 *
 * Structure (which routes exist, which icon each carries) is code, because a
 * link to a route the router does not serve is a broken page rather than a
 * wording choice. The visible labels come from site-content.json so they can
 * be renamed without touching a file five dashboard pages depend on.
 */
const labels = siteChrome.dashboard;

export const sidebarItems: NavGroup[] = [
  {
    id: "overview",
    label: labels.groups.overview,
    items: [{ title: labels.items.dashboard, href: routes.dashboard.root, icon: LayoutDashboard }],
  },
  {
    id: "operations",
    label: labels.groups.operations,
    items: [
      { title: labels.items.reservations, href: routes.dashboard.reservations, icon: CalendarCheck, matchNested: true },
      { title: labels.items.hotels, href: routes.dashboard.hotels, icon: Building2, matchNested: true },
      { title: labels.items.rooms, href: routes.dashboard.rooms, icon: BedDouble, matchNested: true },
    ],
  },
  {
    id: "workspace",
    label: labels.groups.workspace,
    items: [{ title: labels.items.settings, href: routes.dashboard.settings, icon: Settings }],
  },
];
