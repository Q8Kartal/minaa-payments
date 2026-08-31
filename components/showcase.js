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
    if (!el || !value || !size || !dis || !add || el.dataset.wired) return;
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
      /* el.value, NOT the attribute. jelly-select does not reflect value back
         to the attribute, so reading getAttribute here printed the value the
         element was born with and the snippet lagged the control by one pick
         -- measured, not assumed. */
      if (el.value) a.push('value="' + el.value + '"');
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
    /* Enter, on the host: jelly-input's keydown crosses the shadow boundary
       composed, so there is no need to reach inside for the real input. */
    add.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (addOption(add.value)) add.value = '';
    });

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
      after();
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
      const v = spec.dataset.shape;
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
      const r = radius();
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
    wireOtpDemo(); wireInputDemo(); wireCheckboxDemo(); wireLabelDemo(); wireRadioDemo(); wireSelectDemo(); wireSliderDemo(); wireRangeDemo(); wireTextareaDemo(); wireAlertDemo(); wireBadgeDemo(); wireProgressDemo(); wireSpinnerDemo(); wireSkeletonDemo(); wireDialog(); wireDrawer(); wireSquircleCards();
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
