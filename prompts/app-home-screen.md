# Nano Banana Pro — momm app home screen

Everything below is derived from the live site: `src/theme.ts` (colours), `layout.tsx`
(fonts), `src/components/ui/cards.tsx` (the glass language), `phone/screens.tsx` and
`public/momm-avatars/` (the character). If the brand moves, move this too.

Generate at **9:16, 2K or 4K**. Prompt A is the deliverable; B and C are the variants.

---

## Prompt A — the screen itself (flat, no device frame)

> A single, flat, straight-on UI design of a mobile app home screen, rendered edge to
> edge with no device frame, no hand, no perspective, no background scene — the image
> IS the screen. Pixel-crisp, as if exported from Figma at 3x.
>
> **The app.** It is called **momm** (always lowercase, always two m's). It is a
> screen-time app that behaves like your mother: it watches your usage, texts you when
> you're wasting time, seals apps shut, sets daily limits, keeps a streak, and — the
> part that matters — redirects you to a hobby instead of just confiscating the phone.
> The tone is warm, firm, slightly guilt-trippy. Never corporate, never clinical.
>
> **Overall art direction.** Dark, premium, glassmorphic iOS design. Base canvas is a
> near-black plum `#0B0714`. Behind everything, two very large, very soft, heavily
> out-of-focus gradient blobs at about 22% opacity — a periwinkle blue `#94B9FF` blob
> bleeding in from the top-left, an orchid pink `#E894FF` blob from the bottom-right —
> so the frosted panels have something to refract. Every content block is a floating
> glass card: fill `rgba(18,14,22,0.72)`, heavy background blur, a 1px
> `rgba(255,255,255,0.13)` hairline border, a 1px bright inner highlight along the top
> edge only, 26px corner radius, and a large soft black drop shadow beneath. Generous
> padding inside cards, generous air between them. Icons are thin monoline strokes
> (~1.8px, rounded caps, no fills, no emoji, no brand logos). Primary text pure white,
> secondary text white at 50–60%.
>
> **Typography.** Three faces only. Headings, numbers and stats: **Bitter**, a slab
> serif, bold to black. Anything spoken by momm: **Instrument Serif, italic**, in white
> at ~50% opacity. All other interface microcopy: a clean neutral sans (SF Pro / Inter),
> regular to semibold, small. Numbers are tabular.
>
> **Layout, top to bottom, as percentages of the screen height:**
>
> **0–3% — Status bar.** iOS style, white: time "9:41" left; signal, wifi, battery right.
>
> **3–12% — Header.** Left: "Good evening." in Bitter bold ~24px white, and directly
> under it "I've been watching. — momm" in Instrument Serif italic ~14px, white 50%.
> Right: a 44px circular avatar button, glass-rimmed, containing a head-and-shoulders
> crop of the momm character described at the bottom of this prompt, with a small coral
> `#E8567A` unread dot at its top-right.
>
> **12–34% — Hero card, "Today".** A glass card. Top-left, the tiny all-caps label
> "TODAY" in white 45%, letterspaced. Beneath it, huge: "3h 12m" in Bitter black ~46px,
> pure white. To its right, a small pill chip with a downward arrow icon and "42m less
> than yesterday" in emerald `#12B981` on a 12%-opacity emerald fill. Below that, a
> seven-bar mini chart: seven rounded-top vertical bars of varying height, the six past
> days in white at 22%, today's bar (rightmost) solid white, with the tiny day letters
> "M T W T F S S" underneath in white 35%. Along the bottom edge of the card, separated
> by a hairline rule, a strip: a thin flame outline icon in warm orange `#FF8A4C`, then
> "12-day streak" in semibold white, then, right-aligned, "make momm proud" in
> Instrument Serif italic white 45%.
>
> **34–45% — momm's message.** A glass card styled exactly like an iOS notification. On
> the left, a 38px rounded-square app tile with a warm coral-to-pink gradient
> (`#FF8A6B` top-left → `#E8567A` bottom-right) and a white outline heart glyph centred
> in it. To its right: the row "momm" in bold white 13px with "now" right-aligned in
> white 45%; underneath, the message "It's been 15 minutes. I'm not asking again." in
> white 85%, 14px. Nothing else.
>
> **45–68% — "House rules" card.** Heading "House rules" in Bitter bold ~18px white;
> immediately below, "set once. momm enforces." in Instrument Serif italic ~13px, white
> 50%. Then three rows, each with a thin monoline icon on the left, the app name, a
> right-aligned tabular figure, and a 6px-tall rounded progress track beneath it
> (track white 12%, fill solid white, a small white circular thumb at the fill's end):
> - camera outline icon — "Instagram" — "18m / 30m" — bar about 60% full
> - music-note outline icon — "TikTok" — "0m / 15m" — bar empty, and this row is dimmed
>   to ~45% opacity with a small rounded chip at its right reading "sealed" next to a
>   tiny padlock outline icon, chip tinted coral `#E8567A`
> - play-triangle outline icon — "YouTube" — "31m / 45m" — bar about 70% full
>
> Centred at the foot of the card: "and I mean it. — momm" in Instrument Serif italic,
> white 40%.
>
> **68–84% — "Instead" card, the redirect.** This is the app's whole argument, so give
> it presence. Glass card with a faint warm coral inner glow at its top-left corner. A
> thin monoline acoustic-guitar icon. Heading "You said you'd learn guitar." in Bitter
> semibold ~17px white. Under it, "20 minutes. That's all I'm asking." in Instrument
> Serif italic, white 50%. At the bottom of the card, a full-width pill button, 52px
> tall, filled with a left-to-right gradient from periwinkle `#94B9FF` to orchid
> `#E894FF`, with the label "Start focus session" centred in deep ink `#2A0E4A`,
> semibold sans, 15px. No shadow inside the button; a soft coloured glow beneath it.
>
> **84–90% — empty breathing room**, with the very top edge of one more card just
> peeking above the tab bar to imply the page scrolls.
>
> **90–100% — Tab bar.** A frosted glass bar spanning the full width, hairline top
> border, five evenly spaced monoline icons with 10px labels beneath: house "Home"
> (active — solid white, with a 4px white dot beneath it), sliders "Rules", circle-timer
> "Focus", palette "Hobbies", and speech-bubble "momm" (inactive icons and labels at
> white 40%; the momm tab carries a tiny coral `#E8567A` badge dot). Below it, the white
> iOS home indicator bar.
>
> **The momm character** (for the header avatar only): a flat 2D vector cartoon of a
> warm, friendly mother in her late thirties — thick dark navy `#2B2637` outlines of
> even weight, no gradients, no shading beyond a single flat darker tone, and a clean
> white die-cut sticker outline around the whole silhouette. Warm peach skin, soft round
> face, simple dot eyes, thin expressive brows, a small knowing smirk, brown hair pulled
> into a low bun with a few loose wisps, wearing an open coral-orange cardigan over a
> white tee. Sticker-clean, child's-book charming, absolutely not photorealistic and not
> 3D. In the header she is cropped to head and shoulders inside a circle.
>
> **Hard constraints.** Render every string of text exactly as written above, correctly
> spelled, crisply legible, with no additional invented labels, no placeholder or lorem
> text, no gibberish glyphs, no repeated words. "momm" is always lowercase with two m's.
> No emoji anywhere. No Apple, Meta, Instagram, TikTok or YouTube logos — generic
> monoline icons only. No device frame, no bezel, no notch drawn as a shape, no hand
> holding a phone, no desk, no room, no reflections of a room. No light mode. No
> skeuomorphic bevels, no 3D extrusion, no lens flare, no watermark, no signature.

---

## Prompt B — light "paper" variant

Same as A, but swap the shell: canvas is warm newsprint `#FBF6E9`, cards are white with
a 1px `rgba(42,14,74,0.10)` border and a soft violet-tinted shadow, all text is deep ink
`#2A0E4A` (secondary at 55%), progress fills and the active tab are ink rather than
white, and the two background blobs sit at 12% opacity. Everything else — layout, copy,
type, icon weight — is unchanged. Useful for the App Store listing and for any part of
the site that shouldn't break the fridge-door palette.

---

## Prompt C — screen inside the site's drawn phone

Use when you want a hero image that matches `components/phone/PhoneFrame.tsx` rather
than a bare screenshot. Append to Prompt A:

> Place the screen inside a hand-drawn phone: a rounded slab with a 2.5px deep-ink
> `#2A0E4A` outline of perfectly even weight, near-black `#0B0714` body, a pill-shaped
> dynamic island at the top, two small volume nubs on the left edge and a longer power
> nub on the right, turned about 8° to the left on its vertical axis with a 3° forward
> tilt so the left edge of the slab shows as a thin dark side face. One diagonal white
> sheen sweeps across the glass from the top-left at ~10% opacity. The phone stands on a
> flat cool-grey `#C4D2D8` surface with a soft elliptical contact shadow directly
> beneath it. Nothing else in the frame — no room, no props, no gradient backdrop. Square
> 1:1 composition with the phone centred and generous margin.

---

## Iterating

Nano Banana Pro edits conversationally, so don't re-roll the whole prompt when one thing
is off. Change one variable per turn and pin the rest:

- "Keep everything identical. Only fix the House rules card — the numbers must read
  exactly '18m / 30m', '0m / 15m', '31m / 45m'."
- "Keep the layout and all text identical. Make the glass cards more transparent and
  increase the background blur."
- "Same screen, but the hero stat reads '1h 04m' and the chip reads '2h 8m less than
  yesterday'."
- "Same screen, but replace the guitar card with a running-shoe icon and the heading
  'You said you'd start running again.'"

Two known failure modes: the model tends to add invented UI labels in empty space (fix
by naming the empty region as deliberate breathing room), and it will slip an emoji into
the streak strip (fix by re-stating "monoline outline icons only, no emoji"). Text
fidelity is best at 4K — generate large, downscale after.
