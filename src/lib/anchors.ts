/**
 * Section anchors, shared between the sections that declare them and the
 * floating control that watches for them.
 *
 * They live here rather than on either component so that neither has to
 * import the other — a scene shouldn't have to reach into a UI widget to
 * learn its own id.
 */

/** the opening screen; the floating skip control stays out of its way */
export const HERO_ID = "hero";

/** the ask — also a deep link, so /#waitlist lands on the form */
export const WAITLIST_ID = "waitlist";
