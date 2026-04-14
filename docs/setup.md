# Agente de Cobranzas — Setup

## Stack
- **N8N** (self-hosted o N8N Cloud) — orquestación del workflow
- **Google Sheets** — core bancario simulado (clientes, préstamos, estrategia)
- **OpenAI GPT-4o** — generación de mensajes personalizados
- **WhatsApp Business API** (Truora o Twilio) — canal de contacto
- **Gmail** — canal alternativo de contacto

## Pasos para instalar

1. Importar `workflows/main-workflow.json` en N8N
2. Configurar credenciales en N8N:
   - Google Sheets OAuth
   - OpenAI API Key
   - WhatsApp / Gmail
3. Crear el Google Sheets usando la plantilla en `sheets/template.md`
4. Ajustar la hoja `Contact_Strategy` con las reglas del negocio
5. Activar el workflow (trigger: Schedule, 9:00am diario)
6. Probar con `scripts/test-webhook.ts`

## Variables requeridas en N8N
```
OPENAI_API_KEY=
WHATSAPP_API_KEY=   (Truora o Twilio)
GOOGLE_SHEET_ID=    (ID del sheet de producción)
N8N_WEBHOOK_URL=    (URL del webhook de prueba)
```

## Estructura del workflow N8N

```
Schedule Trigger (9am diario)
  ↓
[Google Sheets] Customers + Loans + Contact_Strategy
  ↓
Merge (por customer_id)
  ↓
Filter (days_overdue > 0)
  ↓
OpenAI Chat → mensaje personalizado por cliente
  ↓
Switch → WhatsApp o Email
  ↓
Activity_Log (registra cada acción)
```
