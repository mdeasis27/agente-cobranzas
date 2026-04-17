const BASE = "https://api.telegram.org";

function getToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN no configurado");
  return token;
}

export async function sendMessage(
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const token = getToken();
  const res = await fetch(`${BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  const data = await res.json();
  if (!data.ok) {
    return { ok: false, error: data.description ?? "Error desconocido" };
  }
  return { ok: true };
}
