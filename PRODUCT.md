# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion (step transitions, spring-animated progress bar, choice-card hover).

## Users

**Launch-campaign audience (current, overrides the earlier broad-audience decision for this phase):** owners/decision-makers of aesthetic medicine, hair (capilar), or dental clinics, high average ticket, already capturing patients via WhatsApp, who feel leads slip through or that staff loses too much time answering messages manually. Not targeting the biggest clinics — targeting the clearest pain + willingness to pilot.

The earlier broad "decided-on-AI, comparing vendors" audience still describes Emberly's eventual general positioning once past this launch campaign; record both, current campaign wins for now.

## Product Purpose

Emberly is an AI automation studio. The site's only job is lead capture. Current build is a single, specific campaign: **la oferta de las 3 plazas** — Emberly is selecting 3 clinics for a free 30-day pilot of its WhatsApp booking assistant, in exchange for real, documented results (case studies). The funnel sells this specific offer and qualifies applicants for it; it is not general informational content.

## Positioning

Launch-phase positioning: Emberly just launched and has the technology but no local case studies yet. The 3-clinic pilot is an explicit, honest trade — free implementation for the clinic, a real documented case study for Emberly. Longer-term positioning (once past launch): deep technical specialization in AI/automation, custom-built agents and complex integrations rather than templated setups.

## Operating Context

Visitor is a clinic owner/manager evaluating whether to apply for one of the 3 free pilot spots. Current funnel (5 screens, one question per screen, inside a single card — see DESIGN.md): hero (terminal-style scarcity counter) → clinic type → pain point (with a fade-in follow-up on message volume) → contact details (nombre, clínica, teléfono WhatsApp, ciudad — no email field) → confirmation with a WhatsApp deep link. "Solicitar mi plaza" is a reviewed application, not an instant booking — Emberly confirms fit within 24h. The standalone "offer explainer" screen (qué es / qué recibe / por qué gratis / por qué solo 3 / el candado) that an earlier build had was dropped from the flow at the user's explicit direction; that trust content now lives only in the hero subhead and the legal line under the contact form.

## The 3-Spots Offer — durable facts (do not alter without the user)

- **What:** Emberly implements its automation assistant free for 3 clinics for 30 days. Works from day 1. Clinic pays nothing during the pilot.
- **What the clinic gets:** an assistant that answers and books patients via WhatsApp instantly, 24/7. Implementation, period metrics, and direct support included throughout the pilot.
- **Why it's free:** Emberly just launched — has the tech, lacks real local case studies. The trade: clinic gets the service free, Emberly gets a real, measurable, documented case study (appointments booked, leads answered, no-shows reduced).
- **Why only 3:** each implementation needs personalized attention; quality/results require limiting scope, not scaling to many at once.
- **Selection criteria:** aesthetic/hair/dental clinics, high ticket, already capturing patients via WhatsApp, feeling leads slip or staff overloaded answering messages. Not "biggest clinic" — "clearest pain + willingness to try."
- **After the 30 days:** Emberly presents results (messages answered, appointments booked, recovered leads). Clinic then decides whether to continue on the paid monthly plan — no pressure, no fine print.
- **The trust lock ("el candado"):** the monthly price is agreed on day 1, before the pilot starts. No end-of-pilot negotiation or surprise pricing — the pilot is the proof, the pricing decision is made upfront.

## Capabilities and Constraints

- Current build is a client-side-only funnel (no backend/CRM wired up yet). Captured leads/applications are not persisted or sent anywhere — this is a known, temporary gap before a production backend/CRM integration.
- The confirmation screen's WhatsApp button links to a placeholder number (`EMBERLY_WHATSAPP_NUMBER` in `components/emberly/funnel.tsx`) — **must be replaced with Emberly's real WhatsApp Business number before launch.**
- No real client case studies exist yet — that is the explicit reason the 3-spots offer exists. Do not present any example/illustrative content as if it were a completed real case study from this campaign.
- Cookie consent / RGPD banner is deliberately deferred to the production build; not present in the current demo.
- Spanish-only for now (no i18n).

## Brand Commitments

- Name: **Emberly**, subtitle **AI Automation Studio**. Tagline: "Automatizamos procesos. Multiplicamos resultados."
- Mark: the studio's real horse-head logo asset (navy, motion-streak mane), extracted with a transparent background at `public/emberly-mark.png`; the full lockup with wordmark lives at `public/emberly-logo-full.png`. Not a redrawn approximation — use the real asset for the mark everywhere.
- Current visual system (palette, type, components) is recorded in `DESIGN.md`, not here — this file changed once already (an earlier tech/navy palette was fully replaced by an editorial-luxury direction) and product truth should not duplicate or re-describe it.
- Proprietary methodology named **EMBERLY** (one step per letter): Escucha, Mapeo, Blueprint, Ejecución, Rodaje, Lanzamiento, Y seguimos.
- Services offered for this campaign: a WhatsApp booking/response assistant. (Longer-term service line beyond the campaign — Chatbots, Voice Agents, Automatizaciones, Integraciones — still applies once past launch.)

## Evidence on Hand

None yet — this is the stated reason the 3-spots offer exists. No real customers, testimonials, case studies, or metrics exist. Nothing in the funnel may claim a completed real result; the offer language itself is the only "proof" on hand (a genuine, specific commitment, not a fabricated stat).

## Product Principles

- One goal per screen: move the applicant toward requesting a spot, never toward passive reading.
- Scarcity is real, not decorative: 3 spots, stated plainly, never inflated or fake-urgency'd.
- Radical transparency is the trust mechanic: the offer explains what it is, why it's free, why only 3, and locks pricing upfront — nothing hidden for later.
- Never present fabricated cases, clients, or metrics as real.
- Minimize friction: qualify in a handful of quick steps, not a long interrogation.
