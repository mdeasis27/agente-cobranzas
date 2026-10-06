"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { FlowDiagram, type FlowTone } from "@/design-system/demo/flow-diagram";
import type { MissionResult } from "./mission";
import { bookCells, revealedAccounts } from "./scene-state";
import { STORY } from "./story";

const POS = { accounts: { x: 10, y: 60 }, rule: { x: 200, y: 60 }, call: { x: 420, y: 5 }, queue: { x: 420, y: 115 } } as const;

export function CobranzasStoryScene({ frame, result, locale }: { frame: PlaybackFrame<TraceEvent>; result: MissionResult; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const cells = bookCells(result.items, revealedAccounts(frame, result.items.length, reduced));
  const counts = tapeCounts(cells);
  const tone: Record<keyof typeof POS, FlowTone> = { accounts: "idle", rule: "active", call: counts.served > 0 ? "success" : "idle", queue: counts.lost > 0 ? "danger" : "idle" };
  const nodes = (Object.keys(POS) as (keyof typeof POS)[]).map(id => ({ id, ...POS[id], ...copy.nodes[id], tone: tone[id] }));
  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <FlowDiagram nodes={nodes} width={580} height={195} ariaLabel={copy.atRiskOf(counts.lost)} statusLabels={copy.statusLabels} edges={[
      { from: "accounts", to: "rule" },
      { from: "rule", to: "call", tone: counts.served > 0 ? "success" : undefined },
      { from: "rule", to: "queue", tone: counts.lost > 0 ? "danger" : undefined },
    ]} />
    <div className="mt-6">
      <OutcomeTape cells={cells} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={12} />
      <p className="mt-4 font-mono text-2xl font-semibold tracking-tight">{copy.atRiskOf(counts.lost)}</p>
    </div>
  </StoryStage>;
}
