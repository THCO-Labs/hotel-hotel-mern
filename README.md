# Evergreen Stays

A hotel booking app built as a modular monorepo: an **Express + Drizzle** API and a **Vite + React + TypeScript + Tailwind CSS v4** client, sharing one Neon Postgres database. It is the decoupled successor to the Next.js App Router template kept in `hotel-booking/` for reference, and preserves the original Forest Earth visual system.

## Layout

```text
mono-app/
├── package.json          # npm workspaces + concurrently orchestration
├── drizzle.config.ts     # Shared Drizzle config; reads the server's schema barrel
├── drizzle/              # Generated SQL migrations
├── server/               # Express API
│   └── src/
│       ├── common/       # env, db client, errors, validation, dates, middleware
│       ├── modules/      # auth · hotels · rooms · reservations
│       └── index.ts      # App assembly and router registration
└── client/               # Vite SPA
    └── src/
        ├── api/          # One typed client per domain
        ├── components/   # Atomic UI (shadcn/ui) + shared site chrome
        ├── features/     # auth · hotels · booking · checkout · dashboard
        ├── layouts/      # MainLayout (guest) · AdminLayout (staff)
        ├── pages/        # Route-level components
        └── router.tsx    # React Router route table
```

Every backend module owns its table definition, service, controller, and routes; `server/src/common/db/schema.ts` is the barrel drizzle-kit reads.

## Included flows

- Guest search by city, dates, and party size against live room availability
- Hotel details, room selection, reservation, confirmation, and reference lookup
- Email/password signup and login with bcrypt hashing and HTTP-only JWT sessions
- Guest account with booking history; staff dashboard behind a role check
- Reservation status management and hotel/room inventory editing
- Responsive light/dark theme from shared semantic design tokens

## Editable surfaces and page boundaries

This template is edited by an AI that is shown one page at a time. The platform
decides what it may rewrite from three fields of each page manifest:

    edit boundary = sourceEntry + layout + componentDependencies

Only those files reach the model, and the patcher refuses to write anything
else. So the boundary is the blast radius of every edit aimed at that page, and
the rule the layout exists to serve is:

> A file that renders on more than one page never appears in any page's boundary.

Break it and the failure is silent: an edit aimed at one page rewrites a
component eight others render, `tsc` passes because the JSX is valid, and the
damage shows up later somewhere nobody was looking.

Three ways shared things are handled here:

- **Its own page entry** — `reservation-card`. One component rendered by the
  confirmation, lookup and account pages, registered as its own editable unit
  whose boundary is itself alone.
- **Its own page entry plus a CONFIG surface** — chrome. `site-chrome` and
  `dashboard-chrome` register the header, footer and sidebar as editable units,
  so restyling them is possible but is explicitly a whole-site act. Their *copy*
  also lives in `client/src/config/site-content.json`, which the platform edits
  deterministically with no model involved. Chrome needs both halves: a CONFIG
  surface cannot express "make the header black".
- **Protected** — `components/ui/`, layouts, routing, API clients, `lib/`,
  `hooks/`, `types/` and the shared marks. Dropped from every edit context.

`pages/` and `features/` are editable and page-exclusive. Everything else is
shared and therefore protected. Verify with:

    python ../../../.claude/skills/hotel-booking-template/scripts/check_template.py .

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a Neon connection string and `AUTH_SECRET` to at least 32 random characters.
2. `npm install`
3. `npm run db:migrate`, then `npm run db:seed` for demo data.
4. `npm run dev` — starts the API on `:4000` and the client on `:5173`.

The client calls `/api` and Vite proxies it to the API in development, so the session cookie stays same-site. Deployed builds point `VITE_API_URL` at the API origin, and the API's `CLIENT_ORIGIN` must list that client origin for credentialed CORS.

Demo staff credentials after seeding are `staff@hotel.app` / `password123`. Guests can register at `/register` and see their bookings at `/account`.

## Quality checks

Run `npm test`, `npm run typecheck`, and `npm run build` before shipping changes.
