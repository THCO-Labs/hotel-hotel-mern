import { and, asc, eq } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { notFound } from "../../common/errors.js";
import { rooms } from "./room.model.js";

/** Staff inventory listing across every property. */
export async function listRooms() {
  return db.select().from(rooms).orderBy(asc(rooms.name));
}

export async function listRoomsForHotel(hotelId: string) {
  return db
    .select()
    .from(rooms)
    .where(and(eq(rooms.hotel_id, hotelId), eq(rooms.is_active, true)))
    .orderBy(asc(rooms.price_per_night));
}

export interface RoomInput {
  hotelId: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  isActive?: boolean;
}

export async function createRoom(input: RoomInput) {
  const [created] = await db.insert(rooms).values(toRow(input)).returning();
  return created;
}

export async function updateRoom(id: string, input: RoomInput) {
  const [updated] = await db
    .update(rooms)
    .set({ ...toRow(input), updated_at: new Date() })
    .where(eq(rooms.id, id))
    .returning();

  if (!updated) throw notFound("That room could not be found.");
  return updated;
}

function toRow(input: RoomInput) {
  return {
    hotel_id: input.hotelId,
    name: input.name,
    type: input.type,
    capacity: input.capacity,
    price_per_night: input.pricePerNight,
    amenities: input.amenities,
    is_active: input.isActive ?? true,
  };
}
