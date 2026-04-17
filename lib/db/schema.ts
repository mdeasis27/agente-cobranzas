import { pgTable, text, integer, timestamp, serial } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  customerId: text('customer_id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  segment: text('segment'),
  language: text('language').default('es'),
  telegramChatId: text('telegram_chat_id'),
});

export const loans = pgTable('loans', {
  loanId: text('loan_id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.customerId),
  amount: integer('amount').notNull(),
  daysOverdue: integer('days_overdue').notNull(),
  totalDebt: integer('total_debt').notNull(),
  lastPaymentDate: text('last_payment_date'),
});

export const contactStrategy = pgTable('contact_strategy', {
  id: serial('id').primaryKey(),
  daysOverdueMin: integer('days_overdue_min').notNull(),
  daysOverdueMax: integer('days_overdue_max').notNull(),
  tone: text('tone').notNull(),
  channel: text('channel').notNull(),
  messageTemplate: text('message_template').notNull(),
});

export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  customerId: text('customer_id').notNull(),
  date: text('date').notNull(),
  channel: text('channel').notNull(),
  messageSent: text('message_sent').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
