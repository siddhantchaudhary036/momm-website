"use client";

import Avatar, { type AvatarName } from "../Avatar";
import Note from "../fridge/Note";
import WordReveal from "../WordReveal";

/**
 * PAGE 05 — the better toy.
 *
 * The most under-used pair in the avatar set, and the only page that
 * states the actual difference: every other screen-time app confiscates.
 * momm redirects. `momm-showing-kid-hobby` and `momm-teaching-kid-hobby`
 * were drawn for this and nothing else.
 *
 * No chart here on purpose — one chart per act, and this act's argument
 * isn't quantitative.
 */
export default function PageBetterToy() {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <Beat
          seed="every-mom-knows"
          avatar="momm-showing-kid-hobby"
          line="Every mom knows —"
          i={0}
        />
        <Beat
          seed="better-toy"
          avatar="momm-teaching-kid-hobby"
          line="You don't take the toy away. You give a better one."
          i={1}
        />
      </div>
    </section>
  );
}

function Beat({
  seed,
  avatar,
  line,
  i,
}: {
  seed: string;
  avatar: AvatarName;
  line: string;
  i: number;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Note
        seed={seed}
        paper="lined"
        fasten="tape"
        hand
        delay={i * 0.12}
        className="w-full max-w-[20rem]"
      >
        <div className="px-6 py-5">
          <p className="text-2xl leading-[34px] md:text-[1.9rem]">
            <WordReveal text={line} />
          </p>
        </div>
      </Note>
      <Avatar
        name={avatar}
        enter
        delay={i * 0.12 + 0.1}
        className="h-40 sm:h-48 md:h-56"
        sizes="(max-width: 768px) 70vw, 34vw"
      />
    </div>
  );
}
