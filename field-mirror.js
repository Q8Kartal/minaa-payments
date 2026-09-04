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
   loses its ink: color transparent, caret kept.

   WHAT THE MIRROR DOES. A div inside the same shadow root, BELOW the input so
   the caret paints on top of the glyphs rather than behind them, positioned on
   the input's own box, carrying the input's own computed font, size, weight,
   letter-spacing and line-height — copied, not restated, so the caret the
   input draws and the glyphs the mirror draws share one baseline. It follows
   the input's scrollLeft, draws the selection band itself (the native one is
   made transparent, or it would sit opaque over the glyphs), and shows the
   placeholder in the placeholder colour when the value is empty. Password
   fields are left alone: bullets have no descenders.

   UNIVERSAL, NOT SNIFFED. It runs on every platform, so there is one rendering
   path to verify rather than a platform gate that hides a second one. The
   desktop check is the caret-to-glyph alignment at scale.

   Loaded by the component library and by the app. Self-hooking: waits for
   jelly-input to be defined, walks open shadow roots, watches for later
   insertions, and retries an element whose shadow root has not landed yet.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!window.customElements) return;
  var TAG = 'jelly-input';
  var COPY = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight',
              'paddingInlineStart', 'paddingInlineEnd', 'textAlign', 'direction', 'textIndent'];

  var CSS = [
    /* The input keeps its caret and loses its ink. Only text-fill-color is
       blanked, never `color`: the caret draws in `color`, and the mirror copies
       `color` to match it — blank that and both go with it. That shipped once,
       and every field was empty. */
    'input[part="input"][data-mirrored] { -webkit-text-fill-color: transparent !important; }',
    'input[part="input"][data-mirrored]::placeholder { -webkit-text-fill-color: transparent !important; opacity: 0 !important; }',
    'input[part="input"][data-mirrored]::selection { background: transparent !important; -webkit-text-fill-color: transparent !important; }',
    '.minaa-mirror { position: absolute; inset: 0; box-sizing: border-box; margin: 0; border: 0; background: transparent;',
    '  pointer-events: none; overflow: hidden; white-space: pre; z-index: 0; }',
    '.minaa-mirror > span { display: block; }',
    /* the selection band, drawn here because the native one is now transparent */
    '.minaa-mirror .sel { background: var(--m-selection, rgba(0, 98, 173, .28)); border-radius: 2px; }',
    '.minaa-mirror.is-placeholder { color: var(--m-placeholder, currentColor); opacity: 1; }'
  ].join('\n');

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
    mirror.appendChild(line);
    content.insertBefore(mirror, input);          /* beneath the input: caret on top */

    var active = false;

    function metrics() {
      var cs = getComputedStyle(input);
      for (var i = 0; i < COPY.length; i++) mirror.style[COPY[i]] = cs[COPY[i]];
      /* one line, centred the way a single-line input centres its own line
         box: the leftover height split above and below */
      var h = input.clientHeight, lh = parseFloat(cs.lineHeight);
      if (h && lh) {
        var pad = Math.max(0, (h - lh) / 2);
        mirror.style.paddingTop = pad + 'px';
        mirror.style.paddingBottom = pad + 'px';
      }
      /* `color` is untouched on the input, so this is the real ink colour */
      mirror.__ink = cs.color;
    }

    function paint() {
      var v = input.value;
      if (!active) return;
      if (!v) {
        /* the placeholder colour belongs to the class rule, so no inline colour
           here — an inline value would beat it */
        mirror.classList.add('is-placeholder');
        mirror.style.color = '';
        line.textContent = input.getAttribute('placeholder') || '';
      } else {
        mirror.classList.remove('is-placeholder');
        mirror.style.color = mirror.__ink || '';
        var a = input.selectionStart, b = input.selectionEnd;
        var focused = sr.activeElement === input;
        if (focused && a !== null && b !== null && b > a) {
          line.innerHTML = esc(v.slice(0, a)) + '<span class="sel">' + esc(v.slice(a, b)) + '</span>' + esc(v.slice(b));
        } else {
          line.textContent = v;
        }
      }
      mirror.scrollLeft = input.scrollLeft;
    }

    function mode() {
      /* password bullets have nothing to clip; leave those fields native */
      var want = input.type !== 'password';
      if (want === active) return;
      active = want;
      if (active) { input.setAttribute('data-mirrored', ''); mirror.hidden = false; metrics(); paint(); }
      else { input.removeAttribute('data-mirrored'); mirror.hidden = true; }
    }

    ['input', 'change', 'focus', 'blur', 'keyup', 'mouseup', 'select', 'scroll'].forEach(function (t) {
      input.addEventListener(t, function () { paint(); });
    });
    /* Jelly's own value setter writes input.value without an input event;
       host attribute changes are how that reaches us */
    new MutationObserver(function () { mode(); metrics(); paint(); })
      .observe(host, { attributes: true, attributeFilter: ['value', 'placeholder', 'type', 'size', 'dir', 'disabled', 'readonly'] });
    new MutationObserver(function () { mode(); metrics(); paint(); })
      .observe(input, { attributes: true, attributeFilter: ['type', 'placeholder', 'value'] });
    if (window.ResizeObserver) new ResizeObserver(function () { metrics(); paint(); }).observe(input);
    document.addEventListener('selectionchange', function () { if (sr.activeElement === input) paint(); });
    /* fonts may land after the first paint */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { metrics(); paint(); });

    mode();
    requestAnimationFrame(function () { metrics(); paint(); });
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
          var node = added[j];
          if (node.nodeType !== 1) continue;
          deep(node, []).forEach(attach);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  if (window.requestAnimationFrame) requestAnimationFrame(all);
  setTimeout(all, 300);
  setTimeout(all, 1200);
}());
