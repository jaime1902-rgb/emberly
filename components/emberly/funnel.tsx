"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  type LucideIcon,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmberlyMark } from "./mark";

type ChoiceKey = "tipo" | "canal" | "dolor";

type Step =
  | { type: "cover" }
  | { type: "offer" }
  | { type: "choice"; key: ChoiceKey; q: string; options: string[] }
  | { type: "contact"; q: string; sub: string }
  | { type: "success" };

const STEPS: Step[] = [
  { type: "cover" },
  { type: "offer" },
  {
    type: "choice",
    key: "tipo",
    q: "¿Qué tipo de clínica tienes?",
    options: ["Estética", "Capilar", "Dental", "Otra especialidad"],
  },
  {
    type: "choice",
    key: "canal",
    q: "¿Ya captáis pacientes por WhatsApp?",
    options: ["Sí, activamente", "Algo, pero sin gestionarlo bien", "Todavía no"],
  },
  {
    type: "choice",
    key: "dolor",
    q: "¿Qué es lo que más os está pasando ahora mismo?",
    options: [
      "Se nos escapan leads sin contestar",
      "El equipo pierde demasiado tiempo respondiendo",
      "Las dos cosas",
      "No estoy seguro",
    ],
  },
  {
    type: "contact",
    q: "¿Dónde te contactamos si hay plaza?",
    sub: "Revisamos cada solicitud a mano. Si tu clínica encaja con el perfil, te confirmamos tu plaza en menos de 24h.",
  },
  { type: "success" },
];

const offerPoints: { label: string; body: string; icon: LucideIcon }[] = [
  {
    label: "Qué es",
    body: "Implementamos gratis nuestro asistente de inteligencia artificial en tu clínica durante 30 días. Funciona desde el día 1. No pagas nada mientras dura el piloto.",
    icon: Bot,
  },
  {
    label: "Qué recibe tu clínica",
    body: "Un asistente de IA que contesta y agenda pacientes por WhatsApp al instante, 24/7. Implementación, métricas del periodo y soporte directo incluidos.",
    icon: MessageCircle,
  },
  {
    label: "Por qué es gratis",
    body: "Acabamos de lanzarnos. Tenemos la tecnología, nos falta el caso real. A cambio del piloto, documentamos resultados reales: citas, leads, no-shows.",
    icon: Sparkles,
  },
  {
    label: "Por qué solo 3",
    body: "Cada implementación es atención personalizada. No se puede hacer bien con veinte clínicas a la vez, así que limitamos las plazas para que el resultado sea real.",
    icon: Target,
  },
];

const emptyAnswers = {
  tipo: null as string | null,
  canal: null as string | null,
  dolor: null as string | null,
  nombre: "",
  email: "",
  telefono: "",
  clinica: "",
};

export function EmberlyFunnel() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [entered, setEntered] = useState(false);

  const step = STEPS[current];

  useEffect(() => {
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 20);
    return () => clearTimeout(t);
  }, [current]);

  const goNext = () => setCurrent((c) => Math.min(c + 1, STEPS.length - 1));
  const goBack = () => setCurrent((c) => Math.max(c - 1, 0));

  const contactValid = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(answers.email);
    const phoneOk = answers.telefono.replace(/[^0-9]/g, "").length >= 9;
    return answers.nombre.trim().length > 1 && emailOk && phoneOk;
  }, [answers]);

  function selectChoice(key: ChoiceKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(goNext, 260);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (step.type === "cover" || step.type === "offer") goNext();
        else if (step.type === "contact" && contactValid) goNext();
      }
      if (e.key >= "1" && e.key <= "4" && step.type === "choice") {
        const idx = Number(e.key) - 1;
        const opt = step.options[idx];
        if (opt) selectChoice(step.key, opt);
      }
      if (e.key === "Backspace" && (document.activeElement as HTMLElement)?.tagName !== "INPUT") {
        goBack();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, contactValid]);

  const progress = (current / (STEPS.length - 1)) * 100;
  const showBotnav = step.type !== "success";
  const showFwd = step.type === "cover" || step.type === "offer" || step.type === "contact";
  const topAligned = step.type === "offer" || step.type === "contact";

  return (
    <div className="bg-fine-grid relative flex h-svh flex-col overflow-hidden bg-background">
      {/* Ruled invitation-card frame */}
      <div className="pointer-events-none absolute inset-3 rounded-sm border border-gold/40 sm:inset-5" />
      <div className="pointer-events-none absolute inset-4 rounded-sm border border-foreground/10 sm:inset-6" />
      {/* Scanner sweep — a slow signal pass over the whole page, the clearest
          "this is a live system" cue, kept faint enough to stay a texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, var(--accent-strong) 8%, transparent 18%)",
          backgroundSize: "100% 260%",
          backgroundRepeat: "no-repeat",
          animation: "scan-sweep 11s linear infinite",
        }}
      />

      <div className="relative flex flex-none items-center justify-between px-7 py-6 sm:px-12">
        <div className="flex items-center gap-2.5">
          <EmberlyMark className="h-6 w-auto" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold italic">Emberly</span>
            <span className="text-[0.58rem] tracking-[0.14em] text-text-dim uppercase">
              AI Automation Studio
            </span>
          </div>
        </div>
        <div className="text-xs tracking-wider text-text-dim tabular-nums">
          {String(current + 1).padStart(2, "0")} / {STEPS.length}
        </div>
      </div>

      <div className="relative mx-7 h-px flex-none bg-border sm:mx-12">
        <div
          className="h-full bg-accent-strong transition-all duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          key={current}
          className={cn(
            "absolute inset-0 flex flex-col items-center overflow-y-auto px-7 py-14 text-center transition-all duration-500 sm:px-12",
            topAligned ? "justify-start pt-10" : "justify-center",
            entered ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          )}
        >
          {step.type === "cover" && (
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-24 -inset-y-32 -z-10 opacity-[0.07]"
                style={{
                  background:
                    "repeating-linear-gradient(115deg, var(--accent-strong) 0px, var(--accent-strong) 2px, transparent 2px, transparent 64px)",
                  maskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, black 0%, transparent 75%)",
                }}
              />
              <div className="absolute -top-6 -right-16 hidden sm:block">
                <Seal />
              </div>
              <EmberlyMark className="mx-auto h-11 w-auto" />
              <h1 className="mt-8 max-w-[15ch] font-display text-[clamp(2rem,4.8vw,3.2rem)] font-bold text-balance">
                30 días gratis.
                <br />
                Resultados reales.
              </h1>
              <div className="mx-auto mt-6 w-fit sm:hidden">
                <Seal />
              </div>
              <p className="mx-auto mt-6 max-w-[42ch] text-[0.98rem] leading-relaxed text-text-muted">
                Emberly implementa gratis su asistente de <strong className="font-semibold text-foreground">inteligencia artificial</strong> para WhatsApp en 3 clínicas
                durante 30 días. Si funciona, sigues. Si no, no pagas nada.
              </p>
              <div className="mt-9">
                <InviteButton onClick={goNext}>Quiero mi plaza</InviteButton>
              </div>
            </div>
          )}

          {step.type === "offer" && (
            <div className="w-full max-w-xl text-left">
              <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold text-balance italic">
                La oferta de las 3 plazas.
              </h2>
              <dl className="mt-6 flex flex-col gap-4">
                {offerPoints.map((p) => (
                  <div key={p.label}>
                    <dt className="flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-wide text-accent-strong uppercase">
                      <p.icon className="size-3.5" strokeWidth={2.25} />
                      {p.label}
                    </dt>
                    <dd className="mt-1 max-w-[62ch] text-[0.94rem] leading-relaxed text-text-muted">
                      {p.body}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 border-t border-gold/40 pt-4">
                <p className="text-sm leading-relaxed text-text-muted">
                  <span className="font-semibold text-foreground">El candado: </span>
                  si al terminar el piloto quieres seguir, el precio de la mensualidad ya está
                  acordado desde el día 1 — antes de empezar. Sin sorpresas ni negociación al
                  final.
                </p>
              </div>
              <div className="mt-6 mb-24">
                <InviteButton onClick={goNext}>Ver si tengo plaza</InviteButton>
              </div>
            </div>
          )}

          {step.type === "choice" && (
            <>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.6rem,4vw,2.3rem)] font-semibold text-balance italic">
                {step.q}
              </h2>
              <div className="mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
                {step.options.map((opt, i) => {
                  const selected = answers[step.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectChoice(step.key, opt)}
                      className={cn(
                        "flex items-center gap-3 rounded-sm border px-5 py-3.5 text-[0.95rem] transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(.2,.9,.25,1.2)] active:scale-[0.96]",
                        selected
                          ? "border-accent-strong bg-accent-strong text-primary-foreground"
                          : "border-foreground/20 bg-transparent text-foreground hover:-translate-y-0.5 hover:border-accent-strong hover:bg-accent-dim"
                      )}
                    >
                      <span>{opt}</span>
                      <span
                        className={cn(
                          "rounded-[3px] border px-1.5 text-[0.68rem] tabular-nums",
                          selected ? "border-primary-foreground/40" : "border-foreground/20 text-text-dim"
                        )}
                      >
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step.type === "contact" && (
            <>
              <h2 className="max-w-[22ch] font-display text-[clamp(1.4rem,3.2vw,2rem)] font-semibold text-balance italic">
                {step.q}
              </h2>
              <p className="mt-3 max-w-[44ch] text-sm text-text-muted">{step.sub}</p>
              <div className="mt-8 flex w-full max-w-md flex-col gap-5 text-left">
                <Field
                  label="Nombre completo"
                  value={answers.nombre}
                  onChange={(v) => setAnswers((a) => ({ ...a, nombre: v }))}
                />
                <Field
                  label="Email"
                  type="email"
                  value={answers.email}
                  onChange={(v) => setAnswers((a) => ({ ...a, email: v }))}
                />
                <Field
                  label="Teléfono"
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={answers.telefono}
                  onChange={(v) => setAnswers((a) => ({ ...a, telefono: v }))}
                />
                <Field
                  label="Nombre de la clínica (opcional)"
                  value={answers.clinica}
                  onChange={(v) => setAnswers((a) => ({ ...a, clinica: v }))}
                />
              </div>
              <div className="mt-8 mb-20">
                <InviteButton disabled={!contactValid} onClick={goNext}>
                  Solicitar mi plaza
                </InviteButton>
              </div>
            </>
          )}

          {step.type === "success" && (
            <>
              <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-accent-strong text-accent-strong">
                <Check className="size-5" />
              </div>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.5rem,3.6vw,2.1rem)] font-semibold text-balance italic">
                Solicitud recibida{answers.nombre ? `, ${answers.nombre.split(" ")[0]}` : ""}.
              </h2>
              <p className="mt-4 max-w-[52ch] text-text-muted">
                Revisamos tu clínica y te contactamos en menos de 24h a{" "}
                <strong className="text-foreground">{answers.email}</strong> si hay plaza
                disponible. Al terminar los 30 días verás resultados reales — citas agendadas,
                leads recuperados, no-shows reducidos — y decides si continúas. Sin presión.
              </p>
            </>
          )}
        </div>
      </div>

      {showBotnav && (
        <div className="pointer-events-none absolute inset-x-0 bottom-7 flex items-center justify-center gap-4">
          <button
            onClick={goBack}
            disabled={current === 0}
            aria-label="Anterior"
            className="group pointer-events-auto flex size-9 items-center justify-center rounded-full border border-foreground/20 text-text-muted transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(.2,.9,.25,1.2)] hover:border-accent-strong hover:text-foreground active:scale-90 disabled:cursor-not-allowed disabled:opacity-25 disabled:active:scale-100"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
          <span className="pointer-events-auto text-[0.68rem] tracking-wider text-text-dim">
            Enter ↵ para continuar
          </span>
          <button
            onClick={() => {
              if (step.type === "contact") {
                if (contactValid) goNext();
              } else {
                goNext();
              }
            }}
            aria-label="Siguiente"
            className={cn(
              "group pointer-events-auto flex size-9 items-center justify-center rounded-full border border-foreground/20 text-text-muted transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(.2,.9,.25,1.2)] hover:border-accent-strong hover:text-foreground active:scale-90",
              !showFwd && "invisible"
            )}
          >
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function Seal({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative size-28 -rotate-3", className)}
      style={{ animation: "seal-press 0.7s cubic-bezier(.2,.8,.2,1) both" }}
    >
      {/* Holographic-foil ring — the luxury/futurist fusion: a security-hologram
          band, the same device banknotes and certificates use, spun slowly. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #a68a3f, #d8cd94, #7fd9c4, #9db4e8, #c79ee0, #d8cd94, #a68a3f)",
          animation: "holo-spin 8s linear infinite",
        }}
      />
      <div
        className="absolute inset-[3px] flex flex-col items-center justify-center gap-1 rounded-full text-primary-foreground shadow-[0_10px_24px_-8px_rgba(31,61,43,0.5)]"
        style={{ background: "var(--accent-strong)" }}
      >
        <svg viewBox="0 0 112 112" aria-hidden className="absolute inset-0">
          <defs>
            <path id="seal-rim" d="M 56,56 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
          </defs>
          <text fill="var(--gold)" fontSize="6.4" letterSpacing="2" className="font-sans">
            <textPath href="#seal-rim" startOffset="1%">
              INTELIGENCIA ARTIFICIAL &#8226; INTELIGENCIA ARTIFICIAL &#8226;
            </textPath>
          </text>
        </svg>
        <span className="relative font-display text-4xl leading-none font-bold">3</span>
        <span className="relative text-[0.56rem] tracking-[0.16em] uppercase">plazas</span>
      </div>
    </div>
  );
}

function InviteButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-sm border border-accent-strong bg-accent-strong px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground uppercase shadow-[0_10px_22px_-10px_rgba(31,61,43,0.6)] transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(.2,.9,.25,1.2)] hover:bg-transparent hover:text-accent-strong active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-accent-strong disabled:hover:text-primary-foreground disabled:active:scale-100"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/3 -skew-x-12 opacity-0 transition-[transform,opacity] duration-700 ease-out -translate-x-[10%] group-hover:translate-x-[480%] group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(100deg, transparent, rgba(166,138,63,0.65) 30%, rgba(127,217,196,0.55) 50%, rgba(199,158,224,0.6) 65%, transparent)",
        }}
      />
      <span className="relative">{children}</span>
      <ArrowRight className="relative size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs tracking-wide text-text-dim uppercase">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-b-2 border-foreground/25 bg-transparent px-1 py-2 text-base text-foreground outline-none placeholder:text-text-dim/60 focus-visible:border-accent-strong"
      />
    </div>
  );
}
