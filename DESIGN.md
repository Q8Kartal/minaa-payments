---
name: Minaã Payments
description: Shared payment ledger for the Minaã warehouse/parking team in Kuwait
colors:
  brand-orange: "#E8471C"
  brand-orange-dark: "#C23A16"
  monthly-purple: "#7C3AED"
  monthly-purple-light: "#EDE9FE"
  monthly-purple-mid: "#A78BFA"
  onetime-orange-light: "#FFF1ED"
  onetime-orange-mid: "#F47A5A"
  quarterly-teal: "#0D9488"
  quarterly-teal-dark: "#0F766E"
  quarterly-teal-light: "#F0FDFA"
  quarterly-teal-mid: "#5EEAD4"
  surface-bg: "#F5F5F5"
  surface-card: "#FFFFFF"
  text-primary: "#1A1A1A"
  text-muted: "#6B7280"
  border: "#E5E7EB"
typography:
  body:
    fontFamily: "Cairo, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Cairo, sans-serif"
    fontWeight: 700
  display:
    fontFamily: "Cairo, sans-serif"
    fontWeight: 800
rounded:
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "20px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "22px"
components:
  button-primary:
    backgroundColor: "{colors.brand-orange}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
  stat-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
---

# Design System: Minaã Payments

## 1. Overview

**Creative North Star: "The Minaã Ledger"**

A small internal tool for the Minaã team in Kuwait, tracking warehouse and long-term parking business payments across three currencies. The system is warm and approachable rather than corporate: an orange seagull-on-bollard mark, plain Arabic labels, and a single soft shadow used everywhere instead of a layered elevation system. It explicitly rejects the sterile grey-on-grey enterprise SaaS dashboard and avoids gamified or decorative flourishes: no badges, no confetti, no forced cheerfulness.

Right-to-left Arabic is the native reading order, not an adaptation of an English-first layout. Every screen must work equally well on a phone in the field and a desktop in the office; nothing is desktop-only.

**Key Characteristics:**
- Warm orange brand color carrying the primary actions and one-time payments
- Purple and teal as functional color-coding for monthly and quarterly payments, not decoration
- Flat cards on a light grey background, one consistent soft shadow, no elevation hierarchy
- Cairo (Arabic-optimized) as the only typeface, used at multiple weights for hierarchy instead of switching families

## 2. Colors

The palette is functional before it is decorative: color tells you what kind of payment you're looking at before you read the label.

### Primary
- **Brand Orange** (#E8471C): primary actions (add button, invoice button), one-time payment type, logo mark. Used deliberately, not spread evenly — it marks "the thing to act on" or "one-time money."

### Secondary
- **Monthly Purple** (#7C3AED): every monthly-payment surface — stat card accent, section header, badges, amounts. Never used for anything else, so purple always means "monthly" at a glance.

### Tertiary
- **Quarterly Teal** (#0D9488): every quarterly/3-month-subscription surface, same rule as purple above — teal always means "quarterly."

### Neutral
- **Surface Grey** (#F5F5F5): page background.
- **Card White** (#FFFFFF): every card, modal, and input surface.
- **Text Primary** (#1A1A1A): body text and headings.
- **Text Muted** (#6B7280): labels, counts, secondary metadata.
- **Border** (#E5E7EB): hairline dividers and input borders.

### Named Rules
**The One Meaning Rule.** Purple always means monthly, teal always means quarterly, orange always means one-time or "primary action" — never reassign these colors to an unrelated meaning elsewhere in the app.

## 3. Typography

**Body Font:** Cairo (with system sans-serif fallback)
**Display Font:** Cairo, heavier weight (800)
**Label Font:** Cairo, bold weight (700)

**Character:** One typeface, four weights (400/500/600/700/800) carrying the entire hierarchy — no secondary font is introduced anywhere, keeping the Arabic type consistent and readable at small sizes.

### Hierarchy
- **Display** (800, ~1.1–1.35rem): grand totals, invoice grand-total figure.
- **Headline** (800, ~0.95–1.05rem): stat card values, section sums.
- **Title** (700, ~0.82–0.92rem): section titles, form field group labels, button labels.
- **Body** (400–500, ~0.78–0.88rem): payment names, dates, list content.
- **Label** (700, ~0.68–0.78rem, uppercase for English fragments like "PAYMENT MANAGEMENT"): stat captions, muted counts.

## 4. Elevation

Flat by default. A single soft ambient shadow (`0 4px 24px rgba(0,0,0,.07)`) is reused on every card, modal, and rates bar — there is no tiered elevation system distinguishing "more important" surfaces by shadow depth. Depth, where it matters, is conveyed by color (card white on grey background) rather than shadow intensity.

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 4px 24px rgba(0,0,0,.07)`): every card-like surface, no exceptions.

## 5. Components

### Buttons
- **Shape:** 10px radius (`.btn-add`, `.btn-data`).
- **Primary:** brand-orange gradient background, white text, 10px 22px padding (`.btn-add`).
- **Data toolbar buttons:** each action (invoice, export, import, clear) gets its own tinted-background/colored-border variant rather than one generic button style — color communicates the action's nature (green=export, blue=import, red=destructive, orange=invoice).
- **Hover:** background deepens slightly, no shadow or transform change.

### Cards
- **Corner Style:** 14–20px radius depending on card size (stat cards 14px via `.stat-card`, modals 20px).
- **Background:** white on grey page background.
- **Shadow Strategy:** the single ambient shadow described in Elevation.
- **Border:** a colored left-edge accent bar identifies the stat card's payment-type color (existing pattern — kept consistent with the "One Meaning Rule" color-coding, since it's functional signal rather than decoration here, not a stripe added for pure ornament).
- **Internal Padding:** 18–20px.

### Inputs / Fields
- **Style:** 1.5px solid border (`--border`), 10px radius, Cairo font.
- **Focus:** currency/type selects get a colored left accent dot + tinted background matching the selected value (`updateCurrencyStyle`/`updateTypeStyle`) — a distinctive, non-generic touch specific to this app.

### Navigation
- No traditional nav; the toolbar row of colored action pills serves as the primary navigation between data operations (invoice/export/import/clear/sign-out). RTL order throughout, wraps to multiple rows on narrow screens rather than scrolling horizontally.

## 6. Do's and Don'ts

### Do:
- **Do** keep purple = monthly, teal = quarterly, orange = one-time/primary consistent everywhere, including any new screens or the invoice.
- **Do** design mobile-first for the toolbar and stat rows — the team checks this from the field on phones as often as from a desktop.
- **Do** keep the single ambient shadow; don't introduce a second shadow depth without a reason tied to real hierarchy.
- **Do** use Cairo weights (not a second typeface) for any new hierarchy need.

### Don't:
- **Don't** make this feel like a sterile enterprise SaaS dashboard (grey-on-grey dense tables, corporate jargon) — per PRODUCT.md's anti-references.
- **Don't** add gamified or decorative flourishes (badges, confetti, forced cheerfulness) — per PRODUCT.md's anti-references.
- **Don't** hardcode column counts as inline `style` attributes on grid containers — it silently defeats the responsive breakpoints already defined in the stylesheet (this exact bug was just fixed on the stats and invoice-summary grids; keep new grids defined in CSS with proper breakpoints instead).
