# Selective Payment Receipt — Design

## Goal
Let the user select an arbitrary subset of payments (e.g. the ones his brother/partner still owes his share of) and generate a printable receipt containing just those, separate from the existing "فاتورة شاملة" (comprehensive invoice) which always lists everything.

## Scope
Pure UI feature on top of the existing Firestore-backed payment list. No data model changes, no new Firestore fields, nothing persisted — selection state lives only in the browser tab for the duration of the interaction.

## UI Flow

1. **Entry point:** a new toolbar button, `تحديد الدفعات` (Select payments), added to `.data-toolbar` alongside the existing invoice/export/import/clear/sign-out buttons.
2. **Selection mode ON:** clicking it toggles a `selectionMode` boolean. While true:
   - Every rendered `.pay-item` (across all three sections — monthly, quarterly, one-time — simultaneously) shows a checkbox.
   - The toolbar button's label/state changes to indicate selection mode is active (e.g. becomes `إلغاء التحديد` / Cancel selection, styled as active).
   - A floating summary bar appears (fixed position, similar treatment to the existing toast but persistent while in selection mode) showing: selected count and running KWD total, e.g. `تم تحديد 3 دفعات — 45.200 د.ك`, plus a button `إنشاء إيصال` (Generate receipt). The generate button is disabled/hidden when zero payments are selected.
3. **Selecting:** clicking a checkbox toggles that payment's id in an in-memory `Set`. Checking/unchecking updates the summary bar's count and total live.
4. **Generating the receipt:** clicking `إنشاء إيصال` opens a receipt modal (new function `openReceipt()`, structurally parallel to the existing `openInvoice()`), populated only with the selected payments.
5. **Closing the receipt or canceling selection:** either action clears the selection `Set`, turns `selectionMode` off, removes all checkboxes, and hides the summary bar. Nothing about the selection is saved anywhere.

## Receipt Content & Format

Reuses the existing invoice modal's visual chrome exactly: `.inv-overlay`/`.inv-modal` structure, header band with logo + date + receipt number, footer with close + print buttons, same print CSS (`@media print`) already in place.

Differences from the comprehensive invoice:
- **Numbering:** prefix `REC-` instead of `INV-` (same date+sequence format otherwise: `REC-YYMMDD-NNN`), so a receipt is visually distinguishable from the full invoice at a glance.
- **Table layout:** one flat table of the selected payments (not split into three per-type sections like the full invoice). Each row still shows the payment's type via the existing color-coded left accent/name color, consistent with the rest of the app's "color always means type" rule. Columns match the invoice's existing row format: name, date, amount (with original-currency note if converted).
- **Summary chips:** a simplified single-total chip bar (just "الإجمالي" / grand total for the selection and item count) rather than the full invoice's four chips (monthly/quarterly/one-time/grand) — there's no need to sub-total by type for an arbitrary hand-picked selection.
- Title/header text reads something like `إيصال مُحدد` (Selected-items receipt) instead of implying it's the comprehensive invoice.

## Components touched

- `minaa-payments.html` only (single file, matches project convention).
- New JS: `selectionMode` state (boolean), `selectedIds` (Set of Firestore doc id strings), `toggleSelectionMode()`, `togglePaymentSelection(id)`, `openReceipt()`, `closeReceipt()` (or reuse `closeInvoice`-style logic parameterized for the new modal, whichever keeps the diff smaller — decided at plan/implementation time).
- New CSS: checkbox styling on `.pay-item`, the floating selection-summary bar, minor receipt-specific tweaks (reusing `.inv-*` classes wherever the visual is identical).
- `renderList()` needs to consult `selectionMode` when rendering so it can include/omit the checkbox and reflect current checked state after every Firestore `onSnapshot` re-render (selection state must survive a live re-render triggered by someone else's edit while you're mid-selection).

## Edge cases

- **Live sync while selecting:** since data re-renders in real time (Firestore `onSnapshot`), if a selected payment is deleted by another team member while you're mid-selection, it should silently drop from `selectedIds` (checking a Firestore id that no longer exists in `payments` is filtered out) rather than erroring.
- **Zero selected:** the summary bar's generate button stays disabled (or the bar itself doesn't appear until the first item is checked — decide at implementation, functionally equivalent).
- **Print:** the receipt modal must hide everything else on `window.print()` exactly like the existing invoice does (reuses the same `@media print` rules already scoped to `.inv-overlay`).

## Testing plan
- Toggle selection mode on/off, confirm checkboxes appear/disappear across all three sections correctly.
- Select payments from more than one section (e.g. one monthly + one one-time), confirm the running total and receipt both reflect the mix correctly.
- Generate a receipt with 1 item, with several items, confirm layout doesn't break either way.
- Confirm closing the receipt clears selection and exits selection mode.
- Confirm print/PDF still works correctly for the new receipt modal.
- Confirm a real-time change from another session (add/delete) while selection mode is active doesn't crash the page.
