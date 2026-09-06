import type { DashboardMetrics, Reservation, ReservationDetail, ReservationStatus } from "@/types";
import { api } from "./client";

export interface ReservationInput {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
}

export const reservationsApi = {
  create: (input: ReservationInput) =>
    api.post<{ reservation: Reservation }>("/reservations", input).then((r) => r.reservation),
  /** Reference + email is the guest's key to a booking made without an account. */
  lookup: (reference: string, email: string) =>
    api.get<{ reservation: Reservation | null }>("/reservations/lookup", { reference, email }).then((r) => r.reservation),
  mine: () => api.get<{ reservations: ReservationDetail[] }>("/reservations/me").then((r) => r.reservations),
  list: () => api.get<{ reservations: ReservationDetail[] }>("/reservations").then((r) => r.reservations),
  updateStatus: (id: string, status: ReservationStatus) =>
    api.patch<{ reservation: Reservation }>(`/reservations/${id}/status`, { status }).then((r) => r.reservation),
  metrics: () => api.get<{ metrics: DashboardMetrics }>("/reservations/metrics").then((r) => r.metrics),
};
