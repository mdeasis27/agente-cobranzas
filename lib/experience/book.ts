import { decideContact } from "./contact-policy";
import type { ExperienceInput } from "./types";

export type BookStatus = "prioritized" | "reminder" | "atRisk";
export type Account = { id: string } & Omit<ExperienceInput, "policy" | "thresholdDays">;

/** Days past due from which an account is at real risk of not being paid. */
export const AT_RISK_DAYS = 45;

/** Twelve fictional accounts, 0 to 55 days late. Balances are integer cents. */
export const ACCOUNTS: Account[] = Array.from({ length: 12 }, (_, i) => ({
  id: `account-${i + 1}`,
  daysPastDue: i * 5,
  amountCents: i === 2 ? 150_000 : 25_000,
  segment: i === 4 || i === 7 ? "sensitive" : "standard",
}));

export type BookResult = { items: { id: string; daysPastDue: number; status: BookStatus }[]; counts: Record<BookStatus, number> };

/** Runs every account through decideContact with one day threshold. */
export function runBook(thresholdDays: number): BookResult {
  const items = ACCOUNTS.map(({ id, ...a }) => {
    const high = decideContact({ ...a, policy: "balanced", thresholdDays }).priority === "high";
    const status: BookStatus = high ? "prioritized" : a.daysPastDue >= AT_RISK_DAYS ? "atRisk" : "reminder";
    return { id, daysPastDue: a.daysPastDue, status };
  });
  const counts: Record<BookStatus, number> = { prioritized: 0, reminder: 0, atRisk: 0 };
  for (const i of items) counts[i.status]++;
  return { items, counts };
}
