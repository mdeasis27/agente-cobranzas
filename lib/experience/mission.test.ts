import assert from "node:assert/strict";
import test from "node:test";
import { runMission } from "./mission";

test("reveals the 12 accounts three at a time and compares with no day rule", async () => {
  const r = await runMission({ thresholdDays: 50 }, new AbortController().signal, () => {});
  assert.equal(r.trace.length, 4);
  assert.deepEqual(r.trace[0].evidenceIds, ["account-1", "account-2", "account-3"]);
  assert.deepEqual(r.result.comparison, { mine: 1, noDayRule: 3 });
});

test("rejects a fractional threshold and stops when aborted", async () => {
  await assert.rejects(runMission({ thresholdDays: 12.5 }, new AbortController().signal, () => {}));
  const c = new AbortController(); c.abort();
  await assert.rejects(runMission({ thresholdDays: 50 }, c.signal, () => {}));
});
