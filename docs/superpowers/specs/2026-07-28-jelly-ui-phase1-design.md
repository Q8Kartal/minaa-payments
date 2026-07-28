# Jelly UI Adoption — Phase 1: Foundation, Actions, Forms

## Goal
Replace this app's native buttons, inputs, selects, and checkboxes with Jelly UI's web components (https://jelly-ui.com), embracing its playful "soft-body jelly" aesthetic as the app's new brand direction — while preserving the existing exact color-coding rules (purple = monthly, teal = quarterly, orange = one-time/primary) and RTL Arabic layout.

This is Phase 1 of a larger, explicitly phased redesign. Later phases (not covered by this spec): Phase 2 — surfaces (`jelly-card`, `jelly-badge`); Phase 3 — overlays (`jelly-dialog` replacing the custom modal system); Phase 4 — feedback (`jelly-toaster` replacing the custom toast).

## Background / library facts (verified against the live API reference at jelly-ui.com/api/)
- Dependency-free Web Components library, loaded via a single `<script type="module" src="https://jelly-ui.com/package.js">` tag — no build tools, no npm, consistent with this project's existing architecture (same CDN-script pattern already used for Firebase).
- `<jelly-theme>` is a layout-neutral (`display:contents`) provider that scopes design tokens to its subtree via `mode` (`"light"|"dark"|"auto"`) and `accent` (any valid CSS color, not just a preset name) attributes.
- All form controls are form-associated via `ElementInternals` (native form submission, native keyboard/ARIA semantics via a real hidden/shadow-DOM `<input>`/`<button>`), and RTL is handled internally (caret ripples, panel unfolding, etc. are documented as "direction-aware").
- Named `variant` values across components (`jelly-button`, `jelly-select`, `jelly-checkbox`) are limited to: `white`, `rose`, `amber`, `azure`, `mint`, `platinum`, `graphite`. None of these are an exact match for this app's existing purple (`#7C3AED`) or teal (`#0D9488`) — exact colors are preserved instead via documented CSS custom property overrides (`--jelly-fill`, `--jelly-label`, `--jelly-accent`, `--jelly-on`), which every relevant component explicitly supports for "tinting a single instance."

## Decisions from brainstorming
- **Aesthetic:** the playful/squishy jelly physics is wanted, not something to tone down. `PRODUCT.md`'s Brand Personality section (currently "not playful/toy-like") gets updated as part of this phase to reflect the new direction.
- **Dark mode:** NOT enabled this phase. `<jelly-theme mode="light" ...>` is forced explicitly (not `"auto"`), keeping the app's current single light appearance. Dark mode is an explicit future phase, not a side effect of adopting the library.
- **Color fidelity:** exact existing hex values are preserved via CSS custom property overrides rather than approximated with the nearest named `variant`. The "One Meaning Rule" (a color always means the same payment type everywhere) carries forward unchanged.

## Foundation
- Add `<script type="module" src="https://jelly-ui.com/package.js"></script>` alongside the existing Firebase compat `<script>` tags.
- Wrap the entire visible app in `<jelly-theme mode="light" accent="#E8471C">`. Placement: wrap from the loader/lock-screen through the end of body content (i.e., it can wrap everything between `<body>` and the closing `<script>` tags — `jelly-theme` is layout-neutral so this is safe regardless of what's currently shown/hidden).
- Because the default accent is now brand orange, any Jelly component that doesn't get an explicit override (e.g. the primary "+ إضافة" add button, focus rings generally) automatically uses the correct brand color for free.

## Component-by-component mapping

### Toolbar buttons (`.data-toolbar`)
All six become `<jelly-button>`. Exact color preserved via inline `style` setting `--jelly-fill`/`--jelly-label`:
| Button | Existing colors | Jelly approach |
|---|---|---|
| 🧾 فاتورة شاملة | orange bg/border, brand text | Use theme default accent (no override needed) |
| ☑️ تحديد الدفعات | light purple bg, purple text/border | `--jelly-fill: var(--purple-light); --jelly-label: var(--purple);` (or invert to solid purple fill — decide at implementation for best contrast with jelly's painted-membrane look) |
| ⬇ تصدير البيانات | light green bg, dark green text | `--jelly-fill` / `--jelly-label` set to the existing exact green pair |
| ⬆ استيراد البيانات | light blue bg, dark blue text | same pattern, existing exact blue pair |
| 🗑 مسح الكل | light red bg, dark red text | same pattern, existing exact red pair |
| 🚪 خروج | neutral grey | `variant="platinum"` (Jelly's neutral/muted named variant) is an acceptable fit here since this button was never brand-color-coded to begin with |

### Add-payment form
- اسم الدفعة → `<jelly-input label="اسم الدفعة" placeholder="مثال: إيجار المخزن A">`
- القيمة → `<jelly-input label="القيمة" type="number" placeholder="0.00">`
- العملة → `<jelly-select label="العملة">` containing three `<jelly-option value="KWD">🇰🇼 دينار كويتي</jelly-option>` (and USD/EUR) children
- نوع الدفعة → `<jelly-select label="نوع الدفعة">` containing three `<jelly-option>` children (monthly/quarterly/onetime)
- + إضافة → `<jelly-button type="button">` (uses the default theme accent, brand orange, matching its current primary-action styling — no override needed)

**Dynamic per-selection coloring (replaces `updateCurrencyStyle()`/`updateTypeStyle()`):** these two functions currently swap a CSS class on the native `<select>` based on its current value. They get rewritten to instead set the `--jelly-accent` custom property directly on the `jelly-select` element via `element.style.setProperty('--jelly-accent', ...)`, using the exact same existing hex values (green/blue/purple for currency; purple/teal/orange for type), triggered on the `change` event (`jelly-select` fires a `change` CustomEvent, same event name as native `<select>`, so the wiring is a near-drop-in replacement).

### Edit modal
Same four field types as the add-payment form (`jelly-input` ×2, `jelly-select` ×2 with the same dynamic-accent behavior), plus `<jelly-button>` for حفظ (save, default accent) and إلغاء (cancel, `variant="platinum"`).

### Login form
البريد الإلكتروني / كلمة المرور → `<jelly-input type="email">` / `<jelly-input type="password">`; دخول → `<jelly-button type="submit">` (default accent).

### Payment card selection checkboxes
`.pay-checkbox` → `<jelly-checkbox>`, with `--jelly-on` set to the existing brand orange (matching the current `accent-color: var(--brand)`), and a `label="تحديد الدفعة"` for screen-reader accessibility (an improvement over the current bare checkbox, which had no accessible name).

### Edit/Delete icon buttons on payment cards
`.btn-edit`/`.btn-del` → `<jelly-icon-button label="تعديل">`/`<jelly-icon-button label="حذف">`, reusing the existing `title=""` text as the new `label=` attribute (Jelly requires `label` for icon-only buttons' accessible name — this is a real accessibility improvement over the current plain `<button>`, which relied only on the `title` attribute, not a proper accessible name).

### Selection bar buttons
إلغاء → `<jelly-button variant="platinum">`; إنشاء إيصال → `<jelly-button>` (default accent), keeping its existing `disabled` attribute behavior (Jelly buttons support `disabled` natively).

## Cleanup
Once every native button/input/select/checkbox above is replaced, remove the now-dead CSS: `.btn-add`, `.btn-data` and all its color variants (`.btn-export`, `.btn-import`, `.btn-clear`, `.btn-invoice`, `.btn-select`), the base `input, select { ... }` rule, `.cur-kwd`/`.cur-usd`/`.cur-eur`, `.type-monthly`/`.type-quarterly`/`.type-onetime`, `.pay-checkbox`, `.btn-edit`/`.btn-del`, `.btn-modal-cancel`/`.btn-modal-save`. (`.field`/`.pay-top-row`/`.form-grid`/`.modal-grid` layout CSS stays — those are structural containers, not the controls themselves.)

## Out of scope for this phase
- `jelly-card`, `jelly-badge`, `jelly-dialog`, `jelly-toaster`, `jelly-alert`, dark mode — all later phases.
- Any change to Firestore data model, the receipt/selection feature's logic, or invoice/receipt content — this phase is purely a control-level visual/markup swap.

## Testing plan
- Visual: every replaced control renders correctly in RTL (Arabic labels, correct reading direction, chevrons/carets on the correct side).
- Functional: adding a payment, editing a payment, selecting currency/type (confirm the field still recolors correctly per selection), logging in/out, selecting payments for a receipt, generating a receipt — all continue to work exactly as before (this phase changes markup/styling, not app logic).
- Confirm `jelly-select`'s `change` event correctly drives the existing `updateConvertHint()`/`updateEditHint()` currency-conversion preview logic (these listen for `onchange` on the currency select today).
- Confirm disabled states (generate-receipt button, disabled inputs during edit) still visually and functionally disable correctly.
- Confirm no console errors from the Jelly UI script load itself (network-dependent on jelly-ui.com being reachable — note this as a new external runtime dependency, unlike Firebase which is Google-operated infrastructure).
