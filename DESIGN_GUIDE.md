# JOLT — Visual Design Guide

## Design Philosophy

**Editorial Minimalism**: A brutally minimal, magazine-inspired aesthetic that prioritizes typography, whitespace, and intentional motion over decoration.

---

## Typography System

### Font Families

**Display (Headings):**
```
font-family: 'Crimson Text', serif;
```
- Used for: Page title, note titles, modal headers
- Weights: 400 (regular), 600 (semibold), 700 (bold)
- Character: Classic, literary, authoritative

**Body (UI & Content):**
```
font-family: 'IBM Plex Mono', monospace;
```
- Used for: All UI text, note content, buttons, inputs
- Weights: 300 (light), 400 (regular), 500 (medium)
- Character: Technical, precise, editorial

### Type Scale

```
Page Title:    clamp(3rem, 8vw, 5.5rem)  — 88px max
Note Title:    1.5rem (24px)
Modal Title:   2rem (32px)
Body:          0.875rem (14px)
Labels:        0.75rem (12px)
Tags:          0.7rem (11px)
```

### Typography Rules

1. **Tight Leading on Display:** line-height: 0.95 for dramatic impact
2. **Loose Leading on Body:** line-height: 1.7 for readability
3. **Uppercase Labels:** All metadata in uppercase with letter-spacing: 0.1em
4. **Negative Letter-spacing:** Display titles use letter-spacing: -0.02em

---

## Color System

### Palette

```css
--color-bg:      #FAFAFA  /* Off-white background */
--color-text:    #0A0A0A  /* Near-black text */
--color-accent:  #CCFF00  /* Electric lime */
--color-muted:   #666666  /* Mid-gray for metadata */
--color-border:  #E0E0E0  /* Light gray borders */
--color-card:    #FFFFFF  /* Pure white cards */
--color-shadow:  rgba(0, 0, 0, 0.08)  /* Subtle shadows */
```

### Color Usage Rules

1. **High Contrast:** Always maintain WCAG AA contrast ratios
2. **Single Accent:** Electric lime used sparingly for:
   - Primary action buttons
   - Hover underlines
   - Pinned note highlights
   - Focus states
3. **No Gradients:** Solid colors only (except subtle pinned note gradient)
4. **Black & White Dominance:** 90% of the interface is achromatic

### Accent Application

```
✓ Primary buttons
✓ Active states
✓ Hover indicators
✓ Pinned note accents
✗ Text color
✗ Large background areas
✗ Decorative elements
```

---

## Spacing System

### Scale

```css
--space-xs: 0.5rem   (8px)
--space-sm: 1rem     (16px)
--space-md: 1.5rem   (24px)
--space-lg: 2.5rem   (40px)
--space-xl: 4rem     (64px)
```

### Application

- **Container Padding:** var(--space-xl) desktop, var(--space-lg) mobile
- **Card Padding:** var(--space-lg)
- **Form Groups:** var(--space-lg) margin-bottom
- **Grid Gap:** var(--space-lg)
- **Button Padding:** var(--space-sm) var(--space-md)

---

## Component Patterns

### Note Cards

```
Dimensions:  min-width: 320px (in grid)
Borders:     2px solid var(--color-border)
Background:  var(--color-card)
Padding:     var(--space-lg)

Hover State:
  - transform: rotate(-1deg) translateY(-8px)
  - box-shadow: 12px 12px 0 var(--color-shadow)
  - border-color: var(--color-text)
  - Top border: 4px accent line scales in

Pinned State:
  - border-color: var(--color-accent)
  - Subtle lime gradient background
```

### Buttons

```
Default:
  - Background: var(--color-text)
  - Color: var(--color-bg)
  - Border: 2px solid var(--color-text)
  - Text: uppercase, 0.875rem, letter-spacing: 0.05em

Hover:
  - Background: transparent
  - Color: var(--color-text)
  - transform: translateY(-2px)

Accent:
  - Background: var(--color-accent)
  - Color: var(--color-text)
  - Border: 2px solid var(--color-accent)
```

### Inputs

```
Base:
  - Border: 2px solid var(--color-border)
  - Background: var(--color-bg) (for inputs in white modal)
  - Padding: var(--space-sm) var(--space-md)
  - Font: var(--font-mono), 0.875rem

Focus:
  - Border: var(--color-accent)
  - Box-shadow: 0 0 0 3px rgba(204, 255, 0, 0.1)
```

### Modal

```
Overlay:
  - Background: rgba(0, 0, 0, 0.7)
  - Backdrop-filter: blur(8px)

Content:
  - Border: 3px solid var(--color-text) (thicker than cards)
  - Box-shadow: 20px 20px 0 rgba(0, 0, 0, 0.1) (geometric offset)
  - Max-width: 700px
  - Padding: var(--space-xl)
```

---

## Motion & Animation

### Timing Functions

Primary: `cubic-bezier(0.16, 1, 0.3, 1)` — Smooth, elastic easing

### Animations

**Page Load:**
```css
@keyframes fadeIn {
  from: opacity 0, translateY(20px)
  to: opacity 1, translateY(0)
}
Duration: 0.6s
Stagger: 0.1s per element
```

**Card Hover:**
```
Duration: 0.3s
Effects: rotate, translateY, box-shadow, border-color
```

**Modal:**
```
Overlay: fade (0.2s)
Content: scale + fade (0.3s)
```

**Accent Line:**
```
Transform: scaleX(0) → scaleX(1)
Origin: left
Duration: 0.3s
```

### Animation Principles

1. **Staggered Reveals:** Elements appear sequentially (0.05-0.1s delay)
2. **Exaggerated Transforms:** Large movements (8px translateY, 12px shadows)
3. **Geometric Motions:** Rotations, scales, directional slides
4. **Purposeful Easing:** Elastic curves, not linear
5. **High-Impact Moments:** Page load, hover states, modal open/close

---

## Layout Principles

### Grid System

```
Desktop:
  - repeat(auto-fill, minmax(320px, 1fr))
  - gap: var(--space-lg)

Mobile:
  - Single column
  - Full-width cards
```

### Composition Rules

1. **Generous Top Spacing:** Large title with breathing room
2. **Asymmetric Hover:** Cards rotate diagonally, not straight up
3. **Diagonal Flow:** Visual movement from top-left to bottom-right
4. **Controlled Density:** Cards dense with content but separated by whitespace
5. **Breaking the Grid:** Hover states pop out of alignment

---

## Responsive Breakpoints

```
Mobile:   < 768px
  - Single column grid
  - Stack header vertically
  - Full-width search bar
  - Reduced title size (3rem)
  - Reduced padding (var(--space-lg) var(--space-md))

Desktop:  ≥ 768px
  - Multi-column grid
  - Horizontal header layout
  - Max-width search bar (400px)
  - Full title size (5.5rem)
  - Full padding (var(--space-xl) var(--space-lg))
```

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Body text (#0A0A0A on #FAFAFA): 17.8:1
- Muted text (#666666 on #FAFAFA): 5.1:1
- Accent (#CCFF00 with #0A0A0A text): 15.2:1

### Interactive States

- All buttons have visible focus rings
- Hover states distinct from default
- Active states provide feedback
- Custom checkbox styled but accessible

### Motion

- Animations are decorative, not functional
- No parallax or vestibular triggers
- Respects prefers-reduced-motion (can be added)

---

## What Makes This Design Unique

### Avoids Generic AI Aesthetics:

❌ No Inter/Roboto/system fonts
❌ No purple gradients
❌ No soft, rounded corners everywhere
❌ No predictable card grids
❌ No subtle, timid shadows
❌ No evenly-distributed color palettes

### Embraces Distinctive Choices:

✓ Bold serif + mono pairing
✓ Stark monochrome + single electric accent
✓ Sharp edges and geometric forms
✓ Dramatic, offset shadows
✓ Exaggerated diagonal hover states
✓ Editorial typography hierarchy

---

## Implementation Notes

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
```

### CSS Variables Organization

Define once in `:root`, use throughout:
```css
:root {
  /* Colors */
  --color-bg: #FAFAFA;
  /* ... */
  
  /* Typography */
  --font-display: 'Crimson Text', serif;
  /* ... */
  
  /* Spacing */
  --space-xs: 0.5rem;
  /* ... */
}
```

### Component Scoping

Use CSS-in-JSX with Next.js `<style jsx>` for component-scoped styles while maintaining access to global variables.

---

**Result:** A cohesive, memorable design system that feels intentionally crafted, not algorithmically generated.
