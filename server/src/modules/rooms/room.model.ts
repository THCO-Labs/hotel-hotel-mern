import { sql } from "drizzle-orm";
import { boolean, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../common/db/columns.js";
import { hotels } from "../hotels/hotel.model.js";

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  hotel_id: uuid("hotel_id")
    .references(() => hotels.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  capacity: integer("capacity").notNull(),
  price_per_night: numeric("price_per_night", { precision: 10, scale: 2, mode: "number" }).notNull(),
  amenities: text("amenities")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
  images: text("images")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  ...timestamps,
});

export type Room = typeof rooms.$inferSelect;
