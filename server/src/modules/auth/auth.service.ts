import { eq } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { badRequest, conflict, unauthorized } from "../../common/errors.js";
import { users, type UserRole } from "./auth.model.js";
import { hashPassword, normalizeEmail, registrationError, verifyPassword } from "./auth.credentials.js";

/** The user shape returned to the browser. Never includes the password hash. */
export interface PublicUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
}

export async function register(input: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  const validationError = registrationError(email, input.password, input.confirmPassword);
  if (validationError) throw badRequest(validationError);

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) throw conflict("An account with this email already exists");

  const password_hash = await hashPassword(input.password);
  const [created] = await db
    .insert(users)
    .values({ email, password_hash, role: "guest" })
    .returning({ id: users.id, email: users.email, role: users.role, fullName: users.full_name });

  if (!created) throw badRequest("Unable to create the account");
  return created;
}

export async function login(input: { email: string; password: string }): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user?.password_hash || !(await verifyPassword(input.password, user.password_hash))) {
    throw unauthorized("Invalid email or password");
  }
  return { id: user.id, email: user.email, role: user.role, fullName: user.full_name };
}

/**
 * Re-reads the user behind a verified token. Returning `null` when the stored
 * role no longer matches the token invalidates sessions after a role change.
 */
export async function findSessionUser(session: { userId: string; role: UserRole }): Promise<PublicUser | null> {
  const [user] = await db
    .select({ id: users.id, email: users.email, role: users.role, fullName: users.full_name })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user || user.role !== session.role) return null;
  return user;
}
