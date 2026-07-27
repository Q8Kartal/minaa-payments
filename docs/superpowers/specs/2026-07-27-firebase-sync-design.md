# Minaã Payments — Shared Online Sync (Firebase) Design

## Goal
Team members (mobile + desktop) see the same, up-to-date payment data, without the data being publicly visible.

## Architecture
- **Hosting:** `minaa-payments.html` stays a static file, hosted on **GitHub Pages** from a **private GitHub repo**. The Pages URL itself is publicly reachable (GitHub limitation on non-Enterprise plans), but no payment data is exposed without logging in — privacy is enforced by Firebase, not by hiding the URL.
- **Backend:** Firebase project `minaa-payments` (already created), using:
  - **Firebase Authentication** (Email/Password) — one or more team logins already created in the console.
  - **Cloud Firestore** (`eur3`, Standard edition) — already created, security rules already published:
    ```
    allow read, write: if request.auth != null;
    ```
- Firebase web config (apiKey, authDomain, projectId, etc.) is safe to embed directly in the HTML — it is a client identifier, not a secret. Real access control is the Firestore rule above plus Authentication.

## Login flow
- On page load, if no Firebase Auth session exists, show a simple lock screen (email + password fields, "دخول" button) instead of the app.
- On successful sign-in, Firebase persists the session in the browser (default `LOCAL` persistence) — no need to log in again on that device until they explicitly sign out or clear browser data.
- A small "تسجيل خروج" (sign out) control is added near the toolbar.

## Data model
Firestore collection: `payments`. Each document mirrors the existing localStorage schema:
```
{ name, origValue, origCurrency, kwdValue, type, date }
```
(Firestore's auto-generated document ID replaces the old numeric `id` / `nextId` counter.)

## Data flow (replaces localStorage)
- **Read:** on load (post-login), subscribe with `onSnapshot` to the `payments` collection. Any add/edit/delete from any device re-renders on all open sessions within ~1 second.
- **Write:** `addPayment`, `saveEdit`, `deletePayment` write directly to Firestore (`addDoc` / `updateDoc` / `deleteDoc`) instead of mutating a local array + `localStorage.setItem`.
- Firestore's JS SDK caches data locally automatically, so brief connectivity drops (e.g. mobile) don't lose in-flight reads.

## Migration of existing data
The current **Import JSON** button (`استيراد البيانات`) is repointed: instead of writing into `localStorage`, it batch-writes the imported payments into the `payments` Firestore collection. This lets the user import `minaa-payments-backup7.json` (8 existing payments) straight into Firestore, once, through the existing UI — no separate migration script needed.

**Export JSON** keeps working as a manual backup/download of whatever is currently loaded from Firestore.

## Out of scope (for this change)
- Per-user attribution ("who added/edited this payment") — not required now that either shared or individual logins are just an auth detail; Firestore rules don't distinguish between users.
- Firebase App Check / anti-abuse hardening — unnecessary for a small internal team tool.
- Offline write queuing/conflict resolution beyond Firestore's built-in defaults.
- Any change to currency conversion, invoice, or export logic — unaffected by this change.

## Testing plan
- Sign in on two separate browser sessions (simulating desktop + mobile), add a payment on one, confirm it appears on the other within a couple seconds without refresh.
- Edit and delete from each side, confirm both stay in sync.
- Sign out, confirm the app locks and no data/UI is visible until logging back in.
- Import the existing backup JSON once, confirm all 8 payments appear and totals/stats compute correctly.
- Confirm the app still works if Firestore is briefly unreachable (no crash; shows cached/last-known data).
