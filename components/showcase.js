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

    /* The preview's job is to show what a mode LOOKS like. When it is showing
       the mode the page is already in, a filled card is invisible -- it is the
       same surface as the one behind it -- so it drops its fill and the stroke
       alone describes it. Both sides resolve `auto` first, because the page
       runs at auto and the answer depends on the operating system. */
    const pageProvider = document.querySelector('body > jelly-theme');
    const resolved = (el) => {
      if (!el) return 'light';
      if (el.resolvedMode) return el.resolvedMode;
      const m = el.getAttribute('mode');
      if (m === 'light' || m === 'dark') return m;
      return window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    const syncPreviewFill = () => {
      const card = provider.querySelector('.preview');
      if (!card) return;
      card.toggleAttribute('data-same-as-page',
        resolved(provider) === resolved(pageProvider));
    };

    const mode = document.getElementById('theme-mode');
    if (mode) {
      mode.addEventListener('change', () => {
        const v = mode.value || 'light';
        provider.setAttribute('mode', v);
        syncPreviewFill();
      });
    }

    /* The page can change underneath it two ways: the masthead switch, and the
       operating system while both sit at auto. */
    new MutationObserver(syncPreviewFill)
      .observe(pageProvider, { attributes: true, attributeFilter: ['mode'] });
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', syncPreviewFill);
    }
    syncPreviewFill();

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

  /* ── The radio (entry 08) ───────────────────────────────────────────────
     `checked` is a control rather than something you click on the specimen,
     and that is the component being correct: a radio only clears when a
     sibling in its group takes over, so a lone one cannot be unchecked by
     clicking it. The pill can set the property directly.

     .checked, not toggleAttribute -- unlike disabled and readonly on the
     field, jelly-radio DOES define this property, and going through it keeps
     the component's own group bookkeeping in step rather than writing the
     attribute behind its back. */
  function wireRadioDemo() {
    const el = document.getElementById('radio-demo');
    const chk = document.getElementById('radio-checked');
    const size = document.getElementById('radio-size');
    const dis = document.getElementById('radio-disabled');
    if (!el || !chk || !size || !dis || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-08 .code code');
      if (!box) return;
      const a = ['name="pay"', 'value="monthly"'];
      if (el.getAttribute('size') && el.getAttribute('size') !== 'medium') a.push('size="' + el.getAttribute('size') + '"');
      if (el.checked) a.push('checked');
      if (el.hasAttribute('disabled')) a.push('disabled');
      box.textContent = '<jelly-radio ' + a.join(' ') + '>' + el.textContent.trim() + '</jelly-radio>';
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

    pills(chk, (v) => { el.checked = v === 'true'; });
    pills(size, (v) => v === 'medium' ? el.removeAttribute('size') : el.setAttribute('size', v));
    pills(dis, (v) => el.toggleAttribute('disabled', v === 'true'));

    snippet();
  }

  /* ── The field (entry 05) ───────────────────────────────────────────────
     Six controls, all of them the component's own observed attributes. Two are
     free text, because a placeholder and a value are strings and any pair of
     preset buttons would be an arbitrary pair.

     `disabled` and `readonly` are separate rows on purpose: they look alike
     and are not. A readonly field still takes focus and still lets its value
     be selected and copied; a disabled one does neither and is skipped by the
     tab order. Two pills make that difference clickable rather than described.

     toggleAttribute, not the property: on a web component a property is a
     no-op unless the component defines one, and jelly-input defines neither. */
  function wireInputDemo() {
    const el = document.getElementById('in-demo');
    const ph = document.getElementById('in-placeholder');
    const val = document.getElementById('in-value');
    const type = document.getElementById('in-type');
    const size = document.getElementById('in-size');
    const dis = document.getElementById('in-disabled');
    const ro = document.getElementById('in-readonly');
    if (!el || !ph || !val || !type || !size || !dis || !ro || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-05 .code code');
      if (!box) return;
      const a = [];
      /* text and medium are the defaults, so printing them would document
         attributes that change nothing. */
      if (el.getAttribute('type') && el.getAttribute('type') !== 'text') a.push('type="' + el.getAttribute('type') + '"');
      /* size is ALWAYS printed here, unlike every other entry. On this
         component it is not a cosmetic default: Jelly's base :host carries no
         width, so a jelly-input copied without a size renders zero wide. */
      a.push('size="' + (el.getAttribute('size') || 'medium') + '"');
      if (el.getAttribute('placeholder')) a.push('placeholder="' + el.getAttribute('placeholder') + '"');
      if (el.getAttribute('value')) a.push('value="' + el.getAttribute('value') + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      if (el.hasAttribute('readonly')) a.push('readonly');
      box.textContent = '<jelly-input' + (a.length ? ' ' + a.join(' ') : '') + '></jelly-input>';
    }

    function text(field, apply) {
      const run = () => { apply(field.value == null ? '' : String(field.value)); snippet(); };
      field.addEventListener('input', run);
      field.addEventListener('change', run);
    }
    text(ph, (v) => v ? el.setAttribute('placeholder', v) : el.removeAttribute('placeholder'));
    text(val, (v) => v ? el.setAttribute('value', v) : el.removeAttribute('value'));

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
    pills(type, (v) => v === 'text' ? el.removeAttribute('type') : el.setAttribute('type', v));
    /* Never removed -- see the snippet note: no size means no width. */
    pills(size, (v) => el.setAttribute('size', v));
    pills(dis, (v) => el.toggleAttribute('disabled', v === 'true'));
    pills(ro,  (v) => el.toggleAttribute('readonly', v === 'true'));

    snippet();
  }

  /* ── The alert (entry 24) ───────────────────────────────────────────────
     One specimen driven by three controls, replacing five static alerts that
     showed the tones and hid everything else.

     `tone` is the interesting one: Jelly's attributeChangedCallback for it
     replaces the alert's content outright and rewires the close button, which
     throws away the Micons swap. minaaAlertIcons() re-dresses on exactly that,
     so this control is also the live test of it -- if the glyph ever reverts
     to Jelly's own, clicking a tone here is where it shows. */
  function wireSelectDemo() {
    const el = document.getElementById('sel-demo');
    const value = document.getElementById('sel-value');
    const size = document.getElementById('sel-size');
    const dis = document.getElementById('sel-disabled');
    const add = document.getElementById('sel-add');
    const lbl = document.getElementById('sel-label');
    const ph = document.getElementById('sel-placeholder');
    const del = document.getElementById('sel-remove');
    if (!el || !value || !size || !dis || !add || !lbl || !ph || !del
        || el.dataset.wired) return;
    el.dataset.wired = '1';

    /* Read the options out of the DOM every time rather than holding a list
       here. The reader can add their own, so a constant would print a snippet
       that stopped matching the specimen the moment they did. */
    const options = () => [...el.querySelectorAll('jelly-option')].map(
      (o) => [o.getAttribute('value') || o.textContent.trim(), o.textContent.trim()]);

    function snippet() {
      const box = document.querySelector('#c-12 .code code');
      if (!box) return;
      const a = [];
      /* el.value, the PROPERTY. The reason written here before was wrong: it
         said jelly-select does not reflect `value` to the attribute. It does --
         reflectValue() writes it on every commit. The property is still what to
         read, because it is derived from the selected option rather than from
         whatever the attribute last held, so it cannot disagree with the row
         the panel has highlighted. */
      if (el.value) a.push('value="' + el.value + '"');
      /* Both are on the specimen, so both belong in a snippet a reader copies. */
      const lb = el.getAttribute('label');
      if (lb) a.push('label="' + lb + '"');
      const phv = el.getAttribute('placeholder');
      if (phv) a.push('placeholder="' + phv + '"');
      /* medium is printed only when it is not the default. Jelly's base :host
         already carries 240x54, so `size="medium"` would document an attribute
         that changes nothing -- the opposite of jelly-input, whose base :host
         has no width at all and whose snippet must always carry a size. */
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      const lines = ['<jelly-select' + (a.length ? ' ' + a.join(' ') : '') + '>'];
      options().forEach(
        (o) => lines.push('  <jelly-option value="' + o[0] + '">' + o[1] + '</jelly-option>'));
      lines.push('</jelly-select>');
      box.textContent = lines.join('\n');
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
    /* .value, the PROPERTY, the same call entry 08 makes for the radio:
       jelly-select owns the trigger label and the panel's selected row, and
       setting the attribute behind its back leaves those two disagreeing. */
    pills(value, (v) => { el.value = v; });
    pills(size, (v) => el.setAttribute('size', v));
    /* toggleAttribute, never el.disabled -- assigning the property on a web
       component that does not define it silently no-ops. */
    pills(dis, (v) => el.toggleAttribute('disabled', v === 'true'));
    /* ADDING AN OPTION. Three currencies were only ever an example, and a fixed
       set of three documented a ceiling the component does not have -- so the
       reader can type their own and watch the panel grow.

       jelly-select builds its rows from the slotted jelly-option elements, so
       appending one is the entire operation; a matching pill goes into the
       value row, and the pill handler above is delegated, so the new one is
       live without being wired individually. */
    function addOption(raw) {
      const v = String(raw == null ? '' : raw).trim();
      if (!v) return false;
      /* A duplicate value would give the select two rows it cannot tell apart,
         and picking either would light both pills. */
      if (options().some((o) => o[0] === v)) return false;
      const opt = document.createElement('jelly-option');
      opt.setAttribute('value', v);
      opt.textContent = v;
      el.appendChild(opt);
      const pill = document.createElement('jelly-button');
      pill.className = 'pill';
      pill.dataset.value = v;
      pill.setAttribute('aria-pressed', 'false');
      pill.textContent = v;
      value.appendChild(pill);
      snippet();
      return true;
    }
    /* REMOVING ONE. The mirror of addOption: drop the jelly-option and its
       pill, then make sure the control is not left pointing at something that
       no longer exists.

       Matching is exact on the value first and case-insensitive second, so
       typing `usd` finds USD without letting two options that differ only in
       case collide -- addOption already refuses those.

       THE LAST OPTION IS NOT REMOVABLE. A jelly-select with no children still
       renders, but its panel is an empty box and every row below documents
       nothing, so the floor is one.

       If the option being removed is the SELECTED one, the selection moves to
       the first survivor rather than being left dangling: syncOptions() would
       otherwise find the host still carrying a value that matches no child,
       land on selectedIndex -1, and drop the trigger back to the placeholder
       with no pill pressed. */
    function removeOption(raw) {
      const v = String(raw == null ? '' : raw).trim();
      if (!v) return false;
      const opts = [...el.querySelectorAll('jelly-option')];
      if (opts.length <= 1) return false;
      const val = (o) => o.getAttribute('value') || o.textContent.trim();
      const opt = opts.find((o) => val(o) === v)
        || opts.find((o) => val(o).toLowerCase() === v.toLowerCase());
      if (!opt) return false;
      const gone = val(opt);
      /* Read the selection BEFORE the node goes, and work out what should be
         selected after from what we know -- never by reading el.value back once
         the child is gone. jelly-select re-derives through a MutationObserver,
         which fires asynchronously, so a read straight after remove() races it:
         measured, the pills came back with nothing pressed while the trigger
         and the host attribute had both settled on the right option. */
      const wasSelected = el.value === gone;
      opt.remove();
      const pill = value.querySelector('.pill[data-value="' + CSS.escape(gone) + '"]');
      if (pill) pill.remove();
      let keep = wasSelected ? '' : el.value;
      if (wasSelected) {
        const first = el.querySelector('jelly-option');
        if (first) {
          keep = first.getAttribute('value') || first.textContent.trim();
          el.value = keep;
        }
      }
      value.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === keep)));
      snippet();
      return true;
    }

    /* Enter, on the host: jelly-input's keydown crosses the shadow boundary
       composed, so there is no need to reach inside for the real input. */
    add.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (addOption(add.value)) add.value = '';
    });
    del.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (removeOption(del.value)) del.value = '';
    });

    /* Two observed attributes that draw nothing by themselves. Empty removes
       rather than setting an empty string, so the snippet never prints
       label="" -- and an empty placeholder is how you see the component's own
       fallback rather than ours. */
    const attrField = (field, name) => {
      const apply = () => {
        const v = field.value == null ? '' : String(field.value).trim();
        if (v) el.setAttribute(name, v); else el.removeAttribute(name);
        snippet();
      };
      field.addEventListener('input', apply);
      field.addEventListener('change', apply);
      field.value = el.getAttribute(name) || '';
    };
    attrField(lbl, 'label');
    attrField(ph, 'placeholder');

    snippet();
  }

  /* SLIDER, RANGE AND TEXTAREA share one shape: a pill row per attribute, one
     specimen, and a snippet rebuilt from the element after every change.

     None of the three gets a control for its own VALUE. On a slider and a
     range the specimen is already the value control -- drag a knob, or focus
     and use the arrows -- and on a textarea a one-line input would be the
     wrong shape for a multi-line field. In all three the snippet listens to
     the component's own `input` event instead, so the code follows the
     specimen however the value got there. */

  /* One pill row, delegated. Shared by the three wirings below rather than
     written out three times. */
  function pillRow(root, onPick, after) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.pill');
      if (!b) return;
      root.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === b.dataset.value)));
      onPick(b.dataset.value);
      /* Optional, and it matters: this runs INSIDE the click handler, so a
         missing `after` threw a TypeError that aborted the rest of the
         handler. The visible symptom was a row that moved the component but
         left the snippet stale -- which reads as a snippet bug, not a wiring
         one. Caught on the chip, whose selected row passed two arguments. */
      if (after) after();
    });
  }

  function wireSliderDemo() {
    const el = document.getElementById('sld-demo');
    const step = document.getElementById('sld-step');
    const size = document.getElementById('sld-size');
    const dis = document.getElementById('sld-disabled');
    if (!el || !step || !size || !dis || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-13 .code code');
      if (!box) return;
      const a = [];
      /* el.value, not the attribute: jelly-slider does not reflect a dragged
         value back to the attribute, so reading getAttribute would print the
         number the element was born with. The same trap the select had. */
      a.push('value="' + el.value + '"');
      const st = el.getAttribute('step');
      if (st && st !== '1') a.push('step="' + st + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      box.textContent = '<jelly-slider ' + a.join(' ') + '></jelly-slider>';
    }

    pillRow(step, (v) => el.setAttribute('step', v), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    pillRow(dis, (v) => el.toggleAttribute('disabled', v === 'true'), snippet);
    el.addEventListener('input', snippet);
    el.addEventListener('change', snippet);
    snippet();
  }

  function wireRangeDemo() {
    const el = document.getElementById('rng-demo');
    const step = document.getElementById('rng-step');
    const size = document.getElementById('rng-size');
    const dis = document.getElementById('rng-disabled');
    if (!el || !step || !size || !dis || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-10 .code code');
      if (!box) return;
      /* THERE IS NO .low OR .high. jelly-range exposes ONE accessor, `value`,
         and it returns the pair as a comma string -- "150,750" -- so reading
         el.low printed undefined into the snippet. Checked against the
         prototype's own accessors rather than guessed a second time.

         The attributes are the fallback, not the source: like the slider, a
         dragged knob does not write back to them. */
      const pair = String(el.value == null ? '' : el.value).split(',');
      const low = (pair[0] || el.getAttribute('low') || '').trim();
      const high = (pair[1] || el.getAttribute('high') || '').trim();
      /* min and max are always printed: they are the scale the interval is
         measured on, and low/high mean nothing without them. */
      const a = ['min="' + (el.getAttribute('min') || '0') + '"',
                 'max="' + (el.getAttribute('max') || '100') + '"',
                 'low="' + low + '"',
                 'high="' + high + '"'];
      const st = el.getAttribute('step');
      if (st && st !== '1') a.push('step="' + st + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      box.textContent = '<jelly-range ' + a.join(' ') + '></jelly-range>';
    }

    pillRow(step, (v) => el.setAttribute('step', v), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    pillRow(dis, (v) => el.toggleAttribute('disabled', v === 'true'), snippet);
    el.addEventListener('input', snippet);
    el.addEventListener('change', snippet);
    snippet();
  }

  function wireTextareaDemo() {
    const el = document.getElementById('ta-demo');
    const ph = document.getElementById('ta-placeholder');
    const rows = document.getElementById('ta-rows');
    const size = document.getElementById('ta-size');
    const dis = document.getElementById('ta-disabled');
    const ro = document.getElementById('ta-readonly');
    if (!el || !ph || !rows || !size || !dis || !ro || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-15 .code code');
      if (!box) return;
      const a = [];
      if (el.getAttribute('placeholder')) a.push('placeholder="' + el.getAttribute('placeholder') + '"');
      /* rows 2 is Jelly's own default -- measured: an element with no rows
         attribute reports rows 2 on its inner textarea -- so printing it would
         document an attribute that changes nothing. */
      const rw = el.getAttribute('rows');
      if (rw && rw !== '2') a.push('rows="' + rw + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.value) a.push('value="' + el.value + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      if (el.hasAttribute('readonly')) a.push('readonly');
      box.textContent = '<jelly-textarea' + (a.length ? ' ' + a.join(' ') : '') + '></jelly-textarea>';
    }

    const applyPh = () => {
      const v = ph.value == null ? '' : String(ph.value);
      if (v) el.setAttribute('placeholder', v); else el.removeAttribute('placeholder');
      snippet();
    };
    ph.addEventListener('input', applyPh);
    ph.addEventListener('change', applyPh);

    pillRow(rows, (v) => el.setAttribute('rows', v), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    pillRow(dis, (v) => el.toggleAttribute('disabled', v === 'true'), snippet);
    pillRow(ro, (v) => el.toggleAttribute('readonly', v === 'true'), snippet);
    el.addEventListener('input', snippet);
    el.addEventListener('change', snippet);
    snippet();
  }

  function wireCheckboxDemo() {
    const el = document.getElementById('cb-demo');
    const chk = document.getElementById('cb-checked');
    const ind = document.getElementById('cb-indeterminate');
    const size = document.getElementById('cb-size');
    const dis = document.getElementById('cb-disabled');
    if (!el || !chk || !ind || !size || !dis || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-04 .code code');
      if (!box) return;
      const a = [];
      /* Read the ELEMENT, not the pills. A click on the specimen clears
         indeterminate and sets checked -- native behaviour, measured here too
         -- so a snippet built from what was last clicked in the controls would
         print a state the box no longer has. */
      if (el.checked) a.push('checked');
      if (el.indeterminate) a.push('indeterminate');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      box.textContent = '<jelly-checkbox' + (a.length ? ' ' + a.join(' ') : '')
        + '>Subscribe to updates</jelly-checkbox>';
    }

    /* Push the element's real state back into both rows. The case that needs
       it is a click on the specimen: that clears indeterminate, and without
       this the indeterminate=true pill would stay lit for a state the box has
       already dropped -- the controls lying about the thing they drive.

       Setting the two through the properties does NOT drop either; a box holds
       both at once, as a native input does. Verified both ways round. */
    function sync() {
      const set = (root, on) => root.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String((p.dataset.value === 'true') === on)));
      set(chk, !!el.checked);
      set(ind, !!el.indeterminate);
      snippet();
    }

    pillRow(chk, (v) => { el.checked = v === 'true'; }, sync);
    pillRow(ind, (v) => { el.indeterminate = v === 'true'; }, sync);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    /* toggleAttribute, not the property: jelly-checkbox defines accessors for
       checked, indeterminate and value -- and not for disabled. */
    pillRow(dis, (v) => el.toggleAttribute('disabled', v === 'true'), snippet);
    /* Clicking the specimen is a real way to change it, so the rows follow. */
    el.addEventListener('change', sync);

    sync();
  }

  function wireLabelDemo() {
    const el = document.getElementById('lb-demo');
    const req = document.getElementById('lb-required');
    const size = document.getElementById('lb-size');
    if (!el || !req || !size || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-06 .code code');
      if (!box) return;
      const a = [];
      if (el.hasAttribute('required')) a.push('required');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      box.textContent = '<jelly-label' + (a.length ? ' ' + a.join(' ') : '')
        + '>Email address</jelly-label>';
    }

    /* toggleAttribute, not a property: jelly-label observes for, required and
       size, and defines an accessor for none of them. */
    pillRow(req, (v) => el.toggleAttribute('required', v === 'true'), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    snippet();
  }

  function wireSwitchDemo() {
    const el = document.getElementById('sw-demo');
    const chk = document.getElementById('sw-checked');
    const size = document.getElementById('sw-size');
    const dis = document.getElementById('sw-disabled');
    if (!el || !chk || !size || !dis || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-14 .code code');
      if (!box) return;
      const a = [];
      /* el.checked, not the attribute: dragging the thumb does not write one,
         so the snippet would print the state it loaded with. */
      if (el.checked) a.push('checked');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      box.textContent = '<jelly-switch' + (a.length ? ' ' + a.join(' ') : '')
        + '>Notifications</jelly-switch>';
    }

    /* The specimen is workable by hand -- click, drag, or space -- so the
       checked row is pushed back from the element rather than assumed from
       whichever pill was last pressed. */
    function sync() {
      chk.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String((p.dataset.value === 'true') === !!el.checked)));
      snippet();
    }

    pillRow(chk, (v) => { el.checked = v === 'true'; }, sync);
    /* SIZE NEEDS A RE-CONNECT, and this is the component, not the page.
       jelly-switch observes `size` and updates its own sizeKey, but it reads
       the track geometry once and does not rebuild it: measured, the attribute
       and sizeKey both went small / large / medium while trackSize stayed
       48x24 throughout. Elements built with a size before being connected are
       correct -- 40x20 / 48x24 / 64x32 -- so the geometry is settled on
       connect and never revisited.

       Re-appending the SAME node runs disconnected then connected again, and
       the track is rebuilt. It stays the same element, so every listener above
       survives, and `checked` survives with it -- both verified rather than
       assumed. Without this the row would move a number nobody can see, which
       is the one thing a control row must never do. */
    pillRow(size, (v) => {
      el.setAttribute('size', v);
      if (el.parentElement) el.parentElement.appendChild(el);
    }, snippet);
    /* toggleAttribute: jelly-switch defines accessors for checked and value,
       and not for disabled. */
    pillRow(dis, (v) => el.toggleAttribute('disabled', v === 'true'), snippet);
    el.addEventListener('change', sync);

    sync();
  }

  function wireRadioGroupDemo() {
    const el = document.getElementById('rg-demo');
    const lbl = document.getElementById('rg-label');
    const dir = document.getElementById('rg-direction');
    const size = document.getElementById('rg-size');
    if (!el || !lbl || !dir || !size || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-09 .code code');
      if (!box) return;
      const a = [];
      if (el.getAttribute('label')) a.push('label="' + el.getAttribute('label') + '"');
      /* horizontal is the component's default -- measured, a group with no
         direction lays out the same as one set to horizontal -- so only the
         other value is worth printing. */
      const d = el.getAttribute('direction');
      if (d && d !== 'horizontal') a.push('direction="' + d + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      /* Built from the radios that are actually slotted, so the snippet cannot
         drift from the specimen. */
      const lines = ['<jelly-radio-group' + (a.length ? ' ' + a.join(' ') : '') + '>'];
      el.querySelectorAll('jelly-radio').forEach((r) => {
        const at = ['name="type"', 'value="' + r.getAttribute('value') + '"'];
        if (r.checked) at.push('checked');
        lines.push('  <jelly-radio ' + at.join(' ') + '>' + r.textContent.trim() + '</jelly-radio>');
      });
      lines.push('</jelly-radio-group>');
      box.textContent = lines.join('\n');
    }

    const applyLabel = () => {
      const v = lbl.value == null ? '' : String(lbl.value);
      if (v) el.setAttribute('label', v); else el.removeAttribute('label');
      snippet();
    };
    lbl.addEventListener('input', applyLabel);
    lbl.addEventListener('change', applyLabel);

    pillRow(dir, (v) => el.setAttribute('direction', v), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    /* Picking a radio changes which one carries `checked`, and the snippet
       prints that, so it has to follow the group rather than only the pills. */
    el.addEventListener('change', snippet);

    snippet();
  }

  /* Entry 29. The bar is a jelly-segmented inside jelly-tabs' shadow root, so
     everything the segmented wiring knows applies -- but nothing here reaches
     into that shadow: `value` and `size` are host attributes and the component
     forwards them down itself. */
  /* Entry 30. Seven rows, the most of any entry, because jelly-chip has the
     widest attribute surface in the library. */
  /* Entries 31 and 32. */
  /* Entries 33 to 38. */

  /* Entries 39 to 41 -- the three child elements. Each one renders nothing of
     its own, so every specimen here is the PARENT and the rows drive one child
     inside it. */

  function wireCardDemo() {
    const el = document.getElementById('cd-demo');
    const squish = document.getElementById('cd-squish');
    const size = document.getElementById('cd-size');
    if (!el || !squish || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const snippet = () => {
      const box = document.querySelector('#c-33 .code code');
      if (!box) return;
      const a = [];
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('squish')) a.push('squish');
      box.textContent = '<jelly-card' + (a.length ? ' ' + a.join(' ') : '') + '>\n'
        + '  <b>Bay 4</b>\n'
        + '  Climate controlled \u00b7 12 m\u00b2 \u00b7 150.000 KWD monthly.\n'
        + '</jelly-card>';
    };
    pillRow(squish, (v) => el.toggleAttribute('squish', v === 'true'), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    snippet();
  }

  function wireDividerDemo() {
    const el = document.getElementById('dv-demo');
    const dir = document.getElementById('dv-direction');
    const size = document.getElementById('dv-size');
    const field = document.getElementById('dv-content');
    if (!el || !dir || !size || !field || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const snippet = () => {
      const box = document.querySelector('#c-34 .code code');
      if (!box) return;
      const a = [];
      const d = el.getAttribute('direction');
      if (d && d !== 'horizontal') a.push('direction="' + d + '"');
      const c = el.getAttribute('content');
      if (c) a.push('content="' + c + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      box.textContent = '<jelly-divider' + (a.length ? ' ' + a.join(' ') : '')
        + '></jelly-divider>';
    };
    /* horizontal is the default, so it is the absence of the attribute. */
    pillRow(dir, (v) => {
      if (v === 'vertical') el.setAttribute('direction', 'vertical');
      else el.removeAttribute('direction');
    }, snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    /* `content` is an attribute, not a slot, so an empty field means remove it
       rather than set it to an empty string -- Jelly draws the gap either way,
       but the snippet should not print content="". */
    const apply = () => {
      const v = field.value == null ? '' : String(field.value).trim();
      if (v) el.setAttribute('content', v); else el.removeAttribute('content');
      snippet();
    };
    field.addEventListener('input', apply);
    field.addEventListener('change', apply);
    snippet();
  }

  function wireResizableDemo() {
    const el = document.getElementById('rz-demo');
    const dir = document.getElementById('rz-direction');
    if (!el || !dir || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const snippet = () => {
      const box = document.querySelector('#c-35 .code code');
      if (!box) return;
      const d = el.getAttribute('direction');
      box.textContent = '<jelly-resizable' + (d ? ' direction="' + d + '"' : '') + '>\n'
        + '  <div>Bays</div>\n'
        + '  <div>Payments</div>\n'
        + '  <div>Invoices</div>\n'
        + '</jelly-resizable>';
    };
    /* `row` is the default and the component spells it as the ABSENCE of the
       attribute, so the pill removes it rather than setting direction="row" --
       a value the component does not recognise and would silently ignore. */
    pillRow(dir, (v) => {
      if (v === 'row') el.removeAttribute('direction');
      else el.setAttribute('direction', v);
    }, snippet);
    snippet();
  }

  function wirePaginationDemo() {
    const el = document.getElementById('pg-demo');
    const total = document.getElementById('pg-total');
    const size = document.getElementById('pg-size');
    if (!el || !total || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const snippet = () => {
      const box = document.querySelector('#c-36 .code code');
      if (!box) return;
      const a = ['total="' + (el.getAttribute('total') || '1') + '"',
                 'page="' + (el.page || 1) + '"'];
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      box.textContent = '<jelly-pagination ' + a.join(' ') + '></jelly-pagination>';
    };
    /* Clicking a number moves the page, so the snippet is re-read on `change`
       rather than tracked from the rows. Lowering `total` below the current
       page also moves it, which is the other reason not to assume. */
    pillRow(total, (v) => el.setAttribute('total', v), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    el.addEventListener('change', snippet);
    snippet();
  }

  function wireBreadcrumbsDemo() {
    const el = document.getElementById('bc-demo');
    const size = document.getElementById('bc-size');
    if (!el || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const snippet = () => {
      const box = document.querySelector('#c-37 .code code');
      if (!box) return;
      const sz = el.getAttribute('size');
      const lines = ['<jelly-breadcrumbs' + (sz && sz !== 'medium' ? ' size="' + sz + '"' : '') + '>'];
      /* Printed from the light dom, so the last crumb shows as the span it is
         -- that distinction is the component's whole convention. */
      [...el.children].forEach((c) => {
        lines.push(c.tagName === 'A'
          ? '  <a href="' + (c.getAttribute('href') || '#') + '">' + c.textContent.trim() + '</a>'
          : '  <span>' + c.textContent.trim() + '</span>');
      });
      lines.push('</jelly-breadcrumbs>');
      box.textContent = lines.join('\n');
    };
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    snippet();
  }

  function wireKbdDemo() {
    const el = document.getElementById('kb-demo');
    const key = document.getElementById('kb-key');
    const size = document.getElementById('kb-size');
    if (!el || !key || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const CAP = { Escape: 'Esc', Enter: 'Enter', '/': '/' };
    const snippet = () => {
      const box = document.querySelector('#c-38 .code code');
      if (!box) return;
      const a = ['key="' + (el.getAttribute('key') || '') + '"'];
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      box.textContent = '<jelly-kbd ' + a.join(' ') + '>' + el.textContent.trim() + '</jelly-kbd>';
    };
    /* The cap text follows the key, because a cap reading "Esc" bound to Enter
       would be a lie about what the component does. */
    pillRow(key, (v) => { el.setAttribute('key', v); el.textContent = CAP[v] || v; }, snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    snippet();
  }

  function wireCollapsibleDemo() {
    const el = document.getElementById('col-demo');
    const open = document.getElementById('col-open');
    const size = document.getElementById('col-size');
    if (!el || !open || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    function snippet() {
      const box = document.querySelector('#c-31 .code code');
      if (!box) return;
      const a = [];
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.open) a.push('open');
      /* The header is a SLOT. jelly-collapsible has no label attribute --
         see the entry; one shipped and every header read "Details". */
      box.textContent = '<jelly-collapsible' + (a.length ? ' ' + a.join(' ') : '') + '>\n'
        + '  <span slot="header">Payment details</span>\n'
        + '  Bay 4 · monthly.\n'
        + '</jelly-collapsible>';
    }

    /* The header is clickable, so the row is pushed back from the component's
       own `toggle` event rather than assumed from the last pill. */
    function sync() {
      open.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String((p.dataset.value === 'true') === el.open)));
      snippet();
    }

    /* The PROPERTY, not the attribute: the setter animates the panel height.
       Setting the attribute by hand skips the animation and the panel jumps. */
    pillRow(open, (v) => { el.open = (v === 'true'); }, sync);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    el.addEventListener('toggle', sync);

    sync();
  }

  function wireAccordionDemo() {
    const el = document.getElementById('acc-demo');
    const single = document.getElementById('acc-single');
    const size = document.getElementById('acc-size');
    if (!el || !single || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    function snippet() {
      const box = document.querySelector('#c-32 .code code');
      if (!box) return;
      const a = [];
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('single')) a.push('single');
      const lines = ['<jelly-accordion' + (a.length ? ' ' + a.join(' ') : '') + '>'];
      el.querySelectorAll('jelly-collapsible').forEach((c) => {
        const head = c.querySelector('[slot="header"]');
        lines.push('  <jelly-collapsible' + (c.open ? ' open' : '') + '>'
          + '<span slot="header">' + (head ? head.textContent.trim() : '') + '</span>'
          + '...</jelly-collapsible>');
      });
      lines.push('</jelly-accordion>');
      box.textContent = lines.join('\n');
    }

    pillRow(single, (v) => el.toggleAttribute('single', v === 'true'), snippet);
    /* size forwards to the children, so one row moves all three items. */
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    /* `toggle` bubbles from the collapsibles, and with `single` set the
       accordion closes the others in response -- so the snippet has to be
       re-read from the items rather than tracked. */
    el.addEventListener('toggle', () => setTimeout(snippet, 0));

    snippet();
  }

  function wireChipDemo() {
    const el = document.getElementById('cp-demo');
    const rows = ['tone','selected','selectable','removable','shape','size','disabled']
      .reduce((a, k) => (a[k] = document.getElementById('cp-' + k), a), {});
    if (!el || Object.values(rows).some((r) => !r) || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    function snippet() {
      const box = document.querySelector('#c-30 .code code');
      if (!box) return;
      const a = [];
      const tone = el.getAttribute('tone');
      if (tone && tone !== 'primary') a.push('tone="' + tone + '"');
      const shape = el.getAttribute('shape');
      if (shape) a.push('shape="' + shape + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      /* Bare attributes last, in the order Jelly reads them. */
      ['selectable','removable','selected','disabled'].forEach((k) => {
        if (el.hasAttribute(k)) a.push(k);
      });
      box.textContent = '<jelly-chip' + (a.length ? ' ' + a.join(' ') : '') + '>'
        + el.textContent.trim() + '</jelly-chip>';
    }

    /* The chip toggles ITSELF when selectable -- clicking it fires `change` --
       so the selected row is pushed back from the element rather than assumed.
       Same reason the segmented and tabs rows are. */
    function sync() {
      rows.selected.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed',
          String((p.dataset.value === 'true') === el.hasAttribute('selected'))));
      snippet();
    }

    pillRow(rows.tone, (v) => el.setAttribute('tone', v), snippet);
    /* toggleAttribute for all four booleans: `selected` has a property but the
       other three do not, and one shape for all of them is easier to trust. */
    pillRow(rows.selected,   (v) => el.toggleAttribute('selected', v === 'true'), sync);
    pillRow(rows.selectable, (v) => el.toggleAttribute('selectable', v === 'true'), snippet);
    pillRow(rows.removable,  (v) => el.toggleAttribute('removable',  v === 'true'), snippet);
    pillRow(rows.disabled,   (v) => el.toggleAttribute('disabled',   v === 'true'), snippet);
    /* `round` is the absence of shape, not a value Jelly knows. */
    pillRow(rows.shape, (v) => {
      if (v === 'square') el.setAttribute('shape', 'square');
      else el.removeAttribute('shape');
    }, snippet);
    pillRow(rows.size, (v) => el.setAttribute('size', v), snippet);

    el.addEventListener('change', sync);
    /* The chip removes itself from the layout on `remove`, which would leave
       the stage empty and every row pointing at nothing. Cancel it: this is a
       specimen, and the removable row is here to show the affordance, not to
       demonstrate deletion. */
    el.addEventListener('remove', (e) => e.preventDefault());

    sync();
  }

  function wireTabsDemo() {
    const el = document.getElementById('tb-demo');
    const val = document.getElementById('tb-value');
    const size = document.getElementById('tb-size');
    if (!el || !val || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    function snippet() {
      const box = document.querySelector('#c-29 .code code');
      if (!box) return;
      const sz = el.getAttribute('size');
      const attrs = (sz && sz !== 'medium') ? ' size="' + sz + '"' : '';
      const lines = ['<jelly-tabs' + attrs + '>'];
      /* `active` is printed on the panel the component currently reports, not
         the one that carried it in the markup -- switching tabs moves it. */
      el.querySelectorAll('jelly-tab-panel').forEach((p, i) => {
        const v = p.getAttribute('value') || String(i);
        lines.push('  <jelly-tab-panel value="' + v + '" label="'
          + (p.getAttribute('label') || '') + '"'
          + (v === el.value ? ' active' : '') + '>...</jelly-tab-panel>');
      });
      lines.push('</jelly-tabs>');
      box.textContent = lines.join('\n');
    }

    /* Clicking a tab moves the selection, so the value row is pushed back from
       the element instead of trusting the last pill pressed. */
    function sync() {
      val.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === el.value)));
      snippet();
    }

    /* The PROPERTY, not the attribute: the setter moves the inner segmented and
       runs the panel swap. Setting the attribute alone routes through
       syncValue(), which is a no-op when the host attribute already matches the
       current panel -- true after any click, so the row would go dead. */
    pillRow(val, (v) => { el.value = v; }, sync);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    el.addEventListener('change', sync);

    sync();
  }

  function wireSegmentedDemo() {
    const el = document.getElementById('sg-demo');
    const val = document.getElementById('sg-value');
    const size = document.getElementById('sg-size');
    const dis = document.getElementById('sg-disabled');
    if (!el || !val || !size || !dis || el.dataset.wired) return;
    el.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-11 .code code');
      if (!box) return;
      const a = [];
      /* Printed because the specimen carries it -- it is the group's accessible
         name. There is no row for it; see the entry note. */
      if (el.getAttribute('label')) a.push('label="' + el.getAttribute('label') + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      if (el.hasAttribute('disabled')) a.push('disabled');
      /* `selected` is printed onto the segment the component reports, not the
         one that started with the attribute -- clicking moves the selection
         without rewriting anyone's markup. */
      const lines = ['<jelly-segmented' + (a.length ? ' ' + a.join(' ') : '') + '>'];
      el.querySelectorAll('jelly-segment').forEach((sg) => {
        const v = sg.getAttribute('value');
        lines.push('  <jelly-segment value="' + v + '"' + (v === el.value ? ' selected' : '')
          + '>' + sg.textContent.trim() + '</jelly-segment>');
      });
      lines.push('</jelly-segmented>');
      box.textContent = lines.join('\n');
    }

    /* Clicking a segment is the obvious way to move the selection, so the value
       row is pushed back from the element rather than assumed from the pills.
       It has to be: `change` fires only on a user selection, never on a
       scripted .value, so nothing else would keep the row honest. */
    function sync() {
      val.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === el.value)));
      snippet();
    }

    pillRow(val, (v) => { el.value = v; }, sync);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    /* toggleAttribute: jelly-segmented defines accessors for value, isTablist
       and stateAttribute -- not for disabled. */
    pillRow(dis, (v) => el.toggleAttribute('disabled', v === 'true'), snippet);
    el.addEventListener('change', sync);

    sync();
  }

  function wireThemeSwitchDemo() {
    const el = document.getElementById('ts-demo');
    const geom = document.getElementById('ts-geom');
    const mode = document.getElementById('ts-mode');
    if (!el || !geom || !mode || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const sw = el.querySelector('jelly-switch');

    function snippet() {
      const box = document.querySelector('#c-16 .code code');
      if (!box || !sw) return;
      /* The whole composition is the snippet -- a lone jelly-switch would not
         reproduce this, which is why the markup carries data-snippet-root. The
         geometry rides on data-size, so it is printed where the reader would
         type it. */
      const lines = [
        '<span class="theme-switch" data-theme-switch data-size="' + (el.dataset.size || 'desktop') + '">',
        '  <jelly-switch aria-label="Theme"' + (sw.checked ? ' checked' : '') + '></jelly-switch>',
        '  <svg class="mi mi-moon"><use href="#mi-moon"/></svg>',
        '  <svg class="mi mi-sun"><use href="#mi-sun"/></svg>',
        '</span>'];
      box.textContent = lines.join('\n');
    }

    /* Checked is LIGHT -- the drawing rests the thumb at the start for dark and
       at the end for light, and in an LTR page the start is unchecked. */
    function sync() {
      const light = !!(sw && sw.checked);
      mode.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String((p.dataset.value === 'light') === light)));
      snippet();
    }

    /* GEOMETRY NEEDS A RE-CONNECT, for the same reason entry 14's size row does.
       The three platform sizes are --jelly-switch-width/height, set by
       .theme-switch[data-size] in the bridge, and jelly-switch reads them once
       on connect: measured, all three geometries rendered 80x49 while the
       attribute changed underneath. Re-appending the switch runs disconnected
       then connected and it picks the new pair up. Same node, so the theme
       wiring and its listeners survive. */
    pillRow(geom, (v) => {
      el.dataset.size = v;
      if (sw && sw.parentElement) sw.parentElement.insertBefore(sw, sw.parentElement.firstChild);
    }, snippet);
    pillRow(mode, (v) => { if (sw) { sw.checked = v === 'light'; sw.dispatchEvent(new Event('change', {bubbles: true})); } }, sync);
    if (sw) sw.addEventListener('change', sync);

    sync();
  }

  /* One sentence per tone, so each still fires the message it was written for
     rather than a single generic string across all four. */
  const TOAST_MESSAGE = {
    info:    'List updated',
    success: 'Payment saved',
    warning: 'Exchange rate is stale',
    danger:  'Could not save'
  };

  function wireToastDemo() {
    const el = document.getElementById('tst-demo');
    const tone = document.getElementById('tst-tone');
    if (!el || !tone || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    function snippet() {
      const box = document.querySelector('#c-17 .code code');
      if (!box) return;
      /* The CALL, not the button. jelly-button is not an entry in this library
         and printing it would document page furniture. */
      box.textContent = "jellyToast('" + el.dataset.toast + "', { tone: '"
        + el.dataset.tone + "' });";
    }

    /* data-tone recolours the trigger through .toast-trigger[data-tone] in the
       bridge, and data-toast is read by wireToasts at CLICK time -- so moving
       the dataset is the whole update, with no re-binding. */
    pillRow(tone, (v) => {
      el.dataset.tone = v;
      el.dataset.toast = TOAST_MESSAGE[v] || el.dataset.toast;
    }, snippet);

    snippet();
  }

  /* The three remaining overlays. Each specimen is a TRIGGER, so the rows drive
     the thing it opens rather than the button itself, and the snippet prints
     the component the reader would type. */

  function wirePopoverDemo() {
    const el = document.getElementById('pop-demo');
    const row = document.getElementById('pop-placement');
    if (!el || !row || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';
    const snippet = () => {
      const box = document.querySelector('#c-20 .code code');
      if (!box) return;
      box.textContent = '<jelly-popover placement="' + (el.getAttribute('placement') || 'bottom') + '">\n'
        + '  <jelly-button slot="trigger">Exchange rate</jelly-button>\n'
        + '  <div slot="content">1 USD = 0.3065 KWD</div>\n'
        + '</jelly-popover>';
    };
    pillRow(row, (v) => el.setAttribute('placement', v), snippet);
    snippet();
  }

  function wireTooltipDemo() {
    const el = document.getElementById('tip-demo');
    const field = document.getElementById('tip-text');
    const place = document.getElementById('tip-placement');
    const size = document.getElementById('tip-size');
    if (!el || !field || !place || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    const snippet = () => {
      const box = document.querySelector('#c-21 .code code');
      if (!box) return;
      const a = ['text="' + (el.getAttribute('text') || '') + '"'];
      /* top is the default -- show() falls back to it when the attribute is
         absent -- so printing it would document a no-op. */
      const p = el.getAttribute('placement');
      if (p && p !== 'top') a.push('placement="' + p + '"');
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      const lbl = el.querySelector('jelly-icon-button').getAttribute('label');
      box.textContent = '<jelly-tooltip ' + a.join(' ') + '>\n'
        + '  <jelly-icon-button label="' + lbl + '" size="large">\n'
        + '    <svg class="mi"><use href="#mi-ropeknot"/></svg>\n'
        + '  </jelly-icon-button>\n'
        + '</jelly-tooltip>';
    };

    /* The text names the control, so the button's accessible label follows it.
       Leaving them to drift would put one name in the bubble and another in the
       accessibility tree for the same button. */
    const apply = () => {
      const v = field.value == null ? '' : String(field.value);
      if (v) el.setAttribute('text', v); else el.removeAttribute('text');
      const btn = el.querySelector('jelly-icon-button');
      if (btn) btn.setAttribute('label', v || 'Copy payment link');
      snippet();
    };
    field.addEventListener('input', apply);
    field.addEventListener('change', apply);

    /* top is the absence of the attribute, the same shape the divider and the
       resizable use for their defaults. */
    pillRow(place, (v) => {
      if (v === 'top') el.removeAttribute('placement');
      else el.setAttribute('placement', v);
    }, snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);

    snippet();
  }

  function wireMenuDemo() {
    const el = document.getElementById('menu-demo');
    const place = document.getElementById('menu-placement');
    const size = document.getElementById('menu-size');
    if (!el || !place || !size || el.dataset.wiredCtl) return;
    el.dataset.wiredCtl = '1';

    /* Built from the items that are actually slotted, so the snippet cannot
       drift from the specimen -- it used to print two rows while three were on
       screen. */
    const snippet = () => {
      const box = document.querySelector('#c-22 .code code');
      if (!box) return;
      const a = ['placement="' + (el.getAttribute('placement') || 'bottom') + '"'];
      const sz = el.getAttribute('size');
      if (sz && sz !== 'medium') a.push('size="' + sz + '"');
      const lines = ['<jelly-menu ' + a.join(' ') + '>',
                     '  <jelly-button slot="trigger">'
                       + el.querySelector('[slot="trigger"]').textContent.trim()
                       + '</jelly-button>'];
      el.querySelectorAll('jelly-menu-item').forEach((it) => {
        const v = it.getAttribute('value');
        lines.push('  <jelly-menu-item' + (v ? ' value="' + v + '"' : '')
          + (it.hasAttribute('danger') ? ' danger' : '')
          + (it.hasAttribute('disabled') ? ' disabled' : '')
          + '>' + it.textContent.trim() + '</jelly-menu-item>');
      });
      lines.push('</jelly-menu>');
      box.textContent = lines.join('\n');
    };

    pillRow(place, (v) => el.setAttribute('placement', v), snippet);
    pillRow(size, (v) => el.setAttribute('size', v), snippet);
    snippet();
  }

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

     The control writes ONE thing, and that is the correction. Jelly sizes
     every shape itself -- line 220x16, square 220x88, circle 52x52 -- so
     setting the attribute is the whole job. This used to also write a
     data-shape for the stylesheet to size from, which overrode the component
     and made the control look inert.

     The value is `square`, not the `rect` of Jelly's newer documentation:
     the build vendored here does not define rect. */
  function wireSkeletonDemo() {
    const spec = document.getElementById('skeleton-demo');
    const set  = document.getElementById('skeleton-shape');
    if (!spec || !set || set.dataset.wired) return;
    set.dataset.wired = '1';

    function snippet() {
      const box = document.querySelector('#c-27 .code code');
      if (!box) return;
      /* Read from the ATTRIBUTE. This used to read spec.dataset.shape, and
         data-shape was removed when the stylesheet stopped sizing the
         specimen -- so the snippet has been printing shape="undefined"
         ever since, on every shape including the one it loads with. */
      const v = spec.getAttribute('shape');
      /* `line` is the default, so the snippet shows the bare element for it --
         printing shape="line" would teach an attribute that does nothing. */
      /* shape is always printed: the base :host is 200x16 and each shape has
         its own box, so omitting it does not give you the line you are
         looking at. */
      box.textContent = '<jelly-skeleton shape="' + v + '"></jelly-skeleton>';
    }

    set.addEventListener('click', (e) => {
      const b = e.target.closest('.pill');
      if (!b) return;
      const v = b.dataset.value;
      set.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String(p.dataset.value === v)));

      /* Always set, never removed: every shape including `line` has its own
         box in Jelly's stylesheet, so an unset shape is a different size
         rather than the default one. */
      spec.setAttribute('shape', v);
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

    /* The `open` row, and the dialog closes ITSELF -- the x, Escape, both
       answers -- so the row is re-read from the element on every change rather
       than trusted to whichever pill was last pressed. */
    const openRow = document.getElementById('dlg-open-row');
    if (openRow) {
      const syncOpen = () => openRow.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed',
          String((p.dataset.value === 'true') === dlg.hasAttribute('open'))));
      pillRow(openRow, (v) => { dlg.open = (v === 'true'); }, syncOpen);
      new MutationObserver(syncOpen).observe(dlg, { attributes: true, attributeFilter: ['open'] });
      syncOpen();
    }

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
    const btn = document.getElementById('drw-open');
    const side = document.getElementById('drw-side');
    const openRow = document.getElementById('drw-open-row');
    if (!drw || !btn || !side || !openRow || drw.dataset.wiredCtl) return;
    drw.dataset.wiredCtl = '1';

    function snippet() {
      const box = document.querySelector('#c-19 .code code');
      if (!box) return;
      box.textContent =
        '<jelly-drawer side="' + (drw.getAttribute('side') || 'end') + '" label="Payment details">\n'
        + '  <h3>Payment details</h3>\n'
        + '  <p>Bay 4 \u00b7 150.000 KWD \u00b7 monthly.</p>\n'
        + '</jelly-drawer>\n\n'
        + 'drawer.open = true;   // side = start | end | bottom';
    }

    /* The drawer closes itself -- the scrim, the x, Escape -- so the row is
       pushed back from the element rather than assumed from the last pill. */
    function sync() {
      const isOpen = drw.hasAttribute('open');
      openRow.querySelectorAll('.pill').forEach(
        (p) => p.setAttribute('aria-pressed', String((p.dataset.value === 'true') === isOpen)));
      snippet();
    }

    /* start and end, not left and right. Jelly accepts all four, but the
       logical pair follows the writing direction and the physical pair does
       not -- and this library gets an RTL build later, where left would stay
       left and be wrong. */
    pillRow(side, (v) => drw.setAttribute('side', v), snippet);
    /* .open, the PROPERTY, on the way out: removing the attribute cuts the
       exit animation. */
    pillRow(openRow, (v) => { drw.open = (v === 'true'); }, snippet);
    btn.addEventListener('click', () => { drw.open = true; setTimeout(sync, 60); });

    /* No close event to listen for, so the attribute is watched instead. */
    new MutationObserver(sync).observe(drw, { attributes: true, attributeFilter: ['open'] });

    sync();
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
  /* ── Page direction ─────────────────────────────────────────────────────
     One attribute on <html> drives the whole page, and that is the entire
     retrofit. It works because of two things that were already true rather
     than anything added here:

       our css   carries NO physical properties -- audited, zero occurrences of
                 padding/margin/border-left|right, left:/right:, text-align
                 left|right or float across both stylesheets. Everything was
                 already written padding-inline, inset-inline-end, start/end.

       Jelly     resolves direction at RUNTIME, not at build time. Its helper is
                 getComputedStyle(node).direction === "rtl", called from 27
                 places -- the start/end placement resolver every overlay uses,
                 the drawer's slide origin, the OTP caret measurement, radio
                 keyboard nav, and the switch thumb's target and drag sign.

     So nothing had to be rebuilt. Setting dir is the lever both halves were
     already waiting for. */
  /* ARABIC FOR THE SPECIMENS, ENGLISH FOR THE PAGE. Flipping direction shows
     the layout mirrored; it does not show what the components will actually
     hold, which is Arabic. So RTL swaps the specimen strings too.

     WHERE THE APP ALREADY SAYS IT, THE APP'S WORDING IS USED VERBATIM rather
     than translated afresh -- نوع الدفعة, العملة, دينار كويتي, شهري,
     مرة واحدة, البريد الإلكتروني, أسعار الصرف, تعديل, جارٍ التحميل. The one
     place that rule is broken is quarterly, where the app's label does not fit
     the component -- see the note on it below. minaa-payments.html is the product's own voice and there is
     no reason for the library to invent a second one. The rest are new, and
     they are the ones worth a designer's eye.

     Numbers stay Western and money becomes د.ك, which is what the app does:
     "150.000 د.ك", not Arabic-Indic digits.

     The swap runs over the DEMO and over the CODE BLOCK. The snippets are
     rebuilt from the DOM by each entry's controller, so leaving them alone
     would have shown Arabic in the specimen and English in the markup beside
     it -- the one place a reader looks to copy what they just saw. */
  const AR = {
    "Theme mode": "وضع السمة",
    "mode": "الوضع",
    "accent": "اللون المميز",
    "auto": "تلقائي",
    "light": "فاتح",
    "dark": "داكن",
    "Accent": "اللون المميز",
    "Theme": "السمة",
    "Workspace controls": "عناصر التحكم",
    "Preview the scoped theme": "معاينة السمة",
    "Capacity": "السعة",
    "Utilisation": "الاستخدام",
    "Sync": "مزامنة",
    "Notifications": "الإشعارات",
    "Subscribe to updates": "الاشتراك في التحديثات",
    "Warehouse name": "اسم المخزن",
    "Your name": "اسمك",
    "Email address": "البريد الإلكتروني",
    "One-time code": "رمز التحقق",
    "Payment type": "نوع الدفعة",
    "Monthly": "شهري",
    /* ربع سنوي, NOT the app's own اشتراك / 3 أشهر. The app's label is 15
       characters and 2.87em of text in a segment that offers 2.82em -- it
       overflowed the track at every size, which is the bug this replaces. The
       component's geometry is fixed and the text is what gives way. It also
       makes the specimen agree with the controller, which already said
       ربع سنوي; the page used to show two different Arabic words for one value
       in the same row. Noting the divergence rather than hiding it:
       CLAUDE.md's Payment Types table still records اشتراك / 3 أشهر as the
       app's quarterly label, and that is untouched here. */
    "Quarterly": "ربع سنوي",
    "One-time": "مرة واحدة",
    "Recurring monthly": "شهري متكرر",
    "Every three months": "كل ثلاثة أشهر",
    "One-time payment": "دفعة واحدة",
    "Rent": "الإيجار",
    "Period": "الفترة",
    "Occupancy": "الإشغال",
    "Currency": "العملة",
    "Choose a currency": "اختر العملة",
    "Kuwaiti Dinar": "دينار كويتي",
    "US Dollar": "دولار أمريكي",
    "Euro": "يورو",
    "Note": "ملاحظة",
    "Anything the team should know": "أي شيء يجب أن يعرفه الفريق",
    "Show a toast": "إظهار تنبيه",
    "Delete payment": "حذف الدفعة",
    "Delete this payment?": "حذف هذه الدفعة؟",
    "Keep it": "الاحتفاظ بها",
    "Open the drawer": "فتح اللوحة",
    "Payment details": "تفاصيل الدفعة",
    "Rate detail": "تفاصيل السعر",
    "Exchange rate": "أسعار الصرف",
    "Copy payment link": "نسخ رابط الدفعة",
    "Payment actions": "إجراءات الدفعة",
    "Edit": "تعديل",
    "Duplicate": "تكرار",
    "Export as JSON": "تصدير JSON",
    "Budget used": "الميزانية المستخدمة",
    "Loading": "جارٍ التحميل",
    "Loading rates": "جاري تحميل أسعار الصرف",
    "Details": "التفاصيل",
    "Schedule": "الجدول",
    "History": "السجل",
    "Climate controlled": "مكيّف",
    "Bay 4": "الوحدة 4",
    "Bays": "الوحدات",
    "Payments": "الدفعات",
    "Invoices": "الفواتير",
    "Warehouse": "المخزن",
    "Bay 4 · 150.000 KWD. This cannot be undone.": "الوحدة 4 · 150.000 د.ك. لا يمكن التراجع عن هذا.",
    "Bay 4 · 150.000 KWD · monthly.": "الوحدة 4 · 150.000 د.ك · شهري.",
    "Bay 4 · monthly.": "الوحدة 4 · شهري.",
    "1 USD = 0.3065 KWD": "1 دولار = 0.3065 د.ك",
    "Fixed fallback. Live rates come from open.er-api.com.": "سعر ثابت احتياطي. الأسعار المباشرة من open.er-api.com.",
    "Rates last refreshed 4 minutes ago.": "آخر تحديث للأسعار قبل 4 دقائق.",
    "Bay 4 · climate controlled · 12 m², leased to Al-Kharafi Trading since March.": "الوحدة 4 · مكيّف · 12 م²، مؤجّرة لشركة الخرافي التجارية منذ مارس.",
    "Bay 4 · climate controlled · 12 m².": "الوحدة 4 · مكيّف · 12 م².",
    "150.000 KWD monthly, due on the 1st. Next charge 1 October.": "150.000 د.ك شهرياً، تستحق في الأول. الدفعة القادمة 1 أكتوبر.",
    "150.000 KWD monthly, due on the 1st.": "150.000 د.ك شهرياً، تستحق في الأول.",
    "Nine payments, none late. Last receipt INV-260801-004.": "تسع دفعات، لا تأخير. آخر إيصال INV-260801-004.",
    "Nine payments, none late.": "تسع دفعات، لا تأخير.",
    "Climate controlled · 12 m² · 150.000 KWD monthly.": "مكيّف · 12 م² · 150.000 د.ك شهرياً."
  };
  /* THE CONTROLLER'S OWN WORDS, kept in a SEPARATE map and never applied to a
     code block. These are the API: a pill reading صغير still carries
     data-value="small", and the snippet must keep printing size="small" or it
     stops being something a reader can copy. Running the content dictionary
     over the controls would have rewritten the code too.

     Deliberately NOT translated, because they are identifiers rather than
     words: the currency codes KWD / USD / EUR, every numeric pill, the key
     names Escape / Enter / "/", and the chip's tone names -- primary,
     secondary, neutral, mgreen, myellow, morange -- which are Minaa token
     names, not UI copy. Translating a token name would invent a second name
     for something the system already names once. */
  /* THE PROSE. Entry notes, category names, the masthead and the two captions
     that sit inside demos. Keyed by SECTION ID and swapped as innerHTML rather
     than by matching text, because a note is not a plain string: most carry
     inline <code> for the attribute they describe, and a whole-node match can
     never see past the first element boundary.

     API NAMES STAY LATIN inside the Arabic -- open, side, single, squish,
     total, page, length, size, for, indeterminate, jelly-segmented. That is
     what Arabic technical writing does, and it is the same rule the controller
     map follows: a word you would type stays the word you would type. */
  const AR_FACTS = {
    "Forms · 12 components": "النماذج · 12 مكوّناً",
    "1 theme switch": "مفتاح سمة واحد",
    "Overlays · 6 of 6": "الطبقات · 6 من 6",
    "Feedback · 6 of 6": "التغذية الراجعة · 6 من 6",
    "1 token bridge": "جسر رموز واحد",
    "3 forked tokens": "3 رموز متفرّعة",
    "Minaã Blue throughout": "أزرق ميناء في كل مكان"
  };

  const AR_NOTES = {
    "c-01": "المزوّد الذي يمنح كل مدخل آخر في هذه الصفحة هوية ميناء. يحدّد مجموعة الرموز الكاملة لشجرته الفرعية، والمكوّنات المرسومة على canvas تقرأ تلك الرموز وقت الرسم — ولهذا يُطبَّق الجسر هنا لا على <code>:root</code> وحده. الصفحة تعمل على auto، فتتبع نظام تشغيلك وتتبدّل مباشرة عند تغييره.",
    "c-04": "مربع اختيار مرتبط بالنموذج، بحالتَي محدَّد ومحدَّد جزئياً، مرسوم كمربع ليّن ينبض عند تبديله.",
    "c-05": "حقل نص من سطر واحد على سطح جيلي ليّن: التركيز يرفع الغشاء ويحيطه بحلقة، وكل ضغطة مفتاح تُحدث تموّجاً عند المؤشر.",
    "c-06": "تسمية نموذج تقترن بأي عنصر تحكم عبر <code>for</code>: النقر عليها يُركّز الهدف، ويصبح نصّها اسمه الوصفي.",
    "c-07": "مربع لكل رقم، مع معالجة الكتابة والمسح والأسهم واللصق. <code>length</code> و<code>size</code> مستقلّان. والوضع محدَّد النطاق داخل الكبسولة.",
    "c-08": "زر اختيار؛ الأزرار التي تشترك في <code>name</code> تحت الجذر نفسه تكوّن مجموعة، بتنقّل بالأسهم وtabindex متنقّل.",
    "c-09": "حاوية معنونة تحمل العنوان والتخطيط والحجم لأزرار الاختيار داخلها، بما فيها ما يُضاف لاحقاً.",
    "c-10": "مقبضان يحدّدان مجالاً بين حدٍّ أدنى وأعلى، لكلٍّ منهما تركيزه وARIA الخاص به، على مسار المنزلق ومقبضه ليُقرآ كعائلة واحدة.",
    "c-11": "مسار كبسولي لخيارات متنافية، بحبّة تنزلق وتميل وتتمدّد بين الأقسام. يُبلّغ عن قيمة فقط — وللنسخة التي تملك أيضاً المحتوى الذي تبدّله، انظر المدخل 29. <b>عرض كل قسم يساوي متوسّط عرض التسميات</b>، فالأطول دائماً أقلّها مساحة، وكلمة واحدة طويلة تُضيّق البقية. اجعل التسميات متقاربة في الطول — وثمانية أحرف تقريباً هي حدّ الراحة في العربية، وأقلّ منها في اللاتينية.",
    "c-12": "قائمة منسدلة مركّبة، مشغّلها ولوحتها سطحان ليّنان؛ تنفتح اللوحة من الحقل وتنقلب إلى أعلاه عند غياب المساحة أسفله.",
    "c-13": "قيمة واحدة على مسار، مدعومة بحقل range أصلي مخفي لتبقى تُرسل مع النموذج وتستجيب للوحة المفاتيح.",
    "c-14": "مفتاح قابل للسحب يتمدّد إبهامه كقطرة سائلة، بينما يتلاشى المسار بين وضعَي التشغيل والإيقاف.",
    "c-15": "نص متعدد الأسطر ينمو تلقائياً بين حدٍّ أدنى وأقصى بينما يتبعه الغشاء. نصف القطر 24 بدل كبسولة الحقل، لأن صندوقاً ينمو لا يمكن أن يبقى كبسولة.",
    "c-16": "<code>&lt;jelly-switch&gt;</code> بأبعاد Figma 253:26، يقود <code>&lt;jelly-theme&gt;</code> هذه الصفحة. المحدَّد هو الفاتح؛ والأيقونة تجلس في النصف الذي تركه الإبهام.",
    "c-17": "التنبيهات من صفحة الأزرار، تُطلَق عبر <code>jellyToast()</code>. النبرات الأربع دلالية، فهي متطابقة في الوضعين.",
    "c-18": "لوحة حوارية بخلفيتها الخاصة، تُفتح عبر <code>open</code>.",
    "c-19": "اللوحة الحوارية مستندة إلى حافة، و<code>side</code> تختار أيّها.",
    "c-20": "لوحة مربوطة بمشغّلها، على فتحتين مطلوبتين: <code>trigger</code> و<code>content</code>. وينقلب الموضع حين لا تتوفّر مساحة في الجهة المطلوبة.",
    "c-21": "تلميح عند المرور وعند التركيز. النص سمة، فلا يحمل أي ترميز.",
    "c-22": "قائمة إجراءات معلّقة على مشغّل.",
    "c-24": "شريط تنبيه على سطح جيلي، بأربع نبرات وزر إغلاق اختياري.",
    "c-25": "شارة أو وسم أو حبّة حالة صغيرة، تنبض كلما تغيّر نصّها.",
    "c-26": "شريط تقدّم تتموّج حافته الأمامية وهو يتقدّم؛ و<code>indeterminate</code> يُرسل كتلة ترتدّ من جدار إلى جدار.",
    "c-27": "عنصر نائب للتحميل يتنفّس بهدوء — اهتزاز جيلي ليّن بدل الوميض.",
    "c-28": "مؤشر تحميل بشكلين — نقاط لزجة، أو كتلة واحدة تتحوّل وهي تدور.",
    "c-29": "يبدّل بين مناطق المحتوى. الشريط هو <code>jelly-segmented</code> — المدخل 11 — واللوحات هي ما تضيفه التبويبات إليه.",
    "c-30": "كبسولة جيلي صغيرة: تسمية ثابتة، أو مرشّح قابل للتبديل، أو وسم قابل للإزالة. ست نبرات، مسمّاة بالألوان التي ترسمها.",
    "c-31": "رأس يفتح لوحة تحته. التسمية فتحة، فيمكنها أن تحمل أكثر من نص.",
    "c-32": "مكدّس من العناصر القابلة للطي. مع <code>single</code>، فتح واحدٍ يُغلق البقية.",
    "c-33": "سطح ليّن يجلس عليه المحتوى. ومع <code>squish</code> يتشوّه تحت الضغط.",
    "c-34": "خط فاصل بين الأشياء، مع كلمة موضوعة فيه اختيارياً. ويصبح عمودياً عبر <code>direction</code>.",
    "c-35": "ألواح يمكن للقارئ سحبها لتتباعد. كل ابنٍ لوح، والمقبض يقع بينها.",
    "c-36": "صفحات مرقّمة مع نقاط حذف حين تكثر. <code>total</code> و<code>page</code> يقودانها.",
    "c-37": "المسار للعودة إلى الأعلى. روابط في الفتحات للخطوات، ونص عادي للخطوة التي أنت عليها.",
    "c-38": "غطاء مفتاح. ينضغط عندما يُضغط المفتاح الذي يسمّيه فعلاً."
  };
  const AR_CATS = {
    "Theming": "السمات",
    "Forms": "النماذج",
    "Feedback": "التغذية الراجعة",
    "Overlays": "الطبقات",
    "Navigation": "التنقل",
    "Content": "المحتوى",
    "Disclosure": "الإفصاح",
    "Layout": "التخطيط"
  };
  const AR_MAST = {
    "eyebrow": "المكوّنات",
    "h1": "مكتبة المكوّنات",
    "p": "واجهة Jelly بهوية ميناء. كل عنصر تحكّم أدناه هو مكوّن Jelly الحقيقي، دون تعديل يُذكر — والهوية تأتي من جسر رموز واحد يستبدل لغة تصميم Jelly بلغتنا: أحد عشر رمزاً لونياً، ومقياس المسافات ذو الأربع عشرة خطوة، وخط 29LT Idris Round."
  };
  const AR_DEMO_NOTES = ["الإعدادات الثلاثة كلها ترسم بهوية ميناء الآن. <b>داكن</b> هو الطرف العميق من تدرّج Primary — 900 للحقل و950 للسطح — مع الكريمي حبراً؛ و<b>تلقائي</b> يتبع ما يستخدمه نظام تشغيلك. هذه المعاينة محدَّدة النطاق، فتغييرها هنا لا يمسّ بقية الصفحة.", "تُطلَق في <code>&lt;jelly-toaster&gt;</code> الوحيد في الصفحة، المثبَّت أسفل النهاية. وهو يحمل بالفعل <code>position=\"bottom\"</code>، وهو ما يجعل المكدّس ينمو إلى أعلى لا إلى أسفل."];

  const AR_UI = {
    "mode": "الوضع",
    "accent": "اللون المميز",
    "checked": "محدد",
    "indeterminate": "غير محدد",
    "size": "الحجم",
    "disabled": "معطّل",
    "placeholder": "النص البديل",
    "value": "القيمة",
    "type": "النوع",
    "readonly": "للقراءة فقط",
    "required": "مطلوب",
    "length": "الطول",
    "label": "التسمية",
    "direction": "الاتجاه",
    "step": "الخطوة",
    "rows": "الأسطر",
    "geometry": "الأبعاد",
    "tone": "النبرة",
    "open": "مفتوح",
    "side": "الجهة",
    "placement": "الموضع",
    "text": "النص",
    "dismissible": "قابل للإغلاق",
    "shape": "الشكل",
    "outline": "إطار خارجي",
    "live": "مباشر",
    "max": "الحد الأقصى",
    "selected": "محدد",
    "selectable": "قابل للتحديد",
    "removable": "قابل للإزالة",
    "single": "مفرد",
    "squish": "الانضغاط",
    "content": "المحتوى",
    "total": "الإجمالي",
    "key": "المفتاح",
    "false": "لا",
    "true": "نعم",
    "small": "صغير",
    "medium": "متوسط",
    "large": "كبير",
    "email": "بريد",
    "password": "كلمة مرور",
    "auto": "تلقائي",
    "light": "فاتح",
    "dark": "داكن",
    "vertical": "عمودي",
    "horizontal": "أفقي",
    "monthly": "شهري",
    "quarterly": "ربع سنوي",
    "onetime": "مرة واحدة",
    "android": "أندرويد",
    "desktop": "سطح المكتب",
    "ios": "آي أو إس",
    "info": "معلومة",
    "success": "نجاح",
    "warning": "تحذير",
    "danger": "خطر",
    "start": "البداية",
    "end": "النهاية",
    "top": "أعلى",
    "bottom": "أسفل",
    "pill": "كبسولة",
    "square": "مربع",
    "line": "خط",
    "circle": "دائرة",
    "dots": "نقاط",
    "blob": "كتلة",
    "round": "دائري",
    "row": "صف",
    "both": "كلاهما",
    "details": "التفاصيل",
    "schedule": "الجدول",
    "history": "السجل"
  };

  const AR_ATTRS = ['label', 'text', 'placeholder', 'aria-label'];
  /* Longest first: substring replacement inside code blocks depends on it. */
  const AR_KEYS = Object.keys(AR).sort((a, b) => b.length - a.length);

  /* Originals are kept on the node, not recomputed from a reverse lookup: two
     English strings can share an Arabic translation, so reversing the map
     would not round-trip. */
  /* jelly-tabs BUILDS ITS BAR ONCE, at connect, from its panels' `label`
     attributes -- documented in entry 29, and the reason its own deleted entry
     had needed a rebuild to change a label. Swapping the attribute therefore
     translated the PANEL and left the tab above it reading English. A fresh
     node is the only thing that re-reads, so the element is cloned and
     replaced, carrying the open panel across so the reader is not thrown back
     to the first tab.

     Every other component here re-reads on its own: jelly-segmented syncs from
     attributeChangedCallback, jelly-select through a MutationObserver,
     jelly-menu on each open, and a radio group's legend is an observed
     attribute. Tabs is the single exception. */
  function rebuildTabs() {
    document.querySelectorAll('jelly-tabs').forEach((tabs) => {
      if (!tabs.parentNode) return;
      const open = tabs.value;
      const fresh = tabs.cloneNode(true);
      fresh.querySelectorAll('jelly-tab-panel').forEach((p) => {
        p.toggleAttribute('active', p.getAttribute('value') === open);
      });
      tabs.parentNode.replaceChild(fresh, tabs);
    });
  }

  function swapDirectionText(toArabic) {
    const scopes = [...document.querySelectorAll('.demo, .code code')];
    scopes.forEach((scope) => {
      const walk = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
      let n;
      const nodes = [];
      while ((n = walk.nextNode())) nodes.push(n);
      nodes.forEach((node) => {
        if (node.parentElement && node.parentElement.closest('template')) return;
        /* .demo-note is DOCUMENTATION that happens to sit inside a demo -- the
           caption under entries 01 and 17. It is English prose with <b>dark</b>
           and <b>auto</b> inline, so whole-node matching translated those two
           words and left the sentence around them in English: "with cream as
           داكن. All three settings now paint Minaã." Prose is not specimen
           content, so it is skipped the same way a template is. */
        if (node.parentElement && node.parentElement.closest('.demo-note')) return;
        if (toArabic) {
          const raw = node.textContent;
          const key = raw.trim();
          if (AR[key]) {
            if (node.__en == null) node.__en = raw;
            node.textContent = raw.replace(key, AR[key]);
            return;
          }
          /* A CODE BLOCK IS ONE TEXT NODE holding the whole snippet, so a
             whole-node match never fires on it and the markup stayed English
             beside an Arabic specimen. Those get substring replacement instead,
             LONGEST KEY FIRST -- otherwise "One-time" eats the start of
             "One-time payment" and leaves " payment" behind. */
          if (!node.parentElement || !node.parentElement.closest('.code')) return;
          let next = raw;
          AR_KEYS.forEach((k) => { if (next.indexOf(k) >= 0) next = next.split(k).join(AR[k]); });
          if (next === raw) return;
          if (node.__en == null) node.__en = raw;
          node.textContent = next;
        } else if (node.__en != null) {
          node.textContent = node.__en;
          node.__en = null;
        }
      });
      scope.querySelectorAll('*').forEach((el) => {
        if (el.closest('template')) return;
        AR_ATTRS.forEach((a) => {
          const cur = el.getAttribute(a);
          if (toArabic) {
            if (cur == null || !AR[cur.trim()]) return;
            if (el.dataset['en' + a.replace('-', '')] == null) {
              el.dataset['en' + a.replace('-', '')] = cur;
            }
            el.setAttribute(a, AR[cur.trim()]);
          } else {
            const saved = el.dataset['en' + a.replace('-', '')];
            if (saved != null) { el.setAttribute(a, saved); delete el.dataset['en' + a.replace('-', '')]; }
          }
        });
      });
    });
    /* The controls are page chrome, so they are swapped separately and with the
       other map. Only the visible text moves; data-value is what every pill row
       reads, so behaviour and snippets are untouched by this. */
    document.querySelectorAll('.controls').forEach((box) => {
      if (box.closest('.demo')) return;   /* entry 01's controls ARE its specimen */
      box.querySelectorAll('.ctl-name, .pill').forEach((el) => {
        if (toArabic) {
          const key = el.textContent.trim();
          if (!AR_UI[key]) return;
          if (el.dataset.enui == null) el.dataset.enui = el.textContent;
          el.textContent = AR_UI[key];
        } else if (el.dataset.enui != null) {
          el.textContent = el.dataset.enui;
          delete el.dataset.enui;
        }
      });
    });
    /* Prose: innerHTML, keyed by section, originals stashed on the element. */
    const setHTML = (el, html) => {
      if (!el) return;
      if (toArabic) {
        if (el.__enHTML == null) el.__enHTML = el.innerHTML;
        if (html) el.innerHTML = html;
      } else if (el.__enHTML != null) {
        el.innerHTML = el.__enHTML;
        el.__enHTML = null;
      }
    };
    document.querySelectorAll('section.entry').forEach((sec) => {
      setHTML(sec.querySelector('.entry-note'), AR_NOTES[sec.id]);
      const num = sec.querySelector('.entry-num');
      if (num) {
        if (toArabic) {
          if (num.__enHTML == null) num.__enHTML = num.innerHTML;
          let t = num.__enHTML;
          Object.keys(AR_CATS).forEach((en) => { t = t.replace(en, AR_CATS[en]); });
          num.innerHTML = t;
        } else if (num.__enHTML != null) { num.innerHTML = num.__enHTML; num.__enHTML = null; }
      }
    });
    document.querySelectorAll('.demo-note').forEach((el, i) => setHTML(el, AR_DEMO_NOTES[i]));
    setHTML(document.querySelector('.masthead .eyebrow'), AR_MAST.eyebrow);
    setHTML(document.querySelector('.masthead h1'), AR_MAST.h1);
    /* :not(.eyebrow) -- the eyebrow IS a <p>, so a bare '.masthead p' matched it
       first and dropped the whole description into the eyebrow slot, leaving the
       real paragraph in English underneath. */
    setHTML(document.querySelector('.masthead p:not(.eyebrow)'), AR_MAST.p);
    document.querySelectorAll('.facts li').forEach((li) => {
      if (li.hasAttribute('data-direction-fact')) return;
      if (toArabic) {
        const k = li.textContent.trim();
        if (!AR_FACTS[k]) return;
        if (li.__enHTML == null) li.__enHTML = li.innerHTML;
        li.textContent = AR_FACTS[k];
      } else if (li.__enHTML != null) { li.innerHTML = li.__enHTML; li.__enHTML = null; }
    });
    rebuildTabs();
  }

  function wireDirection() {
    const el = document.querySelector('.masthead-direction');
    if (!el || el.dataset.wired) return;
    el.dataset.wired = '1';

    const apply = (v) => {
      const dir = v === 'rtl' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      /* The masthead lists the page's facts, and direction was one of them as
         a hardcoded LTR. A fact that a control can falsify has to follow it. */
      const fact = document.querySelector('[data-direction-fact]');
      if (fact) fact.textContent = dir.toUpperCase();
      swapDirectionText(dir === 'rtl');
    };

    el.addEventListener('change', () => apply(el.value));
    apply(el.value || 'ltr');
  }

  function wireSquircleCards() {
    if (typeof minaaSquirclePath !== 'function') return;
    const cards = document.querySelectorAll('.demo, .preview, .otp-stage, .rz-pane, .tab-card');
    if (!cards.length) return;

    const SVGNS = 'http://www.w3.org/2000/svg';

    /* THE CAP IS A ROLE, NOT A SIZE, so a surface that plays a smaller role than
       a page panel has to be able to say so. --m-squircle-radius is the hook the
       shadow-DOM generator already reads for exactly this -- the drawer caps
       itself through it -- and this side simply did not read it, so every page
       surface was pinned to the one --m-surface-corner.

       Nothing declares it on :root (only jelly-dialog, jelly-drawer,
       jelly-popover and jelly-tooltip, none of which contain a page surface),
       so .demo, .preview and .otp-stage still resolve to --m-surface-corner and
       are untouched by this. */
    const radius = (el) => {
      const own = el && getComputedStyle(el).getPropertyValue('--m-squircle-radius');
      const raw = (own && own.trim()) || getComputedStyle(document.documentElement)
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
      if (layer && layer.tagName.toLowerCase() === 'svg') layer.remove(), layer = null;
      if (!layer) {
        layer = document.createElement('div');
        layer.setAttribute('data-sq-fill', '');
        layer.setAttribute('aria-hidden', 'true');
        el.insertBefore(layer, el.firstChild);
      }
      layer.style.clipPath = 'path("' + d + '")';
    };

    /* ONE PATH, FILLED AND STROKED -- for surfaces that carry a visible edge.

       Two layers cannot share an edge. A clipped div and a separate stroked
       svg are rasterised independently, so however exactly their geometry
       agrees (measured at 0.28px here) the fill still shows as a pale hairline
       OUTSIDE the stroke: each layer antialiases its own boundary and the two
       coverages do not cancel. Ahmad saw that seam at the preview's corner and
       it is not fixable by nudging either curve.

       Filling and stroking the SAME path removes it by construction. The
       stroke is centred on the boundary, so it covers the fill's own edge with
       its inner half -- there is no fill pixel left outside it to alias. That
       is also what "the stroke belongs to the card" means literally: it is the
       card's edge, not a ring laid over it.

       Inset by half the stroke so the outer half lands on the element bounds
       rather than outside them, exactly as the separate ring did. */
    const filledStroke = (el, w, h, r, s) => {
      const d = minaaSquirclePath(w - s, h - s, Math.max(0, r - s / 2));
      if (!d) return false;
      let svg = el.querySelector(':scope > [data-sq-fill]');
      if (svg && svg.tagName.toLowerCase() !== 'svg') { svg.remove(); svg = null; }
      if (!svg) {
        svg = document.createElementNS(SVGNS, 'svg');
        svg.setAttribute('data-sq-fill', '');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        el.insertBefore(svg, el.firstChild);
      }
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('preserveAspectRatio', 'none');
      /* fill and stroke as CSS, not attributes, so both keep following the
         tokens live -- the scoped provider changes --m-card underneath this
         and nothing has to repaint. */
      svg.innerHTML =
        '<g transform="translate(' + (s / 2) + ',' + (s / 2) + ')">' +
        '<path d="' + d + '" style="fill:var(--m-squircle-fill, var(--m-card));' +
        'stroke:currentColor;stroke-width:' + s + 'px"/></g>';
      return true;
    };

    const shape = (el) => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      if (el.__sqW === w && el.__sqH === h) return;
      const r = radius(el);
      const d = minaaSquirclePath(w, h, r);
      if (!d) return;
      el.__sqW = w; el.__sqH = h;
      const cs = getComputedStyle(el);
      const s = parseFloat(cs.getPropertyValue('--m-surface-stroke'))
        || parseFloat(cs.getPropertyValue('--control-stroke')) || 1.5;
      /* A surface with a visible edge paints as ONE filled-and-stroked path;
         everything else keeps the clipped layer, which has no edge to seam. */
      if (cs.getPropertyValue('--m-squircle-ring').trim()
          && filledStroke(el, w, h, r, s)) return;
      fill(el, d);
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
    wireOtpDemo(); wireInputDemo(); wireCheckboxDemo(); wireLabelDemo(); wireSwitchDemo(); wireRadioGroupDemo(); wireSegmentedDemo(); wireTabsDemo(); wireChipDemo(); wireCollapsibleDemo(); wireAccordionDemo(); wireCardDemo(); wireDividerDemo(); wireResizableDemo(); wirePaginationDemo(); wireBreadcrumbsDemo(); wireKbdDemo(); wireThemeSwitchDemo(); wireToastDemo(); wireRadioDemo(); wireSelectDemo(); wireSliderDemo(); wireRangeDemo(); wireTextareaDemo(); wireAlertDemo(); wireBadgeDemo(); wireProgressDemo(); wireSpinnerDemo(); wireSkeletonDemo(); wireDialog(); wireDrawer(); wirePopoverDemo(); wireTooltipDemo(); wireMenuDemo(); wireDirection(); wireSquircleCards();
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
