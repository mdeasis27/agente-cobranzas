import assert from "node:assert/strict";
import test from "node:test";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { runBook } from "./book";
import { bookCells, revealedAccounts } from "./scene-state";

test("final tape counts match the book", () => {
  assert.deepEqual(tapeCounts(bookCells(runBook(50).items, 12)), { served: 3, rerouted: 8, lost: 1, pending: 0 });
});

test("reveals three accounts per step, all when complete or under reduced motion", () => {
  assert.equal(revealedAccounts({ visible: 1, total: 4, complete: false }, 12, false), 3);
  assert.equal(revealedAccounts({ visible: 4, total: 4, complete: true }, 12, false), 12);
  assert.equal(revealedAccounts({ visible: 1, total: 4, complete: false }, 12, true), 12);
});
