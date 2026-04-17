import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ── Rate limiting en memoria (suficiente para un portafolio) ──────────────────
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const ipStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

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

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
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

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY no configurado" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://agente-cobranzas-theta.vercel.app",
      "X-Title": "Agente de Cobranzas — Demo",
    },
  });

  let message: string;
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `Eres un agente de cobranzas profesional. Redacta mensajes de cobro en español,
directos pero respetuosos, adaptados al segmento del cliente y los días de mora.
Tono requerido: ${strategy.tone}.
Plantilla de referencia: "${strategy.template}".
Máximo 3 oraciones. Sin saludos largos. Termina con una acción clara. Solo texto plano, sin markdown.`,
        },
        {
          role: "user",
          content: `Cliente: ${client.name}
Segmento: ${client.segment}
Días de mora: ${client.days}
Monto original: $${client.amount.toLocaleString("es-CO")}
Deuda total: $${client.totalDebt.toLocaleString("es-CO")}

Redacta el mensaje de cobro.`,
        },
      ],
    });
    message = completion.choices[0].message.content?.trim() ?? "Por favor regulariza tu pago pendiente.";
  } catch (err) {
    console.error("[/api/demo] OpenRouter error:", err);
    return NextResponse.json(
      { error: "El modelo de IA no está disponible en este momento. Intenta de nuevo en unos segundos." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { message, tone: strategy.tone, remaining },
    { headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}
