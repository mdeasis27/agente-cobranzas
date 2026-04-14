import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agente de Cobranzas con IA | Demo",
  description:
    "Automatiza el ciclo completo de cobranzas: lee el core bancario, decide la estrategia y envía mensajes personalizados por WhatsApp. Powered by N8N + OpenAI GPT-4o.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
