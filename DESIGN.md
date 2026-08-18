# Design

<!-- impeccable:design-schema 1 -->

## Visual World

Editorial-luxury invitation. The funnel reads as a private, hand-numbered invitation to one of three pilot spots — not a SaaS onboarding wizard. Direction was pinned directly by the user ("lujo editorial"); no multi-candidate roll was run.

## Color

Restrained-to-Committed strategy: a bone-paper ground, near-black ink for type, one committed field of deep apothecary green (buttons, progress rule, selected states, the wax-seal medallion), and a thin gold rule used only as a hairline/border accent — never as a fill.

- `--paper` `#f6f1e7` — page ground
- `--paper-soft` `#efe8d9` — card/secondary surface
- `--foreground` `#221f19` — ink (primary text)
- `--text-muted` `#5b5648`, `--text-dim` `#8a8370` — secondary/tertiary text
- `--accent-strong` `#1f3d2b` — committed green (buttons, progress, selected chip, seal)
- `--gold` `#a68a3f` — hairline rule accent only (card frame, dividers), never a large fill
- Single theme. No dark mode — the paper/ink relationship is the brand, not a color-scheme toggle.

## Type

- Display: **Bodoni Moda** (`--font-bodoni`) — high-contrast Didone serif, set in italic for headings. Used only for h1/h2, sparingly, at a scale that carries the page.
- Body/UI: **Archivo** (`--font-archivo`) — grotesk, workhorse, all copy, labels, buttons, form fields.
- No monospace face. Tabular figures use `tabular-nums` on Archivo (step counter, chip index) rather than a separate "tech" mono face.
- No eyebrow/kicker labels above headings anywhere in the funnel — a heading always carries its own weight.

## Composition & Components

- **Frame**: the whole viewport is bordered by a double ruled line (`inset-3` gold hairline, `inset-4` ink hairline) evoking a printed invitation card edge.
- **Seal**: `components/emberly/funnel.tsx` → `Seal` — a rotated, double-bordered circular medallion in the committed green, "3 / PLAZAS" set in Bodoni + tracked Archivo caps. Positioned beside/overlapping the cover headline, never stacked above it as a label. One-time `seal-press` entrance animation (scale + rotate settle) — the page's single authored decorative motion.
- **InviteButton**: solid green fill, ink-free flat rectangle (not glossy/gradient), uppercase tracked Archivo label, arrow nudges on hover, inverts to outline on hover. Used for every primary CTA. Reserve it for conversion actions only.
- **Field**: ruled-paper input — no boxed border, just a 2px ink underline that turns green on focus. Label is small tracked uppercase Archivo above.
- **Choice chips**: thin-bordered rectangles, selected state fills solid green with paper-colored text; unselected hover tints pale green.
- **Steps**: `components/emberly/funnel.tsx` (`EmberlyFunnel`) drives a single-question-per-screen funnel (cover → offer explainer → 3 qualifying questions → contact → success), each screen its own `overflow-y-auto` panel so long content (the offer explainer, the contact form) scrolls clear of the fixed bottom nav rather than colliding with it.

## Known traps (found during build — avoid repeating)

- `MetalButton`/gradient-wrapper style buttons put `className` margin utilities directly on the inner `<button>`; since the wrapper is a `flex` container, those margins get absorbed into the wrapper's own box and inflate it. This class of button is no longer used in this build, but if a similar wrapper+inner-element component returns, wrap it in a plain spacing `<div>` instead of passing margin classes into its `className`.
- Passing `hidden sm:block` (or similar unprefixed display utility) as `className` into a component whose own root classes include `flex`/`flex-col` lets `tailwind-merge` drop the base `flex` class (same conflict group, last one wins). Toggle visibility on a wrapping `<div>`, never on the flex container itself.
- Any step with more than ~4 short lines of content needs `justify-start` (top-aligned) rather than `justify-center`, or the centered content pushes its trailing CTA into the fixed bottom nav band on shorter viewports.

## Brand marks preserved from the prior (tech) world

The horse-head + motion-streak `EmberlyMark` (`components/emberly/mark.tsx`) is a product brand commitment and was kept as-is, only recolored: ink fill for the head, committed green for the mane streaks, paper-colored eye "cutout."
