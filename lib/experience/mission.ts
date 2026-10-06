import type { DemoAdapter, TraceEvent } from "@/design-system/demo/types";
import { runBook, type BookResult } from "./book";

export type MissionInput = { thresholdDays: number };
/** comparison counts at-risk accounts left in the normal queue. */
export type MissionResult = BookResult & { comparison: { mine: number; noDayRule: number } };

const STEP = 3;
const NO_DAY_RULE = 10_000;

/** Runs the 12 accounts at one day threshold; the trace reveals them three at a time. */
export const runMission: DemoAdapter<MissionInput, MissionResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  const book = runBook(input.thresholdDays);
  const trace: TraceEvent[] = [];
  for (let i = 0; i < book.items.length; i += STEP) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const n = i / STEP + 1;
    const event: TraceEvent = { id: `batch-${n}`, step: n, kind: "decision", messageKey: `batch.${n}`, timestampMs: performance.now() - startedAt, evidenceIds: book.items.slice(i, i + STEP).map(a => a.id) };
    trace.push(event);
    onEvent(event);
  }
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  return { input, result: { ...book, comparison: { mine: book.counts.atRisk, noDayRule: runBook(NO_DAY_RULE).counts.atRisk } }, trace, executionMs: performance.now() - startedAt, mode: "local" };
};
