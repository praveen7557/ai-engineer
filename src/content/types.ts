/**
 * Content model for The AI Engineer.
 *
 * IDs are explicit, stable strings — progress is keyed by them, so never derive
 * them from titles and never change an ID once shipped.
 *
 * ID conventions (all lowercase, kebab-case slugs):
 *   concept     `${chapterId}.c.${slug}`          e.g. "ch4.c.hybrid-search"
 *   resource    `${chapterId}.r.${slug}`          e.g. "ch4.r.contextual-retrieval"
 *   mission     `${chapterId}.m${n}`              e.g. "ch4.m1"
 *   milestone   `${missionId}.s${n}`              e.g. "ch4.m1.s3"
 *   stretch     `${missionId}.x${n}`              e.g. "ch4.m1.x1"
 *   trial       `${chapterId}.t.${slug}`          e.g. "ch4.t.debugging"
 */

export type ResourceKind =
  | "Video" | "Course" | "Docs" | "Article" | "Paper" | "Book" | "Tool" | "Code" | "Spec" | "Tutorial";

export type Skill = "knowledge" | "building" | "systemDesign" | "evaluation" | "production";

export type TrialDimension =
  | "Understanding" | "Implementation" | "Debugging" | "Explanation" | "Evaluation" | "Tradeoffs" | "Independence";

export interface Concept {
  id: string;
  title: string;
  /** One or two sentences: what it is and why it matters. */
  summary: string;
  /** Estimated study time in minutes (typically 15–90). */
  minutes: number;
}

export interface ConceptGroup {
  /** Short category label, e.g. "Context & prompting". */
  title: string;
  concepts: Concept[];
}

export interface Week {
  /** Absolute week number, 1–24. */
  number: number;
  /** Short title for the week, e.g. "Embeddings & vector search". */
  title: string;
  /** One sentence on what this week is about. */
  focus: string;
  groups: ConceptGroup[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  kind: ResourceKind;
  /** Estimated hours (0 for ongoing feeds). */
  hours: number;
  required: boolean;
  /** Why it's on the list / what to focus on. */
  note: string;
  /** Week number this resource best supports. */
  week: number;
}

export interface Milestone {
  id: string;
  title: string;
  /** Estimated minutes of work. */
  minutes: number;
}

export interface Mission {
  id: string;
  /** Global mission number across the roadmap (1..N), shown as "MISSION 07". */
  number: number;
  title: string;
  /** e.g. "Full-stack", "Backend", "Frontend", "Security", "Career". */
  track: string;
  hours: number;
  /** Major missions award a completion bonus and count toward the Builder/Field Tested achievements. */
  major: boolean;
  objective: string;
  requirements: string[];
  milestones: Milestone[];
  deliverable: string;
  /** 2–3 questions the learner answers in the mission's reflection box. */
  reflection: string[];
  stretch: Milestone[];
}

export interface TrialCriterion {
  id: string;
  dimension: TrialDimension;
  /** "You can …" statement the learner must honestly meet. */
  statement: string;
}

export interface Chapter {
  id: string;            // "ch1".."ch8"
  number: number;        // 1..8
  title: string;         // "RAG & Knowledge Systems"
  /** One-line tagline, evocative but plain, e.g. "Teach the model what it was never trained on." */
  tagline: string;
  description: string;
  /** Why this chapter matters for a working FE/BE engineer. */
  why: string;
  weeks: Week[];         // exactly 3 consecutive weeks
  /** The one thing you'll be able to do at the end of the chapter. */
  majorObjective: string;
  resources: Resource[];
  missions: Mission[];
  trial: TrialCriterion[];
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

export interface SetupItem {
  id: string; // "setup.<slug>"
  title: string;
  note: string;
}
