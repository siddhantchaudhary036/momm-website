import PaperAct from "@/components/paper/PaperAct";
import PageMeetMomm from "@/components/scenes/PageMeetMomm";
import PagePayoff from "@/components/scenes/PagePayoff";
import PageReckoning from "@/components/scenes/PageReckoning";
import PaperOpen from "@/components/scenes/PaperOpen";
import Scene00Hero from "@/components/scenes/Scene00Hero";
import Scene07Waitlist from "@/components/scenes/Scene07Waitlist";
import Scene08Footer from "@/components/scenes/Scene08Footer";
import SkipToWaitlist from "@/components/ui/SkipToWaitlist";

/**
 * The whole argument, on one continuous lit cream ground (`PageBackground`),
 * with her voice and her data in soft clay panels on top of it:
 *
 *   HERO    the open — her line, and the product as a clay centrepiece
 *   CLAY    her arithmetic — the reckoning
 *   CLAY    the product — she notices, she sets the rules
 *   CLAY    the drawing she put up
 *   CLAY    the ask, and a phone with Instagram shut
 *   CLAY    the sign-off
 *
 * There is no dark room and no door any more; acts sit flush on the same
 * cream and the seam between them is spacing and the panels themselves, not a
 * drawn edge.
 *
 * Pacing alternates deliberately. Static sections read fast and cheap;
 * pinned scrubs are expensive and reserved for the beats that earn them.
 */
export default function Home() {
  return (
    <main className="relative">
      <Scene00Hero />

      <PaperAct>
        <PaperOpen />
        <PageReckoning />
      </PaperAct>

      <PaperAct>
        <PageMeetMomm />
      </PaperAct>

      <PaperAct>
        <PagePayoff />
      </PaperAct>

      <PaperAct>
        <Scene07Waitlist />
      </PaperAct>

      <PaperAct>
        <Scene08Footer />
      </PaperAct>

      {/* rides above all of it, from the end of the hero to the ask */}
      <SkipToWaitlist />
    </main>
  );
}
