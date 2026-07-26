import { theme } from "@/theme";

/**
 * The wall the fridge is on: matte black, with grain.
 *
 * This used to be painted enamel under a scroll-driven light — one day in a
 * kitchen, morning gold through to lamplight. That arc only ever rendered
 * where nothing covered it, and now that every act after the hero sits on
 * her paper, the only thing it lit was the first screen. So it's gone, and
 * what's left is the one surface it needs to be: flat, unlit, grainy black.
 *
 * Matte is the rule the palette already had — nothing in this world gets a
 * specular highlight, screens and glass are the only things allowed to
 * shine, because they're what doesn't belong here. Black just states it
 * outright instead of implying it with a desaturated blue-grey.
 *
 * The grain is what keeps it from reading as an empty div. A flat #000 fill
 * is the most obvious "unstyled" signal a page can send; a black with dust
 * in it is a material. It's screened rather than multiplied, because
 * multiply against black is a no-op — the specks have to *add* light.
 */

/** speck size — raise for finer dust, lower for coarser flecks */
const GRAIN_FREQ = 0.9;
/** tile edge in px; must match the svg's own width/height to stitch cleanly */
const GRAIN_TILE = 200;
/**
 * How much of the noise survives. The gamma curve on alpha is what turns an
 * even grey haze into separated specks: it crushes the midtones toward zero
 * and leaves the peaks, so raising the exponent gives sparser, cleaner dust.
 */
const GRAIN_GAMMA = 3.2;
const GRAIN_OPACITY = 0.5;

const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='${GRAIN_TILE}' height='${GRAIN_TILE}'%3E%3Cfilter id='g'%3E` +
  `%3CfeTurbulence type='fractalNoise' baseFrequency='${GRAIN_FREQ}' ` +
  `numOctaves='3' stitchTiles='stitch'/%3E` +
  `%3CfeColorMatrix type='saturate' values='0'/%3E` +
  `%3CfeComponentTransfer%3E%3CfeFuncA type='gamma' ` +
  `exponent='${GRAIN_GAMMA}' amplitude='1'/%3E%3C/feComponentTransfer%3E` +
  `%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E` +
  `%3C/svg%3E")`;

export default function Kitchen() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: theme.night }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: `${GRAIN_TILE}px ${GRAIN_TILE}px`,
          opacity: GRAIN_OPACITY,
          mixBlendMode: "screen",
        }}
      />

      {/*
        Barely-there lift toward the middle. Not a light source — there isn't
        one any more — just enough gradient that the wall has a centre, since
        a perfectly even field reads as a colour swatch rather than a room.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 32%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 62%)",
        }}
      />
    </div>
  );
}
