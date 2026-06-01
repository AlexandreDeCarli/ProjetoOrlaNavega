# Design System: Painel Costeiro Premium

Visual identity guidelines and components for the Plano de Gestão Integrada da Orla (PGI Orla) de Navegantes - SC.

## Colors

All color values are defined using the modern `oklch` color space to ensure beautiful gradients, high-contrast, and accessibility.

### Theme Colors
- **Fundo Principal (Primary Bg)**: `oklch(0.985 0.004 220)` — Ultra-soft coastal off-white with a very light teal/blue hue to prevent visual strain.
- **Superfícies (Surface/Glass)**: `rgba(255, 255, 255, 0.75)` — Soft glassmorphism background with a blur filter.
- **Superfície Opaca**: `oklch(1 0 0)` — Pure white surface.

### Typography Ink Ramps
- **Ink Primário (Primary Text)**: `oklch(0.18 0.02 240)` — Ocean deep navy, ensuring contrast ratios > 7:1 against backgrounds.
- **Ink Secundário (Labels)**: `oklch(0.42 0.02 240)` — Soft slate blue.
- **Ink Muted (Subtle Metadados)**: `oklch(0.55 0.015 240)` — Light blue-gray.

### Accent Coastal Colors
- **Acento Eco (Restinga)**: `oklch(0.60 0.14 165)` — Nature green representing local flora.
  - Light variation: `oklch(0.95 0.02 165)`
- **Acento Costal (Sea)**: `oklch(0.55 0.16 220)` — Vibrant maritime blue.
  - Light variation: `oklch(0.94 0.02 220)`
- **Acento Sol (Sand)**: `oklch(0.72 0.12 70)` — Warm sandy gold.
  - Light variation: `oklch(0.96 0.02 70)`

### Status Badges
- **Previsto / Planejado**: `oklch(0.68 0.10 50)` (Warm orange-sand) | Bg: `oklch(0.96 0.015 50)`
- **Em Execução**: `oklch(0.55 0.15 210)` (Dynamic ocean blue) | Bg: `oklch(0.94 0.02 210)`
- **Concluído / Superado**: `oklch(0.58 0.13 160)` (Preserved green) | Bg: `oklch(0.95 0.015 160)`
- **Mudança de Estratégia**: `oklch(0.58 0.11 320)` (Sophisticated violet) | Bg: `oklch(0.96 0.01 320)`

---

## Typography

- **Display & Headers**: **Outfit** (Weights: 300, 400, 500, 600, 700) — A modern, geometric sans-serif loaded from Google Fonts. Used for brand headings, card numbers, and section highlights.
- **Body, Table & Text**: **Plus Jakarta Sans** (Weights: 300, 400, 500, 600, 700) — Highly readable and spaced beautifully for technical data points.
- **Copy Restrictions**: Never use all-caps for long paragraphs. All caps is restricted to status labels, eyebrows, and short metadata tags under 4 words.

---

## Layout & Components

### 1. App Shell
- **Desktop (>= 992px)**: Sidebar navigation on the left (`width: 320px`), stickily attached. Content explorer on the right (`flex-grow: 1`), max-width restricted to `1400px` for optimal grid scanning.
- **Mobile (< 992px)**: Single column with a bottom padding buffer of `5rem` to leave space for the floating action button. The left sidebar collapses into an slide-out drawer on the right.

### 2. Explorer Card (Tabela)
- High-fidelity table that automatically reflows to responsive cards on viewport widths below `768px`.
- Interactivity: Rows are hoverable, yielding an interactive background transition to a soft blue tint (`rgba(0, 160, 220, 0.015)`).

### 3. Detail Slide-Over Panel
- Smoothly slides out from the right (`transform: translateX(0)`) using a premium easing transition (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Mobile viewport (< 768px) expands the slide-over to full width (`100vw`) for comfortable reading.

### 4. Collapsible Filter Groups (Accordions)
- Filter groups in the sidebar use semantic `<details>` and `<summary>` structures, removing default browser markers for a custom vector chevron indicator.
- Accordions animate dynamically upon expansion via a smooth slide-down and fade-in keyframe transition (`slideDown`).
- To prevent excessive scrolling inside the mobile drawer, the longest lists ("Linhas de Ação", "Secretaria / Responsável", and "Status") are programmatically collapsed during application initialization on viewports narrower than `992px`.

