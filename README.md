# momm — landing page

One-page scrollytelling landing site for **momm**, the screen-time app that
nags like your mom (because she was right).

## Run it

```bash
npm install
cp .env.example .env.local   # then fill both values in
npm run dev
```

→ http://localhost:3000

## The backend lives in the app repo

All of Momm's Convex code — schema, functions, HTTP endpoints — is in
`momm-app/convex/`, so there is one deployment and one schema. This site has no
Convex client and no generated API: it knows the backend only as
`CONVEX_SITE_URL` and talks to it from the server.

Waitlist signups go `form → /api/waitlist (route handler) → POST /waitlist`
on the deployment's `.convex.site` domain, authenticated with a shared
`WAITLIST_INGEST_SECRET`. Both env vars are server-only, so nothing about the
backend ships in the browser bundle. Changing what a signup *does* means editing
`momm-app/convex/waitlist.ts`, not this repo.

## Change the colors

All colors live in **`src/theme.ts`** — swap `gradient.from` (top) and
`gradient.to` (bottom) with the real brand hex codes. Nothing else to touch.

## The ride

Typed hero → scroll-fill data reckoning (pickups · hours · 32 lost years ·
social donut) → "Your mom was right." → 3D phone twist-in → sticky
screen-swap of momm's behaviors → +6 years payoff → waitlist.

- **Fonts:** Bitter (headers / typed mom-lines) · Instrument Serif (sign-offs, captions)
- **Motion:** framer-motion (scroll-scrubbed via `useScroll` + `useTransform`)
- **Phone frames:** react-device-mockup (div-based, so they take live UI + 3D transforms)
- **Waitlist:** `Scene07Waitlist.tsx` → `src/app/api/waitlist/route.ts` → Convex (see above)

Stat sources are linked in the footer.
