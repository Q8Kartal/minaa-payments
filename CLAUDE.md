# Minaã – Payment Management System

## Project Overview
Single-file HTML payment tracker for **Minaã** (منصة ميناء) — a warehouse and long-term parking reservations platform in Kuwait.

The entire app lives in **one file**: `minaa-payments.html`  
No build tools, no dependencies, no backend. Opens directly in any browser.

---

## Brand Identity
See `DESIGN.md` for the full system. Essentials:
- **Primary — Minaã Blue:** `#0062AD` (all actions, all copy, all payment data)
- **Secondary — Minaã Red:** `#E8411D` (Secondary 600). Per the Colour Foundations page (`4008:11512`) this is the **secondary** colour — secondary buttons, navigation, info elements, links, highlights, supporting states — balanced against Primary, and *"these labels show hierarchy, not brand importance"*. It is **not** a destructive colour; the system reserves no brand hue for destruction, and errors are semantic Orange. This file used to say "destructive actions only", which was wrong and reached the button library as a mislabelled example. The app's narrow use of Red (grand-total card, delete/clear) is a product choice, not the system rule.
- **Neutral — Minaã Cream:** `#FBF0DC` (text on brand fills) · `#FDF9F0` page background
- **Semantic (never brand, never decoration):** Green `#05AA00` success · Yellow `#E5B11F` warning · Orange `#E56E1F` error
- **Payment types are all blue** — told apart by icon and label, not hue. All three share one Blue 50 tint (`--primary-tint`); the differentiator is the glyph (`calendar-sync` / `calendar-range` / `zap`). Quarterly previously used Blue 100, which contradicted this rule.
- **No black type.** All copy is Minaã Blue at 100% / 72% / 50%.
- **Spacing:** 14-step scale on an 8px base unit — **0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px** (`space.0` … `space.1000`; CSS `--space-0` … `--space-1000`).
  - **Source of truth:** the Figma **Spacing** page (node `4415:1705`) documents the system; the **`Spacing` variable collection** (`VariableCollectionId:4159:1679`, 14 vars × Desktop/Mobile/Tablet) enforces it. Both outrank this file and `DESIGN.md`.
  - Never write a raw px/rem value for padding, gap, item spacing or layout spacing. In Figma, **bind** the property — a typed number that matches a token is still a violation.
  - Ranges: **0–8px** compact UI · **12–24px** larger components · **32–80px** page layout.
  - Principles: group by similarity · group by proximity · create order and hierarchy · introduce visual rhythm through consistent repetition · use optical adjustment. See `DESIGN.md` §4.
  - Figma cannot store `.` in variable names, so tokens are stored as `space-0` … `space-1000`; `space.0` … `space.1000` is the canonical form.
- **Font:** 29LT Idris Round, **self-hosted** from `fonts/*.woff2` (~130 KB per weight). Cairo remains the fallback in the app.
  - Each weight is a **separate family name** — `"29LT Idris Round Regular" / " Medium" / " ExtraBold"` — so weight is selected by swapping `font-family`, not by `font-weight`. Use the `--font-regular` / `--font-medium` / `--font-bold` vars.
  - Each `@font-face` claims `font-weight: 100 900` **deliberately**. Registered at a single weight, any rule asking for 700/800/900 makes the browser fake a bolder face by smearing the glyphs — which merges Arabic strokes and fills the counters, mangling the script on phones. Claiming the range makes every weight request resolve to that face exactly, with nothing to synthesise. `html { font-synthesis: none }` is the backstop.
  - No Fontstand, so **no per-domain licensing, no 403 on unregistered origins, no 10,000 pageview meter, and `file://` works**.
- **Logo:** Blue seagull-on-bollard logomark — the official `Artboard 17.svg`, embedded as an SVG data URI in the `<img>` inside `.logo-wrap` (no text lockup)
- **Icons — Micons, ours, and no third party.** The library is the Figma file
  `BlltPtiVnS9ULiuMVKo2oM` (page `108:30`), 18 categories. The button-library
  pages inline them as a `<symbol>` sprite in `buttons.js`, referenced with
  `<svg class="mi"><use href="#mi-NAME"/></svg>`; both builds share the one
  sprite, so an icon cannot differ between Arabic and English.
  - **Choose by tier, in order: `brand/*` first, then `-solid`, then `-line`.**
    If nothing in `brand` fits the subject, that gap is worth filling in the
    library rather than settling. The tier never overrides meaning — the glyph
    must reflect what the section is actually about, and matching on the
    component's *name* is not the same as matching the subject.
  - **Decide the tier for a whole set, not per icon.** One solid mark among
    outline neighbours reads visibly heavier and breaks the row.
  - Paths are re-coloured to `currentColor` on export, so icons inherit the
    surrounding text colour and the existing colour rules keep working.
    Strokes are 1.5 on a 24-unit grid — never rescale the stroke.
  - The pages used lucide via iconify's CDN until 2026-08-22. That is gone:
    no script, no `preconnect`, nothing fetched for icons. Do not reintroduce
    it. Anything measuring icons must match on `.mi`, not on a tag name — the
    measure pass tested `tagName === 'ICONIFY-ICON'` and silently scored every
    icon button as text-only when the icons became inline SVG.

### Before committing any UI — run these three checks
Every design-system violation in this project so far came from one of three
places, not from disagreeing with the system:

1. **Scan for raw values.** Any literal `px` in a padding/margin/gap, or any
   literal hex/rgb outside the `:root` token block, is a violation. Both the
   0px panel gaps and the hardcoded `#158200` tick survived review because
   nobody looked for them — they were written and never checked.
2. **Check the step, not just the palette.** A colour can be a real Minaã
   colour and still be the wrong step. Name the Foundations step in a comment
   (`Primary 700`, `Green 700`) so the next reader can verify it.
3. **Chrome normalises colours**, so a regex looking for `#RRGGBB` in the CSSOM
   finds nothing — it returns `rgb(...)`. Grep the source file for literals, or
   compare rendered values against a map of Foundations steps. A clean scan
   from the wrong method is worse than no scan.

Documentation furniture — tables, captions, debug controls — is design work and
gets the same treatment as components. That is where these misses happened.

---

## Payment Types
| Type | Value | Color | Icon | Arabic Label |
|------|-------|-------|------|--------------|
| `monthly` | Recurring monthly | Blue `#0062AD`, tint `#F2F8FF` | `lucide:calendar-sync` | شهري |
| `quarterly` | Every 3 months | Blue `#0062AD`, tint `#E2F0FF` | `lucide:calendar-range` | اشتراك / 3 أشهر |
| `onetime` | One-time payment | Blue `#0062AD`, tint `#F2F8FF` | `lucide:zap` | مرة واحدة |

---

## Currency Support
- **Base currency:** Kuwaiti Dinar (KWD) — all values stored in KWD
- **Input currencies:** KWD, USD, EUR
- **Live exchange rates:** [open.er-api.com](https://open.er-api.com/v6/latest/USD) — free, no API key. (Frankfurter was used before but is ECB-based and 404s on KWD — every refresh silently fell back to fixed rates.)
- **Fallback rates (offline):** USD = 0.3065 KWD, EUR = 0.2820 KWD
- Conversion happens at input time; original amount + currency stored for display

---

## Data Storage
**Firebase Firestore** with Email/Password auth (one shared team login), synced live
via `onSnapshot`. localStorage is no longer the store — the key below is legacy,
kept only so `migrateOldData()` can import older backups.

- **Legacy localStorage key:** `minaa_v2_payments`
- **Schema per payment:**
```json
{
  "id": 1,
  "name": "إيجار المخزن A",
  "origValue": 150.000,
  "origCurrency": "KWD",
  "kwdValue": 150.000,
  "type": "monthly",
  "date": "2026-07-27T10:00:00.000Z"
}
```
- **Migration:** `migrateOldData()` auto-migrates from old keys `minaa_payments`, `minaa_v1_payments`

---

## Key JavaScript Functions

| Function | Purpose |
|----------|---------|
| `fetchRates(manual)` | Fetch live exchange rates from open.er-api.com |
| `toKWD(amount, currency)` | Convert USD/EUR to KWD using live rates |
| `addPayment()` | Validate & add new payment entry |
| `deletePayment(id)` | Remove payment by ID |
| `openEdit(id)` | Open edit modal pre-filled with payment data |
| `saveEdit()` | Save changes from edit modal |
| `render()` | Re-render all stats, badges, and payment lists |
| `renderList(listId, items, type)` | Render individual payment section list |
| `openInvoice()` | Generate and show comprehensive invoice modal |
| `closeInvoice(e)` | Close invoice modal |
| `printInvoice()` | Trigger `window.print()` for PDF/print |
| `exportData()` | Download JSON backup file |
| `importData(e)` | Import JSON backup file |
| `clearData()` | Clear all data after confirmation |
| `migrateOldData()` | Migrate from old localStorage keys |
| `showToast(msg, type)` | Toast for 2.8s. `type` = `success`/`warning`/`error` and drives **both** the Lucide icon and the semantic colour, so they cannot drift apart. Omit for a plain blue toast |
| `updateRing(type, part, total)` | Draw a stat card's SVG progress ring (share of grand total) |
| `updateTypeStyle()` | Apply color class to type select input |
| `updateCurrencyStyle()` | Apply color class to currency select |
| `fmtKWD(val)` | Format number as KWD (3 decimals + "د.ك") |
| `fmtDate(iso)` | Format ISO date to Arabic locale |

---

## UI Components

### Layout (RTL, Arabic) — floating dashboard shell on cream paper
- **Icon rail** (`.side-nav`, 88px): logo, then one centred cluster of circular
  `jelly-icon-button`s — select / export / import / clear / logout. Becomes a
  horizontal bar below 640px.
- **Top bar** (`.topbar`): page title + live date on one side; on the other a slim
  **rates strip** (currency chips, values, timestamp, refresh) and the فاتورة شاملة CTA.
- **Stats row:** 4 cards — grand total **first** (rightmost in RTL), then monthly,
  quarterly, one-time. Each type card carries an SVG progress ring showing its
  share of the total.
- **Add form:** Name, Value, Currency, Type + a circular icon-only add button.
  Flex row, so fields stretch while the circle keeps its size.
- **Payments grid:** 3 auto-fit columns — Monthly | Quarterly | One-time
- **Toast:** bottom-centre, semantic colour + Lucide icon
- **Edit / login modals**, **invoice & receipt modals** (printable)

There is no separate rates panel or button toolbar — both were folded into the
top bar and icon rail.

### Keyboard Shortcuts
- `Enter` → Add payment (or Save edit if modal open)
- `Escape` → Close invoice modal, then close edit modal

---

## Invoice Feature (فاتورة شاملة)
- Opens via "🧾 فاتورة شاملة" button in toolbar
- Auto-generates invoice number: `INV-YYMMDD-NNN`
- Shows: logo, date, 4 summary chips, tables per type, grand total bar
- "🖨 طباعة / PDF" triggers `window.print()`
- Print CSS hides all UI except the invoice modal

---

## Known Quirks
- **RTL + SVG:** Any SVG `<text>` elements need `direction="ltr"` + `text-anchor="start"` to render correctly inside an RTL page
- **localStorage origin:** Data saved in one browser/context won't appear in another (different file path = different origin). Use Export/Import JSON to transfer data between browsers
- **Logo:** the official `Artboard 17.svg`, embedded as an SVG **data URI** (~2.4 KB). Stays crisp at any size; the invoice reuses the same element and inverts it to white
- **Web components:** styling the host does not reach inside. Use the component's own attributes (`shape`, `block`, `variant`), its `--jelly-*` custom properties, or `::part()`. Two bugs this caused: `el.disabled = x` silently no-ops (use `toggleAttribute`), and `width:100%` stretches only the host (use `block`)
- **RTL:** always use logical properties (`padding-inline`, `margin-inline-start`, `text-align: start/end`). Physical sides flip wrongly — this produced a real spacing bug in the rates strip
- **Direction is fixed, never adaptive.** This page is the **Arabic RTL version at all times** (`<html lang="ar" dir="rtl">`). An English payment name must not flip its card, field, alignment or icon order to LTR — Latin text keeps its own character order via the bidi algorithm, and that is enough.
  - **Never use `unicode-bidi: plaintext`.** It derives direction from the first strong character, which is exactly the content-based detection this rule forbids. It was on `.pay-name` and flipped English rows to LTR.
  - `unicode-bidi: isolate` is fine — it isolates a run without changing direction.
  - **No `direction: ltr` islands.** Verified empirically that `64%`, `0.3088`, `INV-260808-001`, `ChatGBT & Codex` and `150.000 د.ك` all render identically in RTL, so the overrides on `.ring-pct`, `.rate-mini`, `.inv-meta` and `.td-amount` were unnecessary and were removed. The page now has **zero** elements computing `direction: ltr`.
  - A separate English LTR build will come later; do **not** make this page adaptive to reach it.
- **iOS autofill:** Safari paints autofilled fields yellow. Masked via `jelly-input::part(input):-webkit-autofill`
- **Never register a face at one weight when rules ask for another.** The browser then synthesises bold by smearing each glyph; Latin survives it, Arabic does not — joined strokes merge and counters fill. This shipped once and mangled the headings and button labels on phones. Fixed by declaring `font-weight: 100 900` on every `@font-face`.

---

## Possible Next Features
- [ ] دفعات سنوية (yearly payments type)
- [ ] تاريخ الاستحقاق / تنبيه قبل الدفع (due date + reminder)
- [ ] فلترة وبحث في الدفعات (search/filter payments)
- [ ] تقرير شهري / سنوي (monthly/yearly report)
- [ ] رفع على GitHub Pages للوصول من أي جهاز
- [ ] دعم أكثر من مشروع (multi-project support)
- [ ] تصدير PDF مباشر بدون طباعة (direct PDF via jsPDF)

---

## File Structure
```
minaa-payments.html   ← The entire app (HTML + CSS + JS + SVG logo)
buttons.html          ← Button library, Arabic RTL build
buttons-en.html       ← Button library, English LTR build
buttons.css           ← Styling, shared by both builds
buttons.js            ← Behaviour, shared by both builds. **Bump the `?v=` on the
                         `<link>` and `<script>` in BOTH html files whenever
                         either shared file changes** — Pages serves them with
                         `max-age=600`, so without it a deploy hands visitors
                         new markup against stale styling for ten minutes.
fonts/                ← 29LT Idris Round, self-hosted WOFF2 (Regular / Medium / ExtraBold)
CLAUDE.md             ← This file — project context for Claude Code
DESIGN.md             ← Design system: colour, type, spacing, components
PRODUCT.md            ← Users, purpose, brand personality
docs/superpowers/     ← Design specs and implementation plans
.claude/launch.json   ← Local static server on :3000
```

---

## How to Run
Opening `minaa-payments.html` directly works, fonts included — they are served
from `fonts/` alongside the file, so `file://` is no longer a problem.

Serving it is still the closer match to production:

```bash
python -m http.server 3000
```

then open `http://localhost:3000/minaa-payments.html`.

Live: https://q8kartal.github.io/minaa-payments/minaa-payments.html
