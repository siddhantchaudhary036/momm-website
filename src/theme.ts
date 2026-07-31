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
   * Paper pressed a shade deeper: inputs, wells, inactive tracks — the fill
   * for anything recessed *into* a sheet rather than sitting on it.
   *
   * This and the two below exist in `momm-app/src/constants/theme.ts`, whose
   * header says it was ported from this file "so the app and the marketing
   * site are made of the same paper". The app has since grown tokens this
   * file never had, which is how the product mockups here ended up inventing
   * their own dark palette instead of reaching for one. Same values, same
   * names, both directions.
   */
  wash: "#F1ECE0",

  /** dark text on paper, used where a slightly warmer black than `ink` reads better */
  onDoor: "#2B2118",

  /** ink faded into the sheet — secondary text, captions, inactive values */
  onDoorMuted: "#796686",

  /** ink at 10% flattened onto paper, so a border and a ruled line are one mark */
  border: "#E6DFD9",

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
   * The one black on the site: the fridge door behind the hero, and the phone
   * screen in the ask's `BlockedPhone`.
   *
   * Not pure #000 — it carries a trace of the ink's violet, so the black
   * belongs to this palette instead of reading as an absence of one. Lift it
   * with a low-alpha white radial rather than a second colour, the way
   * `Kitchen` already lights it.
   *
   * High-key flat-vector avatars with white die-cut outlines read as a
   * sticker pasted into a void on a dark ground unless something puts them in
   * the room — momm standing on this in the hero gets a pool of light at her
   * feet for exactly that reason. Don't place one on `night` without it.
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
