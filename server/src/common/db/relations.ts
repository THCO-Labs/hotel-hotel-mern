import { relations } from "drizzle-orm";
import { users } from "../../modules/auth/auth.model.js";
import { hotels } from "../../modules/hotels/hotel.model.js";
import { rooms } from "../../modules/rooms/room.model.js";
import { reservations } from "../../modules/reservations/reservation.model.js";

/**
 * Relations live outside the module models so each model file stays a leaf:
 * a hotel knows nothing about rooms, but the graph is still declared once.
 */
export const hotelsRelations = relations(hotels, ({ many }) => ({
  rooms: many(rooms),
  reservations: many(reservations),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, { fields: [rooms.hotel_id], references: [hotels.id] }),
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  hotel: one(hotels, { fields: [reservations.hotel_id], references: [hotels.id] }),
  room: one(rooms, { fields: [reservations.room_id], references: [rooms.id] }),
  user: one(users, { fields: [reservations.user_id], references: [users.id] }),
}));
