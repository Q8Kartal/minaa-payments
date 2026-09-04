/* ═══════════════════════════════════════════════════════════════════════════
   THE FIELD MIRROR — the visible text of a jelly-input is painted by a div.

   WHY. On iOS, a single-line native <input> on these pages cuts the bowls
   off ج ح خ ع. Found by elimination on a real iPhone, 2026-09-04, inside the
   live page at top level — the only context that reproduced it. In that
   context, with every control verified on the same face at the same size:

     a plain <input>          cut       every jelly-input variant, V0-V13   cut
     a plain <textarea>       whole     a contenteditable div               whole
     a plain div              whole

   The glyphs are fine. The single-line native input is the one element that
   cannot paint them there, and no CSS on it changes that: line-height, padding,
   appearance, weight, compositing, flow vs absolute, the declared descent —
   all tried in place, all cut. So the input stops painting the text.

   WHAT STAYS NATIVE. Everything Jelly touches. Jelly binds focus, blur, input
   and change on its input and reads selectionStart and scrollLeft for the
   caret ripple; the membrane, the physics, the states, the keyboard, autofill,
   password masking, form submission — all still the native input's. It only
   loses its ink, via -webkit-text-fill-color and never `color`: the caret
   draws in `color`, and the mirror reads `color` to match it. The first cut
   of this blanked `color` and every field went empty.

   WHAT THE MIRROR DOES. A div inside the same shadow root, BELOW the input so
   the caret paints on top of the glyphs, positioned on the input's own box and
   carrying the input's own computed font, size, weight, spacing, features and
   line-height — copied, not restated, so caret and glyphs share one baseline.
   Its text line clips at the CONTENT box, as the native inner editor does, and
   follows the input's scrollLeft — in both directions, since both elements
   use the same convention in any one browser. It draws the selection band
   itself (the native one is made transparent, or it would sit opaque over the
   glyphs), shows the placeholder in the input's own ::placeholder colour when
   the value is empty, and leaves type="password" native: bullets have no
   descenders.

   COLOUR IS READ LIVE, EVERY PAINT. It was copied once at attach, and the
   first light-mode check showed dark-mode cream on a light field: the theme
   had moved and the mirror had not. Now every paint re-reads the input's
   computed colour, and a page-level watcher repaints all mirrors when a
   jelly-theme mode, the document's dir, or the OS colour scheme changes.

   maxlength: Jelly does not pass it through. This reflects the host's
   attribute onto the native input, because this is the one script both the
   library and the app load. It is the only thing here that is not the mirror.

   UNIVERSAL, NOT SNIFFED — one rendering path to verify. Self-hooking: waits
   for jelly-input, walks open shadow roots, watches later insertions, retries
   an element whose shadow root has not landed yet.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!window.customElements) return;
  var TAG = 'jelly-input';
  var COPY = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant', 'fontFeatureSettings',
              'fontKerning', 'letterSpacing', 'wordSpacing', 'textTransform', 'textIndent', 'lineHeight',
              'paddingInlineStart', 'paddingInlineEnd', 'textAlign', 'direction'];
  var SELECTABLE = { text: 1, search: 1, url: 1, tel: 1, password: 1 };

  var CSS = [
    'input[part="input"][data-mirrored] { -webkit-text-fill-color: transparent !important; }',
    'input[part="input"][data-mirrored]::placeholder { -webkit-text-fill-color: transparent !important; opacity: 0 !important; }',
    'input[part="input"][data-mirrored]::selection { background: transparent !important; -webkit-text-fill-color: transparent !important; }',
    /* outer: the input's padding box, padding copied in; inner: the content
       box, which is what clips -- the way the native inner editor clips */
    '.minaa-mirror { position: absolute; inset: 0; box-sizing: border-box; margin: 0; border: 0; background: transparent;',
    '  pointer-events: none; overflow: hidden; z-index: 0; }',
    '.minaa-mirror > .line { display: block; width: 100%; overflow: hidden; white-space: pre; }',
    '.minaa-mirror .sel { background: var(--m-selection, rgba(0, 98, 173, .28)); border-radius: 2px; }'
  ].join('\n');

  var mirrors = [];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function attach(host) {
    if (host.__minaaMirror) return;
    var sr = host.shadowRoot;
    if (!sr) {
      var n = (host.__minaaMirrorWait || 0) + 1;
      if (n > 60 || !window.requestAnimationFrame) return;
      host.__minaaMirrorWait = n;
      requestAnimationFrame(function () { attach(host); });
      return;
    }
    var input = sr.querySelector('input[part="input"]');
    var content = sr.querySelector('.jelly-content') || (input && input.parentNode);
    if (!input || !content) return;
    host.__minaaMirror = true;

    var style = document.createElement('style');
    style.textContent = CSS;
    sr.appendChild(style);

    var mirror = document.createElement('div');
    mirror.className = 'minaa-mirror';
    mirror.setAttribute('aria-hidden', 'true');
    var line = document.createElement('span');
    line.className = 'line';
    mirror.appendChild(line);
    content.insertBefore(mirror, input);

    var active = false;

    function reflectMaxlength() {
      var m = host.getAttribute('maxlength');
      if (m !== null && String(input.maxLength) !== m) input.setAttribute('maxlength', m);
      if (m === null && input.hasAttribute('maxlength') && input.__minaaMaxFromHost) input.removeAttribute('maxlength');
      input.__minaaMaxFromHost = m !== null;
    }

    function metrics() {
      var cs = getComputedStyle(input);
      for (var i = 0; i < COPY.length; i++) mirror.style[COPY[i]] = cs[COPY[i]];
      var h = input.clientHeight, lh = parseFloat(cs.lineHeight);
      if (h && lh) {
        var pad = Math.max(0, (h - lh) / 2);
        mirror.style.paddingTop = pad + 'px';
        mirror.style.paddingBottom = pad + 'px';
      }
    }

    function selection() {
      if (!(input.type in SELECTABLE)) return null;
      try {
        var a = input.selectionStart, b = input.selectionEnd;
        return (a === null || b === null || b <= a) ? null : [a, b];
      } catch (e) { return null; }
    }

    function syncScroll() {
      line.scrollLeft = input.scrollLeft;
    }

    function paint() {
      if (!active) return;
      var v = input.value;
      if (!v) {
        var pcs = getComputedStyle(input, '::placeholder');
        mirror.style.color = pcs.color;
        line.textContent = input.getAttribute('placeholder') || '';
      } else {
        mirror.style.color = getComputedStyle(input).color;   /* live: the theme moves */
        var sel = sr.activeElement === input ? selection() : null;
        if (sel) {
          line.innerHTML = esc(v.slice(0, sel[0])) + '<span class="sel">' + esc(v.slice(sel[0], sel[1])) + '</span>' + esc(v.slice(sel[1]));
        } else {
          line.textContent = v;
        }
      }
      syncScroll();
      /* the native input scrolls to the caret after layout, one frame later */
      if (window.requestAnimationFrame) requestAnimationFrame(syncScroll);
    }

    function mode() {
      var want = input.type !== 'password';
      if (want === active) return;
      active = want;
      if (active) { input.setAttribute('data-mirrored', ''); mirror.hidden = false; metrics(); paint(); }
      else { input.removeAttribute('data-mirrored'); mirror.hidden = true; }
    }

    function refresh() { reflectMaxlength(); mode(); metrics(); paint(); }

    ['input', 'change', 'focus', 'blur', 'keyup', 'mouseup', 'select', 'scroll', 'paste', 'compositionend']
      .forEach(function (t) { input.addEventListener(t, function () { paint(); }); });

    /* Jelly's own value setter writes input.value with no event, so wrap it on
       this instance: same getter, same setter, then a paint. */
    var proto = Object.getPrototypeOf(host), desc = null;
    while (proto && !desc) { desc = Object.getOwnPropertyDescriptor(proto, 'value'); proto = Object.getPrototypeOf(proto); }
    if (desc && desc.set) {
      Object.defineProperty(host, 'value', {
        configurable: true,
        get: function () { return desc.get ? desc.get.call(this) : input.value; },
        set: function (v) { desc.set.call(this, v); paint(); }
      });
    }

    new MutationObserver(refresh).observe(host, { attributes: true,
      attributeFilter: ['value', 'placeholder', 'type', 'size', 'dir', 'disabled', 'readonly', 'maxlength'] });
    new MutationObserver(refresh).observe(input, { attributes: true, attributeFilter: ['type', 'placeholder', 'value'] });
    if (window.ResizeObserver) new ResizeObserver(function () { metrics(); paint(); }).observe(input);
    document.addEventListener('selectionchange', function () { if (sr.activeElement === input) paint(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    mirrors.push(refresh);
    refresh();
    if (window.requestAnimationFrame) requestAnimationFrame(refresh);
  }

  /* One watcher for what moves every field at once: a theme mode, the
     document direction, the OS colour scheme. */
  function refreshAll() { for (var i = 0; i < mirrors.length; i++) mirrors[i](); }
  if (window.MutationObserver) {
    new MutationObserver(refreshAll).observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'lang', 'class', 'data-theme'] });
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        if (records[i].type === 'attributes' && records[i].target.tagName === 'JELLY-THEME') { refreshAll(); return; }
      }
    }).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['mode'] });
  }
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', refreshAll);
    else if (mq.addListener) mq.addListener(refreshAll);
  }

  function deep(root, out) {
    if (root.matches && root.matches(TAG)) out.push(root);
    root.querySelectorAll(TAG).forEach(function (el) { out.push(el); });
    if (root.shadowRoot) deep(root.shadowRoot, out);
    root.querySelectorAll('*').forEach(function (el) { if (el.shadowRoot) deep(el.shadowRoot, out); });
    return out;
  }
  function all() { deep(document, []).forEach(attach); }

  customElements.whenDefined(TAG).then(all).catch(function () {});
  if (window.MutationObserver) {
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var added = records[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) deep(added[j], []).forEach(attach);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  if (window.requestAnimationFrame) requestAnimationFrame(all);
  setTimeout(all, 300);
  setTimeout(all, 1200);
}());
