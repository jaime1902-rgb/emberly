"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmberlyMark } from "./mark";

/** TODO: swap for Emberly's real WhatsApp Business number before launch. */
const EMBERLY_WHATSAPP_NUMBER = "34600000000";

const TOTAL_STEPS = 5;

type TipoOption = { value: string; tag: string };
type DolorOption = { value: string; tag: string | null };

const TIPO_OPTIONS: TipoOption[] = [
  { value: "Medicina estética", tag: "TICKET ALTO" },
  { value: "Capilar / injerto", tag: "TICKET MUY ALTO" },
  { value: "Dental", tag: "IMPLANTES Y ORTODONCIA" },
  { value: "Otra", tag: "CUÉNTANOS" },
];

const DOLOR_OPTIONS: DolorOption[] = [
  { value: "Leads que no contesto a tiempo", tag: null },
  { value: "Citas que se cancelan sin avisar", tag: null },
  { value: "Mi equipo pierde horas contestando", tag: null },
  { value: "Todo lo anterior", tag: "CASO PRIORITARIO" },
];

const VOLUMEN_OPTIONS = ["Menos de 20 / semana", "Entre 20 y 50 / semana", "Más de 50 / semana"];

const stepVariants = {
  enter: { x: 20, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

export function EmberlyFunnel() {
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<string | null>(null);
  const [dolor, setDolor] = useState<string | null>(null);
  const [volumen, setVolumen] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [clinica, setClinica] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");

  const referencia = useMemo(() => `#EMB-${Date.now().toString(36).toUpperCase()}`, []);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const datosValid = useMemo(() => {
    const phoneOk = telefono.replace(/[^0-9]/g, "").length >= 9;
    return nombre.trim().length > 1 && phoneOk;
  }, [nombre, telefono]);

  function selectTipo(value: string) {
    setTipo(value);
    setTimeout(goNext, 260);
  }

  function selectDolor(value: string) {
    setDolor(value);
  }

  function selectVolumen(value: string) {
    setVolumen(value);
    setTimeout(goNext, 260);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isInput = (document.activeElement as HTMLElement)?.tagName === "INPUT";
      if (e.key === "Enter") {
        if (step === 0) goNext();
        else if (step === 3 && datosValid) goNext();
      }
      if (e.key === "Backspace" && !isInput) goBack();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, datosValid]);

  const progress = (step / (TOTAL_STEPS - 1)) * 100;
  const showBotnav = step !== 4;
  const showFwd = step === 0 || step === 3;

  const whatsappHref = `https://wa.me/${EMBERLY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, soy ${nombre || "un solicitante"} de ${clinica || "mi clínica"}. Acabo de solicitar una de las 3 plazas del piloto de Emberly.`
  )}`;

  return (
    <div className="bg-tech-grid relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:px-8">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-sm border border-electric/15 bg-card shadow-[0_30px_60px_-30px_rgba(26,26,62,0.25)]">
        <CircuitCorners />

        <div className="relative h-[1.5px] w-full bg-border/50">
          <motion.div
            className="h-full bg-electric"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-5 sm:px-9">
          <div className="flex items-center gap-2">
            <EmberlyMark className="h-6 w-auto" />
            <span className="font-display text-base font-semibold text-navy italic">Emberly AI</span>
          </div>
          <div className="font-data text-[0.68rem] font-medium tracking-[0.14em] text-text-dim tabular-nums">
            0{step + 1} / {TOTAL_STEPS}
          </div>
        </div>

        <div className="relative min-h-[420px] px-6 pb-24 sm:px-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              {step === 0 && (
                <div className="flex flex-col items-center py-8">
                  <p className="font-data text-xs font-semibold tracking-[0.22em] text-foreground/70 uppercase">
                    Solo quedan
                  </p>
                  <div className="mt-3 flex items-end justify-center">
                    <span className="font-display text-[clamp(4rem,16vw,7rem)] font-bold leading-none text-navy">
                      3
                    </span>
                    <span
                      className="font-display text-[clamp(2.4rem,9vw,4rem)] font-bold text-electric"
                      style={{ animation: "cursor-blink 1s steps(1,end) infinite" }}
                    >
                      |
                    </span>
                  </div>
                  <p className="mt-3 font-data text-xs font-semibold tracking-[0.22em] text-foreground/70 uppercase">
                    Plazas disponibles
                  </p>
                  <p className="mt-6 max-w-[38ch] text-sm text-text-muted">
                    Implementación gratuita de nuestro asistente de IA para WhatsApp, 30 días, sin
                    coste. A cambio, documentamos tu caso como referencia.
                  </p>
                  <NavyButton className="mt-8" onClick={goNext}>
                    Quiero mi plaza
                  </NavyButton>
                </div>
              )}

              {step === 1 && (
                <div className="flex w-full flex-col items-center py-6">
                  <h2 className="max-w-[20ch] font-display text-[clamp(1.5rem,4vw,2.1rem)] font-semibold text-balance italic">
                    ¿Qué tipo de clínica tienes?
                  </h2>
                  <div className="mt-9 flex w-full max-w-lg flex-col gap-3">
                    {TIPO_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt.value}
                        selected={tipo === opt.value}
                        onClick={() => selectTipo(opt.value)}
                      >
                        <span className="text-[0.95rem]">{opt.value}</span>
                        <DataTag>{opt.tag}</DataTag>
                      </ChoiceCard>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex w-full flex-col items-center py-6">
                  <h2 className="max-w-[22ch] font-display text-[clamp(1.5rem,4vw,2.1rem)] font-semibold text-balance italic">
                    ¿Cuál es tu mayor problema hoy?
                  </h2>
                  <div className="mt-9 flex w-full max-w-lg flex-col gap-3">
                    {DOLOR_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt.value}
                        selected={dolor === opt.value}
                        onClick={() => selectDolor(opt.value)}
                      >
                        <span className="text-[0.95rem]">{opt.value}</span>
                        {opt.tag && <DataTag>{opt.tag}</DataTag>}
                      </ChoiceCard>
                    ))}
                  </div>
                  <AnimatePresence>
                    {dolor && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-8 w-full max-w-lg border-t border-border/60 pt-6"
                      >
                        <p className="text-xs font-medium text-text-muted">
                          ¿Cuántos mensajes de pacientes recibís?
                        </p>
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {VOLUMEN_OPTIONS.map((v) => (
                            <button
                              key={v}
                              onClick={() => selectVolumen(v)}
                              className={cn(
                                "rounded-full border px-4 py-2 text-[0.82rem] transition-colors",
                                volumen === v
                                  ? "border-electric bg-electric-dim text-navy"
                                  : "border-foreground/15 text-foreground/80 hover:border-electric hover:bg-electric-dim"
                              )}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {step === 3 && (
                <div className="flex w-full flex-col items-center py-6">
                  <h2 className="max-w-[22ch] font-display text-[clamp(1.3rem,3.4vw,1.9rem)] font-semibold text-balance italic">
                    Últimos datos para tu solicitud
                  </h2>
                  <div className="mt-8 flex w-full max-w-md flex-col gap-5 text-left">
                    <DataField label="Nombre completo" value={nombre} onChange={setNombre} />
                    <DataField label="Clínica" value={clinica} onChange={setClinica} />
                    <div className="flex flex-col gap-1.5">
                      <label className="font-data text-[0.62rem] font-semibold tracking-[0.14em] text-text-dim uppercase">
                        Teléfono WhatsApp
                      </label>
                      <div className="flex items-center gap-2 border-b-2 border-foreground/20 focus-within:border-electric">
                        <span className="text-base text-text-dim">+34</span>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="600 000 000"
                          className="w-full bg-transparent py-2 text-base text-foreground outline-none placeholder:text-text-dim/60"
                        />
                      </div>
                    </div>
                    <DataField label="Ciudad" value={ciudad} onChange={setCiudad} />
                  </div>
                  <p className="mt-5 max-w-md text-[0.68rem] leading-relaxed text-text-dim">
                    Revisamos cada solicitud a mano. Si tu clínica encaja con el perfil, te
                    confirmamos tu plaza en menos de 24h. Si decides continuar tras el piloto, el
                    precio de la mensualidad queda acordado desde el día 1 — sin sorpresas.
                  </p>
                  <NavyButton className="mt-7 mb-16 w-full max-w-md justify-center" disabled={!datosValid} onClick={goNext}>
                    Solicitar mi plaza
                  </NavyButton>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center py-10">
                  <Seal />
                  <h2 className="mt-7 max-w-[22ch] font-display text-[clamp(1.4rem,3.6vw,2rem)] font-semibold text-balance italic">
                    Solicitud recibida{nombre ? `, ${nombre.split(" ")[0]}` : ""}.
                  </h2>
                  <p className="mt-3 font-data text-[0.68rem] font-semibold tracking-[0.14em] text-text-dim uppercase">
                    Referencia {referencia}
                  </p>
                  <p className="mt-4 max-w-[48ch] text-sm text-text-muted">
                    Revisamos tu clínica y te contactamos en menos de 24h si hay plaza disponible.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Escríbenos por WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setStep(0);
                      setTipo(null);
                      setDolor(null);
                      setVolumen(null);
                    }}
                    className="mt-4 text-xs text-text-dim underline-offset-4 hover:text-navy hover:underline"
                  >
                    Volver al inicio
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {showBotnav && (
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4">
            <button
              onClick={goBack}
              disabled={step === 0}
              aria-label="Anterior"
              className="flex size-9 items-center justify-center rounded-full border border-foreground/15 text-text-muted transition-colors hover:border-electric hover:text-navy disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => {
                if (step === 3) {
                  if (datosValid) goNext();
                } else {
                  goNext();
                }
              }}
              aria-label="Siguiente"
              className={cn(
                "flex size-9 items-center justify-center rounded-full border border-foreground/15 text-text-muted transition-colors hover:border-electric hover:text-navy",
                !showFwd && "invisible"
              )}
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CircuitCorners() {
  const positions = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];
  return (
    <>
      {positions.map((p) => (
        <span
          key={p}
          className={cn("absolute size-1.5 rounded-full bg-electric", p)}
          style={{ animation: "node-pulse 3s ease-in-out infinite" }}
        />
      ))}
    </>
  );
}

function DataTag({ children }: { children: string }) {
  return (
    <span
      className="shrink-0 rounded-[3px] px-2 py-1 font-data text-[0.6rem] font-semibold tracking-[0.12em] text-electric uppercase"
      style={{ background: "var(--electric-dim)" }}
    >
      {children}
    </span>
  );
}

function ChoiceCard({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex items-center justify-between gap-4 border-y border-r border-foreground/10 bg-transparent px-5 py-4 text-left transition-colors",
        selected ? "border-l-[3px] border-l-electric bg-electric-dim" : "border-l border-l-foreground/10"
      )}
    >
      {children}
    </motion.button>
  );
}

function DataField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-data text-[0.62rem] font-semibold tracking-[0.14em] text-text-dim uppercase">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-b-2 border-foreground/20 bg-transparent py-2 text-base text-foreground outline-none focus:border-electric"
      />
    </div>
  );
}

function NavyButton({
  children,
  disabled,
  onClick,
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-sm border border-navy bg-navy px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground uppercase transition-[background-color,border-color] duration-150 hover:border-electric hover:bg-[color-mix(in_srgb,var(--navy)_95%,white)] disabled:cursor-not-allowed disabled:opacity-35",
        className
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
    </button>
  );
}

function Seal() {
  return (
    <div
      className="relative size-20"
      style={{ animation: "seal-press 0.8s cubic-bezier(.2,.8,.2,1) both" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #1a1a3e, #4f46e5, #c9a84c, #1a1a3e)",
          animation: "holo-spin 8s linear infinite",
        }}
      />
      <div
        className="absolute inset-[3px] flex flex-col items-center justify-center gap-0.5 rounded-full text-primary-foreground shadow-[0_10px_24px_-8px_rgba(26,26,62,0.5)]"
        style={{ background: "var(--navy)" }}
      >
        <svg viewBox="0 0 80 80" aria-hidden className="absolute inset-0">
          <defs>
            <path id="seal-rim" d="M 40,40 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="none" />
          </defs>
          <text fill="var(--gold)" fontSize="4.6" letterSpacing="1.4" className="font-sans">
            <textPath href="#seal-rim" startOffset="1%">
              SELECCIÓN &#8226; EMBERLY AI &#8226; 2025 &#8226;
            </textPath>
          </text>
        </svg>
        <span className="relative font-display text-2xl leading-none font-bold">3</span>
        <span className="relative text-[0.42rem] tracking-[0.14em] uppercase">plazas</span>
      </div>
    </div>
  );
}
