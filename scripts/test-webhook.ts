// Script para probar el webhook de N8N manualmente
// Uso: npx tsx scripts/test-webhook.ts

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

const testPayload = {
  customer_id: "C001",
  name: "Juan Pérez",
  phone: "+5711234567",
  email: "juan@email.com",
  loan_id: "L001",
  amount: 5000000,
  days_overdue: 15,
  total_debt: 5250000,
  segment: "retail",
  language: "es",
};

async function main() {
  console.log("Enviando payload de prueba al webhook de N8N...");
  console.log(JSON.stringify(testPayload, null, 2));

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testPayload),
  });

  const text = await res.text();
  console.log(`\nRespuesta: ${res.status}`);
  console.log(text);
}

main().catch(console.error);
