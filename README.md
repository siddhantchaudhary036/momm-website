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

## The logo

The five originals live in `public/momm-images/` and are never served —
they're 2000px PNGs of ink on photographed paper, six megabytes each.
Everything the site actually shows is built from them:

```bash
npm run brand
```

That writes the favicon (`.ico`, 16/32/48), `icon.png`, `apple-icon.png` and
the 1200×630 social card into `src/app/`, where Next picks all five up by
filename — which is why `layout.tsx` declares no `icons` at all — plus the
transparent wordmark and figure into `public/brand/`.

"Transparent" is the point: the originals carry their own cream paper, and
dropping that onto the site's cream paper leaves a visible rectangle, because
no two photographs of paper are the same cream. The script lifts the ink off
its background (flat type by coverage, the drawing by flood-filling in from
the frame edge) so the page's own fibre shows through. Re-run it after
changing anything in `momm-images/`; don't hand-edit the outputs.

Set `NEXT_PUBLIC_SITE_URL` in production so the social card's `og:image` URL
is absolute. On Vercel the deployment host is used automatically.

## Change the colors

All colors live in **`src/theme.ts`** — swap `gradient.from` (top) and
`gradient.to` (bottom) with the real brand hex codes. Nothing else to touch.

## The ride

Typed hero → scroll-fill data reckoning (pickups · hours · 32 lost years ·
social donut) → "Your mom was right." → she notices / she sets the limits →
+6 years payoff → the ask, on black, beside a phone with Instagram shut.

- **Fonts:** Bitter (headers / typed mom-lines) · Instrument Serif (sign-offs, captions)
- **Motion:** framer-motion (scroll-scrubbed via `useScroll` + `useTransform`)
- **Phone frames:** react-device-mockup (div-based, so they take live UI + 3D transforms)
- **Waitlist:** `Scene07Waitlist.tsx` → `src/app/api/waitlist/route.ts` → Convex (see above)
