import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import type { UserRole } from "./auth.model.js";

const roles: UserRole[] = ["guest", "staff", "admin"];

export interface SessionPayload extends JWTPayload {
  userId: string;
  role: UserRole;
}

function keyFor(secret: string): Uint8Array {
  const key = new TextEncoder().encode(secret);
  if (key.length < 32) throw new Error("AUTH_SECRET must contain at least 32 bytes");
  return key;
}

export async function signSessionToken(
  payload: { userId: string; role: UserRole },
  secret: string,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(keyFor(secret));
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, keyFor(secret), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string" || !roles.includes(payload.role as UserRole)) return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
