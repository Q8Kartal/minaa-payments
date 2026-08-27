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

  function attrsOf(el) {
    return [...el.attributes]
      .filter((a) => !NOISE.test(a.name) && !NOISE_EXACT.has(a.name))
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
    const roots = [...demo.querySelectorAll('*')].filter(
      (el) => el.tagName.toLowerCase().startsWith('jelly-') && !hasJellyAncestor(el, demo)
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
      entry.appendChild(box);
    });
  }

  if (window.customElements) {
    Promise.all(
      ['jelly-checkbox', 'jelly-input', 'jelly-switch'].map((t) => customElements.whenDefined(t))
    ).then(() => setTimeout(buildCode, 0)).catch(buildCode);
  }
  /* If Jelly never arrives — offline, or its origin is down — the page still
     has to document itself, so the snippets are built regardless. */
  setTimeout(buildCode, 2500);
})();
