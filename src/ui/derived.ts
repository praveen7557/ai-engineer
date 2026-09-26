import { useMemo } from "react";
import {
  bond, companionLine, earnedAchievements, focusChapter, isEndState, moodFor, nextMilestone, nextSteps, overallPct, pace, rankFor, stageFor, streak, xpOf, xpThisWeek,
} from "../engine/progress";
import { useStore } from "../store";

/** Everything the UI derives from state, memoized per state change. */
export function useDerived() {
  const { state } = useStore();
  return useMemo(() => {
    const xp = xpOf(state);
    const r = rankFor(xp.total);
    const b = bond(state);
    const st = stageFor(b);
    return {
      xp: xp.total,
      rank: r.rank,
      nextRank: r.next,
      rankProgress: r.progress,
      bond: b,
      stage: st.stage,
      nextStage: st.next,
      stageProgress: st.progress,
      mood: moodFor(state),
      line: companionLine(state),
      overall: overallPct(state),
      pace: pace(state),
      streak: streak(state),
      xpWeek: xpThisWeek(state),
      tasksDone: Object.keys(state.done).length,
      focus: focusChapter(state),
      next: nextSteps(state, 6),
      nextMilestone: nextMilestone(state),
      achievements: earnedAchievements(state),
      endState: isEndState(state),
    };
  }, [state]);
}
