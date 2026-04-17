// Script para probar el endpoint /api/run-collections manualmente
// Uso: npx tsx scripts/test-webhook.ts
//
// Requiere que el servidor esté corriendo: npm run dev
// y que .env.local tenga todas las variables configuradas

import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.error("❌  CRON_SECRET no está en .env.local");
  process.exit(1);
}

async function main() {
  console.log(`\n🚀  Llamando a ${BASE_URL}/api/run-collections ...\n`);

  const res = await fetch(`${BASE_URL}/api/run-collections`, {
    headers: { Authorization: `Bearer ${CRON_SECRET}` },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`❌  Error ${res.status}:`, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log(`✅  Status: ${res.status}`);
  console.log(`📅  Fecha: ${data.date}`);
  console.log(`👥  Clientes procesados: ${data.processed}\n`);

  for (const r of data.results) {
    const icon = r.status === "sent" ? "💬" : r.status.startsWith("error") ? "❌" : "⚠️";
    console.log(`${icon}  ${r.name} (${r.customer_id}) → ${r.status}`);
    if (r.error) console.log(`     Error: ${r.error}`);
  }
}

main().catch(console.error);
