# Spacing Scale — Atlassian Design System

**Status:** implemented.
**Source:** https://atlassian.design/foundations/spacing

## Decision
The brand owner chose the Atlassian Design System spacing scale over the 8pt
scale originally proposed here. It is the better fit for this codebase: it
includes 2px, 6px and 20px steps that a strict 8pt scale lacks, so far more of
the existing values land on-scale with **zero pixel change**.

## Tokens
Declared in `:root`. Names mirror Atlassian's, where the suffix is the
percentage of the 8px base unit (`space-200` = 200% = 16px).

| Token | px | | Token | px |
|---|---|---|---|---|
| `--space-025` | 2 | | `--space-250` | 20 |
| `--space-050` | 4 | | `--space-300` | 24 |
| `--space-075` | 6 | | `--space-400` | 32 |
| `--space-100` | 8 (base) | | `--space-500` | 40 |
| `--space-150` | 12 | | `--space-600` | 48 |
| `--space-200` | 16 | | | |

## Usage ranges (from the source)
- **0–8px** — small, compact UI: icon/text gaps, badge and icon-button padding,
  input padding, vertical spacing inside a card, repeating element gaps.
- **12–24px** — larger, less dense UI: container padding of larger components,
  spacing between items in cards.
- **32px+** — page-level layout: space between page content, header separation.

## What changed
Every `gap`, `margin-top` and `margin-bottom` in the stylesheet is now a token —
verified zero raw px values remain for those properties — plus all container
padding.

**Landed exactly on-scale, no pixel change:** 2, 6, 8, 12, 16, 20, 24px values
(gaps in the sidebar, payment rows, panel titles, modals; `.inv-grand` padding).

**Rounded onto the scale:**

| Was | Now | Δ | Where |
|---|---|---|---|
| 1px | 2px | +1 | `.pay-info` line gap |
| 3px, 5px | 4px | ±1 | `.field`, `.pay-item`, `.inv-chip` gaps |
| 7px, 9px | 8px | ±1 | `.section-title`, `.nav-group` |
| 10px | 12px | +2 | stat card, form, toolbar, modal footer gaps |
| 14px | 16px | +2 | grid gutters, topbar |
| 18px | 16px | −2 | modal/section bottom margins |
| 20px | 24px | +4 | `.main-col` section separation |
| 22px | 24px | +2 | `.inv-summary` bottom margin |
| 26px, 28px | 24px | −2/−4 | modal + invoice body padding |
| 30px | 32px | +2 | invoice header/footer inline padding |

**Header separation** now follows the "page-level" guidance: `.main-col` gap
(24px) + `.topbar` margin-bottom (8px) = **32px** = `space-400`.

## Out of scope
- `border-radius` — Atlassian treats corner radius as a separate foundation,
  not part of spacing. Untouched.
- `clamp()` fluid paddings (`body`, `.main-col`) — responsive by design; pinning
  them to fixed tokens would lose that.
- Negative geometric offsets (`.ring-wrap` mobile) — corrections, not rhythm.
- Jelly's own `--jelly-*-padding-*` tokens — the library's scale, not ours.

## Verification
Measured 10 key regions before and after at 1178px wide:
- Every region shifted **≤5px** except `.rates-strip`, which narrowed 19px
  because its currency chips tightened from `3px 7px` to `2px 6px`. It is a
  content-sized pill, so this is a size change, not a layout break.
- Page height **unchanged** (1065px), no horizontal overflow.
- Mobile (375px): nav bar still 69px, cluster still row, no overflow, no
  overlapping stat cards.
