import type { Request, Response } from "express";
import { z } from "zod";
import { parseOrThrow } from "../../common/validate.js";
import { clearSession, issueSession } from "./auth.session.js";
import { findSessionUser, login, register } from "./auth.service.js";

const registerSchema = z.object({
  email: z.string().min(1, "Enter a valid email address"),
  password: z.string().min(1, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Passwords do not match"),
});

const loginSchema = z.object({
  email: z.string().min(1, "Enter your email address"),
  password: z.string().min(1, "Enter your password"),
});

export async function registerHandler(req: Request, res: Response) {
  const user = await register(parseOrThrow(registerSchema, req.body));
  await issueSession(res, { userId: user.id, role: user.role });
  res.status(201).json({ user });
}

export async function loginHandler(req: Request, res: Response) {
  const user = await login(parseOrThrow(loginSchema, req.body));
  await issueSession(res, { userId: user.id, role: user.role });
  res.json({ user });
}

export function logoutHandler(_req: Request, res: Response) {
  clearSession(res);
  res.json({ ok: true });
}

/** Always 200 — the client treats `{ user: null }` as "signed out". */
export async function meHandler(req: Request, res: Response) {
  if (!req.session) {
    res.json({ user: null });
    return;
  }
  const user = await findSessionUser(req.session);
  if (!user) clearSession(res);
  res.json({ user });
}
