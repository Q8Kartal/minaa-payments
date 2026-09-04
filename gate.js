/* ═══════════════════════════════════════════════════════════════════════════
   A passphrase prompt for the published pages.

   ── READ THIS BEFORE TRUSTING IT ──────────────────────────────────────────
   This is NOT security. It keeps a casual visitor from landing on the page;
   it stops nobody who looks. Three reasons, all of them unfixable from here:

     1. GitHub Pages serves static files. There is no server to check anything,
        so the check necessarily runs in the visitor's own browser, where the
        visitor controls it.
     2. The repository is public. Every byte this gate covers is readable at
        github.com/Q8Kartal/minaa-payments without ever loading the page.
     3. Deleting one DOM node in devtools reveals the page underneath.

   Storing a hash rather than the passphrase means the source does not simply
   hand the passphrase over — that is the only thing it buys. Treat these pages
   as UNLISTED, never as private. Anything genuinely confidential needs real
   authentication in front of it (Cloudflare Access and similar are free and
   take under an hour); it does not belong here.
   ═════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* SHA-256 of the passphrase. To change it:
       node -e "console.log(require('crypto').createHash('sha256').update('NEW','utf8').digest('hex'))"
     and paste the result here. Bump the ?v= on every <script src="gate.js">
     afterwards, or Pages will serve the old hash for ten minutes. */
  var HASH = 'b1b1b9cae025ade6f1dce45acc20f59d72c78080bfe5922d8c1ea44c0e2f27b4';

  var KEY = 'minaa_gate_v1';
  var HOSTS = ['q8kartal.github.io'];

  /* Local work is never gated: no prompt while developing, and no dependence
     on crypto.subtle, which needs a secure context that file:// may not give. */
  if (HOSTS.indexOf(location.hostname) === -1) return;

  try {
    if (localStorage.getItem(KEY) === HASH) return;
  } catch (e) {
    /* Storage blocked — fall through and prompt. The page still works, it just
       asks again next time. */
  }

  /* Hide the document before anything paints, and keep a handle so the page
     can be revealed again rather than reloaded. */
  var root = document.documentElement;
  var hider = document.createElement('style');
  hider.textContent = 'html{visibility:hidden!important}#minaa-gate,#minaa-gate *{visibility:visible!important}';
  (document.head || root).appendChild(hider);

  async function sha256(text) {
    var bytes = new TextEncoder().encode(text);
    var digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function reveal() {
    var gate = document.getElementById('minaa-gate');
    if (gate) gate.remove();
    if (hider.parentNode) hider.remove();
  }

  /* Unlocking in one tab or frame releases the others. The Storybook shell and
     its story iframe are the same origin, so unlocking the shell also releases
     the iframe without a reload. */
  addEventListener('storage', function (e) {
    if (e.key === KEY && e.newValue === HASH) reveal();
  });

  function build() {
    var gate = document.createElement('div');
    gate.id = 'minaa-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'minaa-gate-title');

    /* Falls back to the literal token values because this may paint before
       buttons.css has arrived — Neutral 50 paper, Primary 700 ink,
       Neutral 200 field, Secondary 600 for the error line. */
    gate.innerHTML = [
      '<style>',
      '#minaa-gate{position:fixed;inset:0;z-index:2147483647;display:flex;',
      'align-items:center;justify-content:center;padding:24px;',
      'background:var(--paper,#FDF9F0);',
      'font-family:var(--font-regular,"29LT Idris Round Regular"),system-ui,sans-serif}',
      '#minaa-gate form{width:100%;max-width:320px;text-align:center}',
      '#minaa-gate h1{margin:0 0 8px;font-size:20px;line-height:30px;',
      'font-family:var(--font-bold,"29LT Idris Round ExtraBold"),system-ui,sans-serif;',
      'color:var(--primary,#0062AD)}',
      '#minaa-gate p{margin:0 0 24px;font-size:16px;line-height:24px;',
      'color:var(--primary,#0062AD);opacity:.72}',
      '#minaa-gate input{width:100%;box-sizing:border-box;height:48px;',
      'padding-inline:20px;font:inherit;font-size:18px;text-align:center;',
      'color:var(--primary,#0062AD);background:#fff;',
      'border:1.5px solid var(--cream-200,#F7E0B6);border-radius:999px;outline:none}',
      '#minaa-gate input:focus-visible{border-color:var(--primary,#0062AD);',
      'outline:3px solid var(--primary,#0062AD);outline-offset:3px}',
      '#minaa-gate button{margin-top:12px;width:100%;height:48px;',
      'padding-inline:20px;font:inherit;font-size:18px;cursor:pointer;',
      'color:var(--cream,#FBF0DC);background:var(--primary,#0062AD);',
      'border:0;border-radius:999px}',
      '#minaa-gate .err{margin:12px 0 0;font-size:16px;min-height:24px;',
      'color:var(--error,#E56E1F);opacity:1}',
      '</style>',
      '<form novalidate>',
      '<h1 id="minaa-gate-title">Minaã</h1>',
      '<p>This page is not public yet.</p>',
      '<input type="password" autocomplete="current-password" ',
      'aria-label="Passphrase" placeholder="Passphrase" autofocus>',
      '<button type="submit">Open</button>',
      '<p class="err" role="status" aria-live="polite"></p>',
      '</form>',
    ].join('');

    document.body.appendChild(gate);

    var form = gate.querySelector('form');
    var input = gate.querySelector('input');
    var err = gate.querySelector('.err');
    input.focus();

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      err.textContent = '';
      var digest;
      try {
        digest = await sha256(input.value);
      } catch (ex) {
        err.textContent = 'This browser cannot check it here.';
        return;
      }
      if (digest !== HASH) {
        err.textContent = 'Not that one.';
        input.select();
        return;
      }
      try { localStorage.setItem(KEY, HASH); } catch (ex) { /* prompt again next visit */ }
      reveal();
    });
  }

  if (document.body) build();
  else addEventListener('DOMContentLoaded', build);
})();
