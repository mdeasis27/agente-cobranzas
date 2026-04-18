import type { Metadata } from "next";
import { fontVariables } from "@/design-system/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agente de Cobranzas con IA | Demo",
  description:
    "Automatiza el ciclo completo de cobranzas: lee el core bancario, decide la estrategia y envía mensajes personalizados por Telegram. Powered by Llama 3.3 vía OpenRouter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={
          fontVariables + " antialiased min-h-full flex flex-col bg-background text-foreground"
        }
      >
        {children}
      </body>
    </html>
  );
}
