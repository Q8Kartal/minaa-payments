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

    /* jelly-segmented draws its pill from `.segment`, which hardcodes
       `padding-block: 0` with no token behind it and carries no part. The pill
       collapses to its 28px line box, and the track came out 44 tall where the
       specification draws it 56 — visibly shorter than the 56px fields beside
       it. A minimum height is the smallest correction, read off the host as
       space-500 rather than written as 40 here. */
    'jelly-segmented': `
      .segment {
        min-height: var(--space-500);
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
