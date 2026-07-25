"use client";

import { MotionValue, useInView, useScroll } from "framer-motion";
import { ReactNode, useRef } from "react";
import Typewriter from "./Typewriter";

type Props = {
  /** tall wrapper height — the scroll runway (e.g. "h-[240vh]") */
  heightClass?: string;
  line: string;
  lineSpeed?: number;
  /** render-prop: gets scroll progress (0→1) across the runway */
  children: (progress: MotionValue<number>, inView: boolean) => ReactNode;
};

/**
 * One full-viewport story beat: a typed mom-line pinned on top,
 * a visual below that only moves when the user scrolls.
 * Tall wrapper + sticky screen = the scrub.
 */
export default function ScrollBeat({
  heightClass = "h-[240vh]",
  line,
  lineSpeed = 55,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const inView = useInView(stickyRef, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className={`relative ${heightClass}`}>
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-center gap-8 px-6 md:gap-12"
      >
        <h2 className="max-w-4xl text-center font-header text-2xl font-semibold leading-snug md:text-4xl">
          <Typewriter text={line} start={inView} speed={lineSpeed} />
        </h2>
        {children(scrollYProgress, inView)}
      </div>
    </section>
  );
}
