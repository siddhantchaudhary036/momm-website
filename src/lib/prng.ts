/**
 * Deterministic randomness.
 *
 * Every hand-drawn shape on the site is generated, not filtered — which
 * means the geometry runs on the server AND on the client. `Math.random()`
 * would produce a different balloon in each and React would flag a
 * hydration mismatch (plus a visible flash as the shape snaps).
 *
 * So: every shape derives from a seed, and the seed is derived from
 * something stable about the element (usually the text it holds). Same
 * text → same lumps, forever, on both sides of the wire.
 */

/** cyrb53 — small, fast, well-distributed string → uint32. */
export function hashString(str: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)) >>> 0;
}

/** mulberry32 — 32-bit PRNG, returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The one entry point: a seeded generator from a string or number. */
export function rngFrom(seed: string | number): () => number {
  return mulberry32(typeof seed === "string" ? hashString(seed) : seed >>> 0);
}
