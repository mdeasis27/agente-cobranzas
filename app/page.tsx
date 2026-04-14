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
    icon: "🔄",
    name: "N8N",
    role: "Orquestación",
    desc: "Workflow visual que conecta todas las piezas. Schedule trigger diario a las 9:00 am.",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    icon: "📊",
    name: "Google Sheets",
    role: "Core bancario simulado",
    desc: "Clientes, préstamos, estrategia de contacto y log de actividad en hojas conectadas.",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
  },
  {
    icon: "🤖",
    name: "OpenAI GPT-4o",
    role: "Generación de mensajes",
    desc: "Personaliza cada mensaje según días de mora, monto, segmento y historial del cliente.",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
  {
    icon: "💬",
    name: "WhatsApp Business API",
    role: "Canal principal",
    desc: "Integración vía Truora o Twilio. Tasa de apertura >90% vs. 20% del email.",
    color: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "📧",
    name: "Gmail",
    role: "Canal alternativo",
    desc: "Fallback cuando WhatsApp no está disponible. También registrado en el log.",
    color: "bg-red-50 border-red-200",
    iconBg: "bg-red-100",
  },
];

const PIPELINE_NODES = [
  {
    icon: "📋",
    name: "Core bancario",
    desc: "Google Sheets",
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
    desc: "GPT-4o decide estrategia",
    bg: "bg-purple-100",
    border: "border-purple-300",
  },
  {
    icon: "💬",
    name: "Canal",
    desc: "WhatsApp / Email",
    bg: "bg-green-100",
    border: "border-green-300",
  },
  {
    icon: "📝",
    name: "Activity Log",
    desc: "Registra cada acción",
    bg: "bg-gray-100",
    border: "border-gray-300",
  },
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function generateMessage(
  name: string,
  amount: string,
  days: number
): string {
  if (days <= 7) {
    return `Hola ${name}, te recordamos que tienes un pago pendiente de ${amount}. ¿Puedes realizarlo hoy? 😊`;
  } else if (days <= 30) {
    return `Estimado/a ${name}, tu préstamo de ${amount} tiene ${days} días de mora. Por favor realiza el pago a la brevedad para evitar cargos adicionales.`;
  } else {
    return `AVISO IMPORTANTE: ${name}, tu deuda de ${amount} lleva ${days} días sin pago. De no regularizar en 48h, iniciaremos acciones legales.`;
  }
}

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

  const client = DEMO_CLIENTS.find((c) => c.id === selectedId)!;

  function handleGenerate() {
    setGenerating(true);
    setMessage(null);
    // Simula un delay de "procesamiento IA"
    setTimeout(() => {
      setMessage(generateMessage(client.name, client.amount, client.days));
      setGenerating(false);
    }, 900);
  }

  const seg = segmentLabel(client.days);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-950/60 px-4 py-1.5 text-sm text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Powered by N8N + OpenAI GPT-4o
          </div>

          <h1 className="mb-5 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Agente de Cobranzas{" "}
            <span className="text-emerald-400">con IA</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            Automatiza el ciclo completo: lee el core bancario → decide la
            estrategia → envía mensajes personalizados por WhatsApp.{" "}
            <strong className="text-slate-200">Sin intervención humana.</strong>
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            {[
              { icon: "⚡", text: "Trigger diario 9:00 am" },
              { icon: "📊", text: "Segmentación automática" },
              { icon: "💬", text: "WhatsApp Business API" },
              { icon: "🧠", text: "GPT-4o por cliente" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1"
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
        <h2 className="mb-3 text-center text-2xl font-semibold text-white">
          Pipeline del workflow
        </h2>
        <p className="mb-10 text-center text-slate-400">
          Cada nodo corre en N8N. El workflow se activa a las 9:00 am y procesa
          todos los clientes con mora activa.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PIPELINE_NODES.map((node, i) => (
            <div key={node.name} className="flex items-center gap-2">
              <div
                className={`flex flex-col items-center rounded-xl border-2 ${node.bg} ${node.border} px-4 py-3 text-center shadow-sm`}
                style={{ minWidth: "110px" }}
              >
                <span className="text-2xl">{node.icon}</span>
                <span className="mt-1 text-xs font-semibold text-slate-800">
                  {node.name}
                </span>
                <span className="mt-0.5 text-xs text-slate-600">{node.desc}</span>
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <span className="text-xl text-slate-500 select-none">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO INTERACTIVA ─────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-2 text-center text-2xl font-semibold text-white">
            Simulador de mensajes
          </h2>
          <p className="mb-10 text-center text-slate-400">
            Selecciona un cliente y observa qué mensaje generaría el agente. La
            lógica corre 100% en el cliente — sin APIs.
          </p>

          {/* Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Cliente de ejemplo
            </label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setMessage(null);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3"
              >
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-1 font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Indicador de segmento */}
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium ${seg.color} ${seg.border} bg-white/5`}
          >
            Estrategia seleccionada por IA: <strong>{seg.label}</strong>
          </div>

          {/* Botón */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generando con GPT-4o…
              </span>
            ) : (
              "Generar mensaje ✨"
            )}
          </button>

          {/* Burbuja de WhatsApp */}
          {message && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
                Preview — WhatsApp Business
              </p>
              {/* Header tipo WA */}
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    {client.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {client.name}
                    </p>
                    <p className="text-xs text-emerald-200">
                      +56 9 •••• ••••
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-emerald-200">
                    9:02 AM
                  </span>
                </div>
                {/* Chat background */}
                <div className="bg-[#ECE5DD] px-4 py-6">
                  {/* Burbuja enviada */}
                  <div className="ml-auto max-w-xs">
                    <div className="rounded-tl-2xl rounded-tr-sm rounded-b-2xl bg-[#DCF8C6] px-4 py-3 shadow-sm">
                      <p className="text-sm leading-relaxed text-slate-800">
                        {message}
                      </p>
                      <div className="mt-2 flex items-center justify-end gap-1">
                        <span className="text-xs text-slate-500">9:02</span>
                        {/* Doble tick azul */}
                        <svg
                          viewBox="0 0 16 11"
                          className="h-3.5 w-3.5 text-blue-500"
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

              {/* Meta info */}
              <p className="mt-3 text-center text-xs text-slate-500">
                En producción, este mensaje lo genera GPT-4o basado en datos
                reales del cliente. Aquí está hardcodeado por segmento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── STACK TÉCNICO ────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-2xl font-semibold text-white">
          Stack técnico
        </h2>
        <p className="mb-10 text-center text-slate-400">
          Cinco herramientas, cero código servidor custom. Todo corre en N8N.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <div
              key={item.name}
              className={`rounded-xl border p-5 ${item.color}`}
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
      <section className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-2 text-center text-2xl font-semibold text-white">
            Cómo está configurado
          </h2>
          <p className="mb-10 text-center text-slate-400">
            Reproducible en cualquier instancia de N8N en menos de 30 minutos.
          </p>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Importar el workflow",
                detail:
                  "Importa workflows/main-workflow.json en N8N. El workflow incluye todos los nodos preconfigurados.",
              },
              {
                step: "02",
                title: "Configurar credenciales en N8N",
                detail:
                  "Google Sheets OAuth, OpenAI API Key, WhatsApp Business API (Truora o Twilio), Gmail.",
              },
              {
                step: "03",
                title: "Crear el Google Sheet",
                detail:
                  "Usa la plantilla en sheets/template.md. Crea 4 hojas: Customers, Loans, Contact_Strategy, Activity_Log.",
              },
              {
                step: "04",
                title: "Ajustar la estrategia de contacto",
                detail:
                  "En la hoja Contact_Strategy define los rangos de días de mora y el tono de mensaje para cada segmento.",
              },
              {
                step: "05",
                title: "Activar el trigger",
                detail:
                  "El workflow se activa con un Schedule Trigger a las 9:00 am. Verifica en el log de N8N que corra sin errores.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-xl border border-slate-800 bg-slate-800/40 p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-xs font-bold text-emerald-400">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Variables */}
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Variables de entorno — configuradas en N8N, no en la app
            </p>
            <pre className="overflow-x-auto text-sm text-emerald-400">
              <code>{`OPENAI_API_KEY=sk-...
WHATSAPP_API_KEY=   # Truora o Twilio
GOOGLE_SHEET_ID=    # ID del Sheet de producción
N8N_WEBHOOK_URL=    # URL del webhook de prueba`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        <p>
          Demo interactiva — el workflow real corre en N8N Cloud · Construido
          por{" "}
          <a
            href="https://manueldeasis.com"
            className="text-emerald-400 hover:underline"
          >
            Manuel De Asís
          </a>
        </p>
      </footer>
    </main>
  );
}
