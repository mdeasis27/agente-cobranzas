import { NextRequest, NextResponse } from "next/server";
import {
  getCustomers,
  getLoans,
  getContactStrategy,
  appendActivityLog,
} from "@/lib/db/queries";
import { generateCollectionMessage } from "@/lib/openai-agent";
import { sendMessage } from "@/lib/telegram";
import { findStrategy } from "@/lib/experience/contact-policy";

// Vercel Cron agrega este header automáticamente.
// Para pruebas manuales, envía: Authorization: Bearer <CRON_SECRET>
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const results: Array<{
    customer_id: string;
    name: string;
    status: string;
    channel: string;
    error?: string;
  }> = [];

  try {
    const [customers, loans, strategies] = await Promise.all([
      getCustomers(),
      getLoans(),
      getContactStrategy(),
    ]);

    // Solo clientes con mora activa y con Telegram configurado
    const overdueLoans = loans.filter((l) => l.days_overdue > 0);

    for (const loan of overdueLoans) {
      const customer = customers.find((c) => c.customer_id === loan.customer_id);
      if (!customer) continue;

      const strategy = findStrategy(loan.days_overdue, strategies);
      if (!strategy) continue;

      let message: string;
      try {
        const result = await generateCollectionMessage({
          name: customer.name,
          amount: loan.amount,
          totalDebt: loan.total_debt,
          daysOverdue: loan.days_overdue,
          segment: customer.segment,
          tone: strategy.tone,
          messageTemplate: strategy.message_template,
        });
        message = result.message;
      } catch (err) {
        results.push({
          customer_id: customer.customer_id,
          name: customer.name,
          status: "error_openai",
          channel: "none",
          error: String(err),
        });
        continue;
      }

      let sendStatus = "sent";
      let channel = "telegram";
      let sendError: string | undefined;

      if (!customer.telegram_chat_id) {
        sendStatus = "skipped_no_telegram";
        channel = "none";
        sendError = "telegram_chat_id no configurado en el sheet";
      } else {
        const result = await sendMessage(customer.telegram_chat_id, message);
        if (!result.ok) {
          sendStatus = "error_telegram";
          sendError = result.error;
        }
      }

      await appendActivityLog({
        customer_id: customer.customer_id,
        date: today,
        channel,
        message_sent: message,
        status: sendStatus,
      });

      results.push({
        customer_id: customer.customer_id,
        name: customer.name,
        status: sendStatus,
        channel,
        ...(sendError ? { error: sendError } : {}),
      });
    }

    return NextResponse.json({
      date: today,
      processed: results.length,
      results,
    });
  } catch (err) {
    console.error("[run-collections] Error:", err);
    return NextResponse.json(
      { error: "Error interno", detail: String(err) },
      { status: 500 }
    );
  }
}
