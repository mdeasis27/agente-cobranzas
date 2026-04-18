"use client";

import { useState } from "react";

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const DEMO_CLIENTS = [
  {
    id: "C001",
    name: "Ana García",
    days: 5,
    amount: "$2,500,000",
    segment: "retail",
  },
  {
    id: "C002",
    name: "Carlos Mendoza",
    days: 15,
    amount: "$8,750,000",
    segment: "premium",
  },
  {
    id: "C003",
    name: "María Rodríguez",
    days: 45,
    amount: "$15,200,000",
    segment: "empresarial",
  },
];

const STACK = [
  {
    icon: "🗄️",
    name: "Neon Postgres",
    role: "Core bancario simulado",
    desc: "Clientes, préstamos, estrategia de contacto y log de actividad en tablas tipadas con Drizzle ORM.",
    color: "bg-teal-50 border-teal-200",
    iconBg: "bg-teal-100",
  },
  {
    icon: "🤖",
    name: "GPT-OSS · OpenRouter",
    role: "Generación de mensajes",
    desc: "Modelo gratuito vía OpenRouter. Personaliza cada mensaje según días de mora, monto y segmento del cliente.",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
  {
    icon: "✈️",
    name: "Telegram Bot API",
    role: "Canal de contacto",
    desc: "Bot gratuito sin aprobaciones. Tasa de apertura >90%. El cliente solo necesita iniciar el chat una vez.",
    color: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "☁️",
    name: "Vercel Cron",
    role: "Orquestación",
    desc: "Trigger diario a las 9:00 am. Todo corre dentro del mismo proyecto Next.js, sin servicios externos.",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
  },
];

const PIPELINE_NODES = [
  {
    icon: "📋",
    name: "Core bancario",
    desc: "Neon Postgres",
    bg: "bg-blue-100",
    border: "border-blue-300",
  },
  {
    icon: "🔍",
    name: "Filtro",
    desc: "Días vencidos > 0",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
  },
  {
    icon: "🤖",
    name: "Agente IA",
    desc: "LLM decide estrategia",
    bg: "bg-purple-100",
    border: "border-purple-300",
  },
  {
    icon: "💬",
    name: "Canal",
    desc: "Telegram Bot",
    bg: "bg-green-100",
    border: "border-green-300",
  },
  {
    icon: "📝",
    name: "Activity Log",
    desc: "Registra cada acción",
    bg: "bg-muted",
    border: "border-muted-foreground/20",
  },
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function segmentLabel(days: number): {
  label: string;
  color: string;
  border: string;
} {
  if (days <= 7)
    return {
      label: "Tono suave · 1–7 días",
      color: "text-green-700",
      border: "border-green-400",
    };
  if (days <= 30)
    return {
      label: "Tono firme · 8–30 días",
      color: "text-yellow-700",
      border: "border-yellow-400",
    };
  return {
    label: "Tono urgente · 31+ días",
    color: "text-red-700",
    border: "border-red-400",
  };
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("C001");
  const [message, setMessage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = DEMO_CLIENTS.find((c) => c.id === selectedId)!;

  async function handleGenerate() {
    setGenerating(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al generar el mensaje.");
      } else {
        setMessage(data.message);
      }
    } catch {
      setError("No se pudo conectar con la API. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  }

  const seg = segmentLabel(client.days);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── HERO ─────────────────────────────── */}
      <section className="border-b shadow-[var(--shadow-border-light)]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border shadow-[var(--shadow-border-light)] px-4 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Powered by GPT-OSS · OpenRouter · Telegram
          </div>

          <h1 className="mb-5 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Agente de Cobranzas{" "}
            <span className="text-primary">con IA</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Automatiza el ciclo completo: lee el core bancario → decide la
            estrategia → envía mensajes personalizados por WhatsApp.{" "}
            <strong className="text-foreground">Sin intervención humana.</strong>
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {[
              { icon: "⚡", text: "Trigger diario 9:00 am" },
              { icon: "📊", text: "Segmentación automática" },
              { icon: "✈️", text: "Telegram Bot API" },
              { icon: "🧠", text: "GPT-OSS por cliente" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PIPELINE ─────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-3 text-center text-2xl font-semibold text-foreground">
          Pipeline del workflow
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Cada paso corre en Next.js API Routes. El cron de Vercel se activa a las 9:00 am
          y procesa todos los clientes con mora activa.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PIPELINE_NODES.map((node, i) => (
            <div key={node.name} className="flex items-center gap-2">
              <div
                className={`flex flex-col items-center rounded-[var(--radius-md)] border-2 ${node.bg} ${node.border} px-4 py-3 text-center shadow-[var(--shadow-card)]`}
                style={{ minWidth: "110px" }}
              >
                <span className="text-2xl">{node.icon}</span>
                <span className="mt-1 text-xs font-semibold text-foreground">
                  {node.name}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">{node.desc}</span>
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <span className="text-xl text-muted-foreground select-none">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO INTERACTIVA ─────────────────── */}
      <section className="border-y shadow-[var(--shadow-border-light)] bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
            Simulador de mensajes
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Selecciona un cliente y observa qué mensaje generaría el agente. La
            Mensaje generado en tiempo real por IA (OpenRouter).
          </p>

          {/* Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Cliente de ejemplo
            </label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setMessage(null);
              }}
              className="w-full rounded-[var(--radius-md)] shadow-[var(--shadow-border-light)] bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {DEMO_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.days} días de mora — {c.amount} —{" "}
                  {c.segment}
                </option>
              ))}
            </select>
          </div>

          {/* Ficha del cliente */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: "Días de mora", value: `${client.days} días` },
              { label: "Monto adeudado", value: client.amount },
              { label: "Segmento", value: client.segment },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--radius-md)] shadow-[var(--shadow-card)] bg-card px-4 py-3"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Indicador de segmento */}
          <div
            className={`mb-6 rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium ${seg.color} ${seg.border} bg-muted/40`}
          >
            Estrategia seleccionada por IA: <strong>{seg.label}</strong>
          </div>

          {/* Botón */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full rounded-[var(--radius-md)] bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generando con GPT-OSS…
              </span>
            ) : (
              "Generar mensaje ✨"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Burbuja de Telegram */}
          {message && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <p className="text-xs uppercase tracking-wide text-primary font-medium">
                  Generado en vivo con GPT-OSS — Preview Telegram
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]">
                {/* Header Telegram */}
                <div className="flex items-center gap-3 bg-[#2CA5E0] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    {client.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {client.name}
                    </p>
                    <p className="text-xs text-blue-100">
                      vía @CobranzasBot
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-blue-100">
                    9:02 AM
                  </span>
                </div>
                {/* Chat background */}
                <div className="bg-[#EEF2F5] px-4 py-6">
                  {/* Burbuja enviada */}
                  <div className="ml-auto max-w-xs">
                    <div className="rounded-tl-2xl rounded-tr-sm rounded-b-2xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-sm leading-relaxed text-slate-800">
                        {message}
                      </p>
                      <div className="mt-2 flex items-center justify-end gap-1">
                        <span className="text-xs text-slate-400">9:02</span>
                        {/* Doble check Telegram */}
                        <svg
                          viewBox="0 0 16 11"
                          className="h-3.5 w-3.5 text-[#2CA5E0]"
                          fill="currentColor"
                        >
                          <path d="M11.071.653a.75.75 0 0 1 .072 1.058l-5.5 6.5a.75.75 0 0 1-1.09.041L1.47 5.168a.75.75 0 0 1 1.06-1.06l2.55 2.55L10.013.725a.75.75 0 0 1 1.058-.072z" />
                          <path d="M14.571.653a.75.75 0 0 1 .072 1.058l-5.5 6.5a.75.75 0 0 1-1.09.041L6.97 6.668a.75.75 0 0 1 1.06-1.06l1.05 1.05 4.433-5.282a.75.75 0 0 1 1.058-.072z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Datos ficticios. En producción el agente lee Neon Postgres y envía a Telegram real.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── STACK TÉCNICO ────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
          Stack técnico
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Todo dentro del mismo proyecto Next.js. Sin servicios externos de orquestación.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <div
              key={item.name}
              className={`rounded-[var(--radius-md)] border p-5 ${item.color}`}
            >
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl ${item.iconBg}`}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <p className="text-xs font-medium text-slate-500">{item.role}</p>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONFIGURACIÓN ────────────────────── */}
      <section className="border-t shadow-[var(--shadow-border-light)] bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
            Cómo está configurado
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Reproducible en cualquier proyecto Next.js en menos de 30 minutos.
          </p>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Crear el bot de Telegram",
                detail:
                  "Abre Telegram → busca @BotFather → /newbot → copia el token. Cada cliente debe enviarle un mensaje al bot para activar su chat_id.",
              },
              {
                step: "02",
                title: "Conectar Neon Postgres en Vercel",
                detail:
                  "Vercel Dashboard → Integrations → Neon → Connect. Inyecta DATABASE_URL automáticamente. Luego: npx drizzle-kit push && npm run db:seed.",
              },
              {
                step: "03",
                title: "Obtener API Key de OpenRouter",
                detail:
                  "Regístrate en openrouter.ai → API Keys → Create Key. El modelo GPT-OSS-20b es gratuito y funciona excelente en español.",
              },
              {
                step: "04",
                title: "Crear el bot de Telegram",
                detail:
                  "Abre Telegram → busca @BotFather → /newbot → copia el token. Cada cliente debe enviarle un mensaje al bot para activar su chat_id.",
              },
              {
                step: "05",
                title: "Agregar variables en Vercel y desplegar",
                detail:
                  "En Vercel → Settings → Environment Variables: OPENROUTER_API_KEY, TELEGRAM_BOT_TOKEN, CRON_SECRET. DATABASE_URL ya fue inyectada por Neon.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-[var(--radius-md)] shadow-[var(--shadow-card)] bg-card p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Variables */}
          <div className="mt-8 rounded-[var(--radius-md)] shadow-[var(--shadow-card)] bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Variables de entorno — configuradas en Vercel
            </p>
            <pre className="overflow-x-auto text-sm text-primary">
              <code>{`OPENROUTER_API_KEY=     # openrouter.ai → API Keys
TELEGRAM_BOT_TOKEN=    # @BotFather en Telegram
DATABASE_URL=          # inyectada por integración Neon en Vercel
CRON_SECRET=           # openssl rand -base64 32`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="border-t shadow-[var(--shadow-border-light)] px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          Demo interactiva — el workflow real corre en Next.js + Vercel Cron · Construido
          por{" "}
          <a
            href="https://manueldeasis.com"
            className="text-primary hover:underline"
          >
            Manuel De Asís
          </a>
        </p>
      </footer>
    </main>
  );
}
