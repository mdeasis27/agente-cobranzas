import assert from "node:assert/strict";
import test from "node:test";
import { runBook } from "./book";
import { revealedAccounts, revealedCounts, toneLineDay } from "./scene-state";

test("final counts match the book; hidden accounts are not counted", () => {
  assert.deepEqual(revealedCounts(runBook(50).items, 12), { prioritized: 3, reminder: 8, atRisk: 1 });
  assert.deepEqual(revealedCounts(runBook(50).items, 3), { prioritized: 1, reminder: 2, atRisk: 0 });
});

test("reveals three accounts per step, all when complete or under reduced motion", () => {
  assert.equal(revealedAccounts({ visible: 1, total: 4, complete: false }, 12, false), 3);
  assert.equal(revealedAccounts({ visible: 4, total: 4, complete: true }, 12, false), 12);
  assert.equal(revealedAccounts({ visible: 1, total: 4, complete: false }, 12, true), 12);
});

test("the tone line sits half a step before the threshold day, inside the ruler", () => {
  assert.equal(toneLineDay(50), 47.5);
  assert.equal(toneLineDay(5), 2.5);
  assert.equal(toneLineDay(0), 0);
});
