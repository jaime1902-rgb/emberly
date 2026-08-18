"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmberlyMark } from "./mark";
import { MetalButton } from "@/components/ui/liquid-glass-button";

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
    q: "¿Ya captáis pacientes por WhatsApp o Instagram?",
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

const offerPoints: { label: string; body: string }[] = [
  {
    label: "Qué es",
    body: "Implementamos gratis nuestro asistente de IA en tu clínica durante 30 días. Funciona desde el día 1. No pagas nada mientras dura el piloto.",
  },
  {
    label: "Qué recibe tu clínica",
    body: "Un asistente que contesta y agenda pacientes por WhatsApp e Instagram al instante, 24/7. Implementación, métricas del periodo y soporte directo incluidos.",
  },
  {
    label: "Por qué es gratis",
    body: "Acabamos de llegar a Madrid. Tenemos la tecnología, nos falta el caso real. A cambio del piloto, documentamos resultados reales: citas, leads, no-shows.",
  },
  {
    label: "Por qué solo 3",
    body: "Cada implementación es atención personalizada. No se puede hacer bien con veinte clínicas a la vez, así que limitamos las plazas para que el resultado sea real.",
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
        <div className="font-mono text-xs tracking-wider text-text-dim tabular-nums">
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
            "absolute inset-0 flex flex-col items-center overflow-y-auto px-6 py-16 text-center transition-all duration-500 sm:px-10",
            topAligned ? "justify-start pt-10" : "justify-center",
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
              <div className="w-[clamp(56px,7vw,72px)] drop-shadow-[0_0_18px_rgba(47,141,255,0.5)]">
                <EmberlyMark />
              </div>

              <TicketBadge className="mt-6" />

              <h1 className="mt-6 max-w-[15ch] font-display text-[clamp(1.9rem,4.6vw,2.9rem)] font-extrabold text-balance">
                30 días gratis. Resultados reales.
              </h1>
              <p className="mt-4 max-w-[44ch] text-sm text-text-muted sm:text-base">
                Emberly implementa gratis su asistente de WhatsApp e Instagram en 3 clínicas de
                Madrid durante 30 días. Si funciona, sigues. Si no, no pagas nada.
              </p>
              <div className="mt-7 mb-16">
                <MetalButton variant="gold" onClick={goNext}>
                  Quiero mi plaza <ArrowRight className="size-4" />
                </MetalButton>
              </div>
            </>
          )}

          {step.type === "offer" && (
            <div className="w-full max-w-xl text-left">
              <h2 className="font-display text-[clamp(1.6rem,3.6vw,2.3rem)] font-bold text-balance">
                La oferta de las 3 plazas.
              </h2>
              <dl className="mt-6 flex flex-col gap-5">
                {offerPoints.map((p) => (
                  <div key={p.label}>
                    <dt className="text-sm font-semibold text-accent-strong">{p.label}</dt>
                    <dd className="mt-1 max-w-[62ch] text-[0.94rem] leading-relaxed text-text-muted">
                      {p.body}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm leading-relaxed text-text-muted">
                  <span className="font-semibold text-foreground">El candado: </span>
                  si al terminar el piloto quieres seguir, el precio de la mensualidad ya está
                  acordado desde el día 1 — antes de empezar. Sin sorpresas ni negociación al
                  final.
                </p>
              </div>
              <div className="mt-7 mb-20">
                <MetalButton variant="gold" onClick={goNext}>
                  Ver si tengo plaza <ArrowRight className="size-4" />
                </MetalButton>
              </div>
            </div>
          )}

          {step.type === "choice" && (
            <>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.7rem,4.4vw,2.5rem)] font-bold text-balance">
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
                      <span className="rounded-[5px] border border-border px-1.5 font-mono text-[0.68rem] text-text-dim tabular-nums">
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
              <h2 className="max-w-[22ch] font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold text-balance">
                {step.q}
              </h2>
              <p className="mt-3 max-w-[44ch] text-sm text-text-muted">{step.sub}</p>
              <div className="mt-7 flex w-full max-w-md flex-col gap-2.5 text-left">
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
              <div className="mt-6 mb-20">
                <MetalButton variant="gold" disabled={!contactValid} onClick={goNext}>
                  Solicitar mi plaza <ArrowRight className="size-4" />
                </MetalButton>
              </div>
            </>
          )}

          {step.type === "success" && (
            <>
              <div className="mb-5 flex size-15 items-center justify-center rounded-full bg-accent-dim text-accent-strong">
                <Check className="size-6" />
              </div>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold text-balance">
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

function TicketBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex -rotate-2 items-center gap-4 rounded-2xl border-2 border-dashed border-accent-strong/50 bg-navy-soft/80 px-6 py-3 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.65)]",
        className
      )}
    >
      <span className="font-mono text-3xl leading-none font-medium tabular-nums text-foreground">
        3<span className="text-text-dim">/3</span>
      </span>
      <span className="text-left font-mono text-[0.62rem] leading-tight tracking-[0.16em] text-accent-strong uppercase">
        Plazas
        <br />
        disponibles
      </span>
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
      <label className="text-xs tracking-wide text-text-dim uppercase">{label}</label>
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
