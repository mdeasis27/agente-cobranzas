import { google } from "googleapis";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON no configurado");
  return new google.auth.GoogleAuth({
    credentials: JSON.parse(raw),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID no configurado");
  return id;
}

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

async function getSheets() {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, spreadsheetId: getSheetId() };
}

export async function getCustomers(): Promise<Customer[]> {
  const { sheets, spreadsheetId } = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Customers!A2:G",
  });
  return (res.data.values ?? []).map((r) => ({
    customer_id: r[0],
    name: r[1],
    phone: r[2],
    email: r[3],
    segment: r[4],
    language: r[5],
    telegram_chat_id: r[6] ?? "",
  }));
}

export async function getLoans(): Promise<Loan[]> {
  const { sheets, spreadsheetId } = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Loans!A2:F",
  });
  return (res.data.values ?? []).map((r) => ({
    loan_id: r[0],
    customer_id: r[1],
    amount: Number(r[2]),
    days_overdue: Number(r[3]),
    total_debt: Number(r[4]),
    last_payment_date: r[5],
  }));
}

export async function getContactStrategy(): Promise<ContactStrategy[]> {
  const { sheets, spreadsheetId } = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Contact_Strategy!A2:E",
  });
  return (res.data.values ?? []).map((r) => ({
    days_overdue_min: Number(r[0]),
    days_overdue_max: Number(r[1]),
    tone: r[2],
    channel: r[3],
    message_template: r[4],
  }));
}

export async function appendActivityLog(entry: ActivityLogEntry): Promise<void> {
  const { sheets, spreadsheetId } = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Activity_Log!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        "",  // log_id auto
        entry.customer_id,
        entry.date,
        entry.channel,
        entry.message_sent,
        entry.status,
      ]],
    },
  });
}
