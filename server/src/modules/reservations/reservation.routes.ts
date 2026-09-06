import { Router } from "express";
import { requireAuth, requireStaff } from "../../common/middleware/auth.js";
import {
  createReservationHandler,
  dashboardMetricsHandler,
  listReservationsHandler,
  lookupReservationHandler,
  myReservationsHandler,
  updateReservationStatusHandler,
} from "./reservation.controller.js";

export const reservationRoutes = Router();

// Booking and reference lookup stay public: guests book without an account.
reservationRoutes.post("/", createReservationHandler);
reservationRoutes.get("/lookup", lookupReservationHandler);

// Literal paths are declared before `/:id` so they are not swallowed by it.
reservationRoutes.get("/me", requireAuth, myReservationsHandler);
reservationRoutes.get("/metrics", requireStaff, dashboardMetricsHandler);

// Staff desk.
reservationRoutes.get("/", requireStaff, listReservationsHandler);
reservationRoutes.patch("/:id/status", requireStaff, updateReservationStatusHandler);
