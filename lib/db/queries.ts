import { db } from './index';
import { customers, loans, contactStrategy, activityLog } from './schema';

export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email: string;
  segment: string;
  language: string;
  telegram_chat_id: string;
}

export interface Loan {
  loan_id: string;
  customer_id: string;
  amount: number;
  days_overdue: number;
  total_debt: number;
  last_payment_date: string;
}

export interface ContactStrategy {
  days_overdue_min: number;
  days_overdue_max: number;
  tone: string;
  channel: string;
  message_template: string;
}

export interface ActivityLogEntry {
  customer_id: string;
  date: string;
  channel: string;
  message_sent: string;
  status: string;
}

export async function getCustomers(): Promise<Customer[]> {
  const rows = await db().select().from(customers);
  return rows.map((r) => ({
    customer_id: r.customerId,
    name: r.name,
    phone: r.phone ?? '',
    email: r.email ?? '',
    segment: r.segment ?? '',
    language: r.language ?? 'es',
    telegram_chat_id: r.telegramChatId ?? '',
  }));
}

export async function getLoans(): Promise<Loan[]> {
  const rows = await db().select().from(loans);
  return rows.map((r) => ({
    loan_id: r.loanId,
    customer_id: r.customerId,
    amount: r.amount,
    days_overdue: r.daysOverdue,
    total_debt: r.totalDebt,
    last_payment_date: r.lastPaymentDate ?? '',
  }));
}

export async function getContactStrategy(): Promise<ContactStrategy[]> {
  const rows = await db().select().from(contactStrategy);
  return rows.map((r) => ({
    days_overdue_min: r.daysOverdueMin,
    days_overdue_max: r.daysOverdueMax,
    tone: r.tone,
    channel: r.channel,
    message_template: r.messageTemplate,
  }));
}

export async function appendActivityLog(entry: ActivityLogEntry): Promise<void> {
  await db().insert(activityLog).values({
    customerId: entry.customer_id,
    date: entry.date,
    channel: entry.channel,
    messageSent: entry.message_sent,
    status: entry.status,
  });
}
