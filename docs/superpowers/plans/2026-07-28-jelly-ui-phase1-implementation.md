# Jelly UI Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this app's native buttons, inputs, selects, and checkboxes with Jelly UI web components and Iconify SVG icons, per `docs/superpowers/specs/2026-07-28-jelly-ui-phase1-design.md`, while preserving every existing brand color exactly and keeping the app fully functional (Firestore writes, currency conversion, selection/receipt feature, RTL layout).

**Architecture:** Two new CDN `<script>` tags (Jelly UI, Iconify) alongside the existing Firebase ones. The whole app body is wrapped in `<jelly-theme mode="light" accent="#E8471C">`. Each native control is swapped 1:1 for its Jelly equivalent, with exact brand colors preserved via inline `style="--jelly-fill:...;--jelly-label:..."` (or `--jelly-accent`/`--jelly-on` where that's the documented token) rather than Jelly's built-in named variants. The two functions that dynamically recolor the currency/type selects based on the current selection (`updateCurrencyStyle`/`updateTypeStyle`/`updateEditCurrencyStyle`) are rewritten to set the `--jelly-accent` CSS custom property instead of swapping a CSS class. Once every control is migrated, the now-dead CSS for the old native controls is removed.

**Tech Stack:** Vanilla JS/HTML, two new CDN dependencies (jelly-ui.com, code.iconify.design), no build tools. No test framework in this project — verification is manual browser checks.

---

### Task 1: Foundation — load scripts, wrap in jelly-theme, update PRODUCT.md

**Files:**
- Modify: `minaa-payments.html` (script tags, body wrapper)
- Modify: `PRODUCT.md` (Brand Personality section)

- [ ] **Step 1: Add the two new CDN script tags**

Find (search for the three existing Firebase script tags):
```html
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js"></script>
```
Insert two more lines right after them:
```html
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js"></script>
<script type="module" src="https://jelly-ui.com/package.js"></script>
<script src="https://code.iconify.design/iconify-icon/2.x/iconify-icon.min.js"></script>
```

- [ ] **Step 2: Wrap the whole visible app in `<jelly-theme>`**

Find the loader's closing `</div>` right before the lock-screen comment (search for `<!-- LOGIN LOCK SCREEN -->`):
```html
</div>

<!-- LOGIN LOCK SCREEN -->
```
Insert the opening `<jelly-theme>` tag right before it:
```html
</div>

<jelly-theme mode="light" accent="#E8471C">

<!-- LOGIN LOCK SCREEN -->
```

Then find the very end of the body content — the closing `</div>` that currently closes the edit-modal, immediately followed by a blank line and the Firebase script tags (search for the exact sequence below, which is the last `</div></div>` pair before the `<script>` tags):
```html
  </div>
</div>
</div>

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>
```
Insert the closing `</jelly-theme>` tag right after the third `</div>` (which closes `#app-content`), before the scripts:
```html
  </div>
</div>
</div>

</jelly-theme>

<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>
```
(This wraps everything from the lock screen through the end of `#app-content` — loader stays outside since it's shown before any theme-dependent content matters, which is harmless either way since `jelly-theme` is layout-neutral.)

- [ ] **Step 3: Update PRODUCT.md's Brand Personality section**

Find the `## Brand Personality` section in `PRODUCT.md`:
```markdown
## Brand Personality

Warm and approachable. Friendly, human, Arabic-first in tone — not a cold corporate dashboard, not playful/toy-like either. The warmth comes from color and directness, not decoration: the orange seagull-on-bollard logo, plain-spoken Arabic labels, and a straightforward layout that respects the user's time.
```
Replace with:
```markdown
## Brand Personality

Warm, approachable, and now playfully tactile. Friendly, human, Arabic-first in tone — not a cold corporate dashboard. The app has embraced a soft, "squishy" interactive feel (via the Jelly UI component library) as part of its personality: buttons and controls respond with a tangible, tactile bounce. The warmth still comes from color and directness — the orange seagull-on-bollard logo, plain-spoken Arabic labels — but playful, tactile interaction is now a deliberate, embraced part of the brand, not something to minimize.
```

- [ ] **Step 4: Verify in browser**

Reload the page. Open the console and run:
```js
customElements.get('jelly-theme'), customElements.get('jelly-button'), customElements.get('iconify-icon')
```
Expected: all three return a class/function (not `undefined`) — confirms both libraries loaded and registered their custom elements. Confirm no console errors. The page will look unchanged visually at this point (no native controls have been swapped yet) except that everything now renders inside a `<jelly-theme>` element — confirm layout is unaffected (still centered, no shifted content) since it's `display:contents`.

- [ ] **Step 5: Commit**

```bash
git add minaa-payments.html PRODUCT.md
git commit -m "feat: load Jelly UI and Iconify, wrap app in jelly-theme, update brand personality"
```

---

### Task 2: Toolbar buttons

**Files:**
- Modify: `minaa-payments.html` (`.data-toolbar` HTML, `toggleSelectionMode()`/`cancelSelectionMode()` JS)

- [ ] **Step 1: Replace the six toolbar buttons**

Find:
```html
<div class="data-toolbar">
  <button class="btn-data btn-invoice" onclick="openInvoice()">🧾 فاتورة شاملة</button>
  <button class="btn-data btn-select" id="btn-select-toggle" onclick="toggleSelectionMode()">☑️ تحديد الدفعات</button>
  <button class="btn-data btn-export" onclick="exportData()">⬇ تصدير البيانات</button>
  <button class="btn-data btn-import" onclick="document.getElementById('import-file').click()">⬆ استيراد البيانات</button>
  <input type="file" id="import-file" accept=".json" onchange="importData(event)"/>
  <button class="btn-data btn-clear" onclick="clearData()">🗑 مسح الكل</button>
  <button class="btn-data" style="background:#F3F4F6;color:var(--muted);border:1.5px solid var(--border)" onclick="logout()">🚪 خروج</button>
</div>
```
Replace with:
```html
<div class="data-toolbar">
  <jelly-button style="--jelly-fill:#FFF1ED;--jelly-label:var(--brand)" onclick="openInvoice()"><iconify-icon icon="lucide:receipt-text"></iconify-icon> فاتورة شاملة</jelly-button>
  <jelly-button id="btn-select-toggle" style="--jelly-fill:#F5F3FF;--jelly-label:#6D28D9" onclick="toggleSelectionMode()"><iconify-icon icon="lucide:list-checks"></iconify-icon> تحديد الدفعات</jelly-button>
  <jelly-button style="--jelly-fill:#F0FDF4;--jelly-label:#15803D" onclick="exportData()"><iconify-icon icon="lucide:download"></iconify-icon> تصدير البيانات</jelly-button>
  <jelly-button style="--jelly-fill:#EFF6FF;--jelly-label:#1D4ED8" onclick="document.getElementById('import-file').click()"><iconify-icon icon="lucide:upload"></iconify-icon> استيراد البيانات</jelly-button>
  <input type="file" id="import-file" accept=".json" onchange="importData(event)"/>
  <jelly-button style="--jelly-fill:#FFF1F2;--jelly-label:#BE123C" onclick="clearData()"><iconify-icon icon="lucide:trash-2"></iconify-icon> مسح الكل</jelly-button>
  <jelly-button variant="platinum" onclick="logout()"><iconify-icon icon="lucide:log-out"></iconify-icon> خروج</jelly-button>
</div>
```
(The invoice button's fill is `#FFF1ED`, the solid form of its original gradient's lighter stop — Jelly paints a solid membrane, not a gradient, so this is the closest solid equivalent of the original look.)

- [ ] **Step 2: Update `toggleSelectionMode()`/`cancelSelectionMode()` to recolor the jelly-button instead of toggling a CSS class**

Find (search for `document.getElementById('btn-select-toggle').textContent`):
```js
  document.getElementById('btn-select-toggle').textContent = '✕ إلغاء التحديد';
  document.getElementById('btn-select-toggle').classList.add('active');
```
Replace with:
```js
  document.getElementById('btn-select-toggle').innerHTML = '<iconify-icon icon="lucide:x"></iconify-icon> إلغاء التحديد';
  document.getElementById('btn-select-toggle').style.setProperty('--jelly-fill', 'var(--purple)');
  document.getElementById('btn-select-toggle').style.setProperty('--jelly-label', '#fff');
```
And find (search for the reset in `cancelSelectionMode()`):
```js
  document.getElementById('btn-select-toggle').textContent = '☑️ تحديد الدفعات';
  document.getElementById('btn-select-toggle').classList.remove('active');
```
Replace with:
```js
  document.getElementById('btn-select-toggle').innerHTML = '<iconify-icon icon="lucide:list-checks"></iconify-icon> تحديد الدفعات';
  document.getElementById('btn-select-toggle').style.setProperty('--jelly-fill', '#F5F3FF');
  document.getElementById('btn-select-toggle').style.setProperty('--jelly-label', '#6D28D9');
```

- [ ] **Step 3: Verify in browser**

Reload (logged out is fine). Confirm the toolbar renders 6 pill-shaped soft-body buttons with visible icons and Arabic labels, in their correct distinct colors (orange/purple/green/blue/red/neutral-grey), laid out RTL. Confirm no console errors. You cannot log in to test the select-toggle's active-state recoloring live — verify that by reading the code instead: confirm both `innerHTML`/`style.setProperty` blocks reference the exact same element id (`btn-select-toggle`) consistently.

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: replace toolbar buttons with jelly-button and Iconify icons"
```

---

### Task 3: Add-payment form

**Files:**
- Modify: `minaa-payments.html` (`.form-grid` HTML, `updateCurrencyStyle()`/`updateTypeStyle()` JS)

- [ ] **Step 1: Replace the four fields and the add button**

Find:
```html
  <div class="form-grid">
    <div class="field">
      <label>اسم الدفعة</label>
      <input id="inp-name" type="text" placeholder="مثال: إيجار المخزن A"/>
    </div>
    <div class="field">
      <label>القيمة</label>
      <input id="inp-value" type="number" min="0" step="0.01" placeholder="0.00"
             oninput="updateConvertHint()"/>
      <div class="convert-hint" id="convert-hint"></div>
    </div>
    <div class="field">
      <label>العملة</label>
      <select id="inp-currency" onchange="updateCurrencyStyle(); updateConvertHint()">
        <option value="KWD">🇰🇼 دينار كويتي</option>
        <option value="USD">🇺🇸 دولار أمريكي</option>
        <option value="EUR">🇪🇺 يورو</option>
      </select>
    </div>
    <div class="field">
      <label>نوع الدفعة</label>
      <select id="inp-type" onchange="updateTypeStyle()">
        <option value="monthly">🟣 شهري</option>
        <option value="quarterly">🔵 اشتراك / 3 أشهر</option>
        <option value="onetime">🟠 مرة واحدة</option>
      </select>
    </div>
    <button class="btn-add" onclick="addPayment()">+ إضافة</button>
  </div>
```
Replace with:
```html
  <div class="form-grid">
    <div class="field">
      <jelly-input id="inp-name" label="اسم الدفعة" type="text" placeholder="مثال: إيجار المخزن A"></jelly-input>
    </div>
    <div class="field">
      <jelly-input id="inp-value" label="القيمة" type="number" placeholder="0.00" oninput="updateConvertHint()"></jelly-input>
      <div class="convert-hint" id="convert-hint"></div>
    </div>
    <div class="field">
      <jelly-select id="inp-currency" label="العملة" value="KWD" onchange="updateCurrencyStyle(); updateConvertHint()">
        <jelly-option value="KWD">🇰🇼 دينار كويتي</jelly-option>
        <jelly-option value="USD">🇺🇸 دولار أمريكي</jelly-option>
        <jelly-option value="EUR">🇪🇺 يورو</jelly-option>
      </jelly-select>
    </div>
    <div class="field">
      <jelly-select id="inp-type" label="نوع الدفعة" value="monthly" onchange="updateTypeStyle()">
        <jelly-option value="monthly">🟣 شهري</jelly-option>
        <jelly-option value="quarterly">🔵 اشتراك / 3 أشهر</jelly-option>
        <jelly-option value="onetime">🟠 مرة واحدة</jelly-option>
      </jelly-select>
    </div>
    <jelly-button onclick="addPayment()"><iconify-icon icon="lucide:plus"></iconify-icon> إضافة</jelly-button>
  </div>
```
(The old `<label>` elements are removed since `jelly-input`/`jelly-select` take their own `label=` attribute for the accessible name — visually the field still shows the same Arabic caption, just as a placeholder-adjacent label baked into the component rather than a separate `<label>` tag. `min`/`step` are dropped from the value input since `jelly-input`'s documented attribute set doesn't include them — the app's own numeric validation in `addPayment()`/`saveEdit()` already guards against invalid values independent of these HTML constraint attributes.)

- [ ] **Step 2: Rewrite `updateCurrencyStyle()` and `updateTypeStyle()` to set `--jelly-accent` instead of swapping a class**

Find:
```js
function updateCurrencyStyle() {
  const s = document.getElementById('inp-currency');
  s.className = { KWD:'cur-kwd', USD:'cur-usd', EUR:'cur-eur' }[s.value] || '';
}
function updateTypeStyle() {
  const s = document.getElementById('inp-type');
  s.className = { monthly:'type-monthly', quarterly:'type-quarterly', onetime:'type-onetime' }[s.value] || '';
}
```
Replace with:
```js
function updateCurrencyStyle() {
  const s = document.getElementById('inp-currency');
  const colors = { KWD:'#10B981', USD:'#3B82F6', EUR:'#8B5CF6' };
  s.style.setProperty('--jelly-accent', colors[s.value] || '');
}
function updateTypeStyle() {
  const s = document.getElementById('inp-type');
  const colors = { monthly:'var(--purple)', quarterly:'var(--teal)', onetime:'var(--brand)' };
  s.style.setProperty('--jelly-accent', colors[s.value] || '');
}
```

- [ ] **Step 3: Call both style functions once on load so the fields show their correct initial color**

Find the `// ── Init ───` section near the end of the script (search for `updateCurrencyStyle();` — it should already be called once at init from before this app had Jelly components; if it's not already there, add it). Confirm both `updateCurrencyStyle();` and `updateTypeStyle();` are present in the init sequence (they call the DOM at that point, so they must run after the `jelly-select` elements exist, i.e. anywhere in the existing init block is fine since it runs after the HTML has parsed).

- [ ] **Step 4: Verify in browser**

You cannot log in, so you can't see the add-form live with real interaction after auth. Instead verify by reading the code: confirm `jelly-select`'s `value="KWD"`/`value="monthly"` attributes are set for the intended default selection, confirm the `jelly-option` children use the exact same `value=`/label text as before, confirm `updateCurrencyStyle()`/`updateTypeStyle()` no longer reference the now-removed `cur-*`/`type-*` CSS classes. Reload logged-out and confirm no console errors.

- [ ] **Step 5: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: replace add-payment form fields with jelly-input/jelly-select/jelly-button"
```

---

### Task 4: Edit modal

**Files:**
- Modify: `minaa-payments.html` (`#edit-modal` HTML, `updateEditCurrencyStyle()` JS)

- [ ] **Step 1: Replace the four fields and the two footer buttons**

Find:
```html
    <div class="modal-grid">
      <div class="field">
        <label>اسم الدفعة</label>
        <input id="edit-name" type="text" placeholder="اسم الدفعة"/>
      </div>
      <div class="field">
        <label>القيمة</label>
        <input id="edit-value" type="number" min="0" step="0.01" placeholder="0.00" oninput="updateEditHint()"/>
        <div class="convert-hint" id="edit-hint"></div>
      </div>
      <div class="field">
        <label>العملة</label>
        <select id="edit-currency" onchange="updateEditCurrencyStyle(); updateEditHint()">
          <option value="KWD">🇰🇼 دينار كويتي</option>
          <option value="USD">🇺🇸 دولار أمريكي</option>
          <option value="EUR">🇪🇺 يورو</option>
        </select>
      </div>
      <div class="field">
        <label>نوع الدفعة</label>
        <select id="edit-type">
          <option value="monthly">🟣 شهري</option>
          <option value="quarterly">🔵 اشتراك / 3 أشهر</option>
          <option value="onetime">🟠 مرة واحدة</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-modal-cancel" onclick="closeModal()">إلغاء</button>
      <button class="btn-modal-save"   onclick="saveEdit()">💾 حفظ التعديل</button>
    </div>
```
Replace with:
```html
    <div class="modal-grid">
      <div class="field">
        <jelly-input id="edit-name" label="اسم الدفعة" type="text" placeholder="اسم الدفعة"></jelly-input>
      </div>
      <div class="field">
        <jelly-input id="edit-value" label="القيمة" type="number" placeholder="0.00" oninput="updateEditHint()"></jelly-input>
        <div class="convert-hint" id="edit-hint"></div>
      </div>
      <div class="field">
        <jelly-select id="edit-currency" label="العملة" onchange="updateEditCurrencyStyle(); updateEditHint()">
          <jelly-option value="KWD">🇰🇼 دينار كويتي</jelly-option>
          <jelly-option value="USD">🇺🇸 دولار أمريكي</jelly-option>
          <jelly-option value="EUR">🇪🇺 يورو</jelly-option>
        </jelly-select>
      </div>
      <div class="field">
        <jelly-select id="edit-type" label="نوع الدفعة">
          <jelly-option value="monthly">🟣 شهري</jelly-option>
          <jelly-option value="quarterly">🔵 اشتراك / 3 أشهر</jelly-option>
          <jelly-option value="onetime">🟠 مرة واحدة</jelly-option>
        </jelly-select>
      </div>
    </div>
    <div class="modal-footer">
      <jelly-button variant="platinum" onclick="closeModal()">إلغاء</jelly-button>
      <jelly-button style="--jelly-fill:var(--purple);--jelly-label:#fff" onclick="saveEdit()"><iconify-icon icon="lucide:save"></iconify-icon> حفظ التعديل</jelly-button>
    </div>
```
(No `value=` default is set on `#edit-currency`/`#edit-type` here since `openEdit(id)` already sets `.value` programmatically when populating the modal for a specific payment — unlike the add-form, this modal never shows a "default" untouched state.)

- [ ] **Step 2: Rewrite `updateEditCurrencyStyle()` to match Task 3's pattern**

Find:
```js
function updateEditCurrencyStyle() {
  const s = document.getElementById('edit-currency');
  s.className = { KWD:'cur-kwd', USD:'cur-usd', EUR:'cur-eur' }[s.value] || '';
}
```
Replace with:
```js
function updateEditCurrencyStyle() {
  const s = document.getElementById('edit-currency');
  const colors = { KWD:'#10B981', USD:'#3B82F6', EUR:'#8B5CF6' };
  s.style.setProperty('--jelly-accent', colors[s.value] || '');
}
```

- [ ] **Step 3: Verify in browser**

You cannot log in, so you can't open the edit modal with real data. Verify by reading the code: confirm the field/button structure mirrors Task 3's add-form pattern exactly (same tag names, same attribute conventions), confirm `updateEditCurrencyStyle()` no longer references the removed `cur-*` classes, confirm `openEdit(id)`/`saveEdit()` (which set/read `.value` on `#edit-currency`/`#edit-type`/`#edit-name`/`#edit-value`) don't need any changes themselves — `jelly-input`/`jelly-select` both expose the same `.value` property as native controls, so existing `document.getElementById('edit-name').value = p.name` style code keeps working unmodified. Reload logged-out and confirm no console errors.

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: replace edit-modal fields with jelly-input/jelly-select/jelly-button"
```

---

### Task 5: Login form

**Files:**
- Modify: `minaa-payments.html` (`#lock-overlay` HTML)

- [ ] **Step 1: Replace the two fields and the submit button**

Find:
```html
    <div class="modal-grid" style="grid-template-columns:1fr">
      <div class="field">
        <label>البريد الإلكتروني</label>
        <input id="lock-email" type="email" placeholder="you@example.com"/>
      </div>
      <div class="field">
        <label>كلمة المرور</label>
        <input id="lock-password" type="password" placeholder="••••••••"/>
      </div>
    </div>
    <div class="lock-error" id="lock-error"></div>
    <div class="modal-footer">
      <button class="btn-add" id="lock-submit" onclick="login()">دخول</button>
    </div>
```
Replace with:
```html
    <div class="modal-grid" style="grid-template-columns:1fr">
      <div class="field">
        <jelly-input id="lock-email" label="البريد الإلكتروني" type="email" placeholder="you@example.com"></jelly-input>
      </div>
      <div class="field">
        <jelly-input id="lock-password" label="كلمة المرور" type="password" placeholder="••••••••"></jelly-input>
      </div>
    </div>
    <div class="lock-error" id="lock-error"></div>
    <div class="modal-footer">
      <jelly-button id="lock-submit" onclick="login()">دخول</jelly-button>
    </div>
```

- [ ] **Step 2: Verify in browser**

Reload the page (this is the ONE part of the app visible without logging in). Confirm the lock screen shows two soft-body input fields with Arabic labels and a "دخول" jelly-button, laid out correctly in RTL. Confirm no console errors. Do NOT attempt to actually type real credentials and log in — just confirm the fields render and are focusable/typeable (clicking into them and confirming a text cursor appears is fine; do not submit).

- [ ] **Step 3: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: replace login form fields with jelly-input/jelly-button"
```

---

### Task 6: Selection bar, payment-card checkbox, and edit/delete icon buttons

**Files:**
- Modify: `minaa-payments.html` (`#selection-bar` HTML, `renderList()` template)

- [ ] **Step 1: Replace the selection bar's two buttons**

Find:
```html
  <div class="selection-actions">
    <button class="btn-modal-cancel" onclick="cancelSelectionMode()">إلغاء</button>
    <button class="btn-add" id="btn-generate-receipt" onclick="openReceipt()" disabled>🧾 إنشاء إيصال</button>
  </div>
```
Replace with:
```html
  <div class="selection-actions">
    <jelly-button variant="platinum" onclick="cancelSelectionMode()">إلغاء</jelly-button>
    <jelly-button id="btn-generate-receipt" onclick="openReceipt()" disabled><iconify-icon icon="lucide:receipt-text"></iconify-icon> إنشاء إيصال</jelly-button>
  </div>
```
(`jelly-button` supports the `disabled` attribute natively, and `updateSelectionBar()`'s existing `document.getElementById('btn-generate-receipt').disabled = selected.length === 0;` line needs no change — `disabled` is a normal reflected property on `jelly-button` same as a native button.)

- [ ] **Step 2: Replace the checkbox and the two icon buttons inside `renderList()`**

Find (inside the `.map(p => {...})` template):
```js
      <div class="pay-top-row">
        ${selectionMode ? `<input type="checkbox" class="pay-checkbox" ${checked} onchange="togglePaymentSelection('${p.id}')"/>` : ''}
        <div class="pay-name" title="${p.name}">${p.name}</div>
      </div>
```
Replace with:
```js
      <div class="pay-top-row">
        ${selectionMode ? `<jelly-checkbox label="تحديد الدفعة" style="--jelly-on:var(--brand)" ${checked} onchange="togglePaymentSelection('${p.id}')"></jelly-checkbox>` : ''}
        <div class="pay-name" title="${p.name}">${p.name}</div>
      </div>
```
And find:
```js
        <div class="pay-actions">
          <button class="btn-edit" onclick="openEdit('${p.id}')" title="تعديل">✏️</button>
          <button class="btn-del"  onclick="deletePayment('${p.id}')" title="حذف">✕</button>
        </div>
```
Replace with:
```js
        <div class="pay-actions">
          <jelly-icon-button label="تعديل" onclick="openEdit('${p.id}')"><iconify-icon icon="lucide:pencil"></iconify-icon></jelly-icon-button>
          <jelly-icon-button label="حذف" onclick="deletePayment('${p.id}')"><iconify-icon icon="lucide:x"></iconify-icon></jelly-icon-button>
        </div>
```
(`jelly-checkbox`'s `checked` reflects the same attribute-driven pattern as before — the `${checked}` template variable already produces the literal string `"checked"` or `""`, which works identically on `jelly-checkbox` as it did on the native `<input type="checkbox">`. `jelly-icon-button` doesn't need a `variant` override — its default coloring is a reasonable neutral fit for these small utility actions, which were never part of the type-color-coding system.)

- [ ] **Step 3: Verify in browser**

You cannot log in, so you cannot see real payment cards with checkboxes/icon-buttons rendered with data. Verify by reading the code: confirm the template literal is still syntactically valid (matching backticks/quotes), confirm `jelly-checkbox`'s `checked`/`onchange` attributes are wired identically to before, confirm both `jelly-icon-button`s have a `label=` attribute (required for their accessible name, per Jelly's API). Reload logged-out and confirm no console errors (checkboxes/icon-buttons only render once logged in with data, so nothing new should fire yet).

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: replace selection-bar buttons, payment checkboxes, and edit/delete icon-buttons with Jelly UI"
```

---

### Task 7: Remove dead CSS

**Files:**
- Modify: `minaa-payments.html` (`<style>` block)

- [ ] **Step 1: Remove the following now-unused CSS rules**

Every native control they styled has been replaced in Tasks 2-6, so these rules no longer match anything in the page. Search for and delete each block entirely:
- `.btn-data { ... }` and its variants: `.btn-export`, `.btn-export:hover`, `.btn-import`, `.btn-import:hover`, `.btn-clear`, `.btn-clear:hover`, `.btn-select`, `.btn-select:hover`, `.btn-select.active`, `.btn-invoice`, `.btn-invoice:hover`
- The base `input, select { ... }` rule, `input:focus, select:focus { ... }`, `select { cursor: pointer; }`
- `select.type-monthly`, `select.type-quarterly`, `select.type-onetime`
- `.cur-kwd`, `.cur-usd`, `.cur-eur`
- `.btn-add`, `.btn-add:hover`, `.btn-add:active`
- `.pay-checkbox`
- `.btn-del, .btn-edit { ... }`, `.btn-del { ... }`, `.btn-edit { ... }`, `.btn-del:hover`, `.btn-edit:hover`
- `.btn-modal-save`, `.btn-modal-save:hover`, `.btn-modal-cancel`, `.btn-modal-cancel:hover`
- `.selection-bar .btn-modal-cancel`, `.selection-bar .btn-modal-cancel:hover` (this override is now moot since the selection bar's cancel button is a `jelly-button`, not `.btn-modal-cancel`)

Do NOT remove: `.field`, `.form-grid` and its media queries, `.modal-grid`, `.modal-grid .field:first-child`, `.modal-footer`, `.data-toolbar`, `.selection-bar`, `.selection-bar .selection-info`, `.selection-actions`, `#btn-generate-receipt:disabled`, `body.selecting`, `.pay-top-row`, `.pay-actions`, `#import-file { display: none; }` — these are structural/layout rules or rules for elements untouched by this phase, still in use.

- [ ] **Step 2: Verify in browser**

Reload the page (logged out). Confirm the lock screen still renders correctly with no visual regression and no console errors. Grep the file afterward for each removed selector (e.g. `grep -c "\.btn-add "`) to confirm zero remaining references, and grep for `jelly-button`, `jelly-input`, `jelly-select`, `jelly-checkbox`, `jelly-icon-button` to confirm they're still present in the expected locations (i.e. confirm you deleted CSS, not markup).

- [ ] **Step 3: Commit**

```bash
git add minaa-payments.html
git commit -m "chore: remove CSS for native controls replaced by Jelly UI"
```

---

### Task 8: Full manual verification (requires the user's real login)

**Files:** none — verification only.

> You (the agent) cannot perform this task's checks yourself — most require signing in with real team credentials. Report the code as implemented, then hand this checklist to the user.

- [ ] Log in via the new jelly-input/jelly-button lock screen. Confirm login still works exactly as before.
- [ ] Confirm the toolbar's 6 buttons all show correct icons, correct colors, and work (open invoice, toggle selection mode, export, import, clear, logout) — especially confirm the select-toggle button visibly recolors to purple with an "✕" icon when activated, and back when canceled.
- [ ] Add a new payment: confirm the name/value jelly-inputs work, confirm the currency jelly-select visibly recolors (green/blue/purple) as you change it and the conversion hint still appears, confirm the type jelly-select visibly recolors (purple/teal/orange) as you change it, confirm the add button works and the payment appears.
- [ ] Edit an existing payment: confirm the edit modal's fields pre-fill correctly, confirm changing currency/type recolors those selects too, confirm save/cancel both work.
- [ ] Toggle selection mode: confirm jelly-checkboxes appear on payment cards and work, confirm the edit/delete jelly-icon-buttons still work, confirm generating a receipt still works end-to-end.
- [ ] Confirm delete still works (jelly-icon-button).
- [ ] Test on a narrow (mobile-width) window: confirm RTL layout, icon direction, and dropdown-panel positioning for jelly-select all look correct (Jelly UI claims automatic RTL support — this is the main thing to scrutinize, since it hasn't been tested with real Arabic content until now).
- [ ] Confirm no console errors anywhere during normal use, and confirm the app still works if `jelly-ui.com` or `code.iconify.design` were slow/unreachable (optional stretch check: throttle network in devtools and reload, confirm the page doesn't hang indefinitely — a graceful degradation isn't required by this phase, just confirm it doesn't silently corrupt data).

If anything above doesn't match, report exactly what you saw and it'll get fixed.
