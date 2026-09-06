import type { NextFunction, Request, Response } from "express";
import { forbidden, unauthorized } from "../errors.js";
import { readSession, SESSION_COOKIE_NAME, type SessionPayload } from "../../modules/auth/auth.session.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session?: SessionPayload | null;
    }
  }
}

/**
 * Verifies the session cookie on every request and hangs the payload off
 * `req.session`. Routes decide what to do with it.
 */
export async function attachSession(req: Request, _res: Response, next: NextFunction) {
  req.session = await readSession(req.cookies?.[SESSION_COOKIE_NAME]);
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.session) return next(unauthorized());
  next();
}

/** Staff and admin share the dashboard; guests never reach it. */
export function requireStaff(req: Request, _res: Response, next: NextFunction) {
  if (!req.session) return next(unauthorized());
  if (req.session.role !== "staff" && req.session.role !== "admin") return next(forbidden());
  next();
}
