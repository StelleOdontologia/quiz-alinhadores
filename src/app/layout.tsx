import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stelle Odontologia | Alinhadores Invisíveis na Taquara",
  description:
    "Descubra se os alinhadores invisíveis fazem sentido para você. Responda um teste rápido e converse com a equipe da Stelle Odontologia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
