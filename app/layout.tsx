import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@/components/Analytics";
import { HubSpotTracking } from "@/components/HubSpot";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VentureERP — ERP para Metalúrgicas e Moveleiras",
  description:
    "Do orçamento ao chão de fábrica: ficha técnica, plano de corte de chapa e MDF, ordem de produção, custo real por peça e fiscal industrial (Bloco K) em um sistema só.",
  metadataBase: new URL("https://venturerp.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${serif.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">
        {children}
        <Analytics />
        <HubSpotTracking />
      </body>
    </html>
  );
}
