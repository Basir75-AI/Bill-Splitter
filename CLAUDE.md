# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mr B Ventures — a client-side e-commerce landing page and product catalog for
precision-engineered audio, wearables, and charging gear. There is no backend,
database, or payment integration; product data is a static in-repo array and
the cart lives only in React state (nothing persists across a page reload).

This repo was originally scaffolded in Google AI Studio (see `metadata.json`
and `assets/.aistudio/`) — that's why `vite.config.ts` has an AI Studio–specific
`DISABLE_HMR` env var that turns off Vite's file watcher; leave that logic
alone.

## Commands

- `npm run dev` — start the dev server (Express + Vite middleware mode) at http://localhost:3000
- `npm run build` — build the client with Vite, then bundle `server.ts` into `dist/server.cjs` with esbuild
- `npm start` — run the production build (`node dist/server.cjs`)
- `npm run preview` — preview the Vite production build directly (no Express server)
- `npm run lint` — type-check only (`tsc --noEmit`); there is no ESLint config
- `npm run clean` — remove `dist/` and `server.js`

There is no test suite/runner configured in this repo.

## Architecture

**Serving.** `server.ts` is a single Express server used for both dev and
prod. In dev it mounts Vite in middleware mode against the SPA; in prod
(`NODE_ENV=production`) it serves the static `dist/` output and falls back
all routes to `dist/index.html`. There's no API layer — Express exists purely
to host the static SPA.

**App shell.** `src/main.tsx` mounts `src/App.tsx`, which wraps the whole page
in `CartProvider` (`src/context/CartContext.tsx`) and renders one section per
component in a fixed order: `Nav`, `Hero`, `TrustBar`, `Catalog`, `Pillars`,
`Story`, `Testimonials`, `Newsletter`, `Footer`, plus the `CartDrawer`
overlay. Each section in `src/components/` is self-contained and reads its
own copy/content inline — there's no CMS or content layer.

**Product data.** `src/data/products.ts` exports a hardcoded `PRODUCTS: Product[]`
array (6 SKUs) and a `getProductBySlug` lookup. `src/types.ts` defines the
`Product`, `ProductSpec`, and `CartLine` shapes. To add/edit a product, edit
this file directly — every product must supply `code`, `slug`, `category`
(one of the fixed `ProductCategory` union values), `specs`, and `materials`.

**Cart.** `CartContext` is the single source of truth for cart state
(`lines`, `isOpen`) and derived values (`itemCount`, `subtotal`), exposed via
the `useCart()` hook. `Catalog` → `ProductCard` → `ProductModal` is the
browse/inspect flow; adding a product opens `CartDrawer` automatically
(`addToCart` sets `isOpen = true`).

**Styling.** Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is no
`tailwind.config.js`; theme tokens (custom colors like `navy`, `paper`,
`copper`, `chalk`, fonts, etc.) are defined with `@theme` directly in
`src/index.css`. Use the existing custom color/font tokens (e.g. `bg-paper`,
`text-ink`, `text-copper-dark`, `font-display`, `font-mono`) rather than
introducing new ad hoc colors, to keep the catalog/blueprint visual language
consistent. Motion/animation uses the `motion` package (Framer Motion's
successor), not CSS-only transitions, for anything beyond simple hovers.

**Path alias.** `@/*` resolves to the repo root (configured in both
`tsconfig.json` and `vite.config.ts`).
