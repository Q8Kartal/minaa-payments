---
name: Minaã Payments
description: Shared payment ledger for the Minaã warehouse/parking team in Kuwait
colors:
  primary: "#0062AD"
  primary-mid: "#68B4FF"
  primary-light: "#E2F0FF"
  primary-tint: "#F2F8FF"
  secondary: "#E8411D"
  secondary-mid: "#FA937D"
  secondary-tint: "#FEF5F3"
  cream-50: "#FDF9F0"
  cream: "#FBF0DC"
  cream-200: "#F7E0B6"
  semantic-success: "#05AA00"
  semantic-warning: "#E5B11F"
  semantic-error: "#E56E1F"
  base-ink: "#161616"
  surface-card: "#FFFFFF"
  text: "#0062AD"
  text-muted: "rgba(0,98,173,.72)"
  text-faint: "rgba(0,98,173,.5)"
  border: "rgba(0,98,173,.14)"
typography:
  body:
    fontFamily: '"29LT Idris Round Regular", Cairo, sans-serif'
  label:
    fontFamily: '"29LT Idris Round Medium", Cairo, sans-serif'
  display:
    fontFamily: '"29LT Idris Round ExtraBold", Cairo, sans-serif'
spacing:
  space-025: "2px"
  space-050: "4px"
  space-075: "6px"
  space-100: "8px"
  space-150: "12px"
  space-200: "16px"
  space-250: "20px"
  space-300: "24px"
  space-400: "32px"
  space-500: "40px"
  space-600: "48px"
rounded:
  chip: "6px"
  tile: "10px"
  row: "13px"
  card: "18px"
  panel: "20px"
  shell: "28px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  stat-card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.card}"
    padding: "{spacing.space-200}"
  panel:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.card}"
    padding: "{spacing.space-250}"
---

# Design System: Minaã Payments

## 1. Overview

**Creative North Star: "The Minaã Ledger"**

A shared internal tool for the Minaã team in Kuwait, tracking warehouse and
long-term parking payments across three currencies. The interface is a floating
white dashboard shell on warm cream paper: a slim icon rail, a page header with
supporting information compressed into a strip, and the payment data itself
given the most room.

Right-to-left Arabic is the native reading order, not an adaptation of an
English-first layout. Every screen works on a phone in the field and a desktop
in the office.

**Key characteristics**
- One blue, one red, cream paper — no third brand hue
- Payment data always blue; red reserved for destructive actions
- 29LT Idris Round, where each weight is a separate font family
- Atlassian spacing scale on an 8px base unit
- Jelly UI web components; Lucide icons via Iconify

## 2. Colors

Source of truth: the Minaã brand guide, section 3.1 (Core Palette).

> "The Minaã core colors are Minaã Blue (#0062AD), Minaã Red (#E8411D), and
> Minaã Cream (#FBF0DC). Make sure to stick with these colors as your main brand
> palette everywhere. Don't swap them out for any unapproved options!"

### Core
- **Minaã Blue** `#0062AD` — the primary. Every action, every heading, all body
  copy, and all three payment types.
- **Minaã Red** `#E8411D` — the secondary. Used sparingly and with one meaning:
  **destructive actions** (delete, clear-all) plus the grand-total card.
- **Minaã Cream** `#FBF0DC` — text on brand-colored surfaces. `#FDF9F0`
  (Cream 50) is the page background.

Scale steps (`50/100/400`) appear only as background tints and focus accents —
never as alternative main colors.

### Semantic — success / warning / error ONLY
Per brand guide 3.5: *"Use Green for success, Yellow for warnings, and Orange
for errors. Do not use these as primary brand colours or substitute them with
unapproved ones."*

- **Green** `#05AA00` — success toasts
- **Yellow** `#E5B11F` — warning toasts
- **Orange** `#E56E1F` — error toasts, login validation errors

These appear **nowhere else**. They are not decoration and never brand colors.

### Type color
No black type. All copy is Minaã Blue: solid for headings, 72% for secondary
text, 50% for faint metadata. `--ink` (`#161616`) exists only for text on the
yellow warning toast, where light text is unreadable.

### Named rules
- **The One Meaning Rule.** A color means exactly one thing everywhere. Blue =
  data and actions. Red = destructive. Green/Yellow/Orange = success/warning/error.
- **Payment types are told apart by icon and label, not hue.** All three are blue;
  quarterly uses a slightly deeper background tint (Blue 100 vs Blue 50).

## 3. Typography

**29LT Idris Round**, served by Fontstand, with Cairo as fallback.

> **Each weight is a separate font family**, not a `font-weight`. Selecting a
> weight means swapping `font-family`. Use the tokens — never `font-weight` alone.

| Token | Family |
|---|---|
| `--font-regular` | `29LT Idris Round Regular` |
| `--font-medium` | `29LT Idris Round Medium` |
| `--font-bold` | `29LT Idris Round ExtraBold` |

Mapping: weights 600–700 → Medium; 800–900 → ExtraBold; everything else → Regular.

**Licensing:** domain-locked and metered (10,000 pageviews/month). Unregistered
origins get a 403 and the page silently falls back to Cairo — which is why Cairo
stays in every stack. `localhost`/`127.0.0.1` are auto-recognized; production
domains must be registered in the Fontstand account.

### Type scale
From the Minaã Foundations Figma text styles. Every step exists in all three
weights — the weight comes from the family tokens above, never `font-weight`.

| Style | Size / line-height | Token |
|---|---|---|
| Display 2xl | 72 / 90 | `--display-2xl` |
| Display xl | 60 / 72 | `--display-xl` |
| Display lg | 48 / 60 | `--display-lg` |
| Display md | 40 / 44 | `--display-md` |
| Display sm | 32 / 40 | `--display-sm` |
| Display xs | 24 / 32 | `--display-xs` |
| Text xl | 20 / 30 | `--text-xl` |
| Text lg | 18 / 28 | `--text-lg` |
| Text md | 16 / 24 | `--text-md` |
| Text sm | 14 / 20 | `--text-sm` |
| Text xs | 12 / 18 | `--text-xs` |

Each has a matching `-lh` token; always set the pair together.

### Applied
| Element | Step |
|---|---|
| Page title | Display sm → Display xs below 480px |
| Grand-total figure | Display xs |
| Stat values | Text xl |
| Panel titles, modal titles, invoice totals | Text md |
| Section titles, payment names and amounts, body | Text sm |
| Labels, counts, dates, metadata, chips | Text xs |

### Rules
- **12px is the floor.** Nothing renders smaller — several values were
  previously as small as 8.3px, which is unreadable in Arabic.
- **Use discrete steps, not fluid `clamp()`.** A clamp lands *between* steps at
  intermediate viewports, putting the type off-scale. Step down at a breakpoint
  instead.
- Jelly's internal text (e.g. `jelly-option` rows) follows the library's own
  metrics and is deliberately out of scope.

## 4. Spacing

The **Atlassian Design System** scale, 8px base unit.
Source: https://atlassian.design/foundations/spacing

| Token | px | | Token | px |
|---|---|---|---|---|
| `--space-025` | 2 | | `--space-250` | 20 |
| `--space-050` | 4 | | `--space-300` | 24 |
| `--space-075` | 6 | | `--space-400` | 32 |
| `--space-100` | 8 (base) | | `--space-500` | 40 |
| `--space-150` | 12 | | `--space-600` | 48 |
| `--space-200` | 16 | | | |

Token names mirror Atlassian's: the suffix is the percentage of the base unit,
so `space-200` = 200% = 16px.

### Usage ranges
- **0–8px** — compact UI: icon/text gaps, icon-button and badge padding, input
  padding, vertical spacing inside a card, gaps between repeating elements.
- **12–24px** — larger components: container padding, spacing between card
  elements, grid gutters.
- **32px+** — page layout: separation between page content and header.

### Applied
- Grid gutters (stats, payments) — `space-200`
- Panel padding — `space-250`; stat-card padding — `space-200`
- Section separation (`.main-col` gap) — `space-300`
- Header → content — `space-300` + `space-100` = **32px** (`space-400`)

### Rules
- **Never write a raw pixel value** for `gap`, `margin-top`, `margin-bottom`, or
  padding. Use a token. There are currently zero raw values for these.
- **Optical adjustment is allowed** — per Atlassian, visual weight sometimes
  needs a nudge off the exact step. Use the nearest token first; deviate only
  with a reason.
- **Out of scope:** `border-radius` (a separate foundation), `clamp()` fluid
  paddings, negative geometric offsets, and Jelly's own `--jelly-*` padding
  tokens.

## 5. Grid

The **Atlassian Design System** grid, **fixed-wide**.
Source: https://atlassian.design/foundations/grid

Fixed-wide is the default for dashboards, directories and search results —
which is what this app is. Max width **1296px including margins**, applied to
the main content area.

### Columns, gutters, margins by breakpoint
Breakpoints are measured on **viewport** width, not content-area width.

| Device | Name | Viewport | Columns | Gutter | Margin |
|---|---|---|---|---|---|
| Mobile | xxs | < 480px | 2 | `space-150` 12px | `space-200` 16px |
| Tablet | xs | 480–767px | 6 | `space-150` 12px | `space-200` 16px |
| Tablet | s | 768–1023px | 6 | `space-150` 12px | `space-200` 16px |
| Desktop | m/l/xl | ≥ 1024px | 12 | `space-200` 16px | `space-400` 32px |

Implemented as three custom properties on `.main-col` (`--grid-columns`,
`--grid-gutter`, `--grid-margin`) that the media queries reassign, so every
aligned container tracks the same grid from one source.

### What spans what

| Container | m (12 col) | s/xs (6 col) | xxs (2 col) |
|---|---|---|---|
| `.stat-card` | span 3 → 4 across | span 3 → 2 across | span 1 → 2 across |
| `.section-card` | span 4 → 3 across | span 2 → 3 across (span 3 below 768) | span 2 → 1 across |
| `.topbar`, `.form-wrap` | full width | full width | full width |

### Rules
- **The grid spans the main content area only.** The 88px icon rail is
  navigation and sits outside it — the shell's max width is therefore
  `1296px + 88px`.
- **Only top-level containers align to columns** — cards, panels, tables,
  forms. Buttons, icons and anything *inside* a card use space tokens instead.
- **Overlays are exempt.** Modals, the invoice/receipt, toasts and dropdowns
  float above the page and do not align to the grid.
- **Never let content bleed into a gutter or margin.**

Flex still handles all one-dimensional rows (top bar, rates strip, form row,
payment rows, icon rail) — the grid is for layout containers, not for
distributing controls within them.

The shell sizes to its content; it does not stretch to fill the viewport.

## 6. Elevation

Two shadows, both purposeful:
- **Card** `0 2px 10px rgba(22,22,22,.05)` — every card and panel.
- **Float** `0 30px 80px -20px rgba(0,67,123,.18), 0 10px 30px rgba(22,22,22,.06)`
  — the app shell only, lifting it off the cream page.

## 7. Components

All interactive controls are **Jelly UI** web components — there are no native
`<button>` elements in the light DOM.

### Buttons
- **Primary** — `jelly-button`, blue fill, cream label, pill.
- **Circle icon** — `jelly-icon-button shape="circle"`, blue fill, cream icon.
  Used for the icon rail and the add-payment action.
- **Destructive** — same, secondary red fill (clear-all, delete).
- **Full width** — use the `block` attribute. `width:100%` only stretches the
  host; the inner button stays content-sized and hugs the inline-start edge.
- **Icon-only buttons must carry `label`** for an accessible name.

### Cards & panels
White on cream, `--radius-card` 18px, card shadow, no elevation tiers.

### Feedback
- `jelly-badge` (with `live`) for counts; `jelly-chip` for section totals;
  `jelly-spinner` for loading.
- Toasts take a **type** (`success`/`warning`/`error`) that drives both the
  Lucide icon and the semantic color together, so they cannot drift apart.

### Icons
**Lucide only**, via `<iconify-icon>`. No emoji anywhere in the UI — flag emoji
in particular do not render on Windows. Toast states use one circle family:
`circle-check` / `circle-alert` / `circle-x`.

## 8. Do's and Don'ts

### Do
- **Do** keep exactly one blue and one red. Reach for a scale step only for
  tints and focus rings.
- **Do** use a spacing token for every gap, margin and padding.
- **Do** give every icon-only control an accessible `label`.
- **Do** use logical properties (`padding-inline`, `margin-inline-start`) — this
  is an RTL document and physical sides flip wrongly.
- **Do** reach for a Jelly component's own attribute (`shape`, `block`,
  `variant`) before overriding it with CSS.

### Don't
- **Don't** introduce a third brand hue, or use Green/Yellow/Orange for anything
  but success/warning/error.
- **Don't** use black for type.
- **Don't** use `font-weight` alone to get a bolder cut — swap the family.
- **Don't** style a web component's internals from outside; use its documented
  CSS custom properties or `::part()`.
- **Don't** put emoji in the UI.
- **Don't** hardcode column counts inline on grid containers — it defeats the
  responsive behaviour defined in CSS.
