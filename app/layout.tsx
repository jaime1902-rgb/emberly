import type { Metadata } from "next";
import { Bodoni_Moda, Archivo, Exo_2 } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Emberly AI — La oferta de las 3 plazas",
  description:
    "Emberly implementa gratis su asistente de IA para WhatsApp en 3 clínicas durante 30 días.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${bodoni.variable} ${archivo.variable} ${exo2.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-hidden">
        {/*
          THESIS: an access-restricted invitation with an AI nerve — editorial trust plus a live system pulse.
          OWN-WORLD: bone paper, near-black ink, night-navy for authority (buttons, mark, active borders),
          electric indigo for data/system signals (counter, tags, circuit nodes, progress), gold reserved for
          the seal only. Bodoni Moda display, Archivo body, Exo 2 small-caps for data/metric labels.
          STORY: a clinic owner sees a live, ticking system (terminal counter, circuit-node card, progress bar)
          holding an honest, limited invitation — not a generic lead form.
          FIRST VIEWPORT: mark top-left, centered terminal-style spots counter with blinking cursor, subhead,
          one navy CTA with an indigo hover border.
          FORM: "invitación de acceso restringido — editorial con nervio de IA", pinned directly by the user
          with exact palette, type, and per-screen copy; built to that spec, not re-interpreted.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
          verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
        {children}
      </body>
    </html>
  );
}
