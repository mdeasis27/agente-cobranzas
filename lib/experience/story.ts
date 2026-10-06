import type { Heading } from "@/design-system/demo/project-story";

export interface CobranzasStory {
  name: string;
  oneLiner: string;
  chips: string[];
  analogy: { heading: Heading; paragraphs: string[]; dictionaryLabel: string; dictionary: { term: string; means: string }[] };
  why: { title: string; text: string };
  tryIt: { heading: Heading; lead: string; question: (days: number) => string; yes: string; no: string; daysLabel: string; daysValue: (days: number) => string; daysHint: string; note: string; simulate: string; cancel: string; reset: string; error: string; idle: string };
  compare: { heading: Heading; lead: string; mine: string; noDayRule: string; atRisk: string; sentence: (mine: number, noDayRule: number) => string };
  fit: { heading: Heading; worthLabel: string; worth: string; notLabel: string; not: string };
  proves: { heading: Heading; text: string };
  engineers: { summary: string; points: string[]; repoLabel: string };
  scene: { title: string; caption: string; callLane: string; reminderLane: string; atRiskZone: string; bigBalance: string; toneLine: (days: number) => string; progress: (shown: number, calls: number) => string; arriving: string; atRiskOf: (n: number) => string };
}

export const STORY: Record<"en" | "es", CobranzasStory> = {
  en: {
    name: "Collections prioritization",
    oneLiner: "Decides which overdue accounts get a call first.",
    chips: ["Collections", "2 min", "Live demo"],
    analogy: {
      heading: { before: "The", accent: "analogy" },
      paragraphs: [
        "When you pay a card late, the first notice is friendly. If the days keep piling up, the tone changes and a person calls you.",
        "This agent decides where that line falls. Accounts past the line, or with a large balance, get a call. The rest get a friendly reminder. If the line is drawn too late, an account that needed a call only gets a reminder.",
      ],
      dictionaryLabel: "In the diagram below",
      dictionary: [
        { term: "the friendly notice", means: "the standard reminder" },
        { term: "the call", means: "priority outreach" },
        { term: "the day the tone changes", means: "the day threshold" },
        { term: "a card about to go bad", means: "an account 45 or more days late" },
      ],
    },
    why: { title: "Why I built it", text: "" },
    tryIt: {
      heading: { before: "Try", accent: "it" },
      lead: "Twelve overdue accounts, from 0 to 55 days late. One has a large balance and two belong to customers in a sensitive situation.",
      question: (d) => `Before you run it, place a bet: with the line at ${d} days late, is any account at risk (45 days or more) left with only a reminder?`,
      yes: "Yes, at least one",
      no: "No, they all get a call",
      daysLabel: "Call from",
      daysValue: (d) => `${d} days late`,
      daysHint: "Lower means more calls for the team to make.",
      note: "Each card is one account, placed on a ruler by its days late. Cards past the dashed line, or with a large balance, get a call. A red card with an × is an account at risk that only got a reminder.",
      simulate: "Run it",
      cancel: "Cancel",
      reset: "Start over",
      error: "The accounts could not be routed.",
      idle: "Place your bet and press Run it.",
    },
    compare: {
      heading: { before: "Your line", accent: "or no day rule" },
      lead: "Same twelve accounts. Without a day rule, only the large balance gets a call.",
      mine: "Your line",
      noDayRule: "No day rule",
      atRisk: "accounts at risk left with a reminder",
      sentence: (mine, none) => {
        if (mine === none) return `With your line and without it, the same ${none === 1 ? "account at risk is" : `${none} accounts at risk are`} left with only a reminder.`;
        return `With your line, ${mine === 0 ? "no account at risk" : mine === 1 ? "one account at risk" : `${mine} accounts at risk`} got only a reminder. Without a day rule, ${none}.`;
      },
    },
    fit: {
      heading: { before: "Where it", accent: "fits" },
      worthLabel: "Worth it",
      worth: "When a collections team has more overdue accounts than calls it can make in a day.",
      notLabel: "Not needed",
      not: "When the book is small enough to call every late customer.",
    },
    proves: {
      heading: { before: "What it", accent: "proves" },
      text: "I put the line where everyone can see it. Where it falls decides who gets a call and who gets a reminder. I also let a large balance count on its own, and kept the tone kind for customers in a sensitive situation.",
    },
    engineers: {
      summary: "For engineers",
      points: [
        "The twelve accounts are a fixed fictional book, 0 to 55 days late. Balances are integer cents.",
        "An account gets priority outreach when it reaches the day threshold or its balance is 100,000 cents or more (account 3).",
        "Accounts 5 and 8 are in a sensitive segment: when prioritized, the tone stays a reminder.",
        "An account counts as at risk from 45 days late. Tests pin the counts at 30, 45 and 50 days and sweep the slider.",
        "Stack: Next.js 16, TypeScript, node:test.",
      ],
      repoLabel: "Source code",
    },
    scene: {
      title: "Who got a call",
      caption: "Watch the accounts arrive three at a time and land on the ruler. Above the line, a call. Below, a reminder.",
      callLane: "A person calls you",
      reminderLane: "Friendly reminder by email",
      atRiskZone: "at risk",
      bigBalance: "large balance",
      toneLine: (d) => `tone changes: day ${d}`,
      progress: (shown, calls) => `${shown} of 12 accounts, ${calls} ${calls === 1 ? "call" : "calls"}, ${shown - calls} ${shown - calls === 1 ? "reminder" : "reminders"}`,
      arriving: "The cards arrive by days late",
      atRiskOf: (n) => (n === 0 ? "Every account at risk gets a call" : n === 1 ? "1 account at risk got only a reminder" : `${n} accounts at risk got only a reminder`),
    },
  },
  es: {
    name: "Agente de Cobranzas",
    oneLiner: "Decide a qué cuentas atrasadas se les llama primero.",
    chips: ["Cobranza", "2 min", "Demo en vivo"],
    analogy: {
      heading: { before: "La", accent: "analogía" },
      paragraphs: [
        "Cuando pagas tarde la tarjeta, el primer aviso es amable. Si los días se acumulan, el tono cambia y te llama una persona.",
        "Este agente decide dónde cae esa línea. Las cuentas que la pasan, o que deben mucho, reciben una llamada. Las demás reciben un recordatorio amable. Si la línea queda muy tarde, una cuenta que necesitaba llamada solo recibe un recordatorio.",
      ],
      dictionaryLabel: "En el diagrama de abajo",
      dictionary: [
        { term: "el aviso amable", means: "el recordatorio estándar" },
        { term: "la llamada", means: "el contacto prioritario" },
        { term: "el día en que cambia el tono", means: "el umbral de días" },
        { term: "la tarjeta a punto de perderse", means: "una cuenta con 45 días o más de atraso" },
      ],
    },
    why: { title: "Por qué lo hice", text: "" },
    tryIt: {
      heading: { accent: "Pruébalo" },
      lead: "Doce cuentas atrasadas, de 0 a 55 días. Una tiene un saldo grande y dos son de clientes en una situación sensible.",
      question: (d) => `Antes de correrlo, apuesta: con la línea en ${d} días de atraso, ¿alguna cuenta en riesgo (45 días o más) se queda solo con un recordatorio?`,
      yes: "Sí, al menos una",
      no: "No, todas reciben llamada",
      daysLabel: "Llamar desde",
      daysValue: (d) => `${d} días de atraso`,
      daysHint: "Más bajo significa más llamadas para el equipo.",
      note: "Cada tarjeta es una cuenta, acomodada en una regla según sus días de atraso. Las que pasan la línea punteada, o deben mucho, reciben una llamada. Una tarjeta roja con una × es una cuenta en riesgo que solo recibió un recordatorio.",
      simulate: "Correr",
      cancel: "Cancelar",
      reset: "Empezar de nuevo",
      error: "No se pudieron asignar las cuentas.",
      idle: "Haz tu apuesta y presiona Correr.",
    },
    compare: {
      heading: { before: "Tu línea", accent: "o sin regla de días" },
      lead: "Las mismas doce cuentas. Sin regla de días, solo el saldo grande recibe llamada.",
      mine: "Tu línea",
      noDayRule: "Sin regla de días",
      atRisk: "cuentas en riesgo solo con recordatorio",
      sentence: (mine, none) => {
        if (mine === none) return `Con tu línea y sin ella, ${none === 1 ? "la misma cuenta en riesgo se queda" : `las mismas ${none} cuentas en riesgo se quedan`} solo con un recordatorio.`;
        return `Con tu línea, ${mine === 0 ? "ninguna cuenta en riesgo se quedó" : mine === 1 ? "una cuenta en riesgo se quedó" : `${mine} cuentas en riesgo se quedaron`} solo con un recordatorio. Sin regla de días, ${none}.`;
      },
    },
    fit: {
      heading: { before: "¿Dónde", accent: "sirve?" },
      worthLabel: "Vale la pena",
      worth: "Cuando un equipo de cobranza tiene más cuentas atrasadas que llamadas posibles en un día.",
      notLabel: "No hace falta",
      not: "Cuando la cartera es tan chica que se puede llamar a todos los que van tarde.",
    },
    proves: {
      heading: { before: "Lo que", accent: "demuestra" },
      text: "Puse la línea donde todos la pueden ver. Dónde cae decide quién recibe una llamada y quién un recordatorio. También dejé que un saldo grande pese por sí solo, y que un cliente en situación sensible reciba siempre un tono amable.",
    },
    engineers: {
      summary: "Para ingenieros",
      points: [
        "Las doce cuentas son una cartera ficticia fija, de 0 a 55 días de atraso. Los saldos están en centavos enteros.",
        "Una cuenta recibe contacto prioritario cuando llega al umbral de días o cuando su saldo es de 100,000 centavos o más (la cuenta 3).",
        "Las cuentas 5 y 8 están en un segmento sensible: si se priorizan, el tono sigue siendo un recordatorio.",
        "Una cuenta está en riesgo a partir de 45 días de atraso. Los tests fijan los conteos con 30, 45 y 50 días y recorren el slider.",
        "Stack: Next.js 16, TypeScript, node:test.",
      ],
      repoLabel: "Código fuente",
    },
    scene: {
      title: "A quién se le llamó",
      caption: "Mira cómo llegan las cuentas de tres en tres y se acomodan en la regla. Arriba, una llamada. Abajo, un aviso.",
      callLane: "Te llama una persona",
      reminderLane: "Aviso amable por correo",
      atRiskZone: "en riesgo",
      bigBalance: "saldo grande",
      toneLine: (d) => `cambia el tono: día ${d}`,
      progress: (shown, calls) => `${shown} de 12 cuentas, ${calls} ${calls === 1 ? "llamada" : "llamadas"}, ${shown - calls} ${shown - calls === 1 ? "aviso" : "avisos"}`,
      arriving: "Las tarjetas llegan por días de atraso",
      atRiskOf: (n) => (n === 0 ? "Todas las cuentas en riesgo reciben llamada" : n === 1 ? "1 cuenta en riesgo solo recibió recordatorio" : `${n} cuentas en riesgo solo recibieron recordatorio`),
    },
  },
};
