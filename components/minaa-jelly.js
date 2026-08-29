/* ═══════════════════════════════════════════════════════════════════════════
   minaa-jelly.js — the part of the bridge a stylesheet cannot reach.

   minaa-jelly.css does almost everything. This file exists only for the
   handful of places where Jelly hardcodes a value inside its shadow root on
   an element that carries NO `part` attribute, so neither a custom property
   nor ::part() can touch it.

   The rule is the one CLAUDE.md already sets out: inject a single rule into
   the shadow root and have it READ THE TOKEN OFF THE HOST, so the value still
   comes from the scale rather than from a number written in JavaScript.
   Nothing here invents a value.

   Keep this list SHORT and justified. Every entry is a small breach of the
   library's encapsulation. Now that Jelly is vendored, the better fix for any
   new case is usually a token in the fork — see vendor/README.md — and an
   entry here should be deleted the moment the fork can express it instead.
   The slider knob used to be handled here as an overlay; the fork replaced it.
   ═════════════════════════════════════════════════════════════════════════ */

(function minaaShadowBridge() {
  'use strict';

  const PATCHES = {
    /* jelly-otp exposes ZERO parts — verified by querying [part] inside its
       shadow root and getting an empty list — so neither ::part() nor a custom
       property can reach its digit boxes. Two things need correcting, and both
       read their value off the host so nothing is hardcoded here:

         font   the boxes render at ui-rounded weight 640, which in our type
                system is a double miss: the wrong face, and a numeric weight
                that cannot resolve because each Minaã weight is its own family
                with synthesis off.

         stroke the specification gives every digit a 1.5px Secondary 600 edge.
                Jelly draws none — its fields have no border concept at all,
                only a transparent focus ring. Every other field gets this
                through ::part(ring), which this component does not offer. */
    'jelly-otp': `
      input {
        font-family: var(--font-medium);
        font-weight: normal;
        border: var(--control-stroke) solid var(--m-stroke);
        box-sizing: border-box;
      }
      input:focus {
        border-color: var(--m-accent);
      }`,

    /* jelly-dialog's close control carries NO part attribute -- the dialog
       exposes only `backdrop` and `dialog`, so ::part() cannot reach it and a
       rule has to be injected.

       Jelly fills it on hover from --jelly-color-background-neutral with ink
       from --jelly-color-foreground-on-neutral. Through this bridge the first
       is Neutral 100 in dark, so hovering the close button put a cream disc on
       the panel and the mark on it went with the surface: a bright empty circle
       where the x should be.

       Both now come off --m-close-disc / --m-close-mark, which the semantic
       layer sets per mode because the two modes genuinely want opposite pairs:
       light keeps its Primary 300 disc and only the mark moves to Secondary
       600, dark inverts to a Secondary 600 disc with a Primary 700 mark. */
    'jelly-dialog': `
      .close { color: var(--m-close-mark); }
      .close:hover,
      .close:focus-visible {
        background: var(--m-close-disc);
        color: var(--m-close-mark);
      }`,

    /* jelly-segmented draws its pill from `.segment`, which hardcodes
       `padding-block: 0` with no token behind it and carries no part. The pill
       collapses to its 28px line box, and the track came out 44 tall where the
       specification draws it 56 — visibly shorter than the 56px fields beside
       it. A minimum height is the smallest correction, read off the host as
       space-500 rather than written as 40 here. */
    'jelly-segmented': `
      .segment {
        min-height: var(--m-seg-pill-h, var(--space-500));
      }`,
  };

  const sheets = new Map();

  function sheetFor(tag) {
    if (sheets.has(tag)) return sheets.get(tag);
    let sheet = null;
    try {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(PATCHES[tag]);
    } catch (e) {
      sheet = null;   // constructable stylesheets unavailable — fall back below
    }
    sheets.set(tag, sheet);
    return sheet;
  }

  function patch(el) {
    const tag = el.tagName.toLowerCase();
    const css = PATCHES[tag];
    if (!css || !el.shadowRoot || el.__minaaPatched) return;

    const sheet = sheetFor(tag);
    if (sheet && 'adoptedStyleSheets' in el.shadowRoot) {
      /* Appended, never assigned: replacing the array would drop the
         component's own stylesheet and unstyle it completely. */
      el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, sheet];
    } else {
      const style = document.createElement('style');
      style.textContent = css;
      el.shadowRoot.appendChild(style);
    }
    el.__minaaPatched = true;
  }

  function patchAll() {
    Object.keys(PATCHES).forEach((tag) => {
      document.querySelectorAll(tag).forEach(patch);
    });
  }

  /* Jelly upgrades asynchronously, so there is no shadow root to reach into
     until it has. Wait for each element it defines, then patch. */
  Object.keys(PATCHES).forEach((tag) => {
    if (window.customElements) {
      customElements.whenDefined(tag).then(patchAll).catch(() => {});
    }
  });

  /* Anything added later — a component rendered after load — gets the same
     treatment, so this cannot quietly stop applying. */
  if (window.MutationObserver) {
    new MutationObserver((records) => {
      for (const r of records) {
        for (const node of r.addedNodes) {
          if (node.nodeType !== 1) continue;
          const tag = node.tagName.toLowerCase();
          if (PATCHES[tag]) patch(node);
          if (node.querySelectorAll) {
            Object.keys(PATCHES).forEach((t) => node.querySelectorAll(t).forEach(patch));
          }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  patchAll();
  /* Upgrade can land a frame or two after whenDefined resolves for elements
     already in the document. */
  setTimeout(patchAll, 300);
  setTimeout(patchAll, 1200);
})();

/* ═══════════════════════════════════════════════════════════════════════════
   DRESSING JELLY'S TOASTS

   Ported from buttons.js unchanged. Jelly builds every toast identically:
   part="toast", a coloured dot, the text, a dismiss button. There is no tone
   ON the element -- the only thing separating the four is which custom
   property the dot's inline background points at. So a stylesheet has nothing
   to hook a per-tone colour onto, and the hook is added here.

   The tone is read from that property rather than from the spoken prefix
   beside it. The prefix is Jelly's English "Success:" / "Error:" -- fine for a
   screen reader, but a string we do not own; the property name is structural
   and identical in every build.

   Then a second part name is appended. `part` is a space-separated list, so
   the element answers to both ::part(toast) and ::part(tone-success) and the
   rules already targeting `toast` keep applying untouched.
   ═════════════════════════════════════════════════════════════════════════ */
(function minaaToasts() {
  'use strict';

  const TONE = { azure: 'info', mint: 'success', amber: 'warning', rose: 'danger' };

  /* Jelly writes the dot's inline background AFTER it appends the toast, so
     reading it during the mutation callback races that write and comes back
     empty -- measured on the buttons page: firing all four dressed exactly one
     of them. Hence the retry across frames rather than a single read. Two
     frames is enough in practice; the cap stops a toast we cannot classify
     from spinning forever, and such a toast simply keeps Jelly's own dot. */
  function dress(toast, tries) {
    if (!toast || toast.dataset.dressed) return;
    const dot = toast.querySelector('.dot');
    if (!dot) return;

    const key = (dot.getAttribute('style') || '').match(/--jelly-color-background-(\w+)/);
    const tone = key && TONE[key[1]];
    if (!tone) {
      if ((tries || 0) < 5) requestAnimationFrame(() => dress(toast, (tries || 0) + 1));
      return;
    }

    toast.dataset.dressed = '1';
    toast.setAttribute('part', toast.getAttribute('part') + ' tone-' + tone);
    dot.style.background = 'none';

    /* width and height are spelled out, and they are not decoration. An <svg>
       carrying only a viewBox has an intrinsic size of auto; Chrome resolves
       that against the parent box, Safari collapses it to zero when the svg is
       a flex item. The icons rendered on desktop and vanished on iPhone. 100%
       of a box whose side is a token is still token-derived. */
    /* The path is INLINED, not referenced with <use>. The dot lives inside the
       toaster shadow root, and <use> cannot reach a symbol sitting in the
       document -- a sprite reference renders nothing at all here, which makes
       this the one place on the page the sprite is no use. MICONS is a
       top-level const in micons.js, which is why that file now loads first. */
    const glyph = (typeof MICONS !== 'undefined') && MICONS['toast-' + tone];
    if (!glyph) return;
    dot.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" ' +
                    'fill="none" aria-hidden="true" focusable="false" ' +
                    'style="display:block">' + glyph + '</svg>';
  }

  /* The toaster builds its rail lazily and a toast arrives long after this file
     runs, so the observer is attached once the shadow root exists and left in
     place. Toasts fired from anywhere get dressed, not only the four specimens. */
  function attach() {
    const toaster = document.querySelector('jelly-toaster');
    if (!toaster || !toaster.shadowRoot) return false;
    const root = toaster.shadowRoot;

    /* The stack between toasts is Jelly's `.rail { gap: 10px }` -- measured,
       and 10 is not a step on the scale. Everything else on the pill is bound
       from the stylesheet through ::part(toast), but .rail carries no part
       attribute, so no outside selector can reach it. One rule injected into
       the shadow root is the only way in, and it reads the token off the host
       so the value still comes from the scale rather than from here. */
    if (!root.querySelector('[data-minaa-rail]')) {
      const rule = document.createElement('style');
      rule.setAttribute('data-minaa-rail', '');
      rule.textContent = '.rail{gap:var(--space-150)}';
      root.appendChild(rule);
    }

    new MutationObserver((records) => {
      for (const r of records) {
        for (const node of r.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.classList.contains('toast')) dress(node);
          if (node.querySelectorAll) node.querySelectorAll('.toast').forEach((t) => dress(t));
        }
      }
    }).observe(root, { childList: true, subtree: true });

    root.querySelectorAll('.toast').forEach((t) => dress(t));
    return true;
  }

  if (!attach() && window.customElements) {
    customElements.whenDefined('jelly-toaster').then(attach);
  }
})();
