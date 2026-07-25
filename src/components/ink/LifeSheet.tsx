"use client";

import { useMemo } from "react";
import { Ink, PEN, Stroke } from "./Ink";
import { hatchRect, inkCircleAround, inkLine } from "@/lib/ink";

/**
 * Eighty years, ruled by hand, with thirty-two of them scratched out.
 *
 * The grid is twenty long strokes rather than eighty little boxes. That
 * isn't only cheaper — it's what ruling a grid actually is. You draw
 * eleven lines down and nine across and the squares appear; nobody draws
 * eighty separate rectangles, and the give-away that the old version was
 * generated is that its cells had eighty independent, perfectly identical
 * edges. Here the lines run slightly long past the corners and the cells
 * inherit whatever wobble the two lines bounding them happen to have, so
 * no two squares are quite the same size — exactly like real graph paper
 * drawn on a kitchen table.
 *
 * A lost year is scribbled out, not filled. This is the one place the
 * distinction really earns itself: a solid red square is a data value,
 * and a square somebody has scratched through is a thing being taken away
 * from you. Same information, and only one of them is an argument.
 *
 * Healing runs the pen backwards. `stroke-dashoffset` is symmetric, so a
 * year given back literally un-scribbles itself and gets ringed instead —
 * which is worth more than any colour change could be, because you watch
 * it happen.
 */

const COLS = 10;
const ROWS = 8;
const CELL = 58;
const PAD = 34;

export const LIFE_W = COLS * CELL + PAD * 2;
export const LIFE_H = ROWS * CELL + PAD * 2;

const TOTAL = COLS * ROWS;

const cellAt = (i: number) => ({
  x: PAD + (i % COLS) * CELL,
  y: PAD + Math.floor(i / COLS) * CELL,
});

export default function LifeSheet({
  filled,
  healed = 0,
  rule = 1,
  capacity = 32,
  canHeal = false,
  className = "",
}: {
  /** years lost to the phone, scratched out */
  filled: number;
  /** how many of the last-lost years have been given back */
  healed?: number;
  /** 0–1: how much of the grid has been ruled in */
  rule?: number;
  /**
   * The most years this sheet will ever scratch out.
   *
   * Hatching all eighty cells and then only ever drawing thirty-two of
   * them costs about 290 wasted `<path>` nodes per instance, and there
   * are two instances. That is most of a thousand nodes carrying inline
   * styles and transitions on the two pages that already run the heaviest
   * scroll work on the site.
   */
  capacity?: number;
  /**
   * Whether this instance can ever heal. The reckoning renders the same
   * sheet and never gives a year back, so generating and mounting 160
   * ring paths it will never draw is 160 more nodes of pure cost.
   */
  canHeal?: boolean;
  className?: string;
}) {
  const g = useMemo(() => {
    const lines: string[] = [];
    // down first, then across — and the overshoot is what makes it graph
    // paper somebody drew rather than a background-image
    for (let c = 0; c <= COLS; c++) {
      const x = PAD + c * CELL;
      lines.push(
        inkLine({ x, y: PAD }, { x, y: PAD + ROWS * CELL }, {
          seed: `v${c}`,
          amp: 1.5,
          wavelength: 240,
          overshoot: 6,
        }),
      );
    }
    for (let r = 0; r <= ROWS; r++) {
      const y = PAD + r * CELL;
      lines.push(
        inkLine({ x: PAD, y }, { x: PAD + COLS * CELL, y }, {
          seed: `h${r}`,
          amp: 1.5,
          wavelength: 240,
          overshoot: 6,
        }),
      );
    }

    const n = Math.min(TOTAL, Math.max(0, capacity));

    const scratch = Array.from({ length: n }, (_, i) => {
      const { x, y } = cellAt(i);
      return hatchRect(x + 4, y + 4, CELL - 8, CELL - 8, {
        seed: `lost-${i}`,
        spacing: 12,
        angle: 47,
        amp: 1,
        wavelength: 70,
        overshoot: 4,
      });
    });

    const rings = canHeal
      ? Array.from({ length: n }, (_, i) => {
          const { x, y } = cellAt(i);
          return inkCircleAround(x + CELL / 2, y + CELL / 2, CELL * 0.38, CELL * 0.38, {
            seed: `kept-${i}`,
            amp: 2.6,
            wavelength: 70,
          });
        })
      : [];

    return { lines, scratch, rings };
  }, [canHeal, capacity]);

  const firstHealed = filled - healed;

  return (
    <Ink w={LIFE_W} h={LIFE_H} className={className}>
      {g.lines.map((d, i) => (
        <Stroke
          key={`l${i}`}
          d={d}
          drawn={rule * g.lines.length > i}
          speed={340}
          stroke={PEN.rule}
          strokeWidth={1.7}
        />
      ))}

      {g.scratch.map((cell, i) =>
        cell.map((d, j) => (
          <Stroke
            key={`s${i}-${j}`}
            d={d}
            /* a healed year runs its own scribble backwards */
            drawn={i < filled && i < firstHealed}
            speed={260}
            delay={j * 26}
            stroke={PEN.loss}
            strokeWidth={2.1}
            style={{ opacity: 0.9 }}
          />
        )),
      )}

      {g.rings.map((laps, i) =>
        laps.map((d, j) => (
          <Stroke
            key={`r${i}-${j}`}
            d={d}
            drawn={i >= firstHealed && i < filled}
            speed={520}
            delay={j * 160 + 220}
            stroke={PEN.gain}
            strokeWidth={2.4}
          />
        )),
      )}
    </Ink>
  );
}
