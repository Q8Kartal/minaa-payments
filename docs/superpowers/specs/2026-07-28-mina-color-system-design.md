# Mina Brand Color System Adoption

## Goal
Replace the app's current ad-hoc color palette (brand orange, purple/teal/orange payment-type colors, flat grey background) with the official Mina brand color system, extracted from the client-supplied brand guide (`colorP.pdf`). Mina Blue becomes the new primary brand color (replacing orange), and all three payment-type colors are remapped onto the new palette.

## Background — the Mina color system (from `colorP.pdf`)
Six color families, each an 11-step 50–950 scale, plus Base and Alpha:

- **Mina Blue** (Primary): 50 `#F2F8FF` · 100 `#E2F0FF` · 200 `#C8E3FF` · 300 `#A1CFFF` · 400 `#68B4FF` · 500 `#1C96F8` · 600 `#007FDA` · **700 `#0062AD` (signature/primary)** · 800 `#005090` · 900 `#00437B` · 950 `#00264B`
- **Mina Red** (Secondary): 50 `#FEF5F3` · 100 `#FEEAE5` · 200 `#FDD7CF` · 300 `#FCBBAD` · 400 `#FA937D` · 500 `#F2664A` · **600 `#E8411D` (signature/secondary)** · 700 `#B93515` · 800 `#952A0F` · 900 `#7B220A` · 950 `#4A1104`
- **Mina Cream** (Neutral): 50 `#FDF9F0` · **100 `#FBF0DC` (primary neutral)** · 200 `#F7E0B6` · 300 `#F2CA82` · 400 `#E0B05D` · 500 `#BD8D45` · 600 `#AB7941` · 700 `#895A30` · 800 `#6B4423` · 900 `#57361B` · 950 `#311F0C`
- **Mina Green** (semantic success): 50 `#E9FFE7` · 100 `#CCFFC7` · 200 `#90FF89` · 300 `#00F812` · 400 `#00E214` · 500 `#00CF11` · **600 `#05AA00` (signature)** · 700 `#158200` · 800 `#146600` · 900 `#115400` · 950 `#063100`
- **Mina Yellow** (semantic warning): 50 `#FFF7E5` · 100 `#FEECC4` · 200 `#FEDB8D` · 300 `#FBC423` · **400 `#E5B11F` (primary yellow)** · 500 `#D6A31C` · 600 `#B98716` · 700 `#94630E` · 800 `#774B08` · 900 `#633C06` · 950 `#392202`
- **Mina Orange** (semantic error): 50 `#FFF6F1` · 100 `#FEEAE0` · 200 `#FDD5C1` · 300 `#FCB692` · 400 `#FF9151` · **500 `#E56E1F` (key error color)** · 600 `#C55B19` · 700 `#A14712` · 800 `#85380C` · 900 `#702D09` · 950 `#431903`
- **Base:** white `#FFFFFF` · black `#161616`. **Alpha:** white 10/20/30/40/50% and black 10/20/30/40/50%.

Guide usage notes: Blue 700 is primary (buttons/CTAs/active nav/focus). Red 600 is secondary (secondary buttons/links/highlights). Cream 100 is the cornerstone neutral for backgrounds/cards. Green/Yellow/Orange are reserved as semantic success/warning/error colors, not general decoration.

## Decisions (approved by user)
1. **Mina Blue becomes primary**, replacing orange as the app's main action/accent color.
2. **Full payment-type remap:** Monthly (was purple) → Mina Blue. Quarterly (was teal) → Mina Green. One-time (was orange) → Mina Red. (One-time's new Red `#E8411D` is coincidentally almost identical to the old orange `#E8471C` — visually this type barely changes.)
3. **Neutral background** moves from flat grey `#F5F5F5` to warm **Mina Cream 50** `#FDF9F0`; cards remain white for contrast against the new warm background.
4. **Scoping — semantic colors are explicitly out of scope this pass.** The guide reserves Green/Yellow/Orange for success/warning/error. Since Green is now claimed by "quarterly payment," reusing it for a "success" toast/state would violate the app's existing One-Meaning-Rule (a color always means the same single thing everywhere). Wiring up semantic success/warning/error states is deferred to a separate future decision. This pass only remaps colors the app already uses (brand primary + 3 payment types + background).

## Variable-by-variable mapping
The app centralizes all payment-type and brand colors as `:root` CSS custom properties in `minaa-payments.html`, consumed throughout via `var(--name)` (CSS rules) and inline JS (`updateTypeStyle()`, the invoice/receipt builders). Every downstream usage inherits automatically once these root values change — variable **names** stay the same to keep the diff minimal and low-risk; only their **values** change.

| Variable | Old value | New value | New source | Role |
|---|---|---|---|---|
| `--brand` | `#E8471C` | `#0062AD` | Mina Blue 700 | Primary brand/action color |
| `--brand-dark` | `#C23A16` | `#005090` | Mina Blue 800 | Primary hover/gradient-dark (used once, in the login/lock-screen spinner gradient) |
| `--purple` | `#7C3AED` | `#0062AD` | Mina Blue 700 | Monthly accent (text/badge/section-title color) |
| `--purple-light` | `#EDE9FE` | `#F2F8FF` | Mina Blue 50 | Monthly light background (chips, card bg, section-sum bg) |
| `--purple-mid` | `#A78BFA` | `#68B4FF` | Mina Blue 400 | Monthly `jelly-select` accent (focus ring) in `updateTypeStyle()` |
| `--teal` | `#0D9488` | `#05AA00` | Mina Green 600 | Quarterly accent |
| `--teal-dark` | `#0F766E` | `#158200` | Mina Green 700 | Defined but currently unused anywhere in the file — update for consistency, no visible effect |
| `--teal-light` | `#F0FDFA` | `#E9FFE7` | Mina Green 50 | Quarterly light background |
| `--teal-mid` | `#5EEAD4` | `#00E214` | Mina Green 400 | Quarterly `jelly-select` accent (focus ring) |
| `--orange` | `#E8471C` | `#E8411D` | Mina Red 600 | One-time accent |
| `--orange-light` | `#FFF1ED` | `#FEF5F3` | Mina Red 50 | One-time light background |
| `--orange-mid` | `#F47A5A` | `#FA937D` | Mina Red 400 | One-time `jelly-select` accent (focus ring) |
| `--bg` | `#F5F5F5` | `#FDF9F0` | Mina Cream 50 | Page background |

`--card` (`#FFFFFF`), `--text` (`#1A1A1A`), `--muted` (`#6B7280`), `--border` (`#E5E7EB`), and `--shadow` are unaffected — not part of the brand palette.

## Other literal (non-variable) occurrences to update
Two places hardcode a brand hex directly instead of referencing `var(--brand)`, and must be updated to match the new `--brand` value:
- `<jelly-theme mode="light" accent="#E8471C">` → `accent="#0062AD"` (the theme's default accent, used by any Jelly component that doesn't set its own override).
- The فاتورة شاملة toolbar button's inline style `style="--jelly-fill:#FFF1ED;--jelly-label:var(--brand)"` — `#FFF1ED` is the old orange-light literal; since this button is themed as the "primary" toolbar action (uses the default accent), change to `--jelly-fill:#E2F0FF` (Mina Blue 100, a light primary tint) to stay visually consistent with the new blue primary. `--jelly-label:var(--brand)` already inherits the new blue automatically, no change needed there.

No other hardcoded brand-family hex literals exist outside of `:root` — confirmed by grep across the file for all seven old hex values (`#7C3AED #0D9488 #E8471C #C23A16 #F47A5A #5EEAD4 #EDE9FE #F0FDFA #FFF1ED #0F766E #A78BFA #F5F5F5`); every match was either a `:root` definition or one of the two literals above.

## Addendum — revision after live review (2026-07-28)
After the initial implementation (commits `3a3a043`, `edd5efa`, `6c56325`) was reviewed live in the browser, the user flagged three problems the original decisions above didn't cover:
1. **A leftover purple button** (`تحديد الدفعات` / select-toggle) — never part of the Mina system to begin with; it used a standalone hardcoded violet (`#F5F3FF`/`#6D28D9`), not one of the payment-type variables.
2. **A leftover pink color** (`مسح الكل` / clear button, the delete icon-button, and the login screen's `.lock-error` text) — a standalone hardcoded rose (`#FFF1F2`/`#BE123C`), also never part of the Mina system.
3. **Mina Green for quarterly reads wrong** in practice — the user wants the whole UI restricted to primary (Blue) and secondary (Red) wherever a brand color is shown, not a third hue.

Two follow-up decisions, made via clarifying questions:
- **Quarterly moves off green onto a *distinct shade* of secondary Red** — not the same shade one-time uses (that would make the two types visually identical). Quarterly becomes a darker, more muted red (Red 800/900/100/300) while one-time keeps its existing brighter red (Red 600/50/400).
- **All non-payment-type toolbar action buttons are unified to primary/secondary/neutral**: `تحديد الدفعات`/`تصدير البيانات`/`استيراد البيانات` become neutral (Jelly's `platinum` variant, same as the existing `خروج` button), `مسح الكل` and the delete icon-button become secondary (reusing `var(--orange)`, the same red driving one-time), and the select-toggle's active-state highlight switches from an accidental `var(--purple)` reference to the correctly-named `var(--brand)` (same blue value, correct semantics). `.lock-error` also moves from the hardcoded pink to `var(--orange)`.

### Updated quarterly mapping (supersedes row `--teal*` in the table above)
| Variable | Value after Task 1 (green) | New value (this addendum) | New source |
|---|---|---|---|
| `--teal` | `#05AA00` | `#952A0F` | Mina Red 800 |
| `--teal-dark` | `#158200` | `#7B220A` | Mina Red 900 |
| `--teal-light` | `#E9FFE7` | `#FEEAE5` | Mina Red 100 |
| `--teal-mid` | `#00E214` | `#FCBBAD` | Mina Red 300 |

### New toolbar/utility literal changes
| Element | Old | New |
|---|---|---|
| `تحديد الدفعات` resting style | `style="--jelly-fill:#F5F3FF;--jelly-label:#6D28D9"` | `variant="platinum"` (style attribute removed) |
| `تحديد الدفعات` active state (JS) | `setProperty('--jelly-fill','var(--purple)')` | `setProperty('--jelly-fill','var(--brand)')` |
| `تحديد الدفعات` cancel/reset (JS) | `setProperty('--jelly-fill','#F5F3FF')` / `setProperty('--jelly-label','#6D28D9')` | `removeProperty('--jelly-fill')` / `removeProperty('--jelly-label')` (lets the `platinum` variant show through again) |
| `تصدير البيانات` | `style="--jelly-fill:#F0FDF4;--jelly-label:#15803D"` | `variant="platinum"` (style attribute removed) |
| `استيراد البيانات` | `style="--jelly-fill:#EFF6FF;--jelly-label:#1D4ED8"` | `variant="platinum"` (style attribute removed) |
| `مسح الكل` | `style="--jelly-fill:#FFF1F2;--jelly-label:#BE123C"` | `style="--jelly-fill:var(--orange-light);--jelly-label:var(--orange)"` |
| Delete icon-button | `style="--jelly-fill:#FFF1F2;--jelly-label:#BE123C"` | `style="--jelly-fill:var(--orange-light);--jelly-label:var(--orange)"` |
| `.lock-error` (login screen) | `color:#BE123C` | `color:var(--orange)` |

Scoping note: this addendum only touches the four toolbar action buttons, the delete icon-button, the quarterly `--teal*` variables, and `.lock-error`. It does not revisit any other decision from the original spec (background, primary, one-time, currency-indicator colors remain as already implemented).

## Addendum 2 — quarterly corrected to Neutral, not a second red (2026-07-28)
Re-reading the guide's own text closely (`colorP.pdf`, full 24-page extraction confirmed to match the earlier excerpt — no additional rules text was missed) surfaced that Addendum 1's "darker shade of secondary" for quarterly wasn't actually grounded in anything the guide defines. The guide only names three general-purpose roles — Primary (Blue 700, "key actions... buttons, CTAs"), Secondary (Red 600, "secondary buttons... supporting states"), Neutral/Cream ("backgrounds, cards, containers... serene surface areas") — plus three semantic colors (Green/Yellow/Orange = success/warning/error) with an explicit warning not to swap them in for unapproved purposes. Inventing a second, darker step of the Secondary scale to encode an unrelated category (quarterly payments) wasn't something the guide describes either — it names one signature shade per role, not "pick a different step per category."

Corrected mapping: **Quarterly → Neutral (Mina Cream)**, using values drawn directly from the guide's own Neutral scale (nothing invented):

| Variable | Addendum 1 value (invented red) | Corrected value | Source |
|---|---|---|---|
| `--teal` | `#952A0F` | `#6B4423` | Mina Cream 800 |
| `--teal-dark` | `#7B220A` | `#57361B` | Mina Cream 900 |
| `--teal-light` | `#FEEAE5` | `#F7E0B6` | Mina Cream 200 |
| `--teal-mid` | `#FCBBAD` | `#E0B05D` | Mina Cream 400 |

This also better satisfies the follow-up creative direction the user gave (via the `frontend-design` skill): the app should read as predominantly Primary Blue with only a restrained, sparing touch of other color. With quarterly now neutral, Blue (primary, monthly + all main actions) dominates, Red (secondary) appears only as a deliberate, singular accent (one-time payments + destructive actions), and quarterly recedes into a quiet warm-neutral tone rather than competing for attention as a third brand hue. Contrast-checked: `#6B4423` on `#F7E0B6` = 6.58:1, comfortably passing WCAG AA.

## Out of scope for this pass
- Semantic success/warning/error color wiring (Mina Green/Yellow/Orange used for their guide-intended semantic purpose, e.g. toast states, form validation) — deferred per the scoping decision above.
- Currency-indicator colors (KWD/USD/EUR green/blue/purple used in `updateCurrencyStyle()`/`updateEditCurrencyStyle()`) — these are arbitrary currency-distinguishing colors, not part of the brand system the PDF defines, and are left unchanged.
- Any Jelly UI component-level changes (Phase 2/3/4 — cards, dialogs, toasts) — purely a color-value update within the existing Phase 1 component set.
- `DESIGN.md` update to document the new palette — tracked as a follow-up after implementation, not part of this code change.

## Testing plan
- Visual: reload the app and confirm the page background is now warm cream, not grey; confirm monthly/quarterly/one-time sections, badges, chips, and totals show blue/green/red respectively everywhere they appear (stats cards, payment list sections, add-payment type selector, edit modal, invoice modal, receipt modal).
- Functional: confirm `updateTypeStyle()`'s dynamic `jelly-select` recoloring still fires correctly on type change (visually verify the three accent colors swap correctly).
- Confirm the toolbar's فاتورة شاملة button and the `jelly-theme` default accent both read as blue (primary), not orange.
- Confirm text/background contrast still passes readability at a glance for the three light-background variants (`--purple-light`/`--teal-light`/`--orange-light` equivalents) against their matching accent text color, since brightness changed for green (`#05AA00`/`#158200`) and blue in particular.
