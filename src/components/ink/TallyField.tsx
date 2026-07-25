"use client";

import { useMemo } from "react";
import { Ink, PEN, Stroke } from "./Ink";
import { tallyGate } from "@/lib/ink";

/**
 * 144 pickups, counted the way a person counts.
 *
 * The old version of this was 144 dots in a 12×12 grid at 342px square —
 * about 7% of the viewport, sitting under a sentence as an illustration of
 * it. Two things were wrong with that and only one of them was the size.
 *
 * A dot grid is a *measurement*: you have to count it, or trust a label
 * that tells you what it adds up to. A five-bar gate is a *record* — it
 * comes pre-grouped in fives, so the quantity is legible at a glance with
 * no axis and no legend, and it carries the one connotation the dots
 * couldn't: somebody sat there and kept score, and got tired of it.
 *
 * The mapping is exact and it's the whole reason this works: there are
 * 144 strokes and there were 144 pickups. Not 144 marks representing
 * pickups — the fourth stroke of the ninth gate *is* the forty-fourth
 * time you picked up your phone. Scrolling writes them in real order,
 * uprights then the strike, which is the order a hand writes them in.
 */

const TOTAL = 144;
const PER_GATE = 5;
/**
 * Six, not eight. Twenty-nine gates across eight columns makes a band
 * about 1.75:1 that wants the full width of the screen, which left the
 * count nowhere to live except on top of the marks. Six columns gives a
 * near-square block that takes one half of the composition and hands the
 * other half to the number — and the number is the reason the chart is
 * here.
 */
const COLS = 6;

const GATE_H = 58;
const PITCH = 15;
const CELL_W = 96;
const CELL_H = 104;
const PAD = 26;

const N_GATES = Math.ceil(TOTAL / PER_GATE);
const ROWS = Math.ceil(N_GATES / COLS);
export const TALLY_W = COLS * CELL_W + PAD * 2;
export const TALLY_H = ROWS * CELL_H + PAD * 2;

/** one entry per pickup, in the order a hand would write them */
function buildStrokes(): string[] {
  const out: string[] = [];
  for (let g = 0; g < N_GATES; g++) {
    const n = Math.min(PER_GATE, TOTAL - g * PER_GATE);
    const col = g % COLS;
    const row = Math.floor(g / COLS);
    const x = PAD + col * CELL_W + 14;
    const y = PAD + row * CELL_H + (CELL_H - GATE_H) / 2;
    // the gate seed carries the position, so no two gates lean alike
    out.push(...tallyGate(x, y, GATE_H, n, { seed: `pickup-${g}`, pitch: PITCH }));
  }
  return out;
}

export default function TallyField({
  count,
  className = "",
}: {
  /** how many pickups have been written, 0–144 */
  count: number;
  className?: string;
}) {
  const strokes = useMemo(buildStrokes, []);

  return (
    <Ink w={TALLY_W} h={TALLY_H} className={className}>
      {strokes.map((d, i) => (
        <Stroke
          key={i}
          d={d}
          drawn={i < count}
          stroke={PEN.ink}
          /* The marks tire as the day wears on — nobody writes the
             hundred-and-fortieth one as carefully as the first. Weight
             and opacity both fall, but only a little: at the range this
             started with, the last two rows read as *unfinished* rather
             than as weary, and an unfinished tally undercounts the day. */
          strokeWidth={2.5 - (i / TOTAL) * 0.5}
          speed={150}
          style={{ opacity: 0.8 + (1 - i / TOTAL) * 0.2 }}
        />
      ))}
    </Ink>
  );
}
