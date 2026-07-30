"use client";

import { useEffect, useRef } from "react";
import { intensity, TALL, WARM, WIDE, WIDE_QUERY } from "@/lib/beam";
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

/** the ink, resolved once — assigning `strokeStyle` re-parses the colour */
const STROKE = `rgb(${WARM})`;

type Mote = {
  x: number;
  y: number;
  /** half-extent of the fleck, precomputed — `angle`/`len` never change */
  dx: number;
  dy: number;
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
    /* the `xMidYMid slice` mapping, resolved once per resize instead of
       per mote per frame — it only depends on the viewport and the frame */
    let scale = 1;
    let offX = 0;
    let offY = 0;

    const wide = window.matchMedia(WIDE_QUERY);

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      active = wide.matches ? WIDE : TALL;

      scale = Math.max(w / active.vb.w, h / active.vb.h);
      offX = (w - active.vb.w * scale) / 2;
      offY = (h - active.vb.h * scale) / 2;

      /* only touch the backing store when it actually changes: assigning
         `width` reallocates and clears it (33 MB at 1920×1080 DPR 2), and
         mobile fires `resize` on every address-bar show/hide, where the
         pixel size is identical */
      const nw = Math.round(w * dpr);
      const nh = Math.round(h * dpr);
      if (el.width !== nw || el.height !== nh) {
        el.width = nw;
        el.height = nh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    /* coalesce into one frame — `resize` fires continuously during a window
       drag, and `innerWidth`/`innerHeight` force synchronous layout */
    let queued = 0;
    const onResize = () => {
      if (queued !== 0) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        size();
      });
    };
    window.addEventListener("resize", onResize);

    const motes: Mote[] = Array.from({ length: COUNT }, () => {
      const len = 1.6 + Math.random() * 4.4;
      // along the beam, but loosely — dust tumbles, it doesn't file
      const angle = active.axis + (Math.random() - 0.5) * 1.5;
      return {
        x: Math.random(),
        y: Math.random(),
        dx: (Math.cos(angle) * len) / 2,
        dy: (Math.sin(angle) * len) / 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
      };
    });

    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      /* all three are constant for the life of the animation, but they have
         to be re-set per frame rather than once at setup: assigning
         `el.width` in `size()` resets the whole 2D context state */
      ctx.lineCap = "round";
      ctx.strokeStyle = STROKE;
      ctx.lineWidth = 0.9;

      for (const m of motes) {
        const x = m.x + Math.sin(t * 0.13 * m.speed + m.phase) * SWAY;
        // wraps, so the drift never runs out; the sway makes the wrap
        // invisible because no two motes cross the seam in the same place
        const y = (m.y + t * DRIFT * m.speed) % 1;

        const px = x * w;
        const py = y * h;
        const lit = intensity(active, (px - offX) / scale, (py - offY) / scale);
        if (lit < 0.015) continue;

        ctx.globalAlpha = Math.min(0.72, lit * 1.5);
        ctx.beginPath();
        ctx.moveTo(px - m.dx, py - m.dy);
        ctx.lineTo(px + m.dx, py + m.dy);
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
      if (queued !== 0) cancelAnimationFrame(queued);
      window.removeEventListener("resize", onResize);
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
