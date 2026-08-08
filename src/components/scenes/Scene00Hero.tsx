"use client";

import Avatar from "../Avatar";
import WordReveal from "../WordReveal";
import ClayPanel from "../ui/ClayPanel";
import { HERO_ID } from "@/lib/anchors";
import { theme } from "@/theme";

/**
 * SCENE 00 — the open.
 *
 * The paper era opened in a drawn dark kitchen at 1am, with one note taped to
 * the fridge and a scroll-driven push-in that zoomed the note until it filled
 * the screen. Clay has no dark room and no door, so all of that is retired.
 *
 * The hero is now a warm cream stage — lit by the global `PageBackground` —
 * carrying her line on one large inflated clay panel, with Momm standing
 * beside it, grounded by her own contact shadow. Her voice is handwritten in
 * Caveat, the way it is everywhere on the site. The panel is the clay
 * centrepiece; the line she says is the product's entire pitch.
 *
 * No push-in means no pinned scroll runway here — her line lights itself once
 * as the page settles (WordReveal's self-sweep), and the reckoning that
 * follows owns the first real scroll scrub.
 */
export default function Scene00Hero() {
  return (
    <section
      id={HERO_ID}
      className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-24 md:flex-row md:gap-14"
    >
      <ClayPanel className="w-[min(88vw,34rem)]">
        <div
          className="px-9 py-10 font-hand md:px-12 md:py-14"
          style={{ color: theme.pen }}
        >
          <p className="text-[2.6rem] font-bold leading-[1.05] md:text-[3.6rem]">
            <WordReveal text="Get off your phone!" feather={2.5} dim={0.4} />
          </p>
          <p className="mt-4 text-right text-2xl opacity-80 md:text-3xl">— momm</p>
        </div>
      </ClayPanel>

      <Avatar
        name="momm-encouraging"
        priority
        className="h-56 md:h-80 lg:h-[26rem]"
        sizes="(max-width: 768px) 45vw, 26vw"
      />
    </section>
  );
}
