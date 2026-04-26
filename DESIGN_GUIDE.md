# JOLT // 88 — Visual Design Guide

## Philosophy

**Memphis arcade · Sticker sheet · Y2K-adjacent.** Loud, chunky, intentional.
Primary candy colors on deep purple-black, hard ink-black borders, hard
offset block shadows, slight rotations, animated SVG patterns. Not minimalism
— maximalism with discipline.

The one rule: **commit to the loudness**. Half-measures (one accent color, a
single rotated element) read as accidents. Every component leans in.

---

## Typography

| Role | Family | Notes |
|---|---|---|
| Display | `Bungee` | Chunky 80s-arcade. Wordmarks, big titles, button labels. |
| Display (shaded) | `Bungee Shade` | Layered behind `Bungee` for the JOLT drop-shadow effect. |
| Body | `Familjen Grotesk` | Italic-capable workhorse for paragraphs, descriptions. |
| Mono | `DM Mono` | Eyebrows, badges, kbd hints, metadata. Always uppercase + tracked. |

Weights, sizes, and tracking are set in `app/globals.css` and per-component
in `app/page.tsx` / `app/settings/page.tsx`. Avoid introducing other families.

---

## Color tokens

Defined in `app/globals.css`:

```
--void        #110A2E   page background
--void-deep   #0A0620   panels under the page
--bone        #FCF4E4   cream paper / on-color text
--ink         #0A0A0A   borders, body text on candy

--pink        #FF3D7F   primary accent + default sticker hue
--cyan        #3DD9EB   secondary accent
--yellow      #FFD23F   highlight + selection
--mint        #7CE3A1   success states
--lavender   #B8A4FF   tertiary
--tangerine  #FF8A3D   tertiary
```

A note's sticker color and rotation are deterministically hashed from its
`id` (see `stable()` in `app/page.tsx`) so the layout is chaotic-looking but
stable across renders.

---

## Surfaces

- **Borders**: 3–4px solid `--ink`. Never use a thinner border — it reads as
  generic shadcn slop.
- **Shadows**: hard offset block shadows, no blur. Tokens:
  `--hard-shadow` (`6px 6px 0 var(--ink)`),
  `--hard-shadow-sm` (`3px 3px 0`),
  `--hard-shadow-lg` (`10px 10px 0`).
  On hover, translate `(-2px, -2px)` and bump shadow up.
- **Tape strips**: cream rectangles with a faint border, rotated `-2deg`,
  half-transparent. Used on stickers and modals.
- **Scanlines + Memphis grain**: applied globally via `body::before` /
  `body::after`. Don't disable.

---

## Motion

- Page-load: spring-physics pop on each sticker (Framer Motion `spring`,
  stiffness ~220, damping ~18, staggered by 0.05s × index).
- Hover on stickers: rotate to 0deg, scale 1.04, lift -6px.
- Ticker tape: 40s linear scroll, never pauses.
- Memphis bg pattern: 60s linear drift.
- Buttons: `translate(-2px, -2px)` on hover with shadow growth, snap back on
  active.

Don't add micro-interactions for their own sake. The aesthetic is loud
enough already.

---

## Components

- **Sticker card** (`app/page.tsx`) — colored block, ink border, tape strip
  top-center, folio number badge, dog-ear corner (on pinned), hashtag bubble
  pills, dashed-rule footer with relative-time + word-count badge.
- **Pinned banner** — diagonal black-on-yellow ribbon across the top-right
  corner of pinned stickers.
- **Big button** (`big-btn`) — pill-shaped, candy fill, ink border, hard
  shadow, optional `kbd` chip on the right.
- **Search pill** — rounded input with a yellow `/` chip prefix.
- **Filter chip** — pill that fills with its data-hue when active.
- **Modal** — index-card style with three-hole punch on the left, vermillion
  + cyan ruled-paper background, tape strip top-center, double offset shadow
  (one in pink, one in ink).
- **Avatar pill** (`UserMenu`) — 44px circle, ink border, cyan default,
  initials or photo, hard shadow.
- **Stat block** (settings) — bone block with ink border, big Bungee
  numeral, mono uppercase label.

---

## Don't

- No Tailwind classes. Styles are CSS-in-JSX strings adjacent to each
  component, plus the global tokens in `globals.css`.
- No emoji-as-icon when an actual glyph (◆ ★ ✦ ✺) reads better.
- No soft drop-shadows (`box-shadow: 0 4px 12px rgba(...)`). Always sharp
  offset blocks.
- No purple gradients on white. Backgrounds are deep ink with candy on top —
  reverse it (light bg, candy text) and the whole thing collapses.
- No sans-serif for display ("Inter for the title") — display is always
  `Bungee`.
