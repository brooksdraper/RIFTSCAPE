# Riftscape Network

The website for **Riftscape**, a Minecraft server network — currently home to
**Project Sulfuria**, a 100-day zombie apocalypse Factions Hardcore
challenge. The site handles player enrollment, a supporter store (Stripe
checkout), player profiles/ID cards, and a wiki for the current season.

Play at `play.riftscape.net`.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (config lives in CSS, not `tailwind.config.*`)
- Supabase (auth + database client)
- Stripe (supporter store checkout)
- Motion (`motion/react`) for animation

> This project runs on newer, breaking versions of Next.js and Tailwind than
> what most tooling/training data expects. Check
> `node_modules/next/dist/docs/` for current APIs before writing code.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
```

## Authentication

Sign-in is **Discord OAuth through Supabase Auth**. There are no passwords and
no credential form — a survivor's Discord account _is_ their identity, and
`profiles.id` is the `auth.users` id, so one Discord account can hold exactly
one survivor slot.

Setup, once per Supabase project:

1. In the [Discord Developer Portal](https://discord.com/developers), create an
   application and add an OAuth2 redirect URI of
   `https://<project-ref>.supabase.co/auth/v1/callback`.
2. In the Supabase dashboard under **Authentication → Providers**, enable
   Discord and paste in the Client ID and Client Secret.
3. Under **Authentication → URL Configuration**, add the site's own callback
   (`http://localhost:3000/**` in dev, `https://riftscape.net/**` in prod) to
   the redirect allow list.
4. Run `supabase/schema.sql`. It drops and recreates `profiles`, so it wipes
   every enrolled survivor.

How the pieces fit:

| File                      | Role                                                  |
| ------------------------- | ----------------------------------------------------- |
| `proxy.ts`                | Refreshes the auth token on every request             |
| `lib/supabase/server.ts`  | Session-aware client for Server Components / handlers |
| `lib/supabase/browser.ts` | Session-aware client for Client Components            |
| `lib/auth/sign-in.ts`     | Starts the Discord handshake                          |
| `app/auth/callback/`      | Trades the OAuth code for a session                   |
| `lib/auth/profile.ts`     | `getViewer()` — signed in? enrolled? — for the UI     |

Enrollment is a second step after sign-in: `/api/enroll` reads the Discord
identity off the verified session and only accepts a Minecraft username from
the client. Tier and life number are never writable from the browser — the
`profiles` RLS policy is read-only and all writes go through the service role.

## Project structure

```
app/            Routes: home, wiki, store (+ supporter tier), user profile, API routes
components/
  home/         Hero, countdown, enrollment, feature grid
  wiki/         Wiki cards/sections — reference implementation for the MC theme
  store/        Store grid, supporter catalog, checkout modal
  user/         Player ID card, security seal, barcode
  layout/       Shared chrome (background overlay, etc.)
  ui/           Shared primitives (copy-IP button, sponsor footer)
lib/
  auth/         Session/identity: Discord metadata, viewer, sign-in
  players/      Enrolled-player data, ID card formatting, Mojang lookup
  store/        Store items, supporter tiers, sale config, Stripe
  supabase/     Supabase client factories (anon, admin, browser, server)
```

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |
