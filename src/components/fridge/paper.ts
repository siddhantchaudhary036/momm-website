import { theme } from "@/theme";

/**
 * Paper, drawn with gradients rather than scanned.
 *
 * Every surface here is procedural on purpose. Bitmap paper textures are
 * what date a scrapbook layout — they tile visibly, they don't respond,
 * and a handful of them would cost more than every avatar on the site put
 * together. Gradients cost nothing and stay crisp at any size.
 */

export type PaperKind = "lined" | "grid" | "plain";

/** ruled-line spacing; note text uses this as its line-height so the
 *  writing sits on the rules instead of floating between them */
export const RULE = 34;
const GRID = 16;

export function paperBackground(kind: PaperKind): string {
  if (kind === "lined") {
    return (
      `repeating-linear-gradient(to bottom,` +
      ` transparent 0px, transparent ${RULE - 1}px,` +
      ` ${theme.fridge.rule} ${RULE - 1}px, ${theme.fridge.rule} ${RULE}px)`
    );
  }
  if (kind === "grid") {
    return (
      `repeating-linear-gradient(to bottom,` +
      ` transparent 0px, transparent ${GRID - 1}px,` +
      ` ${theme.fridge.grid} ${GRID - 1}px, ${theme.fridge.grid} ${GRID}px),` +
      `repeating-linear-gradient(to right,` +
      ` transparent 0px, transparent ${GRID - 1}px,` +
      ` ${theme.fridge.grid} ${GRID - 1}px, ${theme.fridge.grid} ${GRID}px)`
    );
  }
  return "none";
}

/**
 * Paper tooth — the same static turbulence data-uri the page grain uses,
 * scoped to a sheet and multiplied so it darkens into the fibre rather
 * than sitting on top as haze.
 */
export const TOOTH =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E\")";

/**
 * One light source, top-left, for everything on the door.
 *
 * On a dark surface the edge is what decides whether a sheet is lying on
 * the door or pasted over a photograph of it. Three parts, and all three
 * are needed: a warm rim on the lit edges where light catches the paper's
 * thickness, a matching darkening on the shaded edges, and a real cast
 * shadow falling away from the light. Drop any one and it goes flat.
 */
export const PAPER_SHADOW = [
  "inset 1px 1px 0 rgba(255,255,255,0.75)",
  "inset -1px -1px 0 rgba(120,95,70,0.12)",
  "4px 6px 10px rgba(56,46,38,0.16)",
  "14px 22px 40px rgba(56,46,38,0.12)",
].join(", ");
