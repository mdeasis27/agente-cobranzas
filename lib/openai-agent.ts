import type { UserApiKey } from "@/ai-kit/types";
import { chat } from "@/ai-kit/router";

export async function generateCollectionMessage(params: {
  name: string;
  amount: number;
  totalDebt: number;
  daysOverdue: number;
  segment: string;
  tone: string;
  messageTemplate: string;
  userApiKey?: UserApiKey;
}): Promise<{ message: string; provider: string; model: string; latency_ms: number }> {
  const { name, amount, totalDebt, daysOverdue, segment, tone, messageTemplate, userApiKey } =
    params;

  const response = await chat({
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
    maxTokens: 300,
    userApiKey,
  });

  return {
    message: response.text.trim() || "Por favor regulariza tu pago pendiente.",
    provider: response.provider,
    model: response.model,
    latency_ms: response.latency_ms,
  };
}
