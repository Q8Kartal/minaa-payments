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
      /* Jelly's own close button is REPLACED by a real jelly-icon-button --
         see minaaDialogClose(). Two reasons, and the second is the one that
         matters: its mark was the literal character U+2715 in whatever font
         fell through (Arial, measured), so the one glyph in the component was
         not from Micons at all; and a plain <button> has no jelly physics,
         while every other control on the page deforms under the pointer.

         The disc is the MEMBRANE, not a background. Jelly paints it from
         --jelly-fill on canvas, so a CSS background here would sit behind the
         canvas as a second, squarer disc. Rest is transparent; hover swaps the
         token. data-hover rather than :hover because the canvas only repaints
         when asked, and Jelly already repaints on ANY host attribute change
         (its attributeObserver, jelly.js ~897) -- so flipping the attribute
         both selects the colour and schedules the frame that draws it. */
      .minaa-close {
        position: absolute;
        top: var(--space-150);
        inset-inline-end: var(--space-150);
        --jelly-icon-button-size: var(--space-500);
        --jelly-icon-button-icon-size: var(--control-icon-24);
        --jelly-fill: transparent;
        --jelly-label: var(--m-close-mark);
      }
      .minaa-close[data-hover] {
        --jelly-fill: var(--m-close-disc);
        --jelly-label: var(--m-close-mark-hover);
      }
      /* The panel is clipped to a squircle path by minaaSquircle(), and a
         clip removes a box-shadow entirely -- the shadow is drawn outside the
         border box, which is precisely the part being clipped away. So the
         panel stops casting its own and an ANCESTOR casts it instead: a filter
         follows the CLIPPED alpha, so the shadow traces the squircle rather
         than the rectangle underneath it. It has to be an ancestor and not the
         panel: clipping is applied after filtering, so a drop-shadow on the
         clipped element is generated from the unclipped box and then cut away.
         drop-shadow takes no spread, so the two layers are retuned by eye
         against the original rather than transcribed. */
      .dialog { box-shadow: none; }
      .wrap {
        filter: drop-shadow(0 12px 16px rgba(0, 0, 0, .34))
                drop-shadow(0 3px 6px rgba(0, 0, 0, .22));
      }`,

    /* The drawer needs the SAME close treatment, and not having it was visible
       rather than theoretical: with no rule reaching its shadow root the
       replacement button fell back to Jelly's own defaults -- 48px instead of
       40, an accent-filled disc instead of a transparent one, and parked at the
       top-left of the sheet because nothing positioned it.

       Two differences from the dialog, both structural:

         The panel is `.sheet`, not `.dialog`.

         There is no `.wrap` to hang the shadow on -- the sheet is a direct
         child of the shadow root -- so the filter goes on :host. That also
         covers the backdrop, which is harmless: the backdrop is exactly
         viewport-sized, so its shadow falls off-screen. */
    'jelly-drawer': `
      .minaa-close {
        position: absolute;
        top: var(--space-150);
        inset-inline-end: var(--space-150);
        --jelly-icon-button-size: var(--space-500);
        --jelly-icon-button-icon-size: var(--control-icon-24);
        --jelly-fill: transparent;
        --jelly-label: var(--m-close-mark);
      }
      .minaa-close[data-hover] {
        --jelly-fill: var(--m-close-disc);
        --jelly-label: var(--m-close-mark-hover);
      }
      .sheet { box-shadow: none; }
      :host {
        filter: drop-shadow(0 12px 16px rgba(0, 0, 0, .34))
                drop-shadow(0 3px 6px rgba(0, 0, 0, .22));
      }`,

    /* The popover panel is clipped to the family squircle, so its own shadow is
       cut away. minaaSquircle() inserts a wrapper around the panel -- the
       popover has no .wrap and cannot use :host, which holds the trigger -- and
       the shadow moves onto that. The wrapper is inert layout-wise: the panel
       inside it is position:fixed and Jelly keeps placing it by inline style. */
    'jelly-popover': `
      .panel { box-shadow: none; }
      /* THE WRAPPER IS VIEWPORT-SIZED ON PURPOSE, and this is the whole trick.
         A filter makes an element a containing block for position:fixed
         descendants, so an ordinary wrapper re-anchors the panel to itself --
         measured, the panel went from 273x89 to 140x136 and its max-width
         started resolving against a narrow box instead of the screen. Pinning
         the wrapper to the viewport makes it the containing block WITHOUT
         changing what that containing block is: same origin, same size, so
         Jelly's inline left/top still land where it intended.

         pointer-events has to be handed back to the panel, or a full-screen
         layer would swallow every click on the page underneath. */
      [data-minaa-lift] {
        position: fixed;
        inset: 0;
        pointer-events: none;
        filter: drop-shadow(0 14px 18px rgba(0, 0, 0, .30))
                drop-shadow(0 3px 6px rgba(0, 0, 0, .20));
      }
      [data-minaa-lift] > .panel { pointer-events: auto; }`,

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

/* ═══════════════════════════════════════════════════════════════════════════
   THE SQUIRCLE, AS GEOMETRY RATHER THAN AS A CSS FEATURE

   corner-shape: squircle draws the right curve and is the wrong tool. It is a
   very new property, and an engine that lacks it does not approximate the
   shape -- it drops the declaration and leaves border-radius alone, so a panel
   asking for a squircle at radius-full renders as a PILL. That is what iOS
   Safari and the Pages build were showing while desktop Chrome looked correct.

   Shrinking the radius until the two agreed would have been giving up the
   shape to protect the engines that could not draw it. A superellipse is only
   arithmetic, so we generate the outline and clip to it. Every engine can draw
   a path. There is no feature to detect and no fallback to degrade to, and the
   same function can hand Figma the identical curve -- one source of geometry
   instead of CSS on one side and corner smoothing on the other.

   The corner is |x/r|^N + |y/r|^N = 1, parametrised as
       x = r * (cos t)^(2/N),  y = r * (sin t)^(2/N),   t in [0, pi/2]
   N = 2 is a circle; larger N is squarer. N is calibrated against what Chrome
   itself draws for corner-shape: squircle -- see EXPONENT below -- so the path
   is not an interpretation of the shape, it is a copy of it.
   ═════════════════════════════════════════════════════════════════════════ */
(function minaaSquircle() {
  'use strict';

  /* Every overlay that owns a panel. Each joined once it took the family
     corner rather than its own: at radius-16 the old claim here -- that a
     superellipse and a rounded corner are the same few pixels -- was true, and
     at the family corner it is not, even on a chip.

     The tooltip was the last in and the cheapest: alone among these it ships
     NO box-shadow, so clipping it costs nothing and it needs no wrapper. */
  var TAGS = ['jelly-dialog', 'jelly-drawer', 'jelly-popover', 'jelly-tooltip'];

  /* Panels that must have their shadow moved to an inserted wrapper. Only the
     popover: the dialog hangs its shadow on .wrap, the drawer on :host, and the
     tooltip has none to hang. Wrapping the others would be a change with no
     purpose, and the wrapper is not free -- it is a viewport-sized layer. */
  var LIFT = ['jelly-popover'];
  var OVERLAYS = TAGS.join(', ');

  /* EXPONENT. CSS spells the family superellipse(s), and s is NOT the exponent
     -- the curve is |x|^(2^s) + |y|^(2^s) = 1, so round is superellipse(1) and
     N = 2, while squircle is superellipse(2) and N = 4. This was checked, not
     read: superellipse(4) was tried on this panel earlier and came out SQUARER
     than a plain rounded rectangle, which only makes sense if the argument is
     a power of two rather than the exponent itself. */
  var N = 4;

  /* Segments per corner. A 65px corner at 28 segments puts a vertex every
     ~2.3px along the arc, under a pixel once the curve is antialiased. Raising
     it costs path length for nothing visible. */
  var STEPS = 28;

  function squirclePath(w, h, radius) {
    if (!(w > 0 && h > 0)) return null;
    var r = Math.min(radius, Math.min(w, h) / 2);
    var p = 2 / N;
    var d = [];

    /* Each corner walks a quadrant of the superellipse. cx/cy is the corner
       centre and sx/sy point back into the panel; reverse decides which end of
       the quadrant the walk starts at, so every arc begins where the previous
       straight edge ended and the outline never doubles back. */
    function arc(cx, cy, sx, sy, reverse) {
      for (var i = 0; i <= STEPS; i++) {
        var f = reverse ? (STEPS - i) / STEPS : i / STEPS;
        var t = f * Math.PI / 2;
        var x = cx + sx * r * Math.pow(Math.cos(t), p);
        var y = cy + sy * r * Math.pow(Math.sin(t), p);
        d.push((d.length ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2));
      }
    }

    /* Clockwise from the left edge. Each arc must END where the next straight
       edge BEGINS -- get one sweep backwards and the outline doubles back on
       itself, which renders as a bowtie rather than as a wrong curve. */
    arc(r, r, -1, -1, false);           /* top-left     (0,r)   -> (r, 0)   */
    d.push("L" + (w - r).toFixed(2) + " 0");
    arc(w - r, r, 1, -1, true);         /* top-right    (w-r,0) -> (w, r)   */
    d.push("L" + w.toFixed(2) + " " + (h - r).toFixed(2));
    arc(w - r, h - r, 1, 1, false);     /* bottom-right (w,h-r) -> (w-r, h) */
    d.push("L" + r.toFixed(2) + " " + h.toFixed(2));
    arc(r, h - r, -1, 1, true);         /* bottom-left  (r,h)   -> (0, h-r) */
    d.push("Z");
    return d.join(" ");
  }

  /* Exposed so the Figma side, and anything measuring, use the same function.
     If those two ever disagree the shapes disagree, which is the whole point. */
  window.minaaSquirclePath = squirclePath;

  function radiusFor(el) {
    /* Read the nominal radius off the host so the value still comes from the
       scale. --m-squircle-radius wins when set; otherwise the panel is as round
       as it can be, which is the shape this component actually wants. */
    var root = el.getRootNode();
    var host = root && root.host;
    var raw = host && getComputedStyle(host).getPropertyValue("--m-squircle-radius");
    var n = raw ? parseFloat(raw) : NaN;
    return isNaN(n) ? Infinity : n;
  }

  function shape(el) {
    var w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    if (el.__sqW === w && el.__sqH === h) return;
    var d = squirclePath(w, h, radiusFor(el));
    if (!d) return;
    el.__sqW = w; el.__sqH = h;
    el.style.clipPath = "path(" + String.fromCharCode(39) + d + String.fromCharCode(39) + ")";
  }

  var ro = window.ResizeObserver ? new ResizeObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) shape(recs[i].target);
  }) : null;

  function attach(dialog) {
    if (!dialog.shadowRoot) return false;
    /* .dialog on a jelly-dialog, .sheet on a jelly-drawer -- one selector for
       both, so the two overlays cannot drift apart. */
    var panel = dialog.shadowRoot.querySelector('.dialog, .sheet, .panel, .bubble');
    if (!panel) return false;
    if (panel.__sqBound) return true;
    panel.__sqBound = true;

    /* A clip is applied AFTER a filter, so a shadow on the clipped element is
       generated from the unclipped box and then cut away -- verified with two
       identical boxes, one with drop-shadow, neither casting anything. The
       shadow therefore has to live on an ANCESTOR.

       The dialog has .wrap and the drawer has :host. The popover has neither:
       its panel is a direct child of the shadow root, and :host also contains
       the trigger, so a filter there would put a shadow under the button too.
       One is inserted. Checked before relying on it -- Jelly positions the
       panel with inline styles and finds it with querySelector, and both
       survive: same rect to the pixel before and after wrapping. */
    if (LIFT.indexOf(dialog.tagName.toLowerCase()) >= 0 &&
        panel.parentNode && panel.parentNode.nodeType === 11) {
      var lift = document.createElement('div');
      lift.setAttribute('data-minaa-lift', '');
      panel.parentNode.insertBefore(lift, panel);
      lift.appendChild(panel);
    }
    shape(panel);
    /* The panel is display:none until the dialog opens, so the first useful
       size arrives later. ResizeObserver reports 0 -> size as a resize, which
       is exactly the hook needed; without it the first open would be square. */
    if (ro) ro.observe(panel);

    /* ...but not ONLY that. The observer fires after layout, a frame or more
       behind the panel becoming visible, and it was measured still unshaped
       well after opening. That gap would show the fallback rounded rectangle
       snapping into a squircle. Opening is an attribute change we can see, so
       shape on it directly and again over the next few frames while the open
       animation settles the height. */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (!dialog.hasAttribute("open")) return;
        var n = 0;
        (function again() {
          shape(panel);
          if (++n < 6) requestAnimationFrame(again);
        })();
      }).observe(dialog, { attributes: true, attributeFilter: ["open"] });
    }
    return true;
  }

  function attachAll() {
    document.querySelectorAll(OVERLAYS).forEach(attach);
  }

  if (window.customElements) {
    TAGS.forEach(function (t) {
      customElements.whenDefined(t).then(attachAll).catch(function () {});
    });
  }
  if (window.MutationObserver) {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var added = recs[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (TAGS.indexOf(node.tagName.toLowerCase()) >= 0) attach(node);
          if (node.querySelectorAll) node.querySelectorAll(OVERLAYS).forEach(attach);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  attachAll();
  setTimeout(attachAll, 300);
  setTimeout(attachAll, 1200);
})();

/* ═══════════════════════════════════════════════════════════════════════════
   THE DIALOG CLOSE CONTROL

   Jelly ships this as `<button class="close">U+2715</button>` -- a literal
   multiplication-x in whatever font resolves, measured as Arial. Two problems
   in one element: the glyph is not a Micon, so the single icon inside the
   component came from nowhere in our system; and a bare <button> has none of
   the jelly physics that every other control on the page has, so the dialog
   was the one place a press did nothing.

   Both are fixed by swapping the node for a real <jelly-icon-button> holding
   the exported cross-2-line Micon. The physics then comes from Jelly itself
   rather than being imitated, and the glyph is the same component Figma uses.

   Jelly binds its own click handler to the node it built, so replacing that
   node takes the handler with it and the dialog has to be closed here. Use the
   `open` PROPERTY, never removeAttribute: the setter runs the exit animation
   and only then drops the attribute, while removing it directly cuts the
   animation off (jelly.js, the open setter).
   ═════════════════════════════════════════════════════════════════════════ */
(function minaaDialogClose() {
  'use strict';

  /* The drawer ships the identical close control -- same U+2715, same plain
     button -- so it takes the identical replacement rather than a copy of it. */
  var TAGS = ['jelly-dialog', 'jelly-drawer'];
  var OVERLAYS = TAGS.join(', ');

  function swap(dialog) {
    if (!dialog.shadowRoot) return false;
    var old = dialog.shadowRoot.querySelector('button.close');
    if (!old) return !!dialog.shadowRoot.querySelector('.minaa-close');
    if (typeof MICONS === 'undefined' || !MICONS.close) return false;

    var btn = document.createElement('jelly-icon-button');
    btn.className = 'minaa-close';
    btn.setAttribute('shape', 'circle');
    btn.setAttribute('label', old.getAttribute('aria-label') || 'Close');
    /* Inlined, not <use>: the sprite lives in the document and a <use> cannot
       reach across into a shadow root -- it renders nothing at all. Same
       reason the toasts inline their marks. */
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" ' +
                    'focusable="false" style="display:block">' + MICONS.close + '</svg>';
    btn.addEventListener('click', function () { dialog.open = false; });

    /* Hover and keyboard focus drive the same state, so the disc appears for
       a keyboard user too -- but focus is tested for :focus-visible, not for
       focus. The drawer calls focus() on open and, with delegatesFocus, that
       lands on this button: a plain focusin listener therefore opened every
       drawer with the hover disc already lit, which reads as a stuck state.
       :focus-visible is false for that programmatic focus and true for a
       keyboard one, which is exactly the distinction wanted. */
    var on  = function () { btn.setAttribute('data-hover', ''); };
    var off = function () { btn.removeAttribute('data-hover'); };
    btn.addEventListener('pointerenter', on);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('focusin', function () {
      var inner = btn.shadowRoot && btn.shadowRoot.querySelector('button');
      try { if ((inner || btn).matches(':focus-visible')) on(); } catch (e) { /* older engines */ }
    });
    btn.addEventListener('focusout', off);

    old.replaceWith(btn);
    return true;
  }

  function swapAll() {
    document.querySelectorAll(OVERLAYS).forEach(swap);
  }

  if (window.customElements) {
    Promise.all([
      customElements.whenDefined('jelly-dialog'),
      customElements.whenDefined('jelly-drawer'),
      customElements.whenDefined('jelly-icon-button')
    ]).then(swapAll).catch(function () {});
  }
  if (window.MutationObserver) {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var added = recs[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (TAGS.indexOf(node.tagName.toLowerCase()) >= 0) swap(node);
          if (node.querySelectorAll) node.querySelectorAll(OVERLAYS).forEach(swap);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  swapAll();
  setTimeout(swapAll, 300);
  setTimeout(swapAll, 1200);
})();
