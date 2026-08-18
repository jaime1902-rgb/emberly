# Design

<!-- impeccable:design-schema 2 -->

## Visual World

"Invitación de acceso restringido — editorial con nervio de IA." The funnel is presented inside a single centered card (a restricted-access invitation), floating over a bone-paper page with a faint technical grid. Editorial trust (Bodoni serif, generous type) fused with a live-system pulse (circuit-node card corners, a terminal-style spots counter, an animated progress rule). Direction was pinned directly by the user with an exact palette, type system, and per-screen copy; built to that spec.

This is the **second** committed palette for this project — an earlier "apothecary green + gold" editorial-luxury direction (still in git history) was fully replaced, not extended, when the user asked to mix in a "futurista" register. Green no longer appears anywhere.

## Color

Restrained-to-Committed strategy, two accent roles kept deliberately separate:

- `--paper` `#f5f0e8` — page ground
- `--paper-soft` (card) `#fdfaf4` — the card surface
- `--foreground` `#1a1a1a` — ink (primary text)
- `--text-muted` `#4b4b4b`, `--text-dim` `#7a7a7a` — secondary/tertiary text (neutral gray, not green-tinted)
- `--navy` `#1a1a3e` — **authority**: logo, primary buttons, active/selected borders
- `--electric` `#4f46e5` — **system signal only**: the spots counter, data tags, circuit nodes, progress bar, focus rings, hover accents. Never used for large fills outside the data-tag chips.
- `--gold` `#c9a84c` — reserved for the seal only (rim text + shimmer stop)
- Single theme. No dark mode.

## Type

- Display: **Bodoni Moda** (`--font-bodoni`), italic, for every step's question headline.
- Body/UI: **Archivo** (`--font-archivo`) for copy, fields, buttons.
- Data/metric labels: **Exo 2** (`--font-exo2`, Tailwind utility `font-data`) — small caps, tracked, exclusively for the counter labels, data tags ("TICKET ALTO", "CASO PRIORITARIO"), the step counter, and the seal's reference code. This is the one place a second sans face is allowed — it signals "machine-read data," not body copy.
- No eyebrow/kicker labels above headings.

## Composition & Components

- **Card shell**: the whole funnel lives inside one `rounded-sm` card (`bg-card`, `border-electric/15`) centered on the page; the border doubles as the "circuit connection lines" the brief asked for. Four small `--electric` dots (`CircuitCorners`) sit at its corners with a slow pulse.
- **Progress rule**: a 1.5px `--electric` line across the card's top edge, animated with a spring (`framer-motion`), not a linear tween — reads as a system load indicator.
- **Hero counter**: "SOLO QUEDAN" / a huge Bodoni numeral in navy / a blinking `--electric` `|` cursor / "PLAZAS DISPONIBLES" — a terminal-readout treatment of the scarcity count. The count must stay truthful (see PRODUCT.md); it is never inflated for urgency.
- **Seal**: `Seal` in `funnel.tsx` — 80px medallion, navy fill, gold rim text ("SELECCIÓN · EMBERLY AI · 2025"), a conic-gradient shimmer ring animating navy → indigo → gold → navy (`holo-spin`). Its entrance (`seal-press`) doubles as the confirmation screen's "stamp."
- **Choice cards**: stacked full-width rows, `border-l-[3px] border-l-electric` + `bg-electric-dim` when selected, `whileHover={{x:4}}` via Framer Motion. Data tags (`DataTag`) are Exo 2 small caps on `--electric-dim`.
- **Two-phase question**: the "dolor" step reveals a second micro-question (message volume, 3 pills) via fade-in once an answer is chosen, before advancing — handled as local state within one step, not a separate step in the counter.
- **Fields**: `border-b-2` only, Exo 2 tracked label above, `focus:border-electric`. No boxed inputs.
- **Buttons**: `NavyButton` — solid navy, hover fades the border to `--electric` and lightens the fill slightly (150ms). No gradients, no shine sweep in this direction (the prior direction's iridescent hover was dropped along with the green palette).
- **WhatsApp CTA**: on confirmation, a real `wa.me` deep link pre-filled with the applicant's name/clinic. `EMBERLY_WHATSAPP_NUMBER` in `funnel.tsx` is a **placeholder** — replace before launch.
- **Background**: `.bg-tech-grid` (utility in `globals.css`) — 40px navy-tinted grid lines behind the card, "plano técnico" texture. Global `*:focus-visible` outline is 2px solid `--electric` per spec.

## Known traps (carried forward — avoid repeating)

- A wrapper+inner-button component (e.g. a gradient "chrome" button) must never receive margin utilities via its own `className` if its root is a `flex` container — the margin gets absorbed into the wrapper's box. Wrap it in a plain spacing `<div>` instead.
- Passing an unprefixed display utility (`hidden`, `block`) as `className` into a component whose own root already sets `flex`/`flex-col` lets `tailwind-merge` drop the base `flex` class. Toggle visibility on a wrapping `<div>`, never on the flex container itself.
- Hand-drawing a brand mark from scratch is a last resort — this project's horse-mark went through several bad iterations before the user pointed at the real logo asset; always ask for/locate the real file first (check `~/Downloads` for recently pasted chat images) before approximating one in SVG.
