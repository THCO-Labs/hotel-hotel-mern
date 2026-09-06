import { and, count, desc, eq, gt, gte, inArray, lt, ne, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { badRequest, conflict, notFound } from "../../common/errors.js";
import { nightsBetween, todayIso } from "../../common/dates.js";
import { hotels } from "../hotels/hotel.model.js";
import { rooms } from "../rooms/room.model.js";
import { reservations, type Reservation, type ReservationStatus } from "./reservation.model.js";

export interface CreateReservationInput {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
  /** Present when a signed-in guest books, so the stay shows on their account. */
  userId?: string;
}

/** A reservation row with the property and room names it points at. */
export interface ReservationDetail {
  reservation: Reservation;
  hotel: { name: string };
  room: { name: string };
}

export interface DashboardMetrics {
  total_hotels: number;
  total_rooms: number;
  upcoming_reservations: number;
  in_house: number;
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const [room] = await db
    .select()
    .from(rooms)
    .where(and(eq(rooms.id, input.roomId), eq(rooms.hotel_id, input.hotelId), eq(rooms.is_active, true)))
    .limit(1);

  if (!room) throw notFound("The selected room is unavailable.");

  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (!nights) throw badRequest("Check-out must be after check-in.");
  if (input.guests < 1 || input.guests > room.capacity) {
    throw badRequest("The selected room cannot accommodate this party size.");
  }

  // Stays overlap when one starts before the other ends; cancelled rows free the dates.
  const [clash] = await db
    .select({ id: reservations.id })
    .from(reservations)
    .where(
      and(
        eq(reservations.room_id, input.roomId),
        ne(reservations.status, "CANCELLED"),
        lt(reservations.check_in_date, input.checkOut),
        gt(reservations.check_out_date, input.checkIn),
      ),
    )
    .limit(1);

  if (clash) throw conflict("This room is no longer available for those dates.");

  const reference = `EVG-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const [created] = await db
    .insert(reservations)
    .values({
      reference,
      hotel_id: input.hotelId,
      room_id: input.roomId,
      user_id: input.userId ?? null,
      guest_name: input.guestName,
      guest_email: input.guestEmail.toLowerCase(),
      guest_phone: input.guestPhone || null,
      check_in_date: input.checkIn,
      check_out_date: input.checkOut,
      guests: input.guests,
      nights,
      total_amount: room.price_per_night * nights,
      notes: input.notes || null,
    })
    .returning();

  if (!created) throw badRequest("Unable to create the reservation.");
  return created;
}

/** Reference plus email is the guest's credential, so both match case-insensitively. */
export async function lookupReservation(reference: string, email: string): Promise<Reservation | null> {
  const [row] = await db
    .select()
    .from(reservations)
    .where(
      and(
        sql`upper(${reservations.reference}) = ${reference.trim().toUpperCase()}`,
        sql`lower(${reservations.guest_email}) = ${email.trim().toLowerCase()}`,
      ),
    )
    .limit(1);

  return row ?? null;
}

/** Staff listing across every property. */
export async function listReservationDetails(): Promise<ReservationDetail[]> {
  return db
    .select({ reservation: reservations, hotel: { name: hotels.name }, room: { name: rooms.name } })
    .from(reservations)
    .innerJoin(hotels, eq(hotels.id, reservations.hotel_id))
    .innerJoin(rooms, eq(rooms.id, reservations.room_id))
    .orderBy(desc(reservations.created_at));
}

/** Bookings are matched on the guest email, so account and guest checkouts line up. */
export async function listReservationsForEmail(email: string): Promise<ReservationDetail[]> {
  return db
    .select({ reservation: reservations, hotel: { name: hotels.name }, room: { name: rooms.name } })
    .from(reservations)
    .innerJoin(hotels, eq(hotels.id, reservations.hotel_id))
    .innerJoin(rooms, eq(rooms.id, reservations.room_id))
    .where(sql`lower(${reservations.guest_email}) = ${email.trim().toLowerCase()}`)
    .orderBy(desc(reservations.created_at));
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
  const [updated] = await db
    .update(reservations)
    .set({ status, updated_at: new Date() })
    .where(eq(reservations.id, id))
    .returning();

  if (!updated) throw notFound("That reservation could not be found.");
  return updated;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const today = todayIso();
  const [[totalHotels], [totalRooms], [upcoming], [inHouse]] = await Promise.all([
    db.select({ value: count() }).from(hotels),
    db.select({ value: count() }).from(rooms),
    db
      .select({ value: count() })
      .from(reservations)
      .where(and(inArray(reservations.status, ["PENDING", "CONFIRMED"]), gte(reservations.check_in_date, today))),
    db.select({ value: count() }).from(reservations).where(eq(reservations.status, "CHECKED_IN")),
  ]);

  return {
    total_hotels: totalHotels.value,
    total_rooms: totalRooms.value,
    upcoming_reservations: upcoming.value,
    in_house: inHouse.value,
  };
}
