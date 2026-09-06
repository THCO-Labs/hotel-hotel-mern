// Loaded first so dotenv populates process.env before any other module reads it.
import { env } from "./common/env.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./common/errors.js";
import { attachSession } from "./common/middleware/auth.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { hotelRoutes } from "./modules/hotels/hotel.routes.js";
import { reservationRoutes } from "./modules/reservations/reservation.routes.js";
import { roomRoutes } from "./modules/rooms/room.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // The session travels in a cookie, so the browser needs `credentials: true`,
  // and that forbids the `*` origin — every client origin must be listed.
  app.use(cors({ origin: env.CLIENT_ORIGINS, credentials: true }));

  // Every route can read `req.session`; each one decides whether it cares.
  app.use(attachSession);

  // Deliberately touches nothing external so it still answers when Postgres is down.
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/hotels", hotelRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/reservations", reservationRoutes);

  // Express 5 forwards rejected promises from handlers here on its own, so
  // async handlers need no wrapper. Order matters: 404 first, then the formatter.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

app.listen(env.PORT, () => {
  const origins = env.CLIENT_ORIGINS.join(", ");
  console.log(`API listening on http://localhost:${env.PORT} (allowed client origins: ${origins})`);
});
