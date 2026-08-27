/* ═══════════════════════════════════════════════════════════════════════════
   minaa-jelly.js — the part of the bridge a stylesheet cannot reach.

   minaa-jelly.css does almost everything. This file exists only for the
   handful of places where Jelly hardcodes a value inside its shadow root on
   an element that carries NO `part` attribute, so neither a custom property
   nor ::part() can touch it.

   The rule is the one CLAUDE.md already sets out for this situation: inject a
   single rule into the shadow root and have it READ THE TOKEN OFF THE HOST,
   so the value still comes from the scale rather than from a number written
   in JavaScript. Nothing here invents a value.

   Keep this list SHORT and justified. Every entry is a small breach of the
   library's encapsulation, and a component that grows a `part` upstream
   should be moved back into the stylesheet and deleted from here.
   ═════════════════════════════════════════════════════════════════════════ */

(function minaaShadowBridge() {
  'use strict';

  /* Each entry: why it is here, and what it corrects.

     jelly-otp — the digit boxes are <input> elements with no part attribute
     (verified: the component exposes zero parts). They render at
     font-family: ui-rounded, weight 640, which in our type system is a double
     miss: the wrong face, and a numeric weight that cannot resolve to
     anything because each Minaã weight is its OWN FAMILY and font synthesis
     is off. A one-time code is emphasised text, so it takes the Medium face.
     `font-family: inherit` would not do — the input sets its own explicitly,
     and that beats inheritance. */
  const PATCHES = {
    /* jelly-otp exposes ZERO parts — verified by querying [part] inside its
       shadow root and getting an empty list — so neither ::part() nor a custom
       property can reach its digit boxes. Two things have to be corrected on
       them, and both read their value off the host so nothing is hardcoded
       here:

         font   the boxes render at ui-rounded weight 640, which in our type
                system is a double miss: the wrong face, and a numeric weight
                that cannot resolve because each Minaã weight is its own family
                with synthesis off.

         stroke the specification gives every digit a 1.5px Secondary 600 edge.
                Jelly draws none — its fields have no border concept at all,
                only a transparent focus ring — so the edge is added here.
                Every other field gets the same treatment through ::part(ring),
                which this component does not offer. */
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
       therefore collapses to its line box — 28px — and the track came out 44
       tall where the specification draws it 56, leaving it visibly shorter
       than the 56px fields beside it.

       A minimum height on the pill is the smallest correction that restores
       the proportion, and it reads space-500 off the host rather than writing
       40 into this file. */
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
