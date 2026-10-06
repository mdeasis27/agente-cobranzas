const COPY: Record<string, { en: string; es: string }> = {
  "batch.1": { en: "accounts 1 to 3 routed", es: "cuentas 1 a 3 asignadas" },
  "batch.2": { en: "accounts 4 to 6 routed", es: "cuentas 4 a 6 asignadas" },
  "batch.3": { en: "accounts 7 to 9 routed", es: "cuentas 7 a 9 asignadas" },
  "batch.4": { en: "accounts 10 to 12 routed", es: "cuentas 10 a 12 asignadas" },
};
export function traceCopy(locale: "en" | "es", key: string) { return COPY[key]?.[locale] ?? key; }
