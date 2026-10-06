import assert from "node:assert/strict";
import test from "node:test";
import { decideContact } from "./contact-policy";
import { ACCOUNTS, runBook } from "./book";

test("an explicit day threshold overrides the policy; without it the policy still maps to 15 or 30", () => {
  const a = { daysPastDue: 40, amountCents: 25000, segment: "standard" as const, policy: "balanced" as const };
  assert.equal(decideContact(a).priority, "high");
  assert.equal(decideContact({ ...a, thresholdDays: 45 }).priority, "low");
  assert.equal(decideContact({ ...a, daysPastDue: 20, policy: "early" }).priority, "high");
  assert.throws(() => decideContact({ ...a, thresholdDays: 1.5 }));
});

test("12 fictional accounts; at 50 days the 45-day account stays in the normal queue", () => {
  assert.equal(ACCOUNTS.length, 12);
  assert.deepEqual(runBook(50).counts, { prioritized: 3, reminder: 8, atRisk: 1 });
  assert.deepEqual(runBook(45).counts, { prioritized: 4, reminder: 8, atRisk: 0 });
  assert.equal(runBook(30).counts.prioritized, 7);
});

test("money stays in integer cents and the big balance is prioritized by amount", () => {
  for (const a of ACCOUNTS) assert.ok(Number.isInteger(a.amountCents));
  assert.equal(runBook(60).items.find(i => i.id === "account-3")?.status, "prioritized");
});

test("sweep: both bet answers are reachable, and the default (50) leaves an account at risk", () => {
  const answers = new Set<boolean>();
  for (let d = 5; d <= 60; d += 5) answers.add(runBook(d).counts.atRisk > 0);
  assert.deepEqual([...answers].sort(), [false, true]);
  assert.equal(runBook(50).counts.atRisk > 0, true);
});

test("each routed account carries its balance in integer cents for the scene", () => {
  const items = runBook(50).items;
  assert.equal(items.find(i => i.id === "account-3")?.amountCents, 150_000);
  for (const i of items) assert.ok(Number.isInteger(i.amountCents));
});
