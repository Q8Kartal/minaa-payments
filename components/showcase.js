/* ═══════════════════════════════════════════════════════════════════════════
   showcase.js — the catalogue, not the components.

   Nothing here styles or configures a Jelly element. The components are what
   they are; this file only builds the page around them: the contents rail,
   the code block under each entry, and the copy button.

   The snippets are DERIVED FROM THE DEMOS rather than written out beside
   them. A hand-written snippet is a second copy of the truth, and the two
   drift the moment one is edited — the Buttons page learned this and counts
   its component total from the DOM for the same reason. Here the code block
   cannot disagree with the thing above it, because it is generated from it.
   ═════════════════════════════════════════════════════════════════════════ */

(function showcase() {
  'use strict';

  const entries = [...document.querySelectorAll('.entry')];

  /* ── Contents ───────────────────────────────────────────────────────────
     Built from the entries themselves, so adding a component to the page
     adds it to the rail with nothing to remember. */
  const toc = document.querySelector('.toc');
  if (toc) {
    toc.innerHTML = entries.map((s) => {
      const num = (s.querySelector('.entry-num') || {}).textContent || '';
      const n = num.split('·').pop().trim();
      const title = (s.querySelector('.entry-title') || {}).textContent || '';
      const name = title.trim().replace(/^</, '').replace(/>$/, '').replace(/^jelly-/, '');
      return '<a href="#' + s.id + '">' + n + ' ' + name + '</a>';
    }).join('');
  }

  /* Attributes Jelly writes onto its own hosts as it upgrades. They are real
     and correct, but they were not authored — showing them would tell a
     reader to type things the component supplies for itself. */
  const NOISE = /^(aria-|data-jelly)/;
  const NOISE_EXACT = new Set(['role', 'tabindex', 'style', 'slot', 'part', 'class']);
  /* Bookkeeping the wiring writes at runtime, plus the marker that names a
     snippet root. None of it is anything a reader should type. */
  const NOISE_RUNTIME = new Set(['data-snippet-root', 'data-wired', 'data-mode']);

  /* Set only while serialising a declared root. `class` is noise on a Jelly
     element -- the page hangs layout classes on them that have nothing to do
     with using the component. On a composition it is the reverse: .theme-switch
     and .mi-moon ARE the component, and dropping them would print markup that
     does not work. */
  let KEEP_CLASS = false;

  function attrsOf(el) {
    return [...el.attributes]
      .filter((a) => !NOISE.test(a.name) && !NOISE_RUNTIME.has(a.name)
        && !(NOISE_EXACT.has(a.name) && !(KEEP_CLASS && a.name === 'class')))
      .map((a) => (a.value === '' ? ' ' + a.name : ' ' + a.name + '="' + a.value + '"'))
      .join('');
  }

  /* Serialises one element tree as authored markup. Only jelly-* elements and
     their text survive; the figure/figcaption scaffolding this page uses to
     caption specimens is presentation, not part of the component's usage. */
  function serialise(el, depth) {
    const pad = '  '.repeat(depth);
    const tag = el.tagName.toLowerCase();
    const open = '<' + tag + attrsOf(el) + '>';

    const kids = [...el.childNodes].filter((n) => {
      if (n.nodeType === 3) return n.textContent.trim().length > 0;
      return n.nodeType === 1;
    });

    if (!kids.length) return pad + open + '</' + tag + '>';

    const onlyText = kids.length === 1 && kids[0].nodeType === 3;
    if (onlyText) return pad + open + kids[0].textContent.trim() + '</' + tag + '>';

    const inner = kids.map((n) => (n.nodeType === 3
      ? '  '.repeat(depth + 1) + n.textContent.trim()
      : serialise(n, depth + 1))).join('\n');

    return pad + open + '\n' + inner + '\n' + pad + '</' + tag + '>';
  }

  /* A demo's top-level authored elements are the jelly-* elements with no
     jelly-* ancestor inside it — an option inside a select belongs to the
     select's snippet, not to one of its own. */
  function hasJellyAncestor(el, stopAt) {
    let p = el.parentElement;
    while (p && p !== stopAt) {
      if (p.tagName.toLowerCase().startsWith('jelly-')) return true;
      p = p.parentElement;
    }
    return false;
  }

  function snippetFor(demo) {
    /* Some entries are a JS call, not markup. Serialising their demo would
       print the buttons that happen to fire it, which is page furniture and
       teaches the wrong thing, so such a demo states its snippet outright. */
    const literal = demo.querySelector('template[data-snippet-text]');
    if (literal) return literal.content.textContent.trim();   /* .content: a template's children live in a fragment, so textContent on the element itself is empty */

    /* A component that is a composition rather than a single element cannot be
       described by serialising the jelly-* nodes inside it. The theme switch is
       a wrapper, a switch and two icons; printing only the switch would tell a
       reader to type something that does not work. Such a demo names its own
       root and the whole subtree is serialised, classes included. */
    const declared = [...demo.querySelectorAll('[data-snippet-root]')];
    if (declared.length) {
      KEEP_CLASS = true;
      const out = declared.map((el) => serialise(el, 0)).join('\n');
      KEEP_CLASS = false;
      return out;
    }

    const roots = [...demo.querySelectorAll('*')].filter(
      (el) => el.tagName.toLowerCase().startsWith('jelly-')
        && !hasJellyAncestor(el, demo)
        /* Anything marked data-controls drives the demo but is not part of
           using the component. Showing it would tell a reader to type page
           furniture. */
        && !el.closest('[data-controls]')
    );
    return roots.map((el) => serialise(el, 0)).join('\n');
  }

  /* ── Code blocks ────────────────────────────────────────────────────────
     Deferred to the next frame after Jelly has had a chance to upgrade, so
     reflected attributes (checked, value) are present and the snippet shows
     the state the reader can actually see above it. */
  function buildCode() {
    entries.forEach((entry) => {
      const demo = entry.querySelector('[data-demo]');
      if (!demo || entry.querySelector('.code')) return;

      const text = snippetFor(demo);
      if (!text) return;

      const box = document.createElement('div');
      box.className = 'code';

      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = text;
      pre.appendChild(code);

      const copy = document.createElement('button');
      copy.className = 'copy';
      copy.type = 'button';
      copy.textContent = 'Copy';

      copy.addEventListener('click', async () => {
        try {
          /* code.textContent, not the `text` this closure captured. Entry 07's
             snippet is rewritten as its controls move, and copying the string
             from build time would hand over a snippet the page is no longer
             showing. */
          await navigator.clipboard.writeText(code.textContent);
          copy.textContent = 'Copied';
        } catch (e) {
          /* Clipboard can be refused (permission, insecure context). Select the
             text instead so the reader can still take it, rather than failing
             silently with a button that appears to have worked. */
          const range = document.createRange();
          range.selectNodeContents(code);
          const sel = getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          copy.textContent = 'Selected';
        }
        copy.dataset.done = '1';
        setTimeout(() => { copy.textContent = 'Copy'; delete copy.dataset.done; }, 1600);
      });

      box.appendChild(copy);
      box.appendChild(pre);
      /* Into the prose column, so the entry stays two columns and the code
         sits under the description it belongs to rather than under the demo. */
      (entry.querySelector('.entry-text') || entry).appendChild(box);
    });
  }

  /* ── The theming demo's live controls ───────────────────────────────────
     <jelly-theme> is the one component whose behaviour cannot be shown by
     looking at it, so the demo is driveable. Both controls write the real
     attributes the component documents — nothing here reaches inside it. */
  function wireThemeDemo() {
    const provider = document.getElementById('theme-demo');
    if (!provider) return;

    const mode = document.getElementById('theme-mode');
    if (mode) {
      mode.addEventListener('change', () => {
        const v = mode.value || 'light';
        provider.setAttribute('mode', v);
      });
    }

    const swatches = document.getElementById('theme-accent');
    if (swatches) {
      swatches.addEventListener('click', (e) => {
        const btn = e.target.closest('.sw');
        if (!btn) return;
        /* The colour is read back off the rendered swatch rather than written
           into the markup, so the palette stays in the stylesheet and no hex
           is duplicated into HTML or JS. */
        const colour = getComputedStyle(btn).backgroundColor;
        provider.setAttribute('accent', colour);
        swatches.querySelectorAll('.sw').forEach((b) =>
          b.setAttribute('aria-pressed', String(b === btn)));
      });
    }
  }

  /* ── The theme switch (entry 16) ────────────────────────────────────────
     It drives the PAGE provider rather than a scoped one. That is the whole
     point of the component and what it will do in the header, so the demo is
     the mechanism rather than a picture of it -- the opposite call from the
     jelly-theme demo above, which is scoped on purpose.

     The handler only READS the switch. Writing `checked` back to it inside
     its own change event makes Jelly re-sync from the write and toggle a
     second time, so every other click appears to do nothing. That cost an
     afternoon on the test page; the switch owns `checked`, the page owns
     `mode`, and neither writes the other's. */
  function wireThemeSwitch() {
    const page  = document.querySelector('body > jelly-theme');
    const wraps = [...document.querySelectorAll('[data-theme-switch]')];
    if (!page || !wraps.length || page.dataset.switchWired) return;
    page.dataset.switchWired = '1';

    /* One source of truth: the provider. Every switch renders FROM it, and a
       switch that changes writes TO it and then re-renders all of them, so the
       sizes on this page cannot drift apart.

       The guard is the interesting part. Writing `checked` makes Jelly fire a
       change of its own, so a naive handler reacts to its own initialisation --
       and with four switches settling in sequence they fought each other and
       left the page dark with nothing clicked. Rather than time the echo out,
       the handler asks whether the switch is telling it something it does not
       already know: a real toggle always disagrees with the current mode,
       because disagreeing is what toggling means, while an echo always agrees.
       No timers, and nothing to get wrong when the machine is slow. */
    /* The OS, not a hopeful default. Reading `resolvedMode || "light"` looks
       harmless and is not: jelly-theme may not have upgraded yet, and on a dark
       machine the guard below then compares a real "dark" against a made-up
       "light", decides they disagree, and writes mode="dark" onto a page that
       was quite happily on "auto". Nothing looked wrong -- the colour matched
       the OS -- but the page had stopped following it. */
    const osMode = () => (window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const current = () => page.resolvedMode || osMode();

    function render() {
      const mode = current();
      wraps.forEach((w) => {
        w.dataset.mode = mode;
        w.querySelector('jelly-switch').toggleAttribute('checked', mode === 'light');
      });
    }

    wraps.forEach((w) => {
      const sw = w.querySelector('jelly-switch');
      if (!sw) return;
      sw.addEventListener('change', () => {
        const want = sw.checked ? 'light' : 'dark';
        if (want === current()) return;   // our own write coming back
        page.setAttribute('mode', want);
        render();
      });
    });

    render();

    /* While the page is still on auto the OS can move underneath us. */
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (page.getAttribute('mode') === 'auto') render();
      });
    }
  }
  /* The four toast triggers. jellyToast is Jelly's own global; the tone and the
     message ride on the button so the markup stays the single place either is
     written, and nothing here duplicates the copy shown in the caption. */
  function wireToasts() {
    document.querySelectorAll('[data-toast]').forEach((btn) => {
      if (btn.dataset.toastWired) return;
      btn.dataset.toastWired = '1';
      btn.addEventListener('click', () => {
        if (typeof jellyToast === 'function') jellyToast(btn.dataset.toast, { tone: btn.dataset.tone });
      });
    });
  }

  /* ── The OTP controls (entry 07) ────────────────────────────────────────
     The only entry on the page with controls instead of specimens, and it is
     `length` that earns them: a free number cannot be enumerated as examples,
     so any fixed pair is an arbitrary pair.

     LENGTH IS CLAMPED IN TWO PLACES, and both are needed. min/max on the host
     do nothing -- jelly-input forwards exactly nine attributes to its inner
     input and neither is among them -- so they are set on that inner element
     directly, which is what makes the spinner stop at the ends. That still
     leaves typing and pasting, so the value is clamped again on the way
     through. A pasted 40 would otherwise render forty boxes and take the card
     with it. */
  const OTP_MIN = 4;
  const OTP_MAX = 8;

  function wireOtpDemo() {
    const otp   = document.getElementById('otp-demo');
    const theme = document.getElementById('otp-theme');
    const len   = document.getElementById('otp-length');
    const size  = document.getElementById('otp-size');
    const dis   = document.getElementById('otp-disabled');
    const mode  = document.getElementById('otp-mode');
    if (!otp || !theme || !len || !size || !dis || !mode || otp.dataset.wired) return;
    otp.dataset.wired = '1';

    /* A pill group behaves like a radio set: click one, it becomes the pressed
       one and the others are released. Returns a setter, so the initial state
       can be applied without firing a synthetic click through the handler. */
    function pills(root, onPick) {
      const select = (v) => root.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === v)));
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.pill');
        if (!b) return;
        select(b.dataset.value);
        onPick(b.dataset.value);
      });
      return select;
    }

    /* Start the capsule on whatever the page resolved to, so the specimen does
       not contradict what surrounds it. The control can still flip it. */
    const page = document.querySelector('body > jelly-theme');
    const startMode = (page && page.resolvedMode) ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    theme.setAttribute('mode', startMode);

    /* The inner input is reachable and its min/max are not decoration: without
       them the spinner runs to infinity in both directions. */
    const inner = len.shadowRoot && len.shadowRoot.querySelector('input');
    if (inner) { inner.min = String(OTP_MIN); inner.max = String(OTP_MAX); inner.step = '1'; }

    function snippet() {
      const box = document.querySelector('#c-07 .code code');
      if (!box) return;
      const attrs = ['length="' + otp.getAttribute('length') + '"'];
      if (otp.getAttribute('size') && otp.getAttribute('size') !== 'medium') {
        attrs.push('size="' + otp.getAttribute('size') + '"');
      }
      if (otp.hasAttribute('disabled')) attrs.push('disabled');
      box.textContent = '<jelly-otp ' + attrs.join(' ') + '></jelly-otp>';
    }

    function applyLength() {
      const raw = parseInt(len.value, 10);
      const clamped = Number.isFinite(raw) ? Math.min(OTP_MAX, Math.max(OTP_MIN, raw)) : OTP_MIN;
      /* Write the clamped figure back so the field shows what the component is
         actually doing. Typing 40 and seeing 40 beside eight boxes is worse
         than being corrected. */
      if (String(clamped) !== String(len.value)) len.value = String(clamped);
      otp.setAttribute('length', String(clamped));
      snippet();
    }

    len.addEventListener('change', applyLength);
    len.addEventListener('input', applyLength);

    pills(size, (v) => { otp.setAttribute('size', v); snippet(); });

    /* toggleAttribute, not .disabled: on a web component the property is a
       no-op unless the component defines it, and this one does not. */
    pills(dis, (v) => { otp.toggleAttribute('disabled', v === 'true'); snippet(); });

    const setMode = pills(mode, (v) => theme.setAttribute('mode', v));
    setMode(startMode);

    applyLength();
  }

  /* ── The alert (entry 24) ───────────────────────────────────────────────
     One specimen driven by three controls, replacing five static alerts that
     showed the tones and hid everything else.

     `tone` is the interesting one: Jelly's attributeChangedCallback for it
     replaces the alert's content outright and rewires the close button, which
     throws away the Micons swap. minaaAlertIcons() re-dresses on exactly that,
     so this control is also the live test of it -- if the glyph ever reverts
     to Jelly's own, clicking a tone here is where it shows. */
  function wireAlertDemo() {
    const el = document.getElementById('alert-demo');
    const tone = document.getElementById('alert-tone');
    const dis = document.getElementById('alert-dismissible');
    const size = document.getElementById('alert-size');
    if (!el || !tone || !dis || !size || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-24 .code code');
      if (!box) return;
      const attrs = ['tone="' + (el.getAttribute('tone') || 'info') + '"'];
      /* medium is the default, so printing it would document an attribute that
         changes nothing. Same rule the skeleton's `line` follows. */
      if (el.getAttribute('size') && el.getAttribute('size') !== 'medium') {
        attrs.push('size="' + el.getAttribute('size') + '"');
      }
      if (el.hasAttribute('dismissible')) attrs.push('dismissible');
      box.textContent = '<jelly-alert ' + attrs.join(' ') + '>'
        + el.textContent.trim() + '</jelly-alert>';
    }

    function pills(root, onPick) {
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.pill');
        if (!b) return;
        root.querySelectorAll('.pill').forEach(
          (p) => p.setAttribute('aria-pressed', String(p.dataset.value === b.dataset.value)));
        onPick(b.dataset.value);
        snippet();
      });
    }

    pills(tone, (v) => el.setAttribute('tone', v));
    pills(size, (v) => el.setAttribute('size', v));
    /* toggleAttribute, not .dismissible: on a web component the property is a
       no-op unless the component defines one, and this one does not. */
    pills(dis, (v) => el.toggleAttribute('dismissible', v === 'true'));

    snippet();
  }

  /* ── The badge (entry 25) ───────────────────────────────────────────────
     Four axes, and the two absentees are the interesting part. `variant` is
     Jelly's own palette, which is the thing the bridge replaces. `instant`
     only decides whether a FILL CHANGE eases, and with no variant row nothing
     changes fill, so it would sit there doing nothing.

     `size` is CSS-only -- it is not in the component's observedAttributes, so
     it is styled by :host([size]) rules and never announced. It still belongs
     on the control: a reader setting it in markup needs to know it exists. */
  function wireBadgeDemo() {
    const el = document.getElementById('badge-demo');
    const size = document.getElementById('badge-size');
    const shape = document.getElementById('badge-shape');
    const outline = document.getElementById('badge-outline');
    const live = document.getElementById('badge-live');
    if (!el || !size || !shape || !outline || !live || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-25 .code code');
      if (!box) return;
      const a = [];
      /* medium and pill are the defaults, so printing them would document
         attributes that change nothing. */
      if (el.getAttribute('size') && el.getAttribute('size') !== 'medium') a.push('size="' + el.getAttribute('size') + '"');
      if (el.getAttribute('shape') === 'square') a.push('shape="square"');
      if (el.hasAttribute('outline')) a.push('outline');
      if (el.hasAttribute('live')) a.push('live');
      box.textContent = '<jelly-badge' + (a.length ? ' ' + a.join(' ') : '') + '>'
        + el.textContent.trim() + '</jelly-badge>';
    }

    function pills(root, onPick) {
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.pill');
        if (!b) return;
        root.querySelectorAll('.pill').forEach(
          (p) => p.setAttribute('aria-pressed', String(p.dataset.value === b.dataset.value)));
        onPick(b.dataset.value);
        snippet();
      });
    }

    pills(size, (v) => v === 'medium' ? el.removeAttribute('size') : el.setAttribute('size', v));
    pills(shape, (v) => v === 'pill' ? el.removeAttribute('shape') : el.setAttribute('shape', v));
    /* toggleAttribute, not the property: on a web component a property is a
       no-op unless the component defines one, and neither of these does. */
    pills(outline, (v) => el.toggleAttribute('outline', v === 'true'));
    pills(live, (v) => el.toggleAttribute('live', v === 'true'));

    snippet();
  }

  /* ── The progress bar (entry 26) ────────────────────────────────────────
     value and max are free numbers. The states worth seeing on a progress bar
     are its ends -- empty, full, and a value past max -- and typing reaches
     them where three preset buttons never would. They are clamped on the way
     in and the clamped figure is written back, so the field always shows what
     the component is actually doing; entry 07 does the same and for the same
     reason: typing 400 and seeing 400 beside a full bar is worse than being
     corrected.

     `indeterminate` makes value meaningless, so Jelly drops aria-valuenow and
     the number fields are disabled to match -- a control that cannot affect
     anything should not look live. */
  function wireProgressDemo() {
    const el = document.getElementById('prog-demo');
    const val = document.getElementById('prog-value');
    const max = document.getElementById('prog-max');
    const ind = document.getElementById('prog-indeterminate');
    const size = document.getElementById('prog-size');
    if (!el || !val || !max || !ind || !size || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-26 .code code');
      if (!box) return;
      const a = [];
      if (el.hasAttribute('indeterminate')) a.push('indeterminate');
      else a.push('value="' + el.getAttribute('value') + '"', 'max="' + el.getAttribute('max') + '"');
      if (el.getAttribute('size') && el.getAttribute('size') !== 'medium') a.push('size="' + el.getAttribute('size') + '"');
      a.push('label="Budget used"');
      box.textContent = '<jelly-progress ' + a.join(' ') + '></jelly-progress>';
    }

    function apply() {
      const m = Math.max(1, parseInt(max.value, 10) || 1);
      const v = Math.min(m, Math.max(0, parseInt(val.value, 10) || 0));
      if (String(m) !== String(max.value)) max.value = String(m);
      if (String(v) !== String(val.value)) val.value = String(v);
      el.setAttribute('max', String(m));
      el.setAttribute('value', String(v));
      snippet();
    }

    [val, max].forEach((f) => {
      f.addEventListener('change', apply);
      f.addEventListener('input', apply);
    });

    function pills(root, onPick) {
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.pill');
        if (!b) return;
        root.querySelectorAll('.pill').forEach(
          (p) => p.setAttribute('aria-pressed', String(p.dataset.value === b.dataset.value)));
        onPick(b.dataset.value);
        snippet();
      });
    }

    pills(size, (v) => v === 'medium' ? el.removeAttribute('size') : el.setAttribute('size', v));
    pills(ind, (v) => {
      const on = v === 'true';
      el.toggleAttribute('indeterminate', on);
      /* toggleAttribute, not .disabled: on a web component the property is a
         no-op unless the component defines one, and jelly-input does not. */
      [val, max].forEach((f) => f.toggleAttribute('disabled', on));
    });

    apply();
  }

  /* ── The spinner (entry 28) ─────────────────────────────────────────────
     `type` switches between two unrelated renderers rather than restyling one,
     which is the whole point of putting it first: dots is an SVG gooey filter
     with the canvas body unused, the blob is painted on the canvas. `dots` is
     the default and so is left off the snippet, the same rule the skeleton's
     `line` and the badge's `pill` follow.

     `label` stays in the snippet and out of the controls: it sets aria-label
     and nothing visible, and the component already carries role="status". */
  function wireSpinnerDemo() {
    const el = document.getElementById('spin-demo');
    const type = document.getElementById('spin-type');
    const size = document.getElementById('spin-size');
    if (!el || !type || !size || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-28 .code code');
      if (!box) return;
      const a = [];
      if (el.getAttribute('type') === 'blob') a.push('type="blob"');
      if (el.getAttribute('size') && el.getAttribute('size') !== 'medium') a.push('size="' + el.getAttribute('size') + '"');
      a.push('label="' + el.getAttribute('label') + '"');
      box.textContent = '<jelly-spinner ' + a.join(' ') + '></jelly-spinner>';
    }

    function pills(root, onPick) {
      root.addEventListener('click', (e) => {
        const b = e.target.closest('.pill');
        if (!b) return;
        root.querySelectorAll('.pill').forEach(
          (p) => p.setAttribute('aria-pressed', String(p.dataset.value === b.dataset.value)));
        onPick(b.dataset.value);
        snippet();
      });
    }

    pills(type, (v) => v === 'dots' ? el.removeAttribute('type') : el.setAttribute('type', v));
    pills(size, (v) => v === 'medium' ? el.removeAttribute('size') : el.setAttribute('size', v));

    snippet();
  }

  /* ── The skeleton (entry 27) ────────────────────────────────────────────
     A control instead of a paragraph. Three shapes described in prose is worse
     documentation than three shapes you can click between, and this entry now
     carries no note at all.

     The control writes TWO things, and the second is not padding. In our
     vendored build shape() only special-cases `circle`; `line` and `rect` take
     the same branch and are geometrically identical. What separates them in
     Jelly's own documentation is the size the docs page gives them -- so this
     sets `shape` for the component and `data-shape` for the stylesheet, and
     the size difference is honestly the page's, not a pretended API. */
  function wireSkeletonDemo() {
    const spec = document.getElementById('skeleton-demo');
    const set  = document.getElementById('skeleton-shape');
    if (!spec || !set || set.dataset.wired) return;
    set.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-27 .code code');
      if (!box) return;
      const v = spec.dataset.shape;
      /* `line` is the default, so the snippet shows the bare element for it --
         printing shape="line" would teach an attribute that does nothing. */
      box.textContent = v === 'line'
        ? '<jelly-skeleton></jelly-skeleton>'
        : '<jelly-skeleton shape="' + v + '"></jelly-skeleton>';
    }

    set.addEventListener('click', (e) => {
      const b = e.target.closest('.pill');
      if (!b) return;
      const v = b.dataset.value;
      set.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === v)));

      spec.dataset.shape = v;
      /* The attribute is set for `rect` even though our build's shape() does
         not read it, because the snippet prints it and the two must not
         disagree -- a code sample showing an attribute the live demo is not
         carrying is the sample lying about the demo. `rect` is a real value in
         Jelly's vocabulary; this build just draws it the same as the default,
         so setting it costs nothing and starts working the day the vendored
         copy differentiates. `line` IS the default, so it is left off. */
      if (v === 'line') spec.removeAttribute('shape');
      else spec.setAttribute('shape', v);
      snippet();
    });

    snippet();
  }

  /* ── The dialog (entry 18) ──────────────────────────────────────────────
     Open by attribute rather than by the showModal() method, because that is
     what the snippet shows and the two must not disagree. Closing is Jelly's
     own: its close control and Escape both clear `open`. */
  function wireDialog() {
    const dlg = document.getElementById('dlg-demo');
    const btn = document.getElementById('dlg-open');
    if (!dlg || !btn || btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', () => dlg.setAttribute('open', ''));

    /* Both answers close, through the `open` PROPERTY rather than the
       attribute, so the exit animation runs -- removing the attribute cuts it.
       The confirm also raises a toast, because a confirmation whose confirm
       button silently closes teaches the wrong thing: the demo should show the
       action completing, not just the dialog going away. */
    /* EACH BUTTON CARRIES ITS OWN FLAG, not one shared with dlg-open. start()
       runs twice by design -- once when Jelly defines its elements and again on
       a 2500ms fallback so the page documents itself even if Jelly never
       arrives -- and a single guard keyed to one element let the other two be
       wired on both passes. Measured, not theorised: one click produced two
       calls to jellyToast and two identical toasts. */
    const once = (el, fn) => {
      if (!el || el.dataset.wired) return;
      el.dataset.wired = '1';
      el.addEventListener('click', fn);
    };

    /* THE CLOSE IS DEFERRED OUT OF THE CLICK, and it has to be. Closing this
       dialog UN-PORTALS it: Jelly moves the element from document.body back to
       its placeholder in the page. Doing that while the click that triggered it
       is still propagating is a race, and it lost about a quarter of the time --
       the attribute came off and went straight back on, leaving the dialog open.
       Measured over four runs: cancel failed once, confirm failed once, so it
       was never about which button, only about timing.

       One frame is enough. The click finishes, then the dialog tears down. */
    const close = () => requestAnimationFrame(() => { dlg.open = false; });

    once(document.getElementById('dlg-cancel'), close);
    once(document.getElementById('dlg-confirm'), () => {
      close();
      /* A confirmation whose confirm button just closes teaches the wrong
         thing -- the demo should show the action completing. */
      if (typeof jellyToast === 'function') {
        jellyToast('Payment deleted', { tone: 'success' });
      }
    });
  }

  /* ── The drawer (entry 19) ───────────────────────────────────────────────
     side is NOT an observed attribute -- Jelly reads it from CSS only -- so it
     has to be set BEFORE opening. Setting it while the sheet is on screen
     changes nothing until the next open, which is the entry's own warning and
     would be an odd thing for the page to contradict. */
  function wireDrawer() {
    const drw = document.getElementById('drw-demo');
    if (!drw) return;
    /* start and end, not left and right. Jelly accepts all four, but the
       logical pair follows the writing direction and the physical pair does
       not -- and this library gets an RTL build later, where left would stay
       left and be wrong. */
    for (const [id, side] of [['drw-start', 'start'], ['drw-end', 'end'], ['drw-bottom', 'bottom']]) {
      const btn = document.getElementById(id);
      if (!btn || btn.dataset.wired) continue;
      btn.dataset.wired = '1';
      btn.addEventListener('click', () => {
        drw.setAttribute('side', side);
        drw.open = true;
      });
    }
  }

  /* ── Squircle cards ──────────────────────────────────────────────────────
     The same superellipse the overlays use, on the page's own surfaces. The
     geometry comes from the bridge -- window.minaaSquirclePath, exposed for
     exactly this -- rather than being reimplemented here, because two copies of
     the maths is two shapes the day one of them is edited.

     WHICH SURFACES: .demo, .preview and .otp-stage. The fill colour comes from
     --m-squircle-fill, so a well can take --m-page while a card takes --m-card
     without this function knowing which is which.

     .otp-stage was excluded while the shape was a clip, on the grounds that it
     scrolls and a clip would slice its scrollbar. Painting the shape instead
     retired that objection -- but it still needed the scroll moved onto an
     inner .otp-scroll, because an absolutely positioned layer inside a scroll
     container scrolls with the content and would slide out from under its own
     surface.

     .code is still out: it is a well too, but nothing about a code block wants
     a 64px corner.

     A CLIPPED ELEMENT MUST NOT HAVE A BORDER. A border is drawn on the
     border-box rectangle, so the clip keeps the straight middle of each edge
     and cuts the corners off, leaving four hairlines floating around a shape
     they no longer trace. Same reason jelly-popover::part(panel) drops its own.

     But "no border, or no clip" was too quick -- there IS a third option, and
     .preview needs it, because that card is --m-card sitting on a .demo that is
     also --m-card and the stroke is the only thing separating them. Draw the
     stroke as a PATH rather than a border: the same superellipse, stroked, and
     inset by half its own width so the whole stroke lands inside the clip
     instead of straddling it. Opt in with --m-squircle-ring.

     The 5% card shadow is lost -- clipping happens after filtering, so a
     clipped element cannot shadow itself, and lifting it would mean wrapping
     every card on the page. At rgba(22,22,22,.05) it was a whisper, and the
     card is already a different colour from the page it sits on. */
  function wireSquircleCards() {
    if (typeof minaaSquirclePath !== 'function') return;
    const cards = document.querySelectorAll('.demo, .preview, .otp-stage');
    if (!cards.length) return;

    const SVGNS = 'http://www.w3.org/2000/svg';

    /* The stroke, for cards that ask for one. Inset by half the stroke width:
       a stroke is centred on its path, so drawing it on the clip boundary would
       lose the outer half to the clip and leave a stroke of half the weight.
       The inner superellipse is generated at (w - s, h - s) with its radius
       reduced by the same half, which is not the true parallel curve of a
       superellipse but is indistinguishable at these weights. */
    const ring = (el, w, h, r) => {
      const cs = getComputedStyle(el);
      let svg = el.querySelector(':scope > [data-sq-ring]');
      if (!cs.getPropertyValue('--m-squircle-ring').trim()) {
        if (svg) svg.remove();
        return;
      }
      const s = parseFloat(cs.getPropertyValue('--control-stroke')) || 1.5;
      const d = minaaSquirclePath(w - s, h - s, Math.max(0, r - s / 2));
      if (!d) return;
      if (!svg) {
        svg = document.createElementNS(SVGNS, 'svg');
        svg.setAttribute('data-sq-ring', '');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        /* Absolute so it never joins the grid this card lays out, and inert so
           it cannot eat a click meant for a control underneath it. */
        svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
                            'pointer-events:none';
        el.appendChild(svg);
      }
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.innerHTML =
        '<g transform="translate(' + (s / 2) + ',' + (s / 2) + ')">' +
        '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="' + s + '"/>' +
        '</g>';
    };

    const radius = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--m-surface-corner');
      const n = parseFloat(raw);
      return isNaN(n) ? Infinity : n;
    };

    /* THE SHAPE IS PAINTED, NOT CLIPPED, and that distinction is the whole
       reason this function exists in its current form.

       Clipping the card itself was the obvious way to do it and it was wrong:
       clip-path clips EVERY descendant, including position:fixed ones, which
       overflow:hidden would have left alone. The popover and menu panels are
       fixed children of .demo, so the card's own corner was slicing the panels
       off wherever they extended past it. The dialog and drawer escaped only
       because they portal themselves to document.body.

       So the card is never clipped. A layer behind the content carries the
       --m-card fill and takes the clip instead: the shape is identical, and
       nothing inside the card is affected by it.

       z-index -1 rather than a stacking context on the card. isolation:isolate
       would also put the layer behind the content, but it would trap the
       overlays' z-index inside the card -- trading a clipping bug for the
       layering bug this was reported as. */
    const fill = (el, d) => {
      let layer = el.querySelector(':scope > [data-sq-fill]');
      if (!layer) {
        layer = document.createElement('div');
        layer.setAttribute('data-sq-fill', '');
        layer.setAttribute('aria-hidden', 'true');
        el.insertBefore(layer, el.firstChild);
      }
      layer.style.clipPath = 'path("' + d + '")';
    };

    const shape = (el) => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      if (el.__sqW === w && el.__sqH === h) return;
      const r = radius();
      const d = minaaSquirclePath(w, h, r);
      if (!d) return;
      el.__sqW = w; el.__sqH = h;
      fill(el, d);
      ring(el, w, h, r);
    };

    /* Cards reflow constantly here -- fonts settle, code blocks wrap, a demo
       grows when a control opens -- so the path is regenerated on every resize
       rather than measured once. */
    const ro = window.ResizeObserver
      ? new ResizeObserver((recs) => recs.forEach((r) => shape(r.target)))
      : null;
    cards.forEach((el) => { shape(el); if (ro) ro.observe(el); });
  }

  function start() {
    buildCode(); wireThemeDemo(); wireThemeSwitch(); wireToasts();
    wireOtpDemo(); wireAlertDemo(); wireBadgeDemo(); wireProgressDemo(); wireSpinnerDemo(); wireSkeletonDemo(); wireDialog(); wireDrawer(); wireSquircleCards();
  }

  if (window.customElements) {
    Promise.all(
      ['jelly-checkbox', 'jelly-input', 'jelly-switch', 'jelly-segmented']
        .map((t) => customElements.whenDefined(t))
    ).then(() => setTimeout(start, 0)).catch(start);
  }
  /* If Jelly never arrives — offline, or its origin is down — the page still
     has to document itself, so the snippets are built regardless. */
  setTimeout(start, 2500);
})();
