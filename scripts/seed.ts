import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding database...');

  await db.insert(schema.customers).values([
    { customerId: 'C001', name: 'Juan Pérez', phone: '+5711234567', email: 'juan@email.com', segment: 'retail', language: 'es', telegramChatId: '123456789' },
    { customerId: 'C002', name: 'María López', phone: '+5719876543', email: 'maria@email.com', segment: 'premium', language: 'es', telegramChatId: '987654321' },
    { customerId: 'C003', name: 'Carlos Ruiz', phone: '+5713456789', email: 'carlos@email.com', segment: 'retail', language: 'es', telegramChatId: '' },
  ]).onConflictDoNothing();

  await db.insert(schema.loans).values([
    { loanId: 'L001', customerId: 'C001', amount: 5000000, daysOverdue: 15, totalDebt: 5250000, lastPaymentDate: '2026-03-28' },
    { loanId: 'L002', customerId: 'C002', amount: 12000000, daysOverdue: 3, totalDebt: 12100000, lastPaymentDate: '2026-04-10' },
    { loanId: 'L003', customerId: 'C003', amount: 2500000, daysOverdue: 45, totalDebt: 2800000, lastPaymentDate: '2026-02-15' },
  ]).onConflictDoNothing();

  await db.insert(schema.contactStrategy).values([
    { daysOverdueMin: 1, daysOverdueMax: 7, tone: 'suave', channel: 'telegram', messageTemplate: 'Recordatorio amigable de pago' },
    { daysOverdueMin: 8, daysOverdueMax: 30, tone: 'firme', channel: 'telegram', messageTemplate: 'Notificación formal de mora' },
    { daysOverdueMin: 31, daysOverdueMax: 999, tone: 'urgente', channel: 'telegram', messageTemplate: 'Aviso de posibles acciones legales' },
  ]);

  console.log('Seed complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
