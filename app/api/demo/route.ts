import { NextRequest, NextResponse } from "next/server";
import { generateCollectionMessage } from "@/lib/openai-agent";
import { rateLimit } from "@/ai-kit/rate-limit";
import type { UserApiKey } from "@/ai-kit/types";

// ── Datos ficticios de demo ───────────────────────────────────────────────────
const DEMO_CLIENTS = [
  {
    id: "C001",
    name: "Ana García",
    days: 5,
    amount: 2_500_000,
    totalDebt: 2_625_000,
    segment: "retail",
  },
  {
    id: "C002",
    name: "Carlos Mendoza",
    days: 15,
    amount: 8_750_000,
    totalDebt: 9_187_500,
    segment: "premium",
  },
  {
    id: "C003",
    name: "María Rodríguez",
    days: 45,
    amount: 15_200_000,
    totalDebt: 16_720_000,
    segment: "empresarial",
  },
];

const STRATEGIES = [
  { min: 1,  max: 7,   tone: "suave",   template: "Recordatorio amigable de pago" },
  { min: 8,  max: 30,  tone: "firme",   template: "Notificación formal de mora" },
  { min: 31, max: 999, tone: "urgente", template: "Aviso de posibles acciones legales" },
];

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const { allowed, remaining } = rateLimit(ip, { maxRequests: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Vuelve en una hora." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
    );
  }

  const { clientId } = await req.json();
  const client = DEMO_CLIENTS.find((c) => c.id === clientId) ?? DEMO_CLIENTS[0];
  const strategy =
    STRATEGIES.find((s) => client.days >= s.min && client.days <= s.max) ??
    STRATEGIES[0];

  // BYOK: read from header
  const userApiKey = parseByokHeader(req.headers.get("x-user-api-key"));

  let result: { message: string; provider: string; model: string; latency_ms: number };
  try {
    result = await generateCollectionMessage({
      name: client.name,
      amount: client.amount,
      totalDebt: client.totalDebt,
      daysOverdue: client.days,
      segment: client.segment,
      tone: strategy.tone,
      messageTemplate: strategy.template,
      userApiKey: userApiKey ?? undefined,
    });
  } catch (err) {
    console.error("[/api/demo] LLM error:", err);
    return NextResponse.json(
      { error: "El modelo de IA no está disponible en este momento. Intenta de nuevo en unos segundos." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      message: result.message,
      tone: strategy.tone,
      remaining,
      provider: result.provider,
      model: result.model,
      latency_ms: result.latency_ms,
    },
    { headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}

function parseByokHeader(header: string | null): UserApiKey | null {
  if (!header) return null;
  try {
    const parsed = JSON.parse(header) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "provider" in parsed &&
      "key" in parsed &&
      typeof (parsed as { provider: unknown }).provider === "string" &&
      typeof (parsed as { key: unknown }).key === "string"
    ) {
      return parsed as UserApiKey;
    }
  } catch {
    // ignore malformed header
  }
  return null;
}
