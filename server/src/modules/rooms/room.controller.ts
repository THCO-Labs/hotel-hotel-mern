import type { Request, Response } from "express";
import { z } from "zod";
import { parseOrThrow } from "../../common/validate.js";
import { createRoom, listRooms, listRoomsForHotel, updateRoom } from "./room.service.js";

const roomSchema = z.object({
  hotelId: z.string().uuid("Choose a property"),
  name: z.string().trim().min(1, "Room name is required"),
  type: z.string().trim().min(1, "Room type is required"),
  capacity: z.coerce.number().int().min(1).max(20),
  pricePerNight: z.coerce.number().min(0, "Rate cannot be negative"),
  amenities: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().optional(),
});

export async function listRoomsHandler(req: Request, res: Response) {
  const hotelId = typeof req.query.hotelId === "string" ? req.query.hotelId : "";
  res.json({ rooms: hotelId ? await listRoomsForHotel(hotelId) : await listRooms() });
}

export async function createRoomHandler(req: Request, res: Response) {
  res.status(201).json({ room: await createRoom(parseOrThrow(roomSchema, req.body)) });
}

export async function updateRoomHandler(req: Request, res: Response) {
  res.json({ room: await updateRoom(String(req.params.id), parseOrThrow(roomSchema, req.body)) });
}
