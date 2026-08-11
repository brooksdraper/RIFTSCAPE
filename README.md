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
- Prisma (`Profile` model) against the Supabase Postgres database
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

### Database

```bash
npx prisma generate
npx prisma migrate dev
```

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
lib/            Server/client utilities (e.g. Supabase profile lookup)
prisma/         Database schema
```

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |
