import type { Metadata } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Emberly — La oferta de las 3 plazas",
  description:
    "Emberly implementa gratis su asistente de WhatsApp en 3 clínicas durante 30 días.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bodoni.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-hidden">
        {/*
          THESIS: sell three exclusive pilot places like a private invitation, not a SaaS signup form.
          OWN-WORLD: bone-paper ground, one committed field of apothecary green, a thin gold rule, Bodoni Moda
          display serif, Archivo body/UI, a wax-seal edition medallion, letterpress button, ruled paper inputs.
          STORY: a clinic owner receives what reads like a hand-numbered invitation to one of three spots,
          understands the honest trade (free pilot for a real case study), and requests their place.
          FIRST VIEWPORT: centered bone page, small ink horse mark, wax-seal medallion beside the headline,
          Bodoni headline, Archivo subhead, one letterpress CTA.
          FORM: editorial-luxury invitation — direction pinned directly by the user ("lujo editorial"); the
          multi-candidate roll was skipped because the brief already named the world.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
          verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
        {children}
      </body>
    </html>
  );
}
