import type { Hotel, HotelSearchHit, HotelWithRooms } from "@/types";
import { api } from "./client";

export interface HotelSearchQuery {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
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

export const hotelsApi = {
  list: () => api.get<{ hotels: Hotel[] }>("/hotels").then((r) => r.hotels),
  /** Staff listing — includes unpublished properties. */
  listAll: () => api.get<{ hotels: Hotel[] }>("/hotels/all").then((r) => r.hotels),
  search: (query: HotelSearchQuery) =>
    api.get<{ hits: HotelSearchHit[] }>("/hotels/search", { ...query }).then((r) => r.hits),
  /** Accepts a slug or a uuid, so booking links and hotel pages share one call. */
  get: (slugOrId: string) => api.get<{ hotel: HotelWithRooms }>(`/hotels/${slugOrId}`).then((r) => r.hotel),
  create: (input: HotelInput) => api.post<{ hotel: Hotel }>("/hotels", input).then((r) => r.hotel),
  update: (id: string, input: HotelInput) => api.put<{ hotel: Hotel }>(`/hotels/${id}`, input).then((r) => r.hotel),
};
