/**
 * Deciding what a gist sync should do without silently destroying work.
 *
 * `lastSyncedAt` is the `updatedAt` of the version both this browser and the gist agreed on at the last
 * successful sync (stored per browser). A side "changed" if its `updatedAt` moved past that point.
 */
import { isEmptyProgress, sameProgress, type ProgressState } from "./state";

export type SyncDecision =
  | { kind: "noop"; agreedAt: string | null }
  | { kind: "push" }
  | { kind: "pull" }
  | { kind: "conflict"; reason: "first-sync" | "both-changed" };

export function decideSync(local: ProgressState, remote: ProgressState | null, lastSyncedAt: string | null): SyncDecision {
  if (!remote) return local.updatedAt && !isEmptyProgress(local) ? { kind: "push" } : { kind: "noop", agreedAt: lastSyncedAt };
  if (sameProgress(local, remote)) {
    const agreedAt = [local.updatedAt, remote.updatedAt].filter((x): x is string => !!x).sort().pop() ?? lastSyncedAt;
    return { kind: "noop", agreedAt };
  }
  if (isEmptyProgress(local)) return { kind: "pull" };
  if (isEmptyProgress(remote)) return { kind: "push" };
  if (!lastSyncedAt) return { kind: "conflict", reason: "first-sync" };
  const localChanged = (local.updatedAt ?? "") > lastSyncedAt;
  const remoteChanged = (remote.updatedAt ?? "") > lastSyncedAt;
  if (localChanged && !remoteChanged) return { kind: "push" };
  if (remoteChanged && !localChanged) return { kind: "pull" };
  return { kind: "conflict", reason: "both-changed" };
}
