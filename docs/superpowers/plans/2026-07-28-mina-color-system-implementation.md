# Mina Brand Color System Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's current color palette (brand orange, purple/teal/orange payment types, grey background) with the Mina brand color system — Mina Blue as primary, Blue/Green/Red for monthly/quarterly/one-time payment types, and Mina Cream for the page background — per `docs/superpowers/specs/2026-07-28-mina-color-system-design.md`.

**Architecture:** This is a single-file HTML app (`minaa-payments.html`) with no build tools, no test framework, and no npm. All payment-type and brand colors are centralized as `:root` CSS custom properties, consumed via `var(--name)` throughout the CSS and in two JS functions (`updateTypeStyle()` builds inline styles from these same variables). This means the entire color swap is achieved by changing 13 hex values inside one `:root { ... }` block, plus two standalone hardcoded-hex literals elsewhere in the file that don't go through a variable. Because there's no automated test suite, "testing" here means: (1) grep-verifying the exact old hex values are gone from the file, and (2) a manual browser check of every payment-type-colored surface.

**Tech Stack:** Plain CSS custom properties, vanilla JS. No dependencies added or removed.

---

## Task 1: Update `:root` brand and payment-type color variables

**Files:**
- Modify: `minaa-payments.html:11-23`

This task changes the 13 CSS custom property values that drive every payment-type color and the page background throughout the entire app (CSS rules under `.inv-chip.monthly`, `.stat-card.monthly`, `.monthly-section .badge`, etc. — none of these need to change, they all reference `var(--purple)` etc. and will pick up the new colors automatically).

- [ ] **Step 1: Confirm current values**

Run:
```bash
grep -n "^\s*--\(brand\|purple\|orange\|teal\|bg\):" "minaa-payments.html"
```
Expected output (13 lines, matching the block at lines 11-23):
```
11:      --brand:        #E8471C;
12:      --brand-dark:   #C23A16;
13:      --purple:       #7C3AED;
14:      --purple-light: #EDE9FE;
15:      --purple-mid:   #A78BFA;
16:      --orange:       #E8471C;
17:      --orange-light: #FFF1ED;
18:      --orange-mid:   #F47A5A;
19:      --teal:         #0D9488;
20:      --teal-dark:    #0F766E;
21:      --teal-light:   #F0FDFA;
22:      --teal-mid:     #5EEAD4;
23:      --bg:           #F5F5F5;
```
If this doesn't match exactly, stop and re-read the file at that location before proceeding — the edit in Step 2 depends on this exact text.

- [ ] **Step 2: Replace the block**

Find this exact block in `minaa-payments.html`:
```css
      --brand:        #E8471C;
      --brand-dark:   #C23A16;
      --purple:       #7C3AED;
      --purple-light: #EDE9FE;
      --purple-mid:   #A78BFA;
      --orange:       #E8471C;
      --orange-light: #FFF1ED;
      --orange-mid:   #F47A5A;
      --teal:         #0D9488;
      --teal-dark:    #0F766E;
      --teal-light:   #F0FDFA;
      --teal-mid:     #5EEAD4;
      --bg:           #F5F5F5;
```

Replace it with:
```css
      --brand:        #0062AD;
      --brand-dark:   #005090;
      --purple:       #0062AD;
      --purple-light: #F2F8FF;
      --purple-mid:   #68B4FF;
      --orange:       #E8411D;
      --orange-light: #FEF5F3;
      --orange-mid:   #FA937D;
      --teal:         #05AA00;
      --teal-dark:    #158200;
      --teal-light:   #E9FFE7;
      --teal-mid:     #00E214;
      --bg:           #FDF9F0;
```

Note: variable **names** are unchanged (`--purple` still means "monthly accent", `--orange` still means "one-time accent", etc.) — only the hex values change. This keeps every existing `var(--purple)`/`var(--teal)`/`var(--orange)`/`var(--brand)` reference throughout the file correct without touching them.

- [ ] **Step 3: Verify the old hex values are gone**

Run:
```bash
grep -n "#7C3AED\|#0D9488\|#C23A16\|#EDE9FE\|#A78BFA\|#FFF1ED\|#F47A5A\|#0F766E\|#F0FDFA\|#5EEAD4\|#F5F5F5" "minaa-payments.html"
```
Expected: no output (the grep finds nothing — all old values have been replaced). Note `#E8471C` (old `--brand`/`--orange` value) is intentionally NOT in this grep list yet — it's handled in Task 2, since it also appears in two other places in the file that are not part of this `:root` block.

- [ ] **Step 4: Commit**

```bash
git add "minaa-payments.html"
git commit -m "feat: adopt Mina brand color system for primary/payment-type colors"
```

---

## Task 2: Update the two hardcoded hex literals

**Files:**
- Modify: `minaa-payments.html:555` (jelly-theme accent attribute)
- Modify: `minaa-payments.html:611` (فاتورة شاملة toolbar button inline style)

Two places in the file hardcode `#E8471C` (the old brand orange) directly instead of referencing `var(--brand)`. After Task 1, `var(--brand)` is now Mina Blue, so these two literals are now stale and must be updated to match.

- [ ] **Step 1: Confirm current values**

Run:
```bash
grep -n '#E8471C\|#FFF1ED' "minaa-payments.html"
```
Expected output (2 lines):
```
555:<jelly-theme mode="light" accent="#E8471C">
611:  <jelly-button size="small" style="--jelly-fill:#FFF1ED;--jelly-label:var(--brand)" onclick="openInvoice()"><iconify-icon icon="lucide:receipt-text"></iconify-icon> فاتورة شاملة</jelly-button>
```
If this doesn't match exactly, stop and re-read the file at these lines before proceeding.

- [ ] **Step 2: Update the jelly-theme accent**

Find:
```html
<jelly-theme mode="light" accent="#E8471C">
```
Replace with:
```html
<jelly-theme mode="light" accent="#0062AD">
```

- [ ] **Step 3: Update the توolbar button's light-fill literal**

Find:
```html
  <jelly-button size="small" style="--jelly-fill:#FFF1ED;--jelly-label:var(--brand)" onclick="openInvoice()"><iconify-icon icon="lucide:receipt-text"></iconify-icon> فاتورة شاملة</jelly-button>
```
Replace with:
```html
  <jelly-button size="small" style="--jelly-fill:#E2F0FF;--jelly-label:var(--brand)" onclick="openInvoice()"><iconify-icon icon="lucide:receipt-text"></iconify-icon> فاتورة شاملة</jelly-button>
```
(`#E2F0FF` is Mina Blue 100, a light primary tint replacing the old light-orange literal. `--jelly-label:var(--brand)` is untouched — it already resolves to the new blue automatically via Task 1.)

- [ ] **Step 4: Verify no old brand-orange hex remains anywhere**

Run:
```bash
grep -n "#E8471C" "minaa-payments.html"
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add "minaa-payments.html"
git commit -m "fix: update hardcoded brand-orange literals to Mina Blue"
```

---

## Task 3: Full manual verification (user must do this)

**Files:** none (verification only)

There is no automated test suite for this app — verification is manual, in a real browser, against the actual running app (open `minaa-payments.html` directly, or the GitHub Pages–hosted copy).

- [ ] **Step 1: Background and primary color**
  - Reload the app. The page background should now read as warm cream (`#FDF9F0`), not grey.
  - The "+ إضافة" add-payment button, focus rings on inputs, and the `jelly-theme` accent throughout should read as blue, not orange.

- [ ] **Step 2: Payment-type colors — stats row**
  - The four stat cards (Monthly / Quarterly / One-time / Total) at the top: Monthly's accent bar and value text should be blue, Quarterly's should be green, One-time's should be red (visually close to the old orange).

- [ ] **Step 3: Payment-type colors — payment list**
  - In the three-column payment grid, each section's badge, title, item background tint, name color, and amount color should match: Monthly = blue, Quarterly = green, One-time = red.

- [ ] **Step 4: Add-payment form and edit modal**
  - Change the "نوع الدفعة" (type) selector between monthly/quarterly/onetime and confirm the `jelly-select` recolors correctly each time (fill/label/accent all update, matching the type's new color) — this exercises `updateTypeStyle()`.
  - Open the edit modal on an existing payment and confirm the same recoloring works there too.

- [ ] **Step 5: Invoice and receipt modals**
  - Open "🧾 فاتورة شاملة" (full invoice): confirm the toolbar button itself now reads blue/light-blue (not orange), and inside the invoice, each type's chip, section header, and totals show the correct new color (blue/green/red).
  - If any payments are marked unpaid, use "☑️ تحديد الدفعات" to select some and generate a selection receipt; confirm its coloring matches too.

- [ ] **Step 6: Readability check**
  - For each of the three light-background/accent-text pairs (blue-on-blue-50, green-on-green-50, red-on-red-50), confirm the accent text is comfortably readable against its light background at normal viewing distance — call out anything that looks low-contrast, especially the new green (`#05AA00`), which is more saturated than the old teal.

- [ ] **Step 7: Report back**
  - Report any surface that still shows an old color, or any readability issue found in Step 6, so it can be fixed before this task is marked complete.

---

## Self-review notes

**Spec coverage:** All four spec sections are covered — the 13-variable mapping table (Task 1), the two hardcoded-literal fixes (Task 2), and the testing plan (Task 3) map directly to the spec's own testing-plan bullets. Semantic success/warning/error wiring, currency-indicator colors, `DESIGN.md`, and Jelly UI Phase 2/3/4 are explicitly out of scope per the spec and are not tasked here.

**Placeholder scan:** No TBDs; every step has literal exact text to find/replace or an exact command with expected output.

**Type/value consistency:** The hex values used in Task 1's replacement block and Task 2's two literals match the spec's mapping table exactly (cross-checked against the spec file). `--brand` and `--orange` both change from the same old value (`#E8471C`) to two *different* new values (`#0062AD` and `#E8411D` respectively) — this is intentional per the spec (Blue = primary, Red = one-time; these were coincidentally identical before and diverge now), not a typo.
