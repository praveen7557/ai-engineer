/**
 * Content model for The AI Engineer (build-first roadmap).
 *
 * IDs are explicit, stable strings. Progress is keyed by them, so never derive them from titles and
 * never change an ID once shipped.
 *
 * ID conventions (lowercase, kebab-case slugs):
 *   concept     `${chapterId}.c.${slug}`   e.g. "ch4.c.hybrid-search"
 *   resource    `${chapterId}.r.${slug}`   e.g. "ch4.r.contextual-retrieval"
 *   mission     `${chapterId}.m${k}`       k restarts at 1 in every chapter, e.g. "ch7.m2"
 *   milestone   `${missionId}.s${n}`       e.g. "ch7.m2.s3"
 *   stretch     `${missionId}.x${n}`       e.g. "ch7.m2.x1"
 *   trial       `${chapterId}.t.${slug}`   e.g. "ch4.t.debugging"
 */

export type ResourceKind =
  | "Video" | "Course" | "Docs" | "Article" | "Paper" | "Book" | "Tool" | "Code" | "Spec" | "Tutorial";

/** must = needed for the build (counts toward progress) · reference = consult while implementing · bonus = optional depth. */
export type ResourceUse = "must" | "reference" | "bonus";

export type Skill = "knowledge" | "building" | "systemDesign" | "evaluation" | "production";

export type TrialDimension =
  | "Understanding" | "Implementation" | "Debugging" | "Explanation" | "Evaluation" | "Tradeoffs" | "Independence";

export interface Concept {
  id: string;
  title: string;
  /** One or two sentences: what it is and why it matters for this week's build. */
  summary: string;
  /** Estimated study time in minutes (typically 15–60). */
  minutes: number;
  /** Ids of resources that teach this concept (most useful first): this chapter's own, or ones in its `revisit` list. May be empty when the build itself teaches it. */
  resources?: string[];
  /** Optional depth (e.g. SDKs, subagents): tracked and rewarded, but not required for week completion or progress. */
  optional?: boolean;
}

export interface ConceptGroup {
  title: string;
  concepts: Concept[];
}

export interface WeekBuild {
  /** What to build this week (the "Deliverable" column). */
  deliverable: string;
  /** What to keep as proof (the "Evidence to keep" column). */
  evidence: string;
}

export interface Week {
  /** Absolute week number, 1–24. */
  number: number;
  title: string;
  /** One sentence on what this week is about. */
  focus: string;
  build: WeekBuild;
  /** 1–2 groups, 3–5 concepts in total: only what the build needs. */
  groups: ConceptGroup[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  kind: ResourceKind;
  /** Estimated hours of focused reading/viewing (not build time). */
  hours: number;
  use: ResourceUse;
  /** What to focus on and why. */
  note: string;
  /** First week this resource supports. */
  week: number;
  /** Last week, when it spans a range (e.g. 1–3). */
  weekEnd?: number;
  /** Marked as a suggested addition in the roadmap document. */
  suggested?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  /** Estimated minutes of work. */
  minutes: number;
  /** The week this milestone belongs to (within the chapter). */
  week: number;
  /**
   * When set, this milestone only applies under a condition (e.g. "Only if error analysis shows a single call
   * can't handle the task"). The learner can mark it Completed, or Not applicable with a written reason; both
   * count as resolved so a justified simpler implementation isn't penalized.
   */
  conditional?: string;
}

export interface Mission {
  id: string;
  /** Global mission number across the roadmap (1..N), shown as "MISSION 07". */
  number: number;
  title: string;
  /** e.g. "Full-stack", "Backend", "Python lab", "Security". */
  track: string;
  hours: number;
  /** Major missions award a completion bonus and count toward achievements. */
  major: boolean;
  objective: string;
  requirements: string[];
  milestones: Milestone[];
  deliverable: string;
  /** 2–3 reflection questions. */
  reflection: string[];
  stretch: Milestone[];
}

export interface TrialCriterion {
  id: string;
  dimension: TrialDimension;
  /** "You can …" statement the learner must honestly meet. */
  statement: string;
}

export interface ChapterNote {
  /** e.g. "Lab boundary", "Bonus build", "Apply earlier resources", "Deployment". */
  label: string;
  text: string;
  /** Show only in this week's panel; omit for chapter-wide notes. */
  week?: number;
}

export interface Chapter {
  id: string;            // "ch1".."ch8"
  number: number;        // 1..8
  title: string;
  /** Short evocative-but-plain line, ≤ 10 words. */
  tagline: string;
  /** The italic summary line under the chapter heading. */
  description: string;
  why: string;
  /** 2–4 consecutive weeks. */
  weeks: Week[];
  majorObjective: string;
  /** "Done when" from the roadmap. */
  doneWhen: string;
  /** "Engineering decision" from the roadmap. */
  decision: string;
  resources: Resource[];
  /** Resource ids from earlier chapters worth revisiting here (shown as links, not re-counted). */
  revisit?: string[];
  missions: Mission[];
  trial: TrialCriterion[];
  notes?: ChapterNote[];
  /** Relative weight of this chapter toward each end-state capability (0–3). */
  skills: Partial<Record<Skill, number>>;
}

export interface ContinuingSource {
  title: string;
  url: string;
  kind: ResourceKind;
  note: string;
  category: "Releases" | "Research" | "Practice" | "Community" | "Deep dives";
}

/** A specialization to pursue after week 24, built from existing sources. */
export interface ContinuingTrack {
  name: string;
  /** Who this is for and what it deepens, one or two sentences. */
  summary: string;
  items: ShelfItem[];
}

export interface ShelfItem {
  title: string;
  url: string;
  kind: ResourceKind;
  note: string;
}

export interface Guide {
  intro: string;
  audience: string;
  howToUse: { label: string; text: string }[];
  resourceAllowance: string;
  prerequisites: string;
  deployment: string;
  /** How to read the time estimates: milestone slices vs total project work vs reading vs evaluation vs buffer. */
  timeEstimates: { label: string; text: string }[];
  shelf: ShelfItem[];
  continuingIntro: string;
}

export interface SetupItem {
  id: string; // "setup.<slug>"
  title: string;
  note: string;
}
