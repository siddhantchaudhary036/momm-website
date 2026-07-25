# momm — landing page

One-page scrollytelling landing site for **momm**, the screen-time app that
nags like your mom (because she was right).

## Run it

```bash
npm install
npm run dev
```

→ http://localhost:3000

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
- **Waitlist:** local-only for now — `TODO` marked in `Scene07Waitlist.tsx` for the Convex/API hookup

Stat sources are linked in the footer.
