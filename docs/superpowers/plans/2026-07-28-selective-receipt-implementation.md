# Selective Payment Receipt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user toggle a selection mode, check off an arbitrary subset of payments across all three sections, and generate a printable receipt (reusing the existing invoice's visual style) containing just those payments — with nothing persisted afterward.

**Architecture:** Pure client-side addition to the existing single-file app. New in-memory state (`selectionMode`, `selectedIds`) drives whether `renderList()` renders a checkbox per card. A new `openReceipt()` function builds an HTML string using the exact same `.inv-*` CSS classes and `#inv-overlay`/`#inv-modal` DOM elements the existing `فاتورة شاملة` invoice already uses, so `closeInvoice()`/`printInvoice()` work for both without duplication. `closeInvoice()` gains a small `selectionReceiptOpen` flag so it also clears the selection when it was the receipt (not the full invoice) that was closed.

**Tech Stack:** Vanilla JS, no new dependencies. No test framework in this project (single static HTML file) — verification steps are manual browser checks, consistent with how this app has always been validated.

There is no automated test runner in this project. "Tests" in this plan are manual browser verification steps.

---

### Task 1: CSS for the checkbox row, toggle button, and selection bar

**Files:**
- Modify: `minaa-payments.html` (CSS block, `.pay-item`/`.btn-data` neighborhood, and end of `<style>`)

- [ ] **Step 1: Add a `.pay-top-row`/`.pay-checkbox` rule right after the existing `.pay-name` color rules**

Find this block (search for `.onetime-section   .pay-name { color: var(--brand); }`):
```css
    .onetime-section   .pay-name { color: var(--brand); }

    .pay-meta { font-size: .72rem; color: var(--muted); }
```
Insert a new block between them:
```css
    .onetime-section   .pay-name { color: var(--brand); }

    .pay-top-row { display: flex; align-items: center; gap: 8px; }
    .pay-checkbox {
      width: 20px; height: 20px; flex-shrink: 0;
      accent-color: var(--brand); cursor: pointer;
    }

    .pay-meta { font-size: .72rem; color: var(--muted); }
```

- [ ] **Step 2: Add a `.btn-select` variant next to the other toolbar button colors**

Find (search for `.btn-clear:hover { background: #FFE4E6; }`):
```css
    .btn-clear:hover { background: #FFE4E6; }
```
Insert right after it:
```css
    .btn-clear:hover { background: #FFE4E6; }
    .btn-select {
      background: #F5F3FF; color: #6D28D9;
      border: 1.5px solid #C4B5FD;
    }
    .btn-select:hover { background: #EDE9FE; }
    .btn-select.active {
      background: var(--purple); color: #fff; border-color: var(--purple);
    }
```

- [ ] **Step 3: Add the fixed selection bar CSS right before `</style>`**

Insert immediately before the closing `</style>` tag:
```css
    .selection-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: #1a1a2e; color: #fff;
      display: flex; align-items: center; justify-content: space-between;
      gap: 14px; padding: 14px 24px; z-index: 950;
      box-shadow: 0 -4px 24px rgba(0,0,0,.15);
      flex-wrap: wrap;
    }
    .selection-bar .selection-info { display: flex; align-items: center; gap: 14px; font-weight: 700; }
    .selection-actions { display: flex; gap: 10px; }
    #btn-generate-receipt:disabled { opacity: .5; cursor: not-allowed; }
    body.selecting { padding-bottom: 90px; }
```

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: add CSS for payment selection checkboxes and selection bar"
```

---

### Task 2: HTML for the toggle button and the selection bar

**Files:**
- Modify: `minaa-payments.html` (data-toolbar, and the toast div neighborhood)

- [ ] **Step 1: Add the toggle button to the toolbar**

Find (search for `<button class="btn-data btn-invoice" onclick="openInvoice()">🧾 فاتورة شاملة</button>`):
```html
  <button class="btn-data btn-invoice" onclick="openInvoice()">🧾 فاتورة شاملة</button>
```
Insert right after it:
```html
  <button class="btn-data btn-invoice" onclick="openInvoice()">🧾 فاتورة شاملة</button>
  <button class="btn-data btn-select" id="btn-select-toggle" onclick="toggleSelectionMode()">☑️ تحديد الدفعات</button>
```

- [ ] **Step 2: Add the selection bar markup right after `<div id="toast"></div>`**

Find:
```html
<div id="toast"></div>
```
Insert right after it:
```html
<div id="toast"></div>

<!-- SELECTION BAR (shown while selecting payments for a receipt) -->
<div class="selection-bar" id="selection-bar" style="display:none">
  <div class="selection-info">
    <span id="selection-count">تم تحديد 0 دفعات</span>
    <span id="selection-total">0.000 د.ك</span>
  </div>
  <div class="selection-actions">
    <button class="btn-data btn-clear" onclick="cancelSelectionMode()">إلغاء</button>
    <button class="btn-add" id="btn-generate-receipt" onclick="openReceipt()" disabled>🧾 إنشاء إيصال</button>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

Reload the page (logged out is fine for this check). Open the browser console and run:
```js
document.getElementById('btn-select-toggle').textContent, document.getElementById('selection-bar').style.display
```
Expected: `"☑️ تحديد الدفعات", "none"` — button exists, bar is hidden by default. No console errors.

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: add selection toggle button and selection bar markup"
```

---

### Task 3: Selection-mode state and toggle logic

**Files:**
- Modify: `minaa-payments.html` (JS: near `let editingId = null;`, and inside `render()`)

- [ ] **Step 1: Add selection state variables**

Find (search for `let editingId = null;`):
```js
let editingId = null;
```
Insert right after it:
```js
let editingId = null;

// ── Selection mode (for the selective receipt) ─────────────────
let selectionMode = false;
let selectedIds = new Set();
let selectionReceiptOpen = false;

function toggleSelectionMode() {
  if (selectionMode) { cancelSelectionMode(); return; }
  selectionMode = true;
  selectedIds.clear();
  document.getElementById('btn-select-toggle').textContent = '✕ إلغاء التحديد';
  document.getElementById('btn-select-toggle').classList.add('active');
  document.getElementById('selection-bar').style.display = 'flex';
  document.body.classList.add('selecting');
  updateSelectionBar();
  render();
}

function cancelSelectionMode() {
  selectionMode = false;
  selectedIds.clear();
  document.getElementById('btn-select-toggle').textContent = '☑️ تحديد الدفعات';
  document.getElementById('btn-select-toggle').classList.remove('active');
  document.getElementById('selection-bar').style.display = 'none';
  document.body.classList.remove('selecting');
  render();
}

function togglePaymentSelection(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
  updateSelectionBar();
}

function updateSelectionBar() {
  const selected = payments.filter(p => selectedIds.has(p.id));
  const total = selected.reduce((s, p) => s + p.kwdValue, 0);
  document.getElementById('selection-count').textContent = `تم تحديد ${selected.length} دفعات`;
  document.getElementById('selection-total').textContent = fmtKWD(total);
  document.getElementById('btn-generate-receipt').disabled = selected.length === 0;
}
```

- [ ] **Step 2: Drop stale selected ids on every re-render (handles another team member deleting a payment you had selected)**

Find the end of `render()` (search for this exact closing, near the top of the file):
```js
  renderList('list-monthly',   monthly,   'monthly');
  renderList('list-quarterly', quarterly, 'quarterly');
  renderList('list-onetime',   onetime,   'onetime');
}
```
Replace with:
```js
  renderList('list-monthly',   monthly,   'monthly');
  renderList('list-quarterly', quarterly, 'quarterly');
  renderList('list-onetime',   onetime,   'onetime');

  if (selectionMode) {
    const existingIds = new Set(payments.map(p => p.id));
    selectedIds.forEach(id => { if (!existingIds.has(id)) selectedIds.delete(id); });
    updateSelectionBar();
  }
}
```

- [ ] **Step 3: Verify in browser**

You cannot log in (no real credentials available), so `render()`'s payment-dependent behavior can't be exercised live. Instead verify by reading the code: confirm `toggleSelectionMode`/`cancelSelectionMode`/`togglePaymentSelection`/`updateSelectionBar` are defined with no syntax errors, and reload the page (logged out) to confirm no new console errors appear (these functions aren't called automatically before login, so nothing should fire yet).

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: add selection-mode state and toggle logic"
```

---

### Task 4: Render checkboxes in the payment list

**Files:**
- Modify: `minaa-payments.html:renderList()`

- [ ] **Step 1: Add the checkbox row to each payment card**

Find the current card template inside `renderList()`:
```js
    return `
    <div class="pay-item">
      <div class="pay-name" title="${p.name}">${p.name}</div>
      <div class="pay-item-row">
```
Replace with:
```js
    const checked = selectedIds.has(p.id) ? 'checked' : '';
    return `
    <div class="pay-item">
      <div class="pay-top-row">
        ${selectionMode ? `<input type="checkbox" class="pay-checkbox" ${checked} onchange="togglePaymentSelection('${p.id}')"/>` : ''}
        <div class="pay-name" title="${p.name}">${p.name}</div>
      </div>
      <div class="pay-item-row">
```
(Note: the `const checked = ...` line must go inside the existing `.map(p => { ... })` callback, alongside the existing `const isConverted = ...` and `const flagMap = ...` lines already there — add it as a third line in that same spot, not as a separate block.)

- [ ] **Step 2: Verify in browser**

You cannot log in, so you can't see real checkboxes render with data. Instead verify by reading the code: confirm the template literal is valid (matching backticks, no stray `${}`), and confirm that when `selectionMode` is `false` (its default), the `.pay-top-row` div still renders correctly containing just `.pay-name` with no checkbox — i.e. visually and structurally identical to before this change for anyone not in selection mode. Reload the page (logged out) and confirm no new console errors.

- [ ] **Step 3: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: render selection checkboxes on payment cards"
```

---

### Task 5: The receipt modal itself

**Files:**
- Modify: `minaa-payments.html` (new `openReceipt()` function, and `closeInvoice()`)

- [ ] **Step 1: Add `openReceipt()` right after the existing `closeInvoice()` function**

Find:
```js
function closeInvoice(e) {
  if (e && e.target !== document.getElementById('inv-overlay')) return;
  document.getElementById('inv-overlay').style.display = 'none';
  document.getElementById('inv-modal').innerHTML = '';
  document.body.style.overflow = '';
}
```
Replace with:
```js
function closeInvoice(e) {
  if (e && e.target !== document.getElementById('inv-overlay')) return;
  document.getElementById('inv-overlay').style.display = 'none';
  document.getElementById('inv-modal').innerHTML = '';
  document.body.style.overflow = '';
  if (selectionReceiptOpen) {
    selectionReceiptOpen = false;
    cancelSelectionMode();
  }
}

function openReceipt() {
  const selected = payments.filter(p => selectedIds.has(p.id));
  if (!selected.length) return showToast('⚠️ لم يتم تحديد أي دفعة');

  const grandTotal = selected.reduce((s, p) => s + p.kwdValue, 0);

  const now = new Date();
  const recNum = 'REC-' + now.getFullYear().toString().slice(-2)
    + String(now.getMonth()+1).padStart(2,'0')
    + String(now.getDate()).padStart(2,'0')
    + '-' + String(selected.length).padStart(3,'0');

  const recDate = now.toLocaleDateString('ar-KW', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const logoImgEl = document.querySelector('.logo-wrap img');
  const logoSrc   = logoImgEl ? logoImgEl.src : '';

  const typeDot   = { monthly: '🟣', quarterly: '🔵', onetime: '🟠' };
  const typeColor = { monthly: 'var(--purple)', quarterly: 'var(--teal)', onetime: 'var(--brand)' };

  function rowsHTML(list) {
    return list.map(p => {
      const isConv = p.origCurrency && p.origCurrency !== 'KWD';
      const origStr = isConv
        ? `<div class="td-orig">(${p.origCurrency} ${p.origValue.toFixed(3)})</div>` : '';
      const color = typeColor[p.type] || 'inherit';
      return `<tr>
        <td class="td-name" style="color:${color}">${typeDot[p.type]||''} ${p.name}</td>
        <td class="td-date">${fmtDate(p.date)}</td>
        <td class="td-amount" style="color:${color}">${fmtKWD(p.kwdValue)}${origStr}</td>
      </tr>`;
    }).join('');
  }

  const html = `
    <div class="inv-header">
      <div class="inv-logo-area">
        ${logoSrc
          ? `<img src="${logoSrc}" style="width:110px;height:auto;filter:brightness(0) invert(1)" alt="Minaã"/>`
          : `<span style="font-size:1.6rem;font-weight:900;color:#fff;letter-spacing:.05em">Minaã</span>`}
      </div>
      <div class="inv-meta">
        <div class="inv-num">${recNum}</div>
        <div class="inv-date">${recDate}</div>
      </div>
    </div>

    <div class="inv-body">

      <div class="inv-summary" style="grid-template-columns:1fr">
        <div class="inv-chip grand">
          <div class="inv-chip-label">إيصال مُحدد — الإجمالي</div>
          <div class="inv-chip-val">${fmtKWD(grandTotal)}</div>
          <div class="inv-chip-count">${selected.length} دفعة محددة</div>
        </div>
      </div>

      <div class="inv-section">
        <table class="inv-table">
          <thead>
            <tr>
              <th>اسم الدفعة</th>
              <th>تاريخ الإضافة</th>
              <th style="text-align:left">المبلغ (د.ك)</th>
            </tr>
          </thead>
          <tbody>${rowsHTML(selected)}</tbody>
        </table>
      </div>

      <div class="inv-grand">
        <div class="inv-grand-label">💰 إجمالي الدفعات المحددة</div>
        <div class="inv-grand-val">${fmtKWD(grandTotal)}</div>
      </div>

    </div>

    <div class="inv-footer-bar">
      <div class="inv-note">Minaã • إيصال دفعات محددة • ${recDate}</div>
      <div class="inv-actions">
        <button class="btn-inv-close" onclick="closeInvoice()">✕ إغلاق</button>
        <button class="btn-print" onclick="printInvoice()">🖨 طباعة / PDF</button>
      </div>
    </div>
  `;

  selectionReceiptOpen = true;
  document.getElementById('inv-modal').innerHTML = html;
  document.getElementById('inv-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
```

- [ ] **Step 2: Verify in browser**

You cannot log in, so you cannot generate a real receipt with data. Instead verify by reading the code carefully:
- Confirm `openReceipt()` is defined after `closeInvoice()` and both are syntactically valid (matching braces/backticks).
- Confirm `closeInvoice()` only calls `cancelSelectionMode()` when `selectionReceiptOpen` was `true` — opening/closing the regular `فاتورة شاملة` invoice must NOT touch `selectionMode`/`selectedIds` at all, since `openInvoice()` (the pre-existing function) never sets `selectionReceiptOpen = true`.
- Reload the page (logged out) and confirm no new console errors from this change.

- [ ] **Step 3: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: add selective receipt modal (REC-numbered, flat per-payment-color table)"
```

---

### Task 6: Full manual verification (requires the user's real login)

**Files:** none — verification only.

> You (the agent) cannot perform this task's checks yourself — they all require signing in with real team credentials, which you must not do (per the project's credential-handling rule). Report the code as implemented, then hand this checklist to the user for them to run themselves.

- [ ] Log in. Click `☑️ تحديد الدفعات`. Confirm the button changes to `✕ إلغاء التحديد` (styled active/purple), and a dark bar appears at the bottom showing `تم تحديد 0 دفعات` / `0.000 د.ك` with a disabled `🧾 إنشاء إيصال` button.
- [ ] Confirm every payment card, across all three sections (شهري / اشتراكات / أحادية), now shows a checkbox next to its name.
- [ ] Check 2-3 payments across *different* sections (e.g. one monthly + one one-time). Confirm the bottom bar's count and total update live, and the `إنشاء إيصال` button becomes enabled.
- [ ] Click `إنشاء إيصال`. Confirm a receipt opens styled like the existing invoice (same header/logo/footer), numbered `REC-...` (not `INV-...`), listing only the payments you checked, each name/amount colored by its own type (purple/teal/orange), with a single total chip and total match the bottom bar's total.
- [ ] Click `🖨 طباعة / PDF` on the receipt — confirm the print preview shows only the receipt (same behavior as the existing invoice's print).
- [ ] Close the receipt (`✕ إغلاق` or click the dark backdrop). Confirm selection mode turns off automatically: the toggle button reverts to `☑️ تحديد الدفعات`, the bottom bar disappears, and checkboxes are gone from all cards.
- [ ] Re-enter selection mode, select something, then click `إلغاء` in the bottom bar (not the receipt). Confirm selection mode exits the same way, with no receipt shown.
- [ ] Open the regular `🧾 فاتورة شاملة` invoice (not via selection) and close it normally. Confirm this does **not** affect selection mode in any way (should be a no-op either way since selection mode wasn't active, but confirm no errors).
- [ ] If comfortable, open the app in a second browser/tab logged in as well: select payments in tab A, and confirm tab B's payment list still updates live from any add/edit/delete happening elsewhere while tab A is mid-selection (this is the existing real-time sync, just confirming this feature didn't break it).

If anything above doesn't match, report exactly what you saw and it'll get fixed.
