"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmberlyMark } from "./mark";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import DisplayCards from "@/components/ui/display-cards";

type ChoiceKey = "negocio" | "dolor" | "horas";

type Step =
  | { type: "cover" }
  | { type: "choice"; key: ChoiceKey; eyebrow: string; q: string; options: string[] }
  | { type: "contact"; eyebrow: string; q: string; sub: string }
  | { type: "success" };

const STEPS: Step[] = [
  { type: "cover" },
  {
    type: "choice",
    key: "negocio",
    eyebrow: "Paso 1 de 4",
    q: "¿Qué tipo de negocio tienes?",
    options: [
      "Pyme o negocio local",
      "Agencia / freelancer",
      "Empresa mediana o corporativa",
      "Otro / aún no lo sé",
    ],
  },
  {
    type: "choice",
    key: "dolor",
    eyebrow: "Paso 2 de 4",
    q: "¿Qué te está quitando más tiempo ahora mismo?",
    options: [
      "Atención al cliente y llamadas",
      "Captación y seguimiento de leads",
      "Procesos internos repetitivos",
      "No lo sé, quiero que me asesoren",
    ],
  },
  {
    type: "choice",
    key: "horas",
    eyebrow: "Paso 3 de 4",
    q: "¿Cuántas horas a la semana dedicáis a tareas repetitivas?",
    options: ["Menos de 5h", "Entre 5 y 15h", "Entre 15 y 30h", "Más de 30h"],
  },
  {
    type: "contact",
    eyebrow: "Último paso",
    q: "¿Dónde te contactamos para agendar?",
    sub: "Con esto te proponemos un hueco para la consultoría — sin coste, sin compromiso.",
  },
  { type: "success" },
];

const serviceCards = [
  {
    icon: <MessageCircle className="size-4 text-blue-300" />,
    title: "Chatbots",
    description: "Atención 24/7 que convierte",
    date: "Servicio",
    iconClassName: "text-blue-300",
    titleClassName: "text-white",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Phone className="size-4 text-blue-300" />,
    title: "Voice Agents",
    description: "Llamadas gestionadas por IA",
    date: "Servicio",
    iconClassName: "text-blue-300",
    titleClassName: "text-white",
    className:
      "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Workflow className="size-4 text-blue-300" />,
    title: "Automatizaciones",
    description: "Procesos que se ejecutan solos",
    date: "Servicio",
    iconClassName: "text-blue-300",
    titleClassName: "text-white",
    className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
  },
];

const emptyAnswers = {
  negocio: null as string | null,
  dolor: null as string | null,
  horas: null as string | null,
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (step.type === "cover") goNext();
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

  function selectChoice(key: ChoiceKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(goNext, 260);
  }

  const progress = (current / (STEPS.length - 1)) * 100;
  const showBotnav = step.type !== "success";
  const showFwd = step.type !== "choice" && step.type !== "success";

  return (
    <div className="bg-grid relative flex h-svh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, var(--ink) 78%)",
        }}
      />
      <div className="flex flex-none items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <EmberlyMark className="h-[23px] w-[26px] drop-shadow-[0_0_10px_rgba(47,141,255,0.5)]" />
          <span className="font-logo text-lg font-semibold">Emberly</span>
        </div>
        <div className="font-mono text-xs tracking-wider text-text-dim">
          <b className="font-medium text-accent-strong">{String(current + 1).padStart(2, "0")}</b> / {STEPS.length}
        </div>
      </div>

      <div className="h-[2px] flex-none bg-border">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent-strong shadow-[0_0_12px_rgba(47,141,255,0.6)] transition-all duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          key={current}
          className={cn(
            "absolute inset-0 flex flex-col items-center overflow-y-auto px-6 py-20 text-center transition-all duration-500 sm:px-10",
            step.type === "contact" ? "justify-start pt-14" : "justify-center",
            entered ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          )}
        >
          {step.type === "cover" && (
            <>
              <div
                aria-hidden
                className="absolute top-1/2 left-1/2 -z-10 h-[min(70vw,760px)] w-[min(70vw,760px)] -translate-x-1/2 -translate-y-1/2 animate-[glow-pulse_5s_ease-in-out_infinite] rounded-full blur-[6px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(47,141,255,0.28) 0%, rgba(47,141,255,0.09) 42%, transparent 70%)",
                }}
              />
              <div className="mx-auto mb-6 w-[clamp(84px,12vw,120px)] drop-shadow-[0_0_22px_rgba(47,141,255,0.5)]">
                <EmberlyMark />
              </div>
              <h1 className="font-logo text-[clamp(2.4rem,7vw,4rem)] font-semibold">Emberly</h1>
              <p className="mt-2.5 flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.26em] text-accent-strong uppercase">
                <span className="size-1.5 animate-[dot-pulse_2s_ease-in-out_infinite] rounded-full bg-accent-strong shadow-[0_0_8px_2px_var(--primary)]" />
                AI Automation Studio
              </p>
              <p className="mt-6 max-w-[44ch] text-text-muted">
                Descubre en menos de un minuto qué puedes automatizar en tu negocio — y agenda tu
                consultoría gratuita.
              </p>
              <div className="mt-8 mb-16 w-full max-w-md scale-[0.6] opacity-90 sm:mb-20 sm:scale-75">
                <DisplayCards cards={serviceCards} />
              </div>
              <LiquidButton onClick={goNext}>
                Empezar <ArrowRight className="size-4" />
              </LiquidButton>
            </>
          )}

          {step.type === "choice" && (
            <>
              <div className="mb-4 font-mono text-xs tracking-wider text-accent-strong uppercase">
                {step.eyebrow}
              </div>
              <h2 className="max-w-[18ch] font-display text-[clamp(1.7rem,4.4vw,2.7rem)] font-bold text-balance">
                {step.q}
              </h2>
              <div className="mt-11 flex max-w-2xl flex-wrap justify-center gap-3">
                {step.options.map((opt, i) => {
                  const selected = answers[step.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectChoice(step.key, opt)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border px-5.5 py-4 text-[0.98rem] transition-all hover:-translate-y-px hover:border-accent-strong hover:bg-accent-dim",
                        selected
                          ? "border-accent-strong bg-accent-dim shadow-[inset_0_0_0_1px_var(--accent-strong)]"
                          : "border-border bg-foreground/[0.03]"
                      )}
                    >
                      <span>{opt}</span>
                      <span className="rounded-[5px] border border-border px-1.5 font-mono text-[0.68rem] text-text-dim">
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
              <div className="mb-4 font-mono text-xs tracking-wider text-accent-strong uppercase">
                {step.eyebrow}
              </div>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.4rem,3.2vw,2.1rem)] font-bold text-balance">
                {step.q}
              </h2>
              <p className="mt-3 max-w-[44ch] text-sm text-text-muted">{step.sub}</p>
              <div className="mt-6 flex w-full max-w-md flex-col gap-2.5 text-left">
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
                  label="Empresa (opcional)"
                  value={answers.empresa}
                  onChange={(v) => setAnswers((a) => ({ ...a, empresa: v }))}
                />
              </div>
              <LiquidButton className="mt-5 mb-20" size="lg" disabled={!contactValid} onClick={goNext}>
                Agendar consultoría <ArrowRight className="size-4" />
              </LiquidButton>
            </>
          )}

          {step.type === "success" && (
            <>
              <div className="mb-5 flex size-15 items-center justify-center rounded-full bg-accent-dim text-accent-strong">
                <Check className="size-6" />
              </div>
              <h2 className="font-display text-[clamp(1.7rem,4.4vw,2.7rem)] font-bold text-balance">
                Solicitud recibida{answers.nombre ? `, ${answers.nombre.split(" ")[0]}` : ""}.
              </h2>
              <p className="mt-4 max-w-[44ch] text-text-muted">
                Te escribimos a <strong className="text-foreground">{answers.email}</strong> en
                menos de 24h laborables para agendar tu consultoría gratuita.
              </p>
            </>
          )}
        </div>
      </div>

      {showBotnav && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-4">
          <button
            onClick={goBack}
            disabled={current === 0}
            aria-label="Anterior"
            className="pointer-events-auto flex size-9.5 items-center justify-center rounded-full border border-border bg-foreground/[0.03] text-text-muted transition-colors hover:border-accent-strong hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="pointer-events-auto font-mono text-[0.68rem] tracking-wider text-text-dim">
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
              "pointer-events-auto flex size-9.5 items-center justify-center rounded-full border border-border bg-foreground/[0.03] text-text-muted transition-colors hover:border-accent-strong hover:text-foreground",
              !showFwd && "invisible"
            )}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
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
      <label className="font-mono text-xs tracking-wider text-text-dim uppercase">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-border bg-foreground/[0.03] px-4 py-2.5 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
      />
    </div>
  );
}
