/**
 * Domain types.
 *
 * The client never imports the Drizzle schema, so these mirror the JSON the
 * API returns: `date` columns arrive as ISO day strings (yyyy-mm-dd),
 * `timestamptz` columns as full ISO timestamps, and `numeric` columns as
 * numbers (the server declares them with `mode: "number"`).
 */

export type UserRole = "guest" | "staff" | "admin";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT";

/** The signed-in user, as returned by `/api/auth/me`. */
export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  amenities: string[];
  images: string[];
  star_rating: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  name: string;
  type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  reference: string;
  hotel_id: string;
  room_id: string;
  user_id: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  status: ReservationStatus;
  nights: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** A hotel with its room inventory attached. */
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

/** A reservation row joined with the names it is displayed alongside. */
export interface ReservationDetail {
  reservation: Reservation;
  hotel: { name: string };
  room: { name: string };
}

/** Staff overview tiles. */
export interface DashboardMetrics {
  total_hotels: number;
  total_rooms: number;
  upcoming_reservations: number;
  in_house: number;
}
