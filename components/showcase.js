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
          await navigator.clipboard.writeText(text);
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

  function start() { buildCode(); wireThemeDemo(); wireThemeSwitch(); wireToasts(); }

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
