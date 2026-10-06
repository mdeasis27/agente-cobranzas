import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import type { BookStatus } from "./book";

/** Status counts over the accounts already on the ruler. */
export function revealedCounts(items: readonly { status: BookStatus }[], revealed: number): Record<BookStatus, number> {
  const counts: Record<BookStatus, number> = { prioritized: 0, reminder: 0, atRisk: 0 };
  for (const a of items.slice(0, revealed)) counts[a.status]++;
  return counts;
}

export function revealedAccounts(frame: { visible: number; total: number; complete: boolean }, n: number, reducedMotion: boolean): number {
  if (reducedMotion || frame.complete || frame.total === 0) return n;
  return Math.ceil((n * frame.visible) / frame.total);
}

/** Accounts sit every 5 days; the dashed line goes halfway before the first day that gets a call. */
export function toneLineDay(thresholdDays: number): number {
  return Math.max(0, thresholdDays - 2.5);
}

export const COMPLETE_FRAME: PlaybackFrame<TraceEvent> = { visible: 0, total: 0, event: undefined, complete: true };
