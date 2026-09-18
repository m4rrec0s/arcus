import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const data = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://arcus.tecnologia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ARCUS Tecnologia — Precisão em cada linha de código",
    template: "%s · ARCUS Tecnologia",
  },
  description:
    "Sites, apps, automações com n8n e atendimento com IA. Engenharia de software de alto padrão em Campina Grande/PB e todo o Brasil.",
  keywords: ["sites", "apps", "automações", "n8n", "atendimento com IA", "Campina Grande", "software sob medida"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ARCUS Tecnologia",
    title: "ARCUS Tecnologia — Precisão em cada linha de código",
    description: "Sites, apps, automações e IA. Tensão → precisão → impacto.",
  },
  robots: { index: true, follow: true },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ARCUS Tecnologia",
  url: SITE_URL,
  slogan: "Precisão em cada linha de código.",
  areaServed: ["Campina Grande", "Paraíba", "Brasil"],
  knowsAbout: ["Sites", "Apps", "Automações", "n8n", "Atendimento com IA"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${data.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-[#0A0A0C] font-sans text-zinc-100 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-2 focus:text-black">
          Pular para o conteúdo
        </a>
        <Header />
        <SmoothScroll>
          <div id="conteudo">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
