/**
 * One paper surface, shared by the sheet you push *through* and the sheet
 * you land *on*.
 *
 * These were two independent treatments for one frame and it showed: the
 * hero's zoomed note was flat cream and PaperAct added a warm window
 * glow, so at the exact moment the hand-off happens there was a visible
 * horizontal band across the screen where one cream met a slightly
 * different cream. A transition whose whole job is to be invisible cannot
 * afford two sources of truth for the colour it lands on.
 *
 * The light matches Kitchen's — same window, upper left — because the
 * sheet is in the same room as everything else even when it's all you
 * can see.
 */

export const PAPER_LIGHT =
  "radial-gradient(120% 70% at 12% 0%, rgba(255,238,203,0.55) 0%, rgba(255,255,255,0) 55%)," +
  "radial-gradient(100% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(84,66,44,0.10) 100%)";

/** fibre, at the size it reads at when the sheet fills the screen */
export const PAPER_TOOTH_SIZE = "340px 340px";
export const PAPER_TOOTH_OPACITY = 0.085;
