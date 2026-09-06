import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../../common/db/columns.js";

export const userRole = pgEnum("user_role", ["guest", "staff", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash"),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  phone: text("phone"),
  role: userRole("role").default("guest").notNull(),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type UserRole = User["role"];
