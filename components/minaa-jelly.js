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

    /* jelly-slider paints track, fill and knob as ONE canvas blob — its DOM
       track is display:none, and testing every candidate token showed only
       --jelly-accent moves the knob, taking the fill with it. The
       specification wants a Secondary 600 knob on a Primary 700 fill, which
       that construction cannot express.

       The knob is therefore added as a real element (see SLIDER KNOB below),
       and this rule only makes room for it. jelly-range needs none of it — it
       already exposes part="knob", handled in the stylesheet. */
    'jelly-slider': `
      .minaa-knob {
        position: absolute;
        top: 50%;
        /* The knob's own box travels (track - knob), which places its CENTRE
           correctly inset by half a knob at each end. No negative margin: the
           offset already accounts for the width. */
        inset-inline-start: calc(var(--minaa-knob-frac, 0) * (100% - var(--control-knob)));
        width: var(--control-knob);
        height: var(--control-knob);
        transform: translateY(-50%);
        border-radius: var(--radius-full);
        background: var(--m-thumb);
        pointer-events: none;
      }`,
  };

  /* ── SLIDER KNOB ──────────────────────────────────────────────────────────
     A real element rather than the native input's ::-webkit-slider-thumb.

     The native thumb was the first attempt and was abandoned for a specific
     reason: getComputedStyle on a vendor pseudo-element returns the host
     input's own box, not the thumb's, so there is no way to VERIFY it is
     painting the right colour at the right size. Shipping something that
     cannot be measured is how the missing field stroke survived three audits.
     A real element can be measured, and it behaves the same in every browser
     rather than needing a -webkit- and a -moz- spelling.

     This mirrors what jelly-range already does with part="knob", so the two
     controls end up built the same way.

     The knob is decoration only: pointer-events stays off and the native input
     keeps the semantics, the keyboard and the form value. Jelly still owns the
     interaction and the blob underneath still deforms — but this knob is a
     rigid circle, so at the peak of a drag the painted blob squashes while the
     knob on top does not. A real difference from the physics, chosen
     deliberately over having the wrong colour. */
  function enhanceSlider(el) {
    if (el.__minaaKnob || !el.shadowRoot) return;
    const wrap = el.shadowRoot.querySelector('[part="wrap"]') || el.shadowRoot;
    const input = el.shadowRoot.querySelector('input[type="range"]');
    if (!wrap || !input) return;

    const knob = document.createElement('span');
    knob.className = 'minaa-knob';
    knob.setAttribute('aria-hidden', 'true');
    wrap.appendChild(knob);
    el.__minaaKnob = knob;

    /* Two things this has to get right, both learned by measuring rather than
       reasoning:

       WHICH VALUE. The `value` ATTRIBUTE is not authoritative. Measured on this
       page: a slider written value="62" reported el.value === 31, and Jelly
       painted its knob at 0.331 — matching 31, not 62. Jelly settles its own
       value after mount without touching the attribute, so the attribute is
       only ever the initial hint. el.value is the live figure and is what the
       paint follows.

       WHERE IT SITS. A knob's centre does not travel the full width — it is
       inset by half a knob at each end, so the usable span is (track − knob).
       Confirmed against Jelly's painted knob at three values: predicted
       0.595 / 0.310 / 0.453 against measured 0.594 / 0.312 / 0.452. A plain
       percentage drifts by up to six pixels and the two knobs separate
       visibly. */
    const place = () => {
      const min = parseFloat(input.min || '0');
      const max = parseFloat(input.max || '100');
      const raw = el.value !== undefined && el.value !== null && el.value !== ''
        ? el.value : input.value;
      const val = parseFloat(raw || '0');
      const span = max - min;
      const frac = span > 0 ? Math.min(1, Math.max(0, (val - min) / span)) : 0;
      knob.style.setProperty('--minaa-knob-frac', String(frac));
    };

    place();

    /* Jelly settles the value asynchronously and does not always fire an event
       for it, so the position is re-taken on everything that can move it and
       again after the component has had time to settle — the same retry the
       patches themselves use. */
    ['input', 'change', 'pointerup', 'pointercancel', 'keyup'].forEach((t) => {
      el.addEventListener(t, place);
      input.addEventListener(t, place);
    });
    new MutationObserver(place).observe(el, { attributes: true, attributeFilter: ['value', 'min', 'max'] });
    new MutationObserver(place).observe(input, { attributes: true, attributeFilter: ['value', 'min', 'max'] });
    setTimeout(place, 300);
    setTimeout(place, 1200);
  }

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
    if (tag === 'jelly-slider') enhanceSlider(el);
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
