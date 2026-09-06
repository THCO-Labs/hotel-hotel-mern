import type { Request, Response } from "express";
import { z } from "zod";
import { parseOrThrow } from "../../common/validate.js";
import { unauthorized } from "../../common/errors.js";
import { findSessionUser } from "../auth/auth.service.js";
import {
  createReservation,
  getDashboardMetrics,
  listReservationDetails,
  listReservationsForEmail,
  lookupReservation,
  updateReservationStatus,
} from "./reservation.service.js";

const isoDay = /^\d{4}-\d{2}-\d{2}$/;

const createSchema = z.object({
  hotelId: z.string().uuid("Choose a property"),
  roomId: z.string().uuid("Choose a room"),
  checkIn: z.string().trim().regex(isoDay, "Choose a check-in date"),
  checkOut: z.string().trim().regex(isoDay, "Choose a check-out date"),
  guests: z.coerce.number().int().min(1).max(20),
  guestName: z.string().trim().min(1, "Name is required"),
  guestEmail: z.string().trim().email("Enter a valid email address"),
  guestPhone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

const lookupSchema = z.object({
  reference: z.string().trim().min(1, "Enter your booking reference"),
  email: z.string().trim().min(1, "Enter the email used to book"),
});

const statusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT"]),
});

export async function createReservationHandler(req: Request, res: Response) {
  const input = parseOrThrow(createSchema, req.body);
  const userId = req.session?.userId;
  res.status(201).json({ reservation: await createReservation(userId ? { ...input, userId } : input) });
}

/** A miss is not an error — the client renders "not found" copy for `null`. */
export async function lookupReservationHandler(req: Request, res: Response) {
  const { reference, email } = parseOrThrow(lookupSchema, req.query);
  res.json({ reservation: await lookupReservation(reference, email) });
}

export async function listReservationsHandler(_req: Request, res: Response) {
  res.json({ reservations: await listReservationDetails() });
}

export async function myReservationsHandler(req: Request, res: Response) {
  const user = await findSessionUser(req.session!);
  if (!user) throw unauthorized();
  res.json({ reservations: await listReservationsForEmail(user.email) });
}

export async function updateReservationStatusHandler(req: Request, res: Response) {
  const { status } = parseOrThrow(statusSchema, req.body);
  res.json({ reservation: await updateReservationStatus(String(req.params.id), status) });
}

export async function dashboardMetricsHandler(_req: Request, res: Response) {
  res.json({ metrics: await getDashboardMetrics() });
}
