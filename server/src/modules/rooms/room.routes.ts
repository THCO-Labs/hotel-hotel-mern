import { Router } from "express";
import { requireStaff } from "../../common/middleware/auth.js";
import { createRoomHandler, listRoomsHandler, updateRoomHandler } from "./room.controller.js";

export const roomRoutes = Router();

// Room inventory is an operational view; the public reads rooms through hotels.
roomRoutes.get("/", requireStaff, listRoomsHandler);
roomRoutes.post("/", requireStaff, createRoomHandler);
roomRoutes.put("/:id", requireStaff, updateRoomHandler);
