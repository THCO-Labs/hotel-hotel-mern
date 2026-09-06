import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../common/db/columns.js";

export const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  amenities: text("amenities")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
  images: text("images")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
  star_rating: integer("star_rating").notNull(),
  is_published: boolean("is_published").default(true).notNull(),
  ...timestamps,
});

export type Hotel = typeof hotels.$inferSelect;
