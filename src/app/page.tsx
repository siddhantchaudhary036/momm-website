import PaperAct from "@/components/paper/PaperAct";
import PageMeetMomm from "@/components/scenes/PageMeetMomm";
import PagePayoff from "@/components/scenes/PagePayoff";
import PageReckoning from "@/components/scenes/PageReckoning";
import PageTurn from "@/components/scenes/PageTurn";
import PaperOpen from "@/components/scenes/PaperOpen";
import Scene00Hero from "@/components/scenes/Scene00Hero";
import Scene07Waitlist from "@/components/scenes/Scene07Waitlist";
import Scene08Footer from "@/components/scenes/Scene08Footer";

/**
 * The site has an inside and an outside.
 *
 *   DOOR    the hero — one note taped to the fridge, in a room
 *     ↓     the push-in: the sheet grows until it is everything
 *   PAPER   her hand — the reckoning, and the turn
 *     ↓     the sheet's bottom edge, and the door under it again
 *   DOOR    the product — she notices, she sets the rules
 *   PAPER   the drawing she put up, taped at both corners
 *   DOOR    the ask, and the bottom of the door
 *
 * That alternation is the structure the previous running order didn't
 * have. Seven sections all on one surface is a list; the same seven with
 * two changes of material is an argument that goes somewhere and comes
 * back, and it means the three moments worth the reader's whole screen —
 * the numbers, the turn, the drawing — are separated by something other
 * than more scrolling.
 *
 * Pacing still alternates deliberately inside each act. Static sections
 * read fast and cheap; pinned scrubs are expensive and reserved for the
 * beats that earn them.
 */
export default function Home() {
  return (
    <main className="relative">
      <Scene00Hero />

      <PaperAct edges="bottom" seed="reckoning">
        <PaperOpen />
        <PageReckoning />
        <PageTurn />
      </PaperAct>

      <PageMeetMomm />

      <PaperAct edges="both" fasten seed="drawing" className="my-[12vh]">
        <PagePayoff />
      </PaperAct>

      <Scene07Waitlist />
      <Scene08Footer />
    </main>
  );
}
