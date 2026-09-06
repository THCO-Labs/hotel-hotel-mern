import { and, asc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { notFound } from "../../common/errors.js";
import { hotels } from "./hotel.model.js";
import { rooms } from "../rooms/room.model.js";
import { reservations } from "../reservations/reservation.model.js";
import type { HotelSearchHit, HotelWithRooms } from "./hotel.types.js";

export async function listHotels() {
  return db.select().from(hotels).where(eq(hotels.is_published, true)).orderBy(asc(hotels.name));
}

/** Staff listing: unpublished properties included. */
export async function listAllHotels() {
  return db.select().from(hotels).orderBy(asc(hotels.name));
}

export interface HotelSearchInput {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export async function searchHotels(input: HotelSearchInput): Promise<HotelSearchHit[]> {
  const conditions = [eq(hotels.is_published, true), eq(rooms.is_active, true)];

  if (input.city) {
    conditions.push(or(ilike(hotels.city, `%${input.city}%`), ilike(hotels.country, `%${input.city}%`))!);
  }
  if (input.guests) conditions.push(gte(rooms.capacity, input.guests));
  if (input.checkIn && input.checkOut) {
    conditions.push(
      sql`not exists (select 1 from ${reservations} where ${reservations.room_id}=${rooms.id} and ${reservations.status}<>${"CANCELLED"} and ${reservations.check_in_date}<${input.checkOut} and ${reservations.check_out_date}>${input.checkIn})`,
    );
  }

  const rows = await db
    .select({ hotel: hotels, room: rooms })
    .from(hotels)
    .innerJoin(rooms, eq(rooms.hotel_id, hotels.id))
    .where(and(...conditions))
    .orderBy(asc(hotels.name), asc(rooms.price_per_night));

  const grouped = new Map<string, HotelSearchHit>();
  for (const row of rows) {
    const hit = grouped.get(row.hotel.id);
    if (hit) {
      hit.matchingRooms.push(row.room);
      hit.availableCount++;
      hit.totalRooms++;
      hit.priceFrom = Math.min(hit.priceFrom, row.room.price_per_night);
    } else {
      grouped.set(row.hotel.id, {
        hotel: row.hotel,
        matchingRooms: [row.room],
        priceFrom: row.room.price_per_night,
        totalRooms: 1,
        availableCount: 1,
      });
    }
  }
  return [...grouped.values()];
}

/** Accepts a slug or a uuid so booking links and hotel pages share one lookup. */
export async function getHotel(slugOrId: string): Promise<HotelWithRooms> {
  const [hotel] = await db
    .select()
    .from(hotels)
    .where(or(eq(hotels.slug, slugOrId), sql`${hotels.id}::text = ${slugOrId}`))
    .limit(1);

  if (!hotel) throw notFound("That property could not be found.");

  const inventory = await db
    .select()
    .from(rooms)
    .where(and(eq(rooms.hotel_id, hotel.id), eq(rooms.is_active, true)))
    .orderBy(asc(rooms.price_per_night));

  return { ...hotel, rooms: inventory };
}

export interface HotelInput {
  name: string;
  slug: string;
  city: string;
  country: string;
  address: string;
  description: string;
  starRating: number;
  amenities: string[];
  isPublished?: boolean;
}

export async function createHotel(input: HotelInput) {
  const [created] = await db.insert(hotels).values(toRow(input)).returning();
  return created;
}

export async function updateHotel(id: string, input: HotelInput) {
  const [updated] = await db
    .update(hotels)
    .set({ ...toRow(input), updated_at: new Date() })
    .where(eq(hotels.id, id))
    .returning();

  if (!updated) throw notFound("That property could not be found.");
  return updated;
}

function toRow(input: HotelInput) {
  return {
    name: input.name,
    slug: input.slug,
    city: input.city,
    country: input.country,
    address: input.address,
    description: input.description,
    star_rating: input.starRating,
    amenities: input.amenities,
    is_published: input.isPublished ?? true,
  };
}
