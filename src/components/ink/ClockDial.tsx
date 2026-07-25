"use client";

import { useMemo } from "react";
import { Ink, PEN, Stroke } from "./Ink";
import { hatchRect, inkArc, inkLine } from "@/lib/ink";

/**
 * 5h 16m, against the hours you were actually awake for.
 *
 * This replaces an 84×26px sparkline — the year-on-year rise, demoted
 * from a full section to a footnote and then left there. The footnote was
 * the right call for "+14%"; it was the wrong call for the five hours,
 * which is the single most damning number on the page and was being
 * rendered smaller than the caption underneath it.
 *
 * A circle rather than a bar, because a day is a circle — and against the
 * *waking* 16 rather than the full 24, because sleep isn't time the phone
 * was competing for and counting it is the kind of stat-padding this page
 * has to be above. Five and a quarter hours out of sixteen is a third of
 * everything you were conscious for, and that fraction is legible as a
 * shape long before anyone reads the number in the middle.
 *
 * Drawn in three passes, in the order a person draws: the ring, then the
 * boundary of the piece being marked off, then the shading. Shading last
 * and in its own generation order is why it reads as scribbled in rather
 * than swept out by a progress animation.
 */

const W = 460;
const CX = W / 2;
const CY = W / 2;
const R = 168;
const IR = 96;

const WAKING = 16;
const SPENT = 5 + 16 / 60;

const TOP = -Math.PI / 2;
const SPAN = (SPENT / WAKING) * Math.PI * 2;

export const CLOCK_W = W;
export const CLOCK_H = W;

const sub = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

const at = (a: number, r: number) => ({ x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) });

/** the annular sector the shading is confined to */
function wedgeClip(): string {
  const large = SPAN > Math.PI ? 1 : 0;
  const o0 = at(TOP, R);
  const o1 = at(TOP + SPAN, R);
  const i1 = at(TOP + SPAN, IR);
  const i0 = at(TOP, IR);
  return (
    `M${i0.x},${i0.y} L${o0.x},${o0.y} ` +
    `A${R},${R} 0 ${large} 1 ${o1.x},${o1.y} ` +
    `L${i1.x},${i1.y} ` +
    `A${IR},${IR} 0 ${large} 0 ${i0.x},${i0.y} Z`
  );
}

export default function ClockDial({
  p,
  className = "",
  id = "wedge",
}: {
  /** 0–1 through the beat */
  p: number;
  className?: string;
  id?: string;
}) {
  const g = useMemo(() => {
    const ticks: string[] = [];
    for (let i = 0; i < WAKING; i++) {
      const a = TOP + (i / WAKING) * Math.PI * 2;
      // every fourth hour gets a long tick — a dial needs somewhere to
      // rest the eye, and 16 identical marks give it nowhere
      const len = i % 4 === 0 ? 26 : 13;
      ticks.push(
        inkLine(at(a, R), at(a, R + len), {
          seed: `tick-${i}`,
          amp: 0.7,
          wavelength: 40,
          overshoot: 1.5,
        }),
      );
    }

    return {
      ring: inkArc(CX, CY, R, TOP, TOP + Math.PI * 2, {
        seed: "dial-ring",
        amp: 1.8,
        wavelength: 260,
        overshoot: 9,
      }),
      inner: inkArc(CX, CY, IR, TOP, TOP + Math.PI * 2, {
        seed: "dial-inner",
        amp: 1.4,
        wavelength: 210,
        overshoot: 7,
      }),
      ticks,
      // the boundary of the piece marked off, drawn over the shading so
      // the clipped hatch ends never show as a machine-cut edge
      edges: [
        inkLine(at(TOP, IR - 4), at(TOP, R + 6), {
          seed: "wedge-a",
          amp: 1.1,
          overshoot: 5,
        }),
        inkLine(at(TOP + SPAN, IR - 4), at(TOP + SPAN, R + 6), {
          seed: "wedge-b",
          amp: 1.1,
          overshoot: 5,
        }),
        inkArc(CX, CY, R, TOP, TOP + SPAN, {
          seed: "wedge-arc",
          amp: 1.4,
          wavelength: 190,
          overshoot: 6,
        }),
      ],
      hatch: hatchRect(CX - R - 12, CY - R - 12, (R + 12) * 2, (R + 12) * 2, {
        seed: "wedge-fill",
        spacing: 9,
        angle: 52,
        amp: 1.1,
        wavelength: 100,
        overshoot: 4,
      }),
      clip: wedgeClip(),
    };
  }, []);

  const ringP = sub(p, 0, 0.32);
  const tickP = sub(p, 0.12, 0.42);
  const edgeP = sub(p, 0.36, 0.6);
  const fillP = sub(p, 0.52, 1);

  return (
    <Ink w={CLOCK_W} h={CLOCK_H} className={className}>
      <defs>
        <clipPath id={id}>
          <path d={g.clip} />
        </clipPath>
      </defs>

      <Stroke d={g.ring} drawn={ringP > 0.05} speed={900} stroke={PEN.rule} strokeWidth={2.4} />
      <Stroke
        d={g.inner}
        drawn={ringP > 0.4}
        speed={800}
        stroke={PEN.rule}
        strokeWidth={1.8}
      />

      {g.ticks.map((d, i) => (
        <Stroke
          key={`t${i}`}
          d={d}
          drawn={tickP * WAKING > i}
          speed={180}
          stroke={PEN.rule}
          strokeWidth={i % 4 === 0 ? 2.4 : 1.6}
        />
      ))}

      <g clipPath={`url(#${id})`}>
        {g.hatch.map((d, i) => (
          <Stroke
            key={`h${i}`}
            d={d}
            drawn={fillP * g.hatch.length > i}
            speed={200}
            stroke={PEN.loss}
            strokeWidth={2.2}
            style={{ opacity: 0.85 }}
          />
        ))}
      </g>

      {g.edges.map((d, i) => (
        <Stroke
          key={`e${i}`}
          d={d}
          drawn={edgeP * 3 > i}
          speed={420}
          stroke={PEN.loss}
          strokeWidth={2.6}
        />
      ))}
    </Ink>
  );
}
