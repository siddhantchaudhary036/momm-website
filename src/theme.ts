/**
 * momm — single source of truth for the look.
 *
 * GRADIENT: pulled straight from the logo — a horizontal (left→right)
 * blue→pink sweep. Swap `from` (left) / `to` (right) to retune;
 * change `angle` to spin the gradient. Nothing else needs to change.
 */
export const theme = {
  gradient: {
    from: "#94B9FF", // ← left  (periwinkle blue, from the logo)
    to: "#E894FF", //   ← right (orchid pink, from the logo)
    angle: "90deg", // horizontal, matching the logo's vertical split-line
  },

  text: "#FFFFFF",

  /**
   * Balloon and panel fill — warm newsprint. Text *inside* a balloon is
   * ink on paper, not white; which quietly fixes the contrast problem
   * globals.css has been patching with text-shadows. White-on-pastel is
   * only used for the full-bleed splash lines that sit outside a frame.
   */
  paper: "#FBF6E9",

  /**
   * The door: painted enamel on a mid-century fridge.
   *
   * Light, because the avatars are high-key flat vector with white
   * die-cut outlines — high-key art on a dark ground always reads as a
   * sticker pasted into a void, which is exactly what the matte black
   * version did to them. Cool and desaturated, because the characters are
   * warm coral and need to stay the warmest thing in the room.
   *
   * Matte stays a rule: nothing in this world gets a specular highlight.
   * Screens and glass are the only things allowed to shine, which is the
   * point — they're what doesn't belong here.
   */
  door: "#C4D2D8",
  /** type and marks sitting directly on the door */
  onDoor: "#2B2118",

  /** outline weight — the phone body, and anything else that needs an edge */
  stroke: 2.5,

  /** ballpoint — momm's hand, kept distinct from the structural ink */
  pen: "#25306B",

  /**
   * The fridge-door vocabulary, capped on purpose. Two fasteners and
   * three papers, enumerated here so nobody adds a fourth: an unbounded
   * pile of tape, pins, clips and coffee rings is exactly how a
   * scrapbook layout stops looking made and starts looking cluttered.
   */
  fridge: {
    tape: "#FFF6DC",
    magnet: "#E8567A",
    rule: "#2A0E4A1A", //   ruled lines on notepaper
    grid: "#2A0E4A14", //   graph paper
    /** max tilt in degrees — larger reads as amateur, not handmade */
    tilt: 2.5,
  },

  /**
   * The background is light pastel, so every non-text graphic
   * (bars, dots, grids, tracks, form fields, chrome) is drawn in
   * this deep "ink" instead of white — otherwise it vanishes.
   * Text stays white; ink is only for marks. Use `ink + "33"` etc.
   * for translucent variants (8-digit hex alpha).
   */
  ink: "#2A0E4A",

  /**
   * The one dark surface: the ask, and the phone screen inside it.
   *
   * Not pure #000 — it carries a trace of the ink's violet, so the black
   * belongs to this palette instead of reading as an absence of one. Lift it
   * with a low-alpha white radial rather than a second colour, the way
   * `Kitchen` lights the door.
   *
   * Use sparingly. Everything else on this site is light for a reason: the
   * avatars are high-key flat vector with white die-cut outlines, and on a
   * dark ground they read as stickers pasted into a void unless something
   * puts them in the room — a pool of light under them, at minimum.
   */
  night: "#0B0710",

  // accents for the reckoning — deepened so they pop on pastel
  danger: "#FF2D55", // the red that floods the life-grid
  heal: "#12B981", //   the green that gives the years back

  fonts: {
    header: "Bitter", //          typed mom-lines & headlines
    subheader: "Instrument Serif", // sign-offs & captions (italic)
  },
} as const;

export type Theme = typeof theme;
