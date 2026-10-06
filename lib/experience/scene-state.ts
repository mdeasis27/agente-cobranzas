import type { TapeStatus } from "@/design-system/demo/outcome-tape";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import type { BookStatus } from "./book";

const CELL: Record<BookStatus, TapeStatus> = { prioritized: "served", reminder: "rerouted", atRisk: "lost" };

export function bookCells(items: readonly { status: BookStatus }[], revealed: number): TapeStatus[] {
  return items.map((a, i) => (i >= revealed ? "pending" : CELL[a.status]));
}

export function revealedAccounts(frame: { visible: number; total: number; complete: boolean }, n: number, reducedMotion: boolean): number {
  if (reducedMotion || frame.complete || frame.total === 0) return n;
  return Math.ceil((n * frame.visible) / frame.total);
}

export const COMPLETE_FRAME: PlaybackFrame<TraceEvent> = { visible: 0, total: 0, event: undefined, complete: true };
