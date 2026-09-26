/**
 * Curriculum ID migrations. When a tracked item is split or replaced, map the old id to the ids that
 * inherit its completion. Progress saved before the change keeps its credit on load (see engine/state.ts).
 * Keep entries forever; they're cheap and old progress files may still reference the old ids.
 */
export const ID_MIGRATIONS: Record<string, string[]> = {
  "ch4.m1.s8": ["ch4.m1.s8", "ch4.m1.s9", "ch4.m1.s10", "ch4.m1.s11", "ch4.m1.s12"],
  // The embedding-migration stretch became required work (week 12).
  "ch4.m1.x2": ["ch4.m1.s12"],
  // "Deploy the remote server" moved from a stretch goal into the required remote-deployment milestone.
  "ch6.m2.x1": ["ch6.m2.s1"],
};
