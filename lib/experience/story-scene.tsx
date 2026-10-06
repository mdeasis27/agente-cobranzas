"use client";
import type { CSSProperties } from "react";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { useReducedMotion } from "@/design-system/demo/project-story";
import { AT_RISK_DAYS, type BookStatus } from "./book";
import { BIG_BALANCE_CENTS } from "./contact-policy";
import type { MissionResult } from "./mission";
import { revealedAccounts, revealedCounts, toneLineDay } from "./scene-state";
import { STORY } from "./story";

// Ruler: 0 to 60 days late in a 400 x 300 box; accounts sit every 5 days (STEP_X apart).
const W = 400;
const MAX_DAY = 60;
const x = (day: number) => 26 + day * 5.7;
const STEP_X = 28.5;
const CARD_Y = 150;
const RULER_Y = 172;
const CALL_Y = 70;
const MAIL_Y = 240;

const FILL: Record<BookStatus, string> = { prioritized: "fill-success", reminder: "fill-info", atRisk: "fill-danger" };
const TEXT: Record<BookStatus, string> = { prioritized: "text-success", reminder: "text-info", atRisk: "text-danger" };
// Labels get a halo in the surface color so connector lines never cut through them.
const HALO: CSSProperties = { paintOrder: "stroke" };
const PHONE = "M-8-9c2-2 4-2 5 0l2 4c1 2 0 3-1 4l-1 1c1 3 3 5 6 6l1-1c1-1 2-2 4-1l4 2c2 1 2 3 0 5l-2 2c-3 2-10-1-15-6s-8-12-6-15z";

export function CobranzasStoryScene({ frame, result, thresholdDays, locale }: { frame: PlaybackFrame<TraceEvent>; result: MissionResult; thresholdDays: number; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const n = result.items.length;
  const revealed = revealedAccounts(frame, n, reduced);
  const counts = revealedCounts(result.items, revealed);
  const done = revealed === n;
  const headline = !done && counts.atRisk === 0 ? copy.arriving : copy.atRiskOf(counts.atRisk);
  const progress = copy.progress(revealed, counts.prioritized);
  const lineX = x(toneLineDay(thresholdDays));
  const toneLeft = lineX > W / 2;
  // Cards slide in, then the outcome lands; reduced motion shows the final state at once.
  const move: CSSProperties | undefined = reduced ? undefined : { transition: "transform .7s cubic-bezier(.2,.8,.2,1), opacity .3s" };
  const land: CSSProperties | undefined = reduced ? undefined : { transition: "opacity .35s .7s, fill .3s .7s" };

  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <svg viewBox={`0 0 ${W} 300`} className="block h-auto w-full" role="img" aria-label={`${copy.toneLine(thresholdDays)}. ${progress}. ${headline}.`}>
      <text x={6} y={16} fontSize={15} fontWeight={600} className="fill-success">{copy.callLane}</text>
      <text x={6} y={292} fontSize={15} fontWeight={600} className="fill-info">{copy.reminderLane}</text>

      <rect x={x(AT_RISK_DAYS) - STEP_X / 2} y={128} width={x(MAX_DAY) - x(AT_RISK_DAYS) + STEP_X} height={70} className="fill-danger" opacity={0.1} />
      <text x={x(MAX_DAY) + STEP_X / 2} y={124} fontSize={13} textAnchor="end" strokeWidth={4} style={HALO} className="fill-danger stroke-surface">{copy.atRiskZone}</text>

      <line x1={x(0) - 14} y1={RULER_Y} x2={x(MAX_DAY) + 14} y2={RULER_Y} strokeWidth={2} className="stroke-muted-foreground" />
      {Array.from({ length: MAX_DAY / 5 + 1 }, (_, i) => i * 5).map(d => <g key={d}>
        <line x1={x(d)} y1={RULER_Y - 4} x2={x(d)} y2={RULER_Y + 4} className="stroke-muted-foreground" />
        {d % 10 === 0 ? <text x={x(d)} y={RULER_Y + 19} fontSize={13} textAnchor="middle" className="fill-muted-foreground">{d}</text> : null}
      </g>)}

      <line x1={lineX} y1={42} x2={lineX} y2={RULER_Y + 6} strokeWidth={2.5} strokeDasharray="6 4" className="stroke-warning" />
      <text x={toneLeft ? lineX + 4 : lineX - 4} y={36} fontSize={14} fontWeight={600} textAnchor={toneLeft ? "end" : "start"} strokeWidth={4} style={HALO} className="fill-warning stroke-surface">{copy.toneLine(thresholdDays)}</text>

      {result.items.map((a, i) => {
        const on = i < revealed;
        const cx = x(a.daysPastDue);
        const call = a.status === "prioritized";
        return <g key={a.id}>
          <g style={{ ...move, opacity: on ? 1 : 0, transform: `translate(${on ? cx : -20}px, ${CARD_Y}px)` }}>
            <rect x={-11} y={-10} width={22} height={20} rx={3} strokeWidth={1} style={land} className={`stroke-muted-foreground ${on ? FILL[a.status] : "fill-border"}`} />
            <rect x={-11} y={-5} width={22} height={4} className="fill-background" opacity={0.5} />
          </g>
          <g style={{ ...land, opacity: on ? 1 : 0 }} className={TEXT[a.status]}>
            {call
              ? <>
                <path d={PHONE} transform={`translate(${cx} ${CALL_Y}) scale(.8)`} fill="currentColor" />
                <line x1={cx} y1={CALL_Y + 14} x2={cx} y2={CARD_Y - 12} stroke="currentColor" strokeWidth={1.5} opacity={0.6} />
                {a.amountCents >= BIG_BALANCE_CENTS ? <text x={cx} y={52} fontSize={12} textAnchor="middle" strokeWidth={4} style={HALO} className="fill-success stroke-surface">{copy.bigBalance}</text> : null}
              </>
              : <>
                <line x1={cx} y1={RULER_Y + 24} x2={cx} y2={MAIL_Y - 9} stroke="currentColor" strokeWidth={1.5} opacity={0.6} />
                <g transform={`translate(${cx} ${MAIL_Y})`} fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x={-10} y={-7} width={20} height={14} rx={2} />
                  <path d="M-10-6l10 7 10-7" />
                </g>
                {a.status === "atRisk" ? <path d={`M${cx - 6} ${MAIL_Y + 14}l12 12M${cx + 6} ${MAIL_Y + 14}l-12 12`} stroke="currentColor" strokeWidth={3} strokeLinecap="round" /> : null}
              </>}
          </g>
        </g>;
      })}
    </svg>
    <p className="mt-4 font-mono text-xs text-muted-foreground" aria-hidden="true">{progress}</p>
    <p className="mt-2 font-mono text-2xl font-semibold tracking-tight" role="status">{headline}</p>
  </StoryStage>;
}
