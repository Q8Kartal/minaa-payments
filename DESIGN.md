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
  # Source of truth: Figma Spacing collection VariableCollectionId:4159:1679
  space-0: "0px"
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
  space-800: "64px"
  space-1000: "80px"
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

## 0. Verification against Figma — status

Audited **2026-08-07** against *Minaã – Foundations*
(`iV0IGAxiWCCjwyIbc6w74W`) via the Figma MCP server. The Figma file is
**read-only**; corrections are made in this repo only.

### Variable collections found in the file
| Collection | Tokens | Values readable? | Status |
|---|---|---|---|
| **Colors** | Primary, Secondary, Neutral, Green, Yellow, Orange, Base, Alpha (11 steps each) | ✅ yes | **Verified — 100% match** |
| **Typography** | `Font Family/*`, `Font Weight/*`, `Size/*`, `Line Height/*`, `Paragraph Spacing/*` | ✅ yes (node `4008:3625`) | **Verified — all 11 steps match** |
| **Text styles** | `Text xs/sm/md/lg/xl` × Regular/Medium/ExtraBold; `Display xs…2xl` | ✅ yes | **Verified — names and values match** |
| **Spacing** (official) | `space-0` … `space-1000` (14) | ✅ yes | **Authored 2026-08-07 — matches Atlassian exactly, all 3 modes** |
| `Radius`, `Widths` | — | n/a | **Empty (0 variables)** — not yet defined in Figma |
| **Containers** | `container-max-width-desktop`, `container-padding-*` | ❌ no | Unverified — not bound on any node |
| **Minaã Button / Metrics** | `Button space/*`, `Button radius/Full`, `Button font size/*` | ❌ no | Unverified — not bound on any node |

### Why some values are unreadable
`get_variable_defs` returns only variables **bound to the node being queried**.
The file has a single page (*Colors*) whose frames bind colour variables only,
so the Spacing, Radius and Button collections are enumerable by name but their
numeric values are not exposed through the MCP server.

**To unblock:** share a node URL for a frame that uses those tokens (or select
one in Figma desktop) and they can be read and cross-checked.

### Spacing — closed, and now the source of truth
**Closed 2026-08-08.** There is one spacing system. The official `Spacing`
collection (`VariableCollectionId:4159:1679`) holds all 14 tokens across
Desktop / Mobile / Tablet, and the ten-frame **Spacing** page (`4415:1705`)
documents them. Together they are the **authority for all future Minaã design
and implementation work** — this file records them, it does not define them.
See §4. The earlier "two competing systems" question no longer applies: the
temporary `Spacing (Atlassian)` collection was deleted after confirming zero
remaining bindings.

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

**Source of truth:** the *Minaã – Foundations* Figma file (`iV0IGAxiWCCjwyIbc6w74W`),
read via the Figma MCP server. Verified 2026-08-07: every hex in the stylesheet
matches a Figma variable, and every `rgba()` is a Figma colour at alpha.
Treat the Figma file as read-only — correct the code, never the file.

### CSS token → Figma variable

| CSS | Figma variable | Value |
|---|---|---|
| `--primary` | `Colors/Primary/700` | `#0062ad` |
| `--primary-mid` | `Colors/Primary/400` | `#68b4ff` |
| `--primary-light` | `Colors/Primary/100` | `#e2f0ff` |
| `--primary-tint` | `Colors/Primary/50` | `#f2f8ff` |
| `--secondary` | `Colors/Secondary/600` | `#e8411d` |
| `--secondary-mid` | `Colors/Secondary/400` | `#fa937d` |
| `--secondary-tint` | `Colors/Secondary/50` | `#fef5f3` |
| `--cream-50` | `Colors/Neutral/50` | `#fdf9f0` |
| `--cream` | `Colors/Neutral/100` | `#fbf0dc` |
| `--cream-200` | `Colors/Neutral/200` | `#f7e0b6` |
| `--success` | `Colors/Green/600` | `#05aa00` |
| `--warning` | `Colors/Yellow/400` | `#e5b11f` |
| `--error` | `Colors/Orange/500` | `#e56e1f` |
| `--ink` | `Colors/Base/black` | `#161616` |
| `--card` | `Colors/Base/white` | `#ffffff` |

### Two deliberate deviations
1. **Text colour uses Primary at alpha** (`--muted` 72%, `--faint` 50%), not the
   `Colors/Alpha/alpha-black-*` tokens. The brand owner directed that no copy be
   black; all type is Minaã Blue.
2. **Page background is Neutral 50, cards are Base white.** The Figma note
   recommends Neutral 100 for backgrounds and cards. Both values are in the
   palette; this pairing was chosen and approved for contrast between the page
   and the floating cards.

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
- **Payment types are told apart by icon and label, not hue.** All three are blue
  and share one Blue 50 tint; the icon carries the distinction. Quarterly used to
  take Blue 100, which broke the rule this line states — and because that tint was
  also reused for row hover, the same gesture gave different feedback per section.
  Identity and interaction must not share a variable.

## 3. Typography

**29LT Idris Round**, self-hosted from `fonts/*.woff2`, with Cairo as fallback.
Figma variable: `Font Family/font-family-display` = `29LT Idris Round`.

> **Figma and the web differ here, deliberately.** In Figma the family is a
> single `29LT Idris Round` with numeric weights (`font-weight-regular` = 400,
> `font-weight-Extrabold` = 800). 29LT ships each weight as a **separate file**,
> and the web build keeps them as **three `@font-face` families**, so on the web
> the weight is selected by swapping `font-family`. Using `font-weight: 800`
> alone would render Regular. Use the tokens.

| Token | Family |
|---|---|
| `--font-regular` | `29LT Idris Round Regular` |
| `--font-medium` | `29LT Idris Round Medium` |
| `--font-bold` | `29LT Idris Round ExtraBold` |

Mapping: weights 600–700 → Medium; 800–900 → ExtraBold; everything else → Regular.

**Delivery:** self-hosted WOFF2 in `fonts/`, ~130 KB per weight, `font-display:
swap`. No per-domain registration, no 403 on unfamiliar origins, no pageview
meter, and `file://` works. Cairo stays in the app's stack as a fallback for the
case where a font file fails to load.

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

**Verification (node `4008:3625`, 2026-08-07):** all **11 steps verified
directly against the Figma variables** — every size and line-height matches
exactly, with zero mismatches.

Figma also defines a `Paragraph Spacing` variable per step (Display 2xl 72,
xl 60, lg 48, md 36, sm 30, xs 24; Text xl 20, lg 18, md 16, sm 14, xs 12).
Not implemented: the app has no multi-paragraph text blocks. Add as
`margin-block-end` if that changes.

Figma exposes two family variables, `font-family-display` and
`font-family-text` — both resolve to `29LT Idris Round`, so one stack serves
both. Weights are Regular 400, Medium 500, ExtraBold 800.

There is also a `Text sm/Regular underlined` style. Not implemented — the app
has no underlined text.

**Faux-bold — this section previously said the opposite, and was wrong.**
It claimed no synthesis was occurring, on the evidence that each face measured
the same width at weight 400 and 800. That test cannot detect the problem:
Chrome's synthetic bold smears the outline without materially changing advance
widths, so equal widths are a false negative. Synthesis *was* occurring — the
headings computed 700 and Jelly's button label 640 against faces registered at
400 — and it mangled Arabic on phones, thickening joined strokes until they
merged and filling the counters.

Now every `@font-face` claims `font-weight: 100 900`, so a request for any
weight resolves to that face exactly with nothing left to synthesise, and
`html { font-synthesis: none }` backs it up. Verified the way that actually
detects it: per family, the rendered width at 400, 700 and 900 is identical
(Regular 287.4px, Medium 304.2px, ExtraBold 342.4px — three distinct cuts), and
`font-synthesis` computes `none`. The `font-weight` declarations stay so the
Cairo fallback still gets real weights.

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

## 4. Spacing — the official reference

> ### Source of truth
> Spacing for all Minaã design and implementation work is governed by two
> artefacts, and **nothing else**:
>
> | Artefact | Location | Role |
> |---|---|---|
> | **Spacing documentation page** | Foundations file, page `Spacing`, node **`4415:1705`** | Documents the system — the scale, ranges and layout principles |
> | **`Spacing` variable collection** | `VariableCollectionId:4159:1679` | Enforces it — 14 variables, modes Desktop / Mobile / Tablet, scopes `GAP` + `WIDTH_HEIGHT` |
>
> The page explains the rules; the collection makes them binding. Where this
> document and the Figma artefacts ever disagree, **Figma wins** and this file
> is what gets corrected.
>
> The ten frames are: `01 Overview` · `02 8 pixel base unit & Scale` ·
> `03 Space tokens` · `04 Spacing usage` · `05 Layout guidelines · Group by
> similarity` · `06 Group by proximity` · `07 Create order and hierarchy` ·
> `08 Introduce visual rhythm` · `09 Use optical adjustment` · `10 In practice`.
>
> **Naming — a hard Figma constraint.** Figma rejects `.` in variable names
> outright (probed directly; even `a.b` fails). Tokens are therefore stored as
> **`space-0` … `space-1000`** — hyphenated, flat, no grouping — while the
> documentation and this file refer to them canonically as `space.0` …
> `space.1000`. Each variable's `description` records its canonical name. Only
> the separator differs; values, order and base-unit relationships are exact.

### The approved scale

Fourteen steps on an **8px base unit**, derived from the Atlassian Design System.
Source: https://atlassian.design/foundations/spacing

| Canonical | Figma variable | CSS | Multiplier | REM | px |
|---|---|---|---|---|---|
| `space.0` | `space-0` | `--space-0` | 0× | 0rem | **0** |
| `space.025` | `space-025` | `--space-025` | 0.25× | 0.125rem | **2** |
| `space.050` | `space-050` | `--space-050` | 0.5× | 0.25rem | **4** |
| `space.075` | `space-075` | `--space-075` | 0.75× | 0.375rem | **6** |
| `space.100` | `space-100` | `--space-100` | 1× | 0.5rem | **8** ← base unit |
| `space.150` | `space-150` | `--space-150` | 1.5× | 0.75rem | **12** |
| `space.200` | `space-200` | `--space-200` | 2× | 1rem | **16** |
| `space.250` | `space-250` | `--space-250` | 2.5× | 1.25rem | **20** |
| `space.300` | `space-300` | `--space-300` | 3× | 1.5rem | **24** |
| `space.400` | `space-400` | `--space-400` | 4× | 2rem | **32** |
| `space.500` | `space-500` | `--space-500` | 5× | 2.5rem | **40** |
| `space.600` | `space-600` | `--space-600` | 6× | 3rem | **48** |
| `space.800` | `space-800` | `--space-800` | 8× | 4rem | **64** |
| `space.1000` | `space-1000` | `--space-1000` | 10× | 5rem | **80** |

**How the suffix works.** The token suffix is a *percentage of the 8px base
unit* — `space.200` = 200% = 16px. The scale is **not** all whole multiples of
8: it deliberately includes fractional steps *below* the base unit
(`space.025` = 2px, `space.050` = 4px, `space.075` = 6px) and larger multiples
above it. The base unit anchors the scale; it is not its smallest step.

### Negative values
`space.negative.025` through `space.negative.400` (−2px to −32px) exist in
**code and documentation only** — no Figma Variables are created for them.
They are for breaking out of a container's padding or overlapping elements.
Before reaching for one, check whether a Bleed primitive fits instead.

### Usage ranges

**Small — `space.0` to `space.100` (0–8px)**, for small and compact UI:
- Gap between small icons and text
- Container padding of small components (badges, icon buttons, table cells)
- Gap between repeating elements (button groups)
- Padding within input components
- Vertical spacing between elements in a card (title↔description, description↔actions)
- Gap between a trigger and its elevated element (dropdown button ↔ menu)

**Medium — `space.150` to `space.300` (12–24px)**, for larger, less dense UI:
- Container padding of larger components (buttons)
- Space between an avatar/large icon and its content (section messages)
- Vertical spacing between elements in cards
- Spacing between items in less densely packed or larger components

**Large — `space.400` to `space.1000` (32–80px)**, for the largest UI and layout:
- Space between content on the page (top of page ↔ header)
- Alignment within larger pieces of content

### Layout principles

A layout is the elements **plus the space between them**. Use these together
with the tokens; the tokens alone do not produce a good layout.

1. **Group by similarity.** Consistent spacing around elements gives them visual
   similarity and signals a semantic relationship. A list or table of items
   should be spaced consistently so it reads as one cohesive collection.
2. **Group by proximity.** Distance carries meaning — things placed close
   together are assumed to be related. Put elements of the same flow or user
   action closer together, and less related things further apart.
3. **Create order and hierarchy.** Users look for order to reduce the effort of
   scanning. Rank elements with size *and* whitespace: larger draws focus, and
   varying the space around an element groups or separates it to impart
   importance.
4. **Introduce visual rhythm — through consistent repetition.** Repeating the
   same spacing between elements (a table, a list, a board column) creates a
   predictable rhythm and reinforces that those elements are equal in
   importance. Varying spacing and size deliberately creates points of
   attention and improves scannability. Repetition is the default; variation
   must be intentional.
5. **Use optical adjustment.** A spacing system improves consistency but does
   not guarantee visual harmony. Visual weight — a filled disc against a text
   cap, for instance — may need a minor deviation from the standard pattern.
   Adjust *using the scale's units* and visual judgement, never with a raw value.

### Applied in `minaa-payments.html`
- Grid gutters (stats, payments) — `space-200`
- Panel padding — `space-250`; stat-card padding — `space-200`
- Section separation (`.main-col` gap) — `space-300`
- Header → content — `space-300` + `space-100` = **32px** (`space-400`)

### Rules
- **Never write a raw pixel or REM value** for padding, gap, item spacing or
  layout spacing. Use a token. In Figma, **bind** the property to the variable
  rather than typing the number — a typed value that happens to equal a token
  is still a violation.
- **Bind, then verify what renders.** A binding can be present and still resolve
  wrongly; confirm the resolved value, not just that a binding exists.
- **Optical adjustment is allowed** (principle 5). Use the nearest token first;
  deviate only with a reason, and stay on the scale.
- **Token compliance is a floor, not a goal.** A layout can be fully bound and
  still be wrong. Every choice must also produce clear hierarchy, semantic
  grouping and optical balance. If one auto-layout frame can only express one
  gap but the content has two different relationships, **restructure** — nest a
  sub-group — rather than flattening the semantics.
- **Judge gaps optically.** The perceived gap is the token *plus* the leading
  inside each adjacent line box, `(lineHeight − fontSize) / 2`. Aim for roughly
  **2:1** between "separate level" and "same unit" spacing.
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
