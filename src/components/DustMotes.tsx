"use client";

import { useEffect, useRef } from "react";
import { intensity, TALL, toViewBox, WARM, WIDE, WIDE_FROM } from "@/lib/beam";
import { HERO_ID } from "@/lib/anchors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Dust, turning over in the doorway.
 *
 * The static stipple in `Kitchen` is the light; this is the air. It's the
 * one animated thing on the opening screen and it has exactly one job: stop
 * the room being a picture of a room. A frame that never changes reads as an
 * illustration no matter how well drawn, and half a dozen specks drifting
 * through a shaft of light is the smallest possible amount of motion that
 * says "this is happening now, and it's quiet."
 *
 * WHAT SELLS IT is not that the specks move. It's that they *appear when
 * they drift into the light and vanish when they leave it* — every fleck's
 * alpha is `intensity()` at its own position, the same function that placed
 * the stipple and lit the fridge. Motes that are visible everywhere are
 * snow; motes that are only visible in the beam are dust, and the beam
 * becomes volume rather than a shape drawn on the wall.
 *
 * They're drawn as short strokes rather than round dots, angled along the
 * beam, because everything else in this world came off a pen and a glowing
 * circle is the one mark a pen cannot make.
 */

const COUNT = 60;
/** downward drift per second, in screens. Dust in still air barely moves —
 *  anything you can watch travel is snow, and this is a kitchen. */
const DRIFT = 0.007;
/** how far a mote wanders sideways, in screens */
const SWAY = 0.022;

type Mote = {
  x: number;
  y: number;
  len: number;
  angle: number;
  phase: number;
  speed: number;
};

export default function DustMotes() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // the static stipple already puts dust in the beam, so there's nothing
    // to fall back to here — drifting specks are precisely the motion this
    // preference exists to turn off
    if (reduced) return;

    const el = canvas.current;
    if (el === null) return;
    const ctx = el.getContext("2d");
    if (ctx === null) return;

    let w = 0;
    let h = 0;
    /** whichever composition the CSS is showing — masking against the other
     *  one is dust glowing in the dark and a beam full of nothing */
    let active = WIDE;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      active = w >= WIDE_FROM ? WIDE : TALL;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const motes: Mote[] = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 1.6 + Math.random() * 4.4,
      // along the beam, but loosely — dust tumbles, it doesn't file
      angle: active.axis + (Math.random() - 0.5) * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
    }));

    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const m of motes) {
        const x = m.x + Math.sin(t * 0.13 * m.speed + m.phase) * SWAY;
        // wraps, so the drift never runs out; the sway makes the wrap
        // invisible because no two motes cross the seam in the same place
        const y = (m.y + t * DRIFT * m.speed) % 1;

        const vb = toViewBox(active, x * w, y * h, w, h);
        const lit = intensity(active, vb.x, vb.y);
        if (lit < 0.015) continue;

        const px = x * w;
        const py = y * h;
        const dx = (Math.cos(m.angle) * m.len) / 2;
        const dy = (Math.sin(m.angle) * m.len) / 2;

        ctx.globalAlpha = Math.min(0.72, lit * 1.5);
        ctx.strokeStyle = `rgb(${WARM})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(px - dx, py - dy);
        ctx.lineTo(px + dx, py + dy);
        ctx.stroke();
      }

      if (running) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /**
     * Stop dead when nobody's looking.
     *
     * This is background decoration on a page that is eight screens long,
     * and it has no business costing anyone battery for the seven screens
     * where it isn't on camera — nor while the tab is in the background,
     * where `requestAnimationFrame` throttling is a courtesy rather than a
     * guarantee.
     */
    const pause = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };
    const hero = document.getElementById(HERO_ID);
    const io =
      hero === null
        ? null
        : new IntersectionObserver(([entry]) => pause(entry.isIntersecting));
    io?.observe(hero as Element);

    const onVisibility = () => pause(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
    /* re-run when the preference resolves: `useReducedMotion` reports false
       during SSR and settles on mount, and the hero swaps to a different
       element when it flips — so an observer set up on the first pass would
       be left holding a node that is no longer in the document */
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" />;
}
