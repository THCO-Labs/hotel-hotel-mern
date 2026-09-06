import type { Room } from "@/types";
import { api } from "./client";

export interface RoomInput {
  hotelId: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  isActive?: boolean;
}

export const roomsApi = {
  /** Staff inventory. Omit `hotelId` for every room across every property. */
  list: (hotelId?: string) => api.get<{ rooms: Room[] }>("/rooms", { hotelId }).then((r) => r.rooms),
  create: (input: RoomInput) => api.post<{ room: Room }>("/rooms", input).then((r) => r.room),
  update: (id: string, input: RoomInput) => api.put<{ room: Room }>(`/rooms/${id}`, input).then((r) => r.room),
};
