# Firebase Shared Sync + Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `localStorage` in `minaa-payments.html` with a Firebase-backed data layer (Firestore + Auth) so the Minaa team sees the same, real-time-synced payment data across devices, gated behind a login screen.

**Architecture:** Single-file app stays single-file. Firebase is loaded via the **compat SDK** (`firebase-app-compat.js`, `firebase-auth-compat.js`, `firebase-firestore-compat.js`) as plain `<script>` tags — this keeps the existing "one classic script, everything global, called via inline `onclick=`" architecture completely intact (no ES module scoping issues, no build step). A lock-screen overlay gates an `#app-content` wrapper; once `auth.onAuthStateChanged` confirms a session, a Firestore `onSnapshot` listener replaces the old `localStorage` read, and writes go straight to Firestore instead of `localStorage.setItem`.

**Tech Stack:** Vanilla JS, Firebase compat SDK v10 (Auth + Firestore) via CDN, no build tools.

There is no automated test runner in this project (single static HTML file, no `package.json`). "Tests" in this plan are manual browser verification steps, consistent with how this app has always been validated.

---

## Reference: Firebase config (already created in console)

```js
const firebaseConfig = {
  apiKey: "AIzaSyC-Nylul8l-RfYy1K-LurE17oPBqw2oLBs",
  authDomain: "minaa-payments.firebaseapp.com",
  projectId: "minaa-payments",
  storageBucket: "minaa-payments.firebasestorage.app",
  messagingSenderId: "469963012025",
  appId: "1:469963012025:web:0b1130d7d0c2f2ec23a868",
  measurementId: "G-83DBSLNEVJ"
};
```

---

### Task 1: Initialize git repo

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Init the repo**

Run: `git init` (from `D:\Claude Project's\Minaa payment mini payment S`)
Expected: `Initialized empty Git repository in ...`

- [ ] **Step 2: Add a minimal .gitignore**

```
.DS_Store
Thumbs.db
```

- [ ] **Step 3: First commit**

```bash
git add CLAUDE.md minaa-payments.html .gitignore docs/superpowers/specs/2026-07-27-firebase-sync-design.md docs/superpowers/plans/2026-07-27-firebase-sync-implementation.md
git commit -m "chore: initial commit of Minaa payments app"
```
Expected: commit succeeds, `git status` shows clean tree.

---

### Task 2: Load Firebase SDK and initialize app/auth/db

**Files:**
- Modify: `minaa-payments.html:812-816` (insert before existing `<script>` block, and inside it)

- [ ] **Step 1: Add the three compat SDK script tags right before the existing `<script>` at line 813**

Insert immediately before line 813 (`<script>`):
```html
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js"></script>
```

- [ ] **Step 2: Initialize Firebase at the very top of the existing `<script>` block**

Insert as the first lines inside `<script>` (right after the `<script>` tag, before the `// ── Exchange Rates ──` comment):
```js
// ── Firebase ───────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC-Nylul8l-RfYy1K-LurE17oPBqw2oLBs",
  authDomain: "minaa-payments.firebaseapp.com",
  projectId: "minaa-payments",
  storageBucket: "minaa-payments.firebasestorage.app",
  messagingSenderId: "469963012025",
  appId: "1:469963012025:web:0b1130d7d0c2f2ec23a868",
  measurementId: "G-83DBSLNEVJ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
```

- [ ] **Step 3: Verify in browser**

Open `minaa-payments.html` in the browser preview. Open the browser console and run:
```js
typeof firebase, typeof auth, typeof db
```
Expected: `"object", "object", "object"` — no red errors in the console about `firebase is not defined`.

- [ ] **Step 4: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: load Firebase SDK and initialize app/auth/firestore"
```

---

### Task 3: Add login lock-screen and gate the app behind it

**Files:**
- Modify: `minaa-payments.html:611` (CSS, before `</style>`)
- Modify: `minaa-payments.html:621-623` (insert lock-screen HTML + open `#app-content` wrapper)
- Modify: `minaa-payments.html:660` (insert sign-out button in toolbar)
- Modify: `minaa-payments.html:811` (close `#app-content` wrapper)
- Modify: `minaa-payments.html` init block (end of script) — add `login()`, `logout()`, `auth.onAuthStateChanged`

- [ ] **Step 1: Add a small CSS rule for the lock-screen error text**

Insert immediately before `</style>` (line 611):
```css
.lock-error { color:#BE123C; font-size:.78rem; margin-bottom:10px; min-height:16px; }
```

- [ ] **Step 2: Insert the lock-screen markup and open the `#app-content` wrapper**

Insert right after the loader's closing `</div>` (line 621) and right before `<!-- HEADER -->` (line 623):
```html
<!-- LOGIN LOCK SCREEN -->
<div class="modal-overlay" id="lock-overlay" style="display:none">
  <div class="modal">
    <div class="modal-title"><span class="dot"></span> تسجيل الدخول</div>
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
  </div>
</div>

<div id="app-content" style="display:none">
```
(The opening `<div id="app-content" ...>` line goes immediately before `<!-- HEADER -->`.)

- [ ] **Step 3: Add the sign-out button to the data toolbar**

Insert right after the existing clear-data button (line 660, `<button class="btn-data btn-clear" onclick="clearData()">🗑 مسح الكل</button>`):
```html
<button class="btn-data" style="background:#F3F4F6;color:var(--muted);border:1.5px solid var(--border)" onclick="logout()">🚪 خروج</button>
```

- [ ] **Step 4: Close the `#app-content` wrapper**

Insert a closing `</div>` immediately after the edit-modal's closing `</div>` (the line right after line 811, before the blank line preceding `<script>`).

- [ ] **Step 5: Add `login()`, `logout()`, and the auth-state listener**

Replace the existing Init block at the very end of the script:
```js
updateCurrencyStyle();
updateTypeStyle();
migrateOldData();
render();
fetchRates();
```
with:
```js
updateCurrencyStyle();
updateTypeStyle();
fetchRates();

function login() {
  const email    = document.getElementById('lock-email').value.trim();
  const password = document.getElementById('lock-password').value;
  const errEl    = document.getElementById('lock-error');
  errEl.textContent = '';
  if (!email || !password) { errEl.textContent = 'أدخل البريد وكلمة المرور'; return; }
  auth.signInWithEmailAndPassword(email, password)
    .catch(() => { errEl.textContent = 'بيانات الدخول غير صحيحة'; });
}

function logout() {
  if (unsubscribePayments) { unsubscribePayments(); unsubscribePayments = null; }
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('lock-overlay').style.display = 'none';
    document.getElementById('app-content').style.display  = '';
    subscribeToPayments();
  } else {
    document.getElementById('app-content').style.display = 'none';
    document.getElementById('lock-overlay').style.display = 'flex';
  }
});
```
(`unsubscribePayments` and `subscribeToPayments` are defined in Task 4 — this step will show an undefined-function error until Task 4 lands. That's expected and fixed in the next task; the login screen itself is still verifiable in Step 6.)

- [ ] **Step 6: Verify the lock screen appears and blocks the app**

Reload the page in the browser. Expected: you see only the "تسجيل الدخول" (login) box — none of the stats/add-form/payment lists are visible. Open the console: no errors other than (at this point) a possible `subscribeToPayments is not defined` — that's expected until Task 4.

- [ ] **Step 7: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: add login lock-screen gating the app behind Firebase Auth"
```

---

### Task 4: Replace the localStorage data layer with Firestore

**Files:**
- Modify: `minaa-payments.html:861-868` (state + save → subscribeToPayments)
- Modify: `minaa-payments.html:895-922` (addPayment)
- Modify: `minaa-payments.html:925-929` (deletePayment)
- Modify: `minaa-payments.html:985-986` (renderList onclick attributes — quote id as string)
- Modify: `minaa-payments.html:1017-1042` (saveEdit)

- [ ] **Step 1: Replace the state/save block**

Replace:
```js
let payments = JSON.parse(localStorage.getItem('minaa_v2_payments') || '[]');
let nextId   = parseInt(localStorage.getItem('minaa_v2_nextId')    || '1');

function save() {
  localStorage.setItem('minaa_v2_payments', JSON.stringify(payments));
  localStorage.setItem('minaa_v2_nextId',   String(nextId));
}
```
with:
```js
let payments = [];
let unsubscribePayments = null;

function subscribeToPayments() {
  if (unsubscribePayments) unsubscribePayments();
  unsubscribePayments = db.collection('payments').onSnapshot(snapshot => {
    payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    render();
  }, err => {
    console.error('Firestore sync error', err);
    showToast('⚠️ تعذّر الاتصال بقاعدة البيانات');
  });
}
```

- [ ] **Step 2: Replace `addPayment()`**

Replace the body from `const kwdValue = toKWD(rawValue, currency);` through `save(); render();` with:
```js
  const kwdValue = toKWD(rawValue, currency);

  db.collection('payments').add({
    name,
    origValue: rawValue,
    origCurrency: currency,
    kwdValue,
    type,
    date: new Date().toISOString()
  }).then(() => {
    showToast('✅ تمت الإضافة: ' + fmtKWD(kwdValue));
  }).catch(() => showToast('❌ تعذّرت الإضافة'));
```
Remove the old `showToast('✅ تمت الإضافة: ' + fmtKWD(kwdValue));` line that came after clearing the inputs (it's now inside the `.then()` above). The input-clearing lines (`inp-name`, `inp-value`, `convert-hint`) stay as-is, right after the `db.collection(...).add(...)` call.

- [ ] **Step 3: Replace `deletePayment(id)`**

Replace:
```js
function deletePayment(id) {
  payments = payments.filter(p => p.id !== id);
  save(); render();
  showToast('🗑️ تم الحذف');
}
```
with:
```js
function deletePayment(id) {
  db.collection('payments').doc(id).delete()
    .then(() => showToast('🗑️ تم الحذف'))
    .catch(() => showToast('❌ تعذّر الحذف'));
}
```

- [ ] **Step 4: Quote `p.id` as a string in the two `renderList` onclick attributes**

Replace:
```js
        <button class="btn-edit" onclick="openEdit(${p.id})" title="تعديل">✏️</button>
        <button class="btn-del"  onclick="deletePayment(${p.id})" title="حذف">✕</button>
```
with:
```js
        <button class="btn-edit" onclick="openEdit('${p.id}')" title="تعديل">✏️</button>
        <button class="btn-del"  onclick="deletePayment('${p.id}')" title="حذف">✕</button>
```
(Firestore document IDs are strings, not numbers — `openEdit`/`deletePayment` already compare with `===`, which works fine against strings; only the call-site quoting needs to change.)

- [ ] **Step 5: Replace `saveEdit()`**

Replace:
```js
  const idx = payments.findIndex(x => x.id === editingId);
  if (idx === -1) return;

  payments[idx] = {
    ...payments[idx],
    name,
    origValue: rawValue,
    origCurrency: currency,
    kwdValue: toKWD(rawValue, currency),
    type
  };

  save(); render();
  document.getElementById('edit-modal').style.display = 'none';
  editingId = null;
  showToast('✅ تم حفظ التعديل');
```
with:
```js
  db.collection('payments').doc(editingId).update({
    name,
    origValue: rawValue,
    origCurrency: currency,
    kwdValue: toKWD(rawValue, currency),
    type
  }).then(() => showToast('✅ تم حفظ التعديل'))
    .catch(() => showToast('❌ تعذّر حفظ التعديل'));

  document.getElementById('edit-modal').style.display = 'none';
  editingId = null;
```

- [ ] **Step 6: Verify in browser**

1. Reload the page, log in with your Firebase Auth account.
2. Add a payment named `اختبار Firestore`. Confirm it appears in the correct section (monthly/quarterly/one-time) within ~1 second.
3. In the Firebase console, go to Firestore → Data → `payments` collection. Confirm a new document exists with matching fields.
4. Edit that payment's value in the app. Confirm both the app UI and the Firestore console document update.
5. Delete it from the app. Confirm it disappears from both the app and the Firestore console.

- [ ] **Step 7: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: replace localStorage data layer with Firestore real-time sync"
```

---

### Task 5: Repoint export/import/clear to Firestore, remove old-key migration

**Files:**
- Modify: `minaa-payments.html:1254-1262` (exportData)
- Modify: `minaa-payments.html:1264-1291` (importData)
- Modify: `minaa-payments.html:1293-1298` (clearData)
- Modify: `minaa-payments.html:1300-1330` (remove migrateOldData entirely — already removed its call in Task 3 Step 5)

- [ ] **Step 1: Update `exportData()` (drop the removed `nextId`)**

Replace:
```js
function exportData() {
  if (!payments.length) return showToast('⚠️ لا توجد بيانات للتصدير');
  const blob = new Blob([JSON.stringify({ payments, nextId }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'minaa-payments-backup.json';
  a.click();
  showToast('✅ تم تصدير البيانات بنجاح');
}
```
with:
```js
function exportData() {
  if (!payments.length) return showToast('⚠️ لا توجد بيانات للتصدير');
  const blob = new Blob([JSON.stringify({ payments }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'minaa-payments-backup.json';
  a.click();
  showToast('✅ تم تصدير البيانات بنجاح');
}
```

- [ ] **Step 2: Update `importData(e)` to batch-write into Firestore**

Replace the whole function:
```js
function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      let list;
      if (Array.isArray(data.payments)) {
        list = data.payments;
      } else if (Array.isArray(data)) {
        list = data.map(p => ({
          name: p.name, origValue: p.value,
          origCurrency: 'KWD', kwdValue: p.value,
          type: p.type, date: p.date || new Date().toISOString()
        }));
      } else {
        showToast('❌ ملف غير صحيح');
        return;
      }
      const batch = db.batch();
      list.forEach(p => {
        const ref = db.collection('payments').doc();
        batch.set(ref, {
          name: p.name,
          origValue: p.origValue,
          origCurrency: p.origCurrency || 'KWD',
          kwdValue: p.kwdValue,
          type: p.type,
          date: p.date || new Date().toISOString()
        });
      });
      batch.commit()
        .then(() => showToast(`✅ تم استيراد ${list.length} دفعة بنجاح`))
        .catch(() => showToast('❌ تعذّر الاستيراد'));
    } catch { showToast('❌ تعذّر قراءة الملف'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}
```

- [ ] **Step 3: Update `clearData()` to delete all Firestore docs**

Replace:
```js
function clearData() {
  if (!confirm('هل أنت متأكد من مسح جميع البيانات؟')) return;
  payments = []; nextId = 1;
  save(); render();
  showToast('🗑️ تم مسح جميع البيانات');
}
```
with:
```js
function clearData() {
  if (!confirm('هل أنت متأكد من مسح جميع البيانات؟')) return;
  db.collection('payments').get().then(snapshot => {
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    return batch.commit();
  }).then(() => showToast('🗑️ تم مسح جميع البيانات'))
    .catch(() => showToast('❌ تعذّر المسح'));
}
```

- [ ] **Step 4: Delete the entire `migrateOldData()` function**

Remove the whole block (from `// ── Migration: استرجاع بيانات النسخة القديمة ──` comment through the closing `}` of `migrateOldData`). It referenced the removed `save()`/`nextId` and is no longer reachable (its call was already dropped from Init in Task 3).

- [ ] **Step 5: Also remove the stray duplicate closing tags at the end of the file**

The file currently ends with:
```html
</script>
</body>
</html>
/body>
</html>
```
Remove the extra `/body>` and `</html>` lines so the file ends cleanly after the first `</html>`.

- [ ] **Step 6: Verify with the real backup file**

1. Reload, log in.
2. Click "استيراد البيانات" and select `minaa-payments-backup7.json` (the one from `C:\Users\Asus\Downloads\`).
3. Confirm the toast reports `تم استيراد 8 دفعة بنجاح` and all 8 payments appear (تأجير خطوط الويب من 29LT, اشتراك Mobbin, اشتراك Figma, RetroSupply Co., minaa.co Domain, octopus.do, figma weave, osmo supply).
4. Confirm stat totals at the top match the sum of the imported values.
5. Click "تصدير البيانات", confirm a valid JSON file downloads with a `payments` array (no `nextId` key).
6. Click "مسح الكل", confirm all payments disappear from both the app and the Firestore console's Data tab.

- [ ] **Step 7: Commit**

```bash
git add minaa-payments.html
git commit -m "feat: repoint import/export/clear to Firestore, remove obsolete localStorage migration"
```

---

### Task 6: Fix the Enter-key shortcut to not fire while the lock screen is showing

**Files:**
- Modify: `minaa-payments.html:1069-1084` (keydown listener)

- [ ] **Step 1: Guard the shortcut handler on login state**

Replace:
```js
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // Close invoice if open
    const inv = document.getElementById('inv-overlay');
    if (inv && inv.style.display !== 'none') {
      inv.style.display = 'none';
      document.getElementById('inv-modal').innerHTML = '';
      document.body.style.overflow = '';
      return;
    }
    document.getElementById('edit-modal').style.display = 'none';
    editingId = null;
  }
  if (e.key === 'Enter' && !editingId) addPayment();
  if (e.key === 'Enter' &&  editingId) saveEdit();
});
```
with:
```js
document.addEventListener('keydown', e => {
  const loggedIn = document.getElementById('app-content').style.display !== 'none';
  if (!loggedIn) {
    if (e.key === 'Enter') login();
    return;
  }
  if (e.key === 'Escape') {
    // Close invoice if open
    const inv = document.getElementById('inv-overlay');
    if (inv && inv.style.display !== 'none') {
      inv.style.display = 'none';
      document.getElementById('inv-modal').innerHTML = '';
      document.body.style.overflow = '';
      return;
    }
    document.getElementById('edit-modal').style.display = 'none';
    editingId = null;
  }
  if (e.key === 'Enter' && !editingId) addPayment();
  if (e.key === 'Enter' &&  editingId) saveEdit();
});
```

- [ ] **Step 2: Verify**

1. Sign out. Focus the password field, type your password, press Enter. Expected: it logs in (same as clicking "دخول").
2. Log in. Focus the "اسم الدفعة" field, type a name and value, press Enter. Expected: it adds the payment (unchanged old behavior).

- [ ] **Step 3: Commit**

```bash
git add minaa-payments.html
git commit -m "fix: only trigger add/save shortcuts when logged in"
```

---

### Task 7: Multi-device sync verification

**Files:** none (verification only)

- [ ] **Step 1: Simulate two devices**

Open the app in two separate browser profiles/windows (or one normal + one incognito), log in to both with the same or different team accounts.

- [ ] **Step 2: Verify real-time sync**

Add a payment in window A. Expected: it appears in window B within ~1-2 seconds with no manual refresh. Edit it in window B, confirm window A updates. Delete it in window A, confirm it disappears from window B.

- [ ] **Step 3: Verify the lock screen re-engages after sign-out**

Click "🚪 خروج" in one window. Expected: that window immediately shows the lock screen again and no payment data is visible until logging back in. The other window (still logged in) is unaffected.

- [ ] **Step 4: Verify brief connectivity drops don't crash the app**

In one window's DevTools, open the Network tab and switch to "Offline" for a few seconds while the app is open and logged in. Expected: no JS errors/crash; the last-loaded payments stay visible (Firestore's in-memory cache holds them for the current session). Switch back to "Online" and confirm new changes from the other window sync in again.

- [ ] **Step 5: No commit needed** — this task is verification-only. If any check fails, fix the relevant task above and re-verify before moving on.

---

### Task 8: Push to GitHub and enable Pages

**Files:** none (repo/hosting operations)

> Before this task's push/publish steps, confirm with the user in chat — pushing code and enabling a public Pages URL are both actions that need explicit go-ahead in the moment, even though the overall project was approved earlier.

- [ ] **Step 1: Create the private GitHub repo**

Confirm the user has run `gh auth login` (see earlier conversation). Then:
```bash
gh repo create minaa-payments --private --source=. --remote=origin
```
Expected: repo created, `origin` remote added.

- [ ] **Step 2: Push**

```bash
git push -u origin main
```
Expected: push succeeds.

- [ ] **Step 3: Enable GitHub Pages**

```bash
gh api repos/{owner}/minaa-payments/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```
(Replace `{owner}` with the actual GitHub username — `gh api` fills `{owner}/{repo}` automatically if you use `gh repo view --json` to confirm the slug first, or just do this step manually in the GitHub repo's Settings → Pages tab if the API call is finicky.)

- [ ] **Step 4: Verify**

Open the Pages URL GitHub reports (usually `https://<username>.github.io/minaa-payments/minaa-payments.html`). Confirm the lock screen shows, and logging in loads the same data seen in Firestore.

- [ ] **Step 5: Commit note (if any docs updated)**

If the Pages URL is documented anywhere (e.g. added to CLAUDE.md), commit that update. Otherwise no commit needed for this task.
