# Mr B Ventures

The e-commerce landing page and product catalog for Mr B Ventures —
precision-engineered audio, wearables, and charging gear.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Build

`npm run build` produces a static bundle plus a small Express server
(`dist/server.cjs`) that serves it. Run the built app with `npm start`.

## Stack

React 19, Vite, Tailwind CSS v4, and Motion for animation. The product
catalog and cart are entirely client-side — there's no backend or payment
integration wired up yet.
