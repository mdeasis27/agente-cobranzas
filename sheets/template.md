# Plantilla Google Sheets — Core Bancario Simulado

## Cómo crear el sheet

1. Crear un nuevo Google Sheets
2. Crear 4 hojas con estos nombres exactos: `Customers`, `Loans`, `Contact_Strategy`, `Activity_Log`
3. Copiar los encabezados de cada sección abajo

---

## Sheet: Customers

| customer_id | name        | phone       | email               | segment  | language |
|-------------|-------------|-------------|---------------------|----------|----------|
| C001        | Juan Pérez  | +5711234567 | juan@email.com      | retail   | es       |
| C002        | María López | +5719876543 | maria@email.com     | premium  | es       |

---

## Sheet: Loans

| loan_id | customer_id | amount   | days_overdue | total_debt | last_payment_date |
|---------|-------------|----------|--------------|------------|-------------------|
| L001    | C001        | 5000000  | 15           | 5250000    | 2026-03-28        |
| L002    | C002        | 12000000 | 3            | 12100000   | 2026-04-10        |

---

## Sheet: Contact_Strategy

| days_overdue_min | days_overdue_max | tone    | channel          | message_template                        |
|------------------|------------------|---------|------------------|-----------------------------------------|
| 1                | 7                | suave   | whatsapp         | Recordatorio amigable de pago           |
| 8                | 30               | firme   | email            | Notificación formal de mora             |
| 31               | 999              | urgente | whatsapp + email | Aviso de posibles acciones legales      |

---

## Sheet: Activity_Log

| log_id | customer_id | date       | channel   | message_sent | status  |
|--------|-------------|------------|-----------|--------------|---------|
| (auto) | C001        | 2026-04-13 | whatsapp  | (mensaje)    | sent    |
