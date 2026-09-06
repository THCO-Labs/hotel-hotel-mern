import { Route, Routes } from "react-router-dom";
import { RequireAuth, RequireStaff } from "@/components/protected-route";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MainLayout } from "@/layouts/MainLayout";
import AccountPage from "@/pages/AccountPage";
import BookingPage from "@/pages/BookingPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import HomePage from "@/pages/HomePage";
import HotelDetailsPage from "@/pages/HotelDetailsPage";
import LoginPage from "@/pages/LoginPage";
import LookupPage from "@/pages/LookupPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import SearchPage from "@/pages/SearchPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DashboardHotelsPage from "@/pages/dashboard/HotelsPage";
import DashboardReservationsPage from "@/pages/dashboard/ReservationsPage";
import DashboardRoomsPage from "@/pages/dashboard/RoomsPage";
import DashboardSettingsPage from "@/pages/dashboard/SettingsPage";

/**
 * Route table. The guest site and the staff dashboard are separate layout
 * branches, mirroring the `(site)` and `dashboard` segments of the Next.js app
 * this replaced; `RequireStaff` takes over from the old middleware check.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="hotels/:slug" element={<HotelDetailsPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="booking/confirmation/:reference" element={<ConfirmationPage />} />
        <Route path="lookup" element={<LookupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route
          path="account"
          element={
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="dashboard"
        element={
          <RequireStaff>
            <AdminLayout />
          </RequireStaff>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="reservations" element={<DashboardReservationsPage />} />
        <Route path="hotels" element={<DashboardHotelsPage />} />
        <Route path="rooms" element={<DashboardRoomsPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
      </Route>
    </Routes>
  );
}
