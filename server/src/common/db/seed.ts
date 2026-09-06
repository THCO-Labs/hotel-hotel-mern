import { hash } from "bcryptjs";
import { db } from "./index.js";
import { hotels, rooms, users } from "./schema.js";

interface SeedProperty {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  amenities: string[];
  /** A fixed pair, not an open array: the room generator reads both slots by index. */
  images: [string, string];
  star_rating: number;
}

/** Fixed uuids keep the seed idempotent and let demo links stay stable across resets. */
const properties: SeedProperty[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    slug: "evergreen-grand-hotel",
    name: "Evergreen Grand Hotel",
    city: "Vancouver",
    country: "Canada",
    address: "1122 Burrard Street",
    description: "A downtown landmark with mountain views, a two-storey spa, and Pacific Northwest dining.",
    amenities: ["Free Wi-Fi", "Valet parking", "Fitness center", "Indoor pool", "Spa & sauna"],
    images: ["pine", "canopy"],
    star_rating: 5,
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    slug: "pinecrest-lodge",
    name: "Pinecrest Lodge",
    city: "Whistler",
    country: "Canada",
    address: "45 Alpine Way",
    description: "A slopeside chalet lodge with a stone fireplace lounge and ski-in ski-out access.",
    amenities: ["Free Wi-Fi", "Ski storage", "Hot tub", "Restaurant", "Free parking"],
    images: ["cabin", "pine"],
    star_rating: 4,
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    slug: "cedar-valley-inn",
    name: "Cedar Valley Inn",
    city: "Portland",
    country: "United States",
    address: "2300 N Interstate Ave",
    description:
      "A relaxed riverside inn with a garden patio, complimentary bikes, and a neighboring craft brewery.",
    amenities: ["Free Wi-Fi", "Bicycle rental", "Garden patio", "Breakfast included"],
    images: ["meadow", "stone"],
    star_rating: 3,
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    slug: "fernwood-retreat",
    name: "Fernwood Retreat",
    city: "Asheville",
    country: "United States",
    address: "8 Sunset Ridge Road",
    description: "A mountain wellness retreat with forest trails, yoga, and organic farm-to-table dining.",
    amenities: ["Free Wi-Fi", "Wellness spa", "Forest trails", "Yoga studio"],
    images: ["lake", "canopy"],
    star_rating: 4,
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    slug: "maple-grove-hotel",
    name: "Maple Grove Hotel",
    city: "Toronto",
    country: "Canada",
    address: "400 King Street W",
    description: "A boutique tower with a rooftop bar, theatre-view suites, and a business lounge.",
    amenities: ["Free Wi-Fi", "Rooftop bar", "Fitness center", "Restaurant"],
    images: ["stone", "meadow"],
    star_rating: 4,
  },
  {
    id: "a0000000-0000-4000-8000-000000000006",
    slug: "mosswood-boutique",
    name: "Mosswood Boutique",
    city: "Seattle",
    country: "United States",
    address: "77 Pike Place",
    description: "A waterfront hideaway with harbor-view rooms and a specialty coffee bar.",
    amenities: ["Free Wi-Fi", "Waterfront views", "Coffee bar", "Bike storage"],
    images: ["lake", "pine"],
    star_rating: 3,
  },
];

// Tuples rather than string[] so indexing by property position stays typed.
const queenNames = ["Evergreen", "Alpine", "Garden", "Fern", "Market", "Harbor"] as const;
const kingNames = ["Skyline", "Chalet", "Cedar", "Retreat", "Maple", "Waterfront"] as const;

/** Three rooms per property, with ids derived from the property position so re-seeding is a no-op. */
const inventory = properties.flatMap((hotel, index) => [
  {
    id: `b0000000-0000-4000-8000-${String(index * 3 + 1).padStart(12, "0")}`,
    hotel_id: hotel.id,
    name: `${queenNames[index % queenNames.length]} Queen`,
    type: "Queen",
    capacity: 2,
    price_per_night: 139 + index * 10,
    amenities: ["Queen bed", "Wi-Fi", "Rain shower"],
    images: [hotel.images[0]],
  },
  {
    id: `b0000000-0000-4000-8000-${String(index * 3 + 2).padStart(12, "0")}`,
    hotel_id: hotel.id,
    name: `${kingNames[index % kingNames.length]} King`,
    type: "King",
    capacity: 2,
    price_per_night: 179 + index * 10,
    amenities: ["King bed", "Work desk", "Smart TV"],
    images: [hotel.images[1]],
  },
  {
    id: `b0000000-0000-4000-8000-${String(index * 3 + 3).padStart(12, "0")}`,
    hotel_id: hotel.id,
    name: "Signature Suite",
    type: "Suite",
    capacity: 4,
    price_per_night: 259 + index * 20,
    amenities: ["Separate living room", "King bed", "Sofa bed"],
    images: [hotel.images[0]],
  },
]);

async function seed() {
  const password_hash = await hash("password123", 12);

  // `onConflictDoNothing` on every insert keeps `npm run db:seed` safe to re-run.
  await db
    .insert(users)
    .values({ email: "staff@hotel.app", full_name: "Alex Rivera", role: "staff", password_hash })
    .onConflictDoNothing();
  await db.insert(hotels).values(properties).onConflictDoNothing();
  await db.insert(rooms).values(inventory).onConflictDoNothing();

  console.log("Seeded Evergreen Stays demo data.");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
