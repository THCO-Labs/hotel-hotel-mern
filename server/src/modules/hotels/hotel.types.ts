import type { Hotel } from "./hotel.model.js";
import type { Room } from "../rooms/room.model.js";

/** A hotel with its bookable room inventory attached. */
export type HotelWithRooms = Hotel & { rooms: Room[] };

/** One row of the search results page. */
export interface HotelSearchHit {
  hotel: Hotel;
  /** Rooms that fit the requested dates and party size. */
  matchingRooms: Room[];
  /** Cheapest nightly rate among the matching rooms. */
  priceFrom: number;
  /** Total rooms in the hotel inventory. */
  totalRooms: number;
  /** How many of those matched the search. */
  availableCount: number;
}
