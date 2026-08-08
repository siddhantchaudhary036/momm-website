"use client";

import Avatar from "../Avatar";
import WordReveal from "../WordReveal";
import ClayPanel from "../ui/ClayPanel";
import NotificationStack from "../ui/NotificationStack";
import { LimitsCard, StreakCard } from "../ui/cards";
import { theme } from "@/theme";

/**
 * PAGE 04 — meet momm.
 *
 * Was four identical panels each holding a shrunken phone. Now two
 * moments, each using the technique it's actually strongest in: she
 * arrives as notifications, and she structures you with real UI at real
 * size.
 *
 * Nothing here is inside a device frame. The interface is the artwork,
 * not a picture of the artwork on a prop.
 *
 * Her voice and her UI both sit on clay panels now; the one exception is the
 * notification card, which stays iOS glass because that surface belongs to
 * the operating system, not to momm.
 */
export default function PageMeetMomm() {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24">
      <h2
        className="mb-12 text-center font-sub text-2xl italic md:mb-16 md:text-4xl"
        style={{ color: theme.onDoor }}
      >
        So we built her into your phone.
      </h2>

      {/* 1 — she arrives, and keeps arriving */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-16">
        <div className="order-2 md:order-1 md:w-[19rem]">
          <ClayPanel className="w-full">
            <div className="px-7 py-6 font-hand" style={{ color: theme.pen }}>
              <p className="text-2xl leading-tight md:text-[1.7rem]">
                <WordReveal text="She notices. Immediately." />
              </p>
            </div>
          </ClayPanel>
          <Avatar
            name="momm-smirking"
            enter
            className="mt-6 h-32 md:h-40"
            sizes="(max-width: 768px) 30vw, 14vw"
          />
        </div>
        <div className="order-1 md:order-2">
          <NotificationStack />
        </div>
      </div>

      {/* 2 — she sets the rules, and keeps score */}
      <div className="mx-auto mt-24 flex max-w-5xl flex-col items-center gap-10 md:mt-32 md:flex-row md:justify-center md:gap-14">
        <LimitsCard />
        <div className="flex flex-col items-center gap-6">
          <ClayPanel className="w-[min(80vw,17rem)]">
            <div className="px-6 py-5 font-hand" style={{ color: theme.pen }}>
              <p className="text-xl leading-tight md:text-2xl">
                <WordReveal text="I set your limits. And I mean it." />
              </p>
            </div>
          </ClayPanel>
          <Avatar
            name="momm-suggesting"
            enter
            className="h-32 md:h-40"
            sizes="(max-width: 768px) 30vw, 14vw"
          />
        </div>
        <StreakCard />
      </div>
    </section>
  );
}
