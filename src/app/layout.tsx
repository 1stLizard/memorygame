// ❌ No pongas "use client" aquí

import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Memorama App",
  description: "Una colaboración de Diseño Gráfico e Ingeniería en Sistemas",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
