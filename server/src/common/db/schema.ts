/**
 * Schema barrel. Every module owns its own table definition; this file is the
 * single entry point drizzle-kit and the query client read.
 */
export { users, userRole, type User, type UserRole } from "../../modules/auth/auth.model.js";
export { hotels, type Hotel } from "../../modules/hotels/hotel.model.js";
export { rooms, type Room } from "../../modules/rooms/room.model.js";
export {
  reservations,
  reservationStatus,
  type Reservation,
  type ReservationStatus,
} from "../../modules/reservations/reservation.model.js";
export * from "./relations.js";
