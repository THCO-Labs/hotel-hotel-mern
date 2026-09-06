import generatedBrand from "./brand.generated.json";
import siteContent from "./site-content.json";

/**
 * Single place to rename the product, adjust copy, and change routes.
 * Nothing below is derived from the database, so an AI builder can rebrand
 * the app by editing this one file.
 */

export const appConfig = {
  name: generatedBrand.name,
  /** Rendered as two words so the second can carry the brand colour. */
  nameParts: generatedBrand.nameParts,
  description: generatedBrand.description,
  tagline: generatedBrand.tagline,
  url: generatedBrand.url,
  logoPath: generatedBrand.logoPath as string | null,
  /** Which token set the app opens in, chosen at build time. */
  defaultTheme: ((generatedBrand as { theme?: string }).theme === "dark" ? "dark" : "light") as "light" | "dark",
  locale: "en-US",
  currency: "USD",
  /** Reservation without payment: nothing is charged online. */
  paymentEnabled: false,
  cancellationWindowHours: 48,
  maxGuestsPerBooking: 6,
} as const;

/**
 * Chrome that renders on every page: header, footer, dashboard sidebar.
 *
 * It lives in JSON rather than in the components because those components are
 * shared. A component shared by nine pages cannot sit inside any one page's
 * edit boundary without an edit aimed at one page silently rewriting the other
 * eight — so the components are protected and this file is the surface that
 * changes them. Editing a label here is a bounded, whole-site act by design,
 * which is exactly what changing site chrome is.
 */
export const siteChrome = siteContent;

export interface NavLink {
  label: string;
  href: string;
}

export const routes = {
  home: "/",
  search: "/search",
  hotel: (slug: string) => `/hotels/${slug}`,
  booking: "/booking",
  confirmation: (reference: string) => `/booking/confirmation/${reference}`,
  lookup: "/lookup",
  auth: {
    login: "/login",
    register: "/register",
    forbidden: "/forbidden",
  },
  account: {
    root: "/account",
  },
  dashboard: {
    root: "/dashboard",
    reservations: "/dashboard/reservations",
    hotels: "/dashboard/hotels",
    rooms: "/dashboard/rooms",
    settings: "/dashboard/settings",
  },
} as const;

/** Guest-facing links in the marketing header, read from site-content.json. */
export const guestNavItems: NavLink[] = siteContent.header.nav;

/** Party-size options shared by every search and booking form. */
export const guestOptions = Array.from({ length: appConfig.maxGuestsPerBooking }, (_, i) => i + 1);
