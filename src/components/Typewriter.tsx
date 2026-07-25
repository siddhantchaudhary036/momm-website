"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  text: string;
  /** ms per character */
  speed?: number;
  /** extra random ms per character so it feels human */
  jitter?: number;
  /** ms before the first character */
  startDelay?: number;
  /** typing begins only when true */
  start?: boolean;
  onDone?: () => void;
  className?: string;
  /** keep the caret blinking after the line finishes — only for lines handing off to a second line/signature. Default: caret disappears once typing is done. */
  keepCaret?: boolean;
};

/**
 * The site's signature: mom typing to you, one character at a time,
 * with a blinking caret. Layout-stable — the full line reserves its
 * space invisibly so nothing reflows while she types.
 */
export default function Typewriter({
  text,
  speed = 70,
  jitter = 40,
  startDelay = 0,
  start = true,
  onDone,
  className = "",
  keepCaret = false,
}: Props) {
  // split by grapheme-ish units so emoji don't get sliced in half
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!start) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setCount(i);
      if (i < chars.length) {
        t = setTimeout(tick, speed + Math.random() * jitter);
      } else {
        setDone(true);
        onDoneRef.current?.();
      }
    };

    t = setTimeout(tick, startDelay + speed);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [start, chars.length, speed, jitter, startDelay]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* invisible full line reserves the layout */}
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0" aria-label={text}>
        {chars.slice(0, count).join("")}
        {start && (!done || keepCaret) && <span className="caret" aria-hidden />}
      </span>
    </span>
  );
}
