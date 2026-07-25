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
   * The background is light pastel, so every non-text graphic
   * (bars, dots, grids, tracks, form fields, chrome) is drawn in
   * this deep "ink" instead of white — otherwise it vanishes.
   * Text stays white; ink is only for marks. Use `ink + "33"` etc.
   * for translucent variants (8-digit hex alpha).
   */
  ink: "#2A0E4A",

  // accents for the reckoning — deepened so they pop on pastel
  danger: "#FF2D55", // the red that floods the life-grid
  heal: "#12B981", //   the green that gives the years back

  fonts: {
    header: "Bitter", //          typed mom-lines & headlines
    subheader: "Instrument Serif", // sign-offs & captions (italic)
  },
} as const;

export type Theme = typeof theme;
