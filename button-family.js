/* ═══════════════════════════════════════════════════════════════════════════
   THE MINAÃ BUTTON FAMILY — runtime, shared by buttons.html, buttons-en.html
   and the component library.

   The partner to button-family.css. The look is CSS, but the FEEL is not: the
   colour is driven by reading Jelly's live deformation out of its canvas every
   frame, the Outline stroke is drawn from the same silhouette, the focus ring
   is applied by hand because Jelly delegates focus into its shadow root, and
   activation on a disabled button is blocked in the capture phase. None of
   that survives as a stylesheet.

   Lifted here verbatim from buttons.js so a third page could have it without a
   second copy. The block turned out to be entirely self-contained -- checked
   before moving it: no reference to the page's strings, its factories, or any
   element id -- so the only edit is the one that made it take a root, and the
   comments below are the originals.

   Returns the handles buttons.js still uses after wiring: CONTROLS and
   DISABLED for its own init, and setP for its scrubber.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  window.minaaButtonFamily = function (scope) {
    const root = scope || document;

  /* ═══════════════════════════════════════════════════════════════════════
     COLOUR DRIVEN BY JELLY'S LIVE DEFORMATION

     Jelly emits no motion events and exposes no progress API, but it repaints
     its blob into <canvas part="jelly"> every frame. Measured during a real
     drag: the alpha count moved 523 -> 586 and the alpha centroid shifted
     204.6 -> 195.8, returning to rest afterwards. The canvas transform never
     changes, so the deformation lives purely in those pixels — which means it
     can be read rather than guessed at.

     So each frame, for the one button being touched:
       intensity  = how far the blob has departed from its resting shape
       lean       = which way its centroid has moved
     and the colour is composited into Jelly's own silhouette with
     `source-in`, so it can only ever appear exactly where the deformed body
     is. Origin is the real contact point; the spread leans with the blob;
     when Jelly springs back, intensity falls and the spread retracts along
     the same path. One response, one source of truth.
     ═════════════════════════════════════════════════════════════════════ */
  /* SCOPED TWO WAYS. `root` is what the caller hands in -- the whole document
     on the button pages, one entry's demo on the component library -- and
     .mn-btn is the same marker button-family.css keys on, so the runtime and
     the stylesheet can never disagree about which buttons are ours. On the
     component library that matters twice over: its own controller pills are
     jelly-buttons too, and wiring the physics to them would fight the page. */
  const ALL_BUTTONS = [...root.querySelectorAll('jelly-button.mn-btn, jelly-icon-button.mn-btn')];
  /* Disabled buttons are kept out of CONTROLS, so the physics below is never
     wired to them and --p can never leave 0.

     This is the mechanism, not a belt-and-braces extra. Measured on the live
     component: pointer-events:none does NOT stop a dispatched event — a
     synthetic pointerenter still reached the host — so excluding them here is
     the only thing that actually keeps a disabled button inert. */
  const CONTROLS = ALL_BUTTONS.filter(el => el.getAttribute('aria-disabled') !== 'true');
  const DISABLED = ALL_BUTTONS.filter(el => el.getAttribute('aria-disabled') === 'true');
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  /* Reading the deformation */
  const SAMPLE_STEP   = 6;      // pixel stride when reading the blob
  const AREA_SPAN     = 0.14;   // +14% area ~ full intensity
  const SHIFT_SPAN    = 10;     // 10 canvas px of centroid travel ~ full
  const BASELINE_EASE = 0.08;   // how fast the resting sample re-learns when untouched

  /* Knowing when it has settled */
  const STILL_EPS     = 0.004;  // frame-to-frame movement counted as "not moving"
  const STILL_FRAMES  = 12;     // consecutive still frames before the loop lets go

  /* Drawing the wave */
  const CORE      = 0.88;       // solid share of the wave before it fades; the label
                                // uses the same figure so the two cannot drift
  const LEAN_GAIN = 2;          // how far the origin leans with the body's centroid
  const MIN_BAND  = 12;         // floor for the soft edge on the smallest buttons
  const FALLBACK_ACTIVE = 'rgb(232,65,29)';   // only if --fill-active resolves to nothing

  const setP = (el, p) => {
    const v = clamp01(p);
    el.__p = v;
    el.style.setProperty('--p', v.toFixed(4));
  };

  const jellyCanvas = el => el.shadowRoot && el.shadowRoot.querySelector('canvas');

  /* Reads Jelly's rendered blob: area + centroid, cheaply and only on demand. */
  function readBlob(el) {
    const c = jellyCanvas(el);
    if (!c || !c.width) return null;
    if (!el.__ctx) el.__ctx = c.getContext('2d', { willReadFrequently: true });
    const d = el.__ctx.getImageData(0, 0, c.width, c.height).data;
    let n = 0, sx = 0, sy = 0;
    for (let y = 0; y < c.height; y += SAMPLE_STEP)
      for (let x = 0; x < c.width; x += SAMPLE_STEP) {
        if (d[(y * c.width + x) * 4 + 3] > 16) { n++; sx += x; sy += y; }
      }
    return n ? { n, cx: sx / n, cy: sy / n } : null;
  }

  /* Both layers are canvases stacked on Jelly's own, pixel for pixel. They are
     slotted into .jelly-content, its own stacking context above the jelly
     canvas, so a negative z-index puts them between the body and the label —
     tinting or outlining the blob, never the text.

       reveal (z -1)  the colour, composited inside the silhouette
       ring   (z -2)  the outline variant's stroke, derived from the silhouette

     One factory builds both: they differ only in class and depth, and letting
     them drift apart is what let the ring keep a stale size while the reveal
     stayed correct. */
  const LAYERS = {
    reveal: { className: 'reveal-layer', z: -1, node: '__overlay', ctx: '__octx' },
    ring:   { className: 'ring-layer',   z: -2, node: '__ring',    ctx: '__rctx' },
  };

  function layerFor(el, kind) {
    const spec = LAYERS[kind];
    if (el[spec.node]) return el[spec.node];
    const jc = jellyCanvas(el);
    if (!jc) return null;
    const c = document.createElement('canvas');
    c.className = spec.className;
    c.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
                      'pointer-events:none;z-index:' + spec.z + ';';
    el.appendChild(c);
    el[spec.node] = c;
    el[spec.ctx] = c.getContext('2d');
    syncLayer(c, jc);                 // sole owner of layer geometry
    return c;
  }

  /* ── Outline ────────────────────────────────────────────────────────────
     The outline variant needs a real stroke, and Jelly has no ring API — the
     --jelly-ring properties we were setting are Jelly's focus ring, not a
     border, which is how the outline quietly became a plain cream fill when
     the buttons moved onto Jelly. A CSS border is not an option
     either: it would stay a rigid capsule while the body squashes. So the
     stroke is derived from Jelly's own silhouette every frame — draw the blob
     smeared around a small circle, punch the undisplaced blob back out, and
     what is left is an even rim that deforms with the body exactly. */
  const RING_STEPS = 16;

  /* Our layers are composited 1:1 with Jelly's canvas, so any drift in size
     puts the stroke and the fill in different places. Jelly resizes its canvas
     when the button does — after a webfont swap, a reflow, a container change —
     and a layer created before that keeps the old geometry. This re-syncs on
     every paint, so a layer can never stay stale. Returns true if it changed,
     since assigning width/height also clears the canvas. */
  function syncLayer(c, jc) {
    const jcs = getComputedStyle(jc);
    let changed = false;
    if (c.width !== jc.width || c.height !== jc.height) {
      c.width = jc.width; c.height = jc.height; changed = true;
    }
    if (c.style.width !== jcs.width || c.style.height !== jcs.height) {
      c.style.width = jcs.width; c.style.height = jcs.height; changed = true;
    }
    return changed;
  }

  function paintRing(el) {
    const cs = getComputedStyle(el);
    const colour = cs.getPropertyValue('--stroke').trim();
    const widthCss = parseFloat(cs.getPropertyValue('--stroke-width')) || 0;
    if (!colour || widthCss <= 0) return;
    const jc = jellyCanvas(el), c = layerFor(el, 'ring');
    if (!jc || !c) return;
    syncLayer(c, jc);
    const ctx = el.__rctx;
    const scale = jc.width / parseFloat(getComputedStyle(jc).width);
    const w = widthCss * scale;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < RING_STEPS; i++) {
      const a = (i / RING_STEPS) * Math.PI * 2;
      ctx.drawImage(jc, Math.cos(a) * w, Math.sin(a) * w);
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(jc, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* The pieces of copy the wave has to repaint. jelly-button wraps them in a
     .jelly-label; jelly-icon-button carries a bare icon instead, which the
     wave used to miss entirely — a red glyph then sat on a fully red fill and
     vanished. Our own canvas layers are children too, so they are excluded. */
  function labelParts(el) {
    const wrapped = el.querySelectorAll('.jelly-label > *');
    if (wrapped.length) return wrapped;
    return el.querySelectorAll(':scope > :not(canvas)');
  }

  /* Wipes the colour and puts the label back to its resting colour. The stroke
     is left alone — it belongs to the resting state, not the interaction. */
  function clearReveal(el) {
    if (el.__octx && el.__overlay) el.__octx.clearRect(0, 0, el.__overlay.width, el.__overlay.height);
    resetLabel(el);
  }

  /* Paints the active colour into Jelly's silhouette, from the contact point. */
  function paint(el, intensity, lean) {
    const jc = jellyCanvas(el), o = layerFor(el, 'reveal');
    if (!jc || !o) return;
    syncLayer(o, jc);
    const ctx = el.__octx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, o.width, o.height);
    if (intensity <= 0.001 || !el.__contact) { resetLabel(el); return; }

    const scale = jc.width / parseFloat(getComputedStyle(jc).width);   // device px per css px
    // contact point, host coords -> canvas coords
    const hb = el.getBoundingClientRect();
    const jb = jc.getBoundingClientRect();
    let ox = (el.__contact.x - jb.left) * scale;
    let oy = (el.__contact.y - jb.top)  * scale;
    // let the spread lean the way the body is leaning
    ox += lean.x * LEAN_GAIN; oy += lean.y * LEAN_GAIN;

    /* Reach = the distance from this contact point to the furthest corner of
       the button, so intensity 1 means "just covered" wherever you touched and
       intensity 0.5 really is half way. A fixed reach saturated long before 1:
       the canvas diagonal by p≈0.45, the button diagonal by p≈0.5 from centre. */
    const cx = el.__contact.x - hb.left, cy = el.__contact.y - hb.top;
    const reach = Math.hypot(Math.max(cx, hb.width - cx),
                             Math.max(cy, hb.height - cy)) * scale;
    const r = Math.max(1, reach * intensity);

    ctx.drawImage(jc, 0, 0);                     // exact deformed silhouette
    ctx.globalCompositeOperation = 'source-in';  // colour only inside the body
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    const active = activeColour(el);
    g.addColorStop(0, active);
    g.addColorStop(CORE, active);
    g.addColorStop(1, active.replace('rgb(', 'rgba(').replace(')', ',0)'));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, o.width, o.height);
    ctx.globalCompositeOperation = 'source-over';

    paintLabel(el, hb, cx, cy, reach / scale, intensity);
  }

  /* Repaints each label part as the same wave front passes over it, so the
     text and icons turn where the colour actually arrives rather than fading
     on a separate timer. */
  function paintLabel(el, hb, cx, cy, reachCss, intensity) {
    const parts = labelParts(el);
    if (!parts.length) return;
    const front = reachCss * intensity * CORE;          // same front as the fill
    const band = Math.max(MIN_BAND, reachCss * (1 - CORE));   // same soft edge
    parts.forEach(part => {
      const pb = part.getBoundingClientRect();
      const d = Math.hypot(pb.left + pb.width / 2 - hb.left - cx,
                           pb.top + pb.height / 2 - hb.top - cy);
      part.style.setProperty('--t', clamp01((front - d) / band + 0.5).toFixed(3));
    });
  }

  function resetLabel(el) {
    labelParts(el).forEach(p => p.style.setProperty('--t', '0'));
  }

  /* --fill-active may be any CSS colour, and the canvas needs a concrete rgb()
     to build a gradient from. A throwaway element resolves it. The answer is
     fixed by the variant class, so it is worked out once per button rather
     than on every interaction. */
  function activeColour(el) {
    if (el.__activeColour) return el.__activeColour;
    const v = getComputedStyle(el).getPropertyValue('--fill-active').trim();
    let rgb = FALLBACK_ACTIVE;
    if (v) {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:fixed;left:-9999px;color:' + v;
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      if (resolved.startsWith('rgb')) rgb = resolved;
    }
    el.__activeColour = rgb;
    return rgb;
  }

  /* One loop per active button. It follows Jelly rather than leading it, and
     stops on its own once the body has settled back to rest. */
  function track(el) {
    if (el.__tracking) return;
    el.__tracking = true;
    activeColour(el);
    if (!el.__rest) el.__rest = readBlob(el);
    let still = 0, prev = null;
    const step = () => {
      const now = readBlob(el);
      const rest = el.__rest;
      if (!now || !rest) { el.__tracking = false; return; }

      /* While nothing is touching it, ease the baseline toward what we see.
         The baseline is read from a live canvas, so it can be captured
         mid-wobble; without this it stays wrong and the button keeps a
         phantom colour forever. */
      if (!el.__engaged) {
        rest.n  += (now.n  - rest.n)  * BASELINE_EASE;
        rest.cx += (now.cx - rest.cx) * BASELINE_EASE;
        rest.cy += (now.cy - rest.cy) * BASELINE_EASE;
      }

      const dArea = (now.n - rest.n) / rest.n;
      const dx = now.cx - rest.cx, dy = now.cy - rest.cy;
      const shift = Math.hypot(dx, dy);
      const intensity = clamp01(Math.max(dArea / AREA_SPAN, shift / SHIFT_SPAN));

      setP(el, intensity);
      paint(el, intensity, { x: dx, y: dy });
      paintRing(el);                             // the stroke deforms with the body

      /* Stop on frame-to-frame stillness, not on distance from the baseline —
         a bad baseline must never be able to keep the loop alive. */
      const moved = prev
        ? Math.abs(now.n - prev.n) / rest.n + Math.hypot(now.cx - prev.cx, now.cy - prev.cy)
        : Infinity;
      prev = now;
      still = moved < STILL_EPS ? still + 1 : 0;
      if (still > STILL_FRAMES && !el.__engaged) {   // settled and no longer touched
        el.__tracking = false; setP(el, 0); clearReveal(el); return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  CONTROLS.forEach(el => {
    setP(el, 0);
    const contact = e => { el.__contact = { x: e.clientX, y: e.clientY }; };

    el.addEventListener('pointerenter', e => { el.__engaged = true; contact(e); track(el); });
    el.addEventListener('pointermove',  e => { contact(e); track(el); });
    el.addEventListener('pointerdown',  e => { el.__engaged = true; contact(e); track(el); });
    el.addEventListener('pointerup',    e => { contact(e); });
    ['pointerleave','pointercancel'].forEach(t =>
      el.addEventListener(t, () => { el.__engaged = false; }));   // loop unwinds itself

    // Keyboard has no contact point and no deformation to follow.
    el.addEventListener('focus', () => {
      /* Jelly delegates focus into its shadow button, and that inner element is
         the one that matches :focus-visible — the host never does. Testing the
         host meant this returned on every tab stop and keyboard users saw no
         colour at all. */
      const inner = el.shadowRoot && el.shadowRoot.querySelector('button');
      if (!(inner || el).matches(':focus-visible')) return;
      const b = el.getBoundingClientRect();
      el.__contact = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
      setP(el, 1); paint(el, 1, { x: 0, y: 0 });
    });
    el.addEventListener('blur', () => { setP(el, 0); clearReveal(el); });
  });

  /* ── Focus ring — every button, enabled or not ──────────────────────────
     Separate from the loop above because disabled buttons are deliberately not
     in CONTROLS, yet must still show focus: they stay in the tab order on
     purpose. The ring cannot be written as `jelly-button:focus-visible` in CSS
     — Jelly delegates focus into its shadow button and that inner element is
     the one that matches, never the host — so the class is set here using the
     same test the colour reveal already uses. */
  ALL_BUTTONS.forEach(el => {
    el.addEventListener('focus', () => {
      const inner = el.shadowRoot && el.shadowRoot.querySelector('button');
      if ((inner || el).matches(':focus-visible')) el.classList.add('is-focused');
    });
    el.addEventListener('blur', () => el.classList.remove('is-focused'));
  });

  /* ── Disabled — activation blocked in the capture phase ─────────────────
     Capture phase and stopImmediatePropagation, so nothing downstream ever
     sees the activation — Jelly's own handlers included. Only Enter and Space
     are swallowed on keydown; Tab, Escape and the arrow keys must keep working
     or the button becomes a keyboard trap. */
  DISABLED.forEach(el => {
    const block = e => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    ['click', 'keydown', 'pointerdown'].forEach(t => el.addEventListener(t, block, true));
  });

  /* On resize the resting shape has changed, so the old baseline would read as
     a permanent deformation and has to go.

     The stroke is repainted here as well as by the observer below. The observer
     watches the layout box, but a change in device pixel ratio rewrites Jelly's
     backing store while the CSS box stays put — measured after a viewport
     switch: our layer held 468x288 against Jelly's 410x252 at an identical
     234px on screen, which would have drawn the stroke at 0.88 scale. */
  addEventListener('resize', () => CONTROLS.forEach(el => {
    el.__rest = null;
    settleRing(el);
  }));

  /* Repaint until Jelly has finished resizing rather than once on the event.
     Painting immediately syncs to the size Jelly is about to abandon, and the
     observer cannot cover it — a device-pixel-ratio change rewrites the
     backing store while the layout box it watches stays identical. So watch
     the backing store directly and stop as soon as it holds still. */
  function settleRing(el) {
    if (el.__settling) return;
    el.__settling = true;
    let stable = 0, frames = 0;
    const step = () => {
      const jc = jellyCanvas(el), c = el.__ring;
      if (!jc || ++frames > 40) { el.__settling = false; return; }
      const matched = c && c.width === jc.width && c.height === jc.height;
      if (!matched) { paintRing(el); stable = 0; } else stable++;
      if (stable >= 3) { el.__settling = false; return; }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* At rest nothing is tracking, so the stroke has to be repainted whenever the
     button changes size. Fixed timeouts were not enough: the RTL 40px outline
     settled to its final width after the last one, leaving a stroke drawn at
     the old size sitting 16px off the fill.

     The observer watches Jelly's canvas, not the host. Watching the host fires
     while Jelly still holds its previous canvas size, so the stroke resynced to
     stale dimensions and stayed exactly one resize behind — correct until the
     first reflow, then 42px out. The canvas is what we composite against, so it
     is what to follow. */
  const ringWatch = new ResizeObserver(entries => {
    entries.forEach(e => {
      const host = e.target.__host;
      if (host && !host.__tracking) paintRing(host);
    });
  });
  function restRing(el) {
    const attach = () => {
      const jc = jellyCanvas(el);
      if (!jc) { setTimeout(attach, 100); return; }   // the element may not have upgraded yet
      jc.__host = el;
      ringWatch.observe(jc);
      paintRing(el);
    };
    attach();
  }
  CONTROLS.forEach(restRing);


    return { ALL_BUTTONS, CONTROLS, DISABLED, setP };
  };
}());
