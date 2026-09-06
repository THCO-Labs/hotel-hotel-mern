import type { Request, Response } from "express";
import { z } from "zod";
import { parseOrThrow } from "../../common/validate.js";
import { createHotel, getHotel, listAllHotels, listHotels, searchHotels, updateHotel } from "./hotel.service.js";

const searchSchema = z.object({
  city: z.string().trim().optional(),
  checkIn: z.string().trim().optional(),
  checkOut: z.string().trim().optional(),
  guests: z.coerce.number().int().min(1).max(20).optional(),
});

const hotelSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug may contain lowercase letters, numbers, and hyphens"),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  address: z.string().trim().min(1, "Address is required"),
  description: z.string().trim().min(1, "Description is required"),
  starRating: z.coerce.number().int().min(1).max(5),
  amenities: z.array(z.string().trim().min(1)).default([]),
  isPublished: z.boolean().optional(),
});

/** Empty strings arrive from optional query inputs; treat them as absent. */
function blankToUndefined(query: Request["query"]) {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== "" && value !== undefined));
}

export async function listHotelsHandler(_req: Request, res: Response) {
  res.json({ hotels: await listHotels() });
}

export async function listAllHotelsHandler(_req: Request, res: Response) {
  res.json({ hotels: await listAllHotels() });
}

export async function searchHotelsHandler(req: Request, res: Response) {
  const query = parseOrThrow(searchSchema, blankToUndefined(req.query));
  res.json({ hits: await searchHotels(query) });
}

export async function getHotelHandler(req: Request, res: Response) {
  res.json({ hotel: await getHotel(String(req.params.slugOrId)) });
}

export async function createHotelHandler(req: Request, res: Response) {
  res.status(201).json({ hotel: await createHotel(parseOrThrow(hotelSchema, req.body)) });
}

export async function updateHotelHandler(req: Request, res: Response) {
  res.json({ hotel: await updateHotel(String(req.params.id), parseOrThrow(hotelSchema, req.body)) });
}
