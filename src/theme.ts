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

  /**
   * CLAYMORPHISM PROTOTYPE — scoped to the "house rules" cluster on the
   * meet-momm page, so the look can be felt before anyone commits to it.
   *
   * It stays inside the brand's own palette on purpose: fills are `paper`
   * and `wash`, the shadow is the warm `#382E26` (rgba 56,46,38) this site
   * already casts — never neutral black, which reads as dirt on cream — and
   * the one light source is top-left, same as every other surface here. The
   * only thing that changes is the *shape* of the surface: flat sheet with a
   * hairline becomes an inflated, rounded blob.
   *
   * The recipe is the standard three-part one: a large radius, two inset
   * shadows (light top-left, warm shade bottom-right) to fake the inflation,
   * and a soft outer shadow to float it off the page. `pressed` inverts the
   * insets for anything recessed *into* a surface (a slider groove, an empty
   * day); `nub` is the tiny raised element (a slider thumb).
   *
   * If clay graduates from prototype to decision, this block is what moves to
   * the shared token set the app reads too — same names, both directions.
   */
  clay: {
    /** raised surface — paper, lifted so it catches the top-left light */
    surface: "#FFFDF6",
    /** recessed fill — paper pressed a shade deeper, for grooves and wells */
    well: "#F1ECE0",
    radius: 30,
    radiusSm: 18,
    radiusXs: 11,
    /** puffy and floating: inset highlight, inset warm shade, soft cast */
    raised: [
      "inset 5px 5px 10px rgba(255,255,255,0.9)",
      "inset -6px -7px 13px rgba(120,95,70,0.16)",
      "0 16px 34px -10px rgba(56,46,38,0.26)",
      "0 4px 10px rgba(56,46,38,0.10)",
    ].join(", "),
    /** same, dialled down for small raised beads */
    raisedSm: [
      "inset 2px 2px 4px rgba(255,255,255,0.85)",
      "inset -2px -3px 5px rgba(120,95,70,0.2)",
      "0 5px 10px -2px rgba(56,46,38,0.22)",
    ].join(", "),
    /** pressed into the surface — inverted insets, no cast */
    pressed: [
      "inset 5px 6px 11px rgba(120,95,70,0.22)",
      "inset -4px -4px 9px rgba(255,255,255,0.85)",
    ].join(", "),
    /** a shallow groove — a slider track, a tiny empty cell */
    pressedSm: [
      "inset 2px 2px 5px rgba(120,95,70,0.24)",
      "inset -1px -1px 3px rgba(255,255,255,0.7)",
    ].join(", "),
  },

  fonts: {
    header: "Bitter", //          typed mom-lines & headlines
    subheader: "Instrument Serif", // sign-offs & captions (italic)
  },
} as const;

export type Theme = typeof theme;
