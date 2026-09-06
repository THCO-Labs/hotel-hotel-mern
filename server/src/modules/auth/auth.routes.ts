import { Router } from "express";
import { loginHandler, logoutHandler, meHandler, registerHandler } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/logout", logoutHandler);
authRoutes.get("/me", meHandler);
