import assert from "node:assert/strict";
import test from "node:test";
import { STORY } from "./story";
import { lintStory, storyStrings as strings } from "@/design-system/demo/copy-lint";

const keys = (o: unknown): string[] => o && typeof o === "object" && !Array.isArray(o) ? Object.entries(o).filter(([k]) => k !== "before" && k !== "after").flatMap(([k, v]) => [k, ...keys(v).map(x => `${k}.${x}`)]) : [];

test("same shape in English and Spanish", () => assert.deepEqual(keys(STORY.es), keys(STORY.en)));

test("no empty strings except the owner-supplied why note", () => {
  for (const locale of ["en", "es"] as const) {
    const { why, ...rest } = STORY[locale];
    assert.notEqual(why.title.trim(), "");
    for (const s of strings(rest)) assert.notEqual(s.trim(), "", `${locale}: empty string`);
  }
});

test("avoids AI-sounding patterns and brand names", () => {
  for (const locale of ["en", "es"] as const) assert.deepEqual(lintStory(STORY[locale]), [], locale);
});

test("the bet names the day line", () => {
  assert.match(STORY.es.tryIt.question(50), /línea en 50 días/);
  assert.match(STORY.en.tryIt.question(45), /line at 45 days/);
});

test("the comparison sentence is true at a gap, zero, one and a tie", () => {
  assert.equal(STORY.es.compare.sentence(1, 3), "Con tu línea, una cuenta en riesgo se quedó solo con un recordatorio. Sin regla de días, 3.");
  assert.match(STORY.es.compare.sentence(0, 3), /ninguna cuenta en riesgo se quedó/);
  assert.match(STORY.es.compare.sentence(3, 3), /las mismas 3 cuentas/);
  assert.match(STORY.en.compare.sentence(2, 3), /2 accounts at risk got only a reminder/);
});

test("at-risk count agrees in number", () => {
  assert.equal(STORY.es.scene.atRiskOf(1), "1 cuenta en riesgo solo recibió recordatorio");
  assert.equal(STORY.en.scene.atRiskOf(2), "2 accounts at risk got only a reminder");
});

test("scene progress line agrees in number", () => {
  assert.equal(STORY.es.scene.progress(12, 12, 3), "12 de 12 cuentas, 3 llamadas, 9 avisos");
  assert.equal(STORY.en.scene.progress(3, 7, 1), "3 of 7 accounts, 1 call, 2 reminders");
  assert.equal(STORY.es.scene.toneLine(50), "cambia el tono: día 50");
});
