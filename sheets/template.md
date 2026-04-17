# Plantilla Google Sheets — Core Bancario Simulado

## Cómo crear el sheet

1. Crear un nuevo Google Sheets
2. Crear 4 hojas con estos nombres exactos: `Customers`, `Loans`, `Contact_Strategy`, `Activity_Log`
3. Compartir el sheet con el email de la Service Account (aparece en el JSON como `client_email`)
4. Copiar los encabezados de cada sección abajo

---

## Sheet: Customers

| customer_id | name        | phone       | email           | segment  | language | telegram_chat_id |
|-------------|-------------|-------------|-----------------|----------|----------|------------------|
| C001        | Juan Pérez  | +5711234567 | juan@email.com  | retail   | es       | 123456789        |
| C002        | María López | +5719876543 | maria@email.com | premium  | es       | 987654321        |

> **¿Cómo obtengo el telegram_chat_id de cada cliente?**
> El cliente debe iniciar conversación con el bot primero (mensaje de "Hola" al bot).
> Luego consulta: `https://api.telegram.org/bot<TOKEN>/getUpdates`
> El `chat.id` que aparece es el valor a guardar aquí.

---

## Sheet: Loans

| loan_id | customer_id | amount   | days_overdue | total_debt | last_payment_date |
|---------|-------------|----------|--------------|------------|-------------------|
| L001    | C001        | 5000000  | 15           | 5250000    | 2026-03-28        |
| L002    | C002        | 12000000 | 3            | 12100000   | 2026-04-10        |

---

## Sheet: Contact_Strategy

| days_overdue_min | days_overdue_max | tone    | channel  | message_template                   |
|------------------|------------------|---------|----------|------------------------------------|
| 1                | 7                | suave   | telegram | Recordatorio amigable de pago      |
| 8                | 30               | firme   | telegram | Notificación formal de mora        |
| 31               | 999              | urgente | telegram | Aviso de posibles acciones legales |

---

## Sheet: Activity_Log

| log_id | customer_id | date       | channel  | message_sent | status |
|--------|-------------|------------|----------|--------------|--------|
| (auto) | C001        | 2026-04-14 | telegram | (mensaje)    | sent   |
