import OpenAI from "openai";

// OpenRouter es compatible con la API de OpenAI.
// Modelos gratuitos disponibles en: https://openrouter.ai/models?q=free
const MODEL = "google/gemma-3-27b-it:free";

let _client: OpenAI | null = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://agente-cobranzas.vercel.app",
        "X-Title": "Agente de Cobranzas",
      },
    });
  }
  return _client;
}

export async function generateCollectionMessage(params: {
  name: string;
  amount: number;
  totalDebt: number;
  daysOverdue: number;
  segment: string;
  tone: string;
  messageTemplate: string;
}): Promise<string> {
  const { name, amount, totalDebt, daysOverdue, segment, tone, messageTemplate } = params;

  const completion = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `Eres un agente de cobranzas profesional. Redacta mensajes de cobro en español,
directos pero respetuosos, adaptados al segmento del cliente y los días de mora.
Tono requerido: ${tone}.
Plantilla de referencia: "${messageTemplate}".
El mensaje debe ser corto (máximo 3 oraciones), sin saludos largos, y terminar con una acción clara.
No uses markdown. Solo texto plano.`,
      },
      {
        role: "user",
        content: `Cliente: ${name}
Segmento: ${segment}
Días de mora: ${daysOverdue}
Monto original del préstamo: $${amount.toLocaleString("es-CO")}
Deuda total con intereses: $${totalDebt.toLocaleString("es-CO")}

Redacta el mensaje de cobro.`,
      },
    ],
  });

  return completion.choices[0].message.content?.trim() ?? "Por favor regulariza tu pago pendiente.";
}
