import { date, integer, numeric, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../common/db/columns.js";
import { hotels } from "../hotels/hotel.model.js";
import { rooms } from "../rooms/room.model.js";
import { users } from "../auth/auth.model.js";

export const reservationStatus = pgEnum("reservation_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "CHECKED_IN",
  "CHECKED_OUT",
]);

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  reference: text("reference").notNull().unique(),
  hotel_id: uuid("hotel_id")
    .references(() => hotels.id)
    .notNull(),
  room_id: uuid("room_id")
    .references(() => rooms.id)
    .notNull(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  guest_name: text("guest_name").notNull(),
  guest_email: text("guest_email").notNull(),
  guest_phone: text("guest_phone"),
  check_in_date: date("check_in_date").notNull(),
  check_out_date: date("check_out_date").notNull(),
  guests: integer("guests").notNull(),
  status: reservationStatus("status").default("PENDING").notNull(),
  nights: integer("nights").notNull(),
  total_amount: numeric("total_amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
  notes: text("notes"),
  ...timestamps,
});

export type Reservation = typeof reservations.$inferSelect;
export type ReservationStatus = Reservation["status"];
