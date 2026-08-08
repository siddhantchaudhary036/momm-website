import { theme } from "@/theme";

/**
 * The room the whole site sits in — warm cream, lit from a window at the
 * upper left.
 *
 * This replaced `Kitchen`, the drawn dark 1am kitchen with a light beam that
 * the paper era opened on. Clay has no dark ground anywhere, so the page is
 * simply cream with the light laid over it: two radial gradients, no filter,
 * no noise. Without the light a full field of one cream reads as a flat fill
 * rather than as a lit surface — it is the same job `PAPER_LIGHT` did for the
 * paper build, ported straight across.
 *
 * Fixed and behind everything (`-z-10`), so every clay panel above it floats
 * on the same lit cream and casts its warm shadow onto one continuous ground.
 */

/** warm pool from the upper-left window, then a faint warm vignette in the far corners */
export const PAGE_LIGHT =
  "radial-gradient(120% 70% at 12% 0%, rgba(255,238,203,0.55) 0%, rgba(255,255,255,0) 55%)," +
  "radial-gradient(100% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(84,66,44,0.10) 100%)";

export default function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: theme.paper }}
    >
      <div className="absolute inset-0" style={{ background: PAGE_LIGHT }} />
    </div>
  );
}
