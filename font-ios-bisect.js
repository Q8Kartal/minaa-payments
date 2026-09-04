/* ═══════════════════════════════════════════════════════════════════════════
   DIAGNOSTIC. Loaded by components/showcase.js ONLY when the page URL carries
   `?bisect`. Does nothing otherwise, ships nothing otherwise, and comes out
   the moment the iOS descender cut is understood.

   WHY IT LIVES IN THE PAGE. Six reproductions of the cut have now rendered
   whole on the reporting iPhone: a bare input in the field's exact box at
   every declared descent, idle, focused and typed into; a real jelly-input
   loading Jelly, the bridge, the fonts and the patcher; and the live page
   itself inside a frame, the very field that cuts when opened directly,
   whole, typed into, with every clone beside it whole. Resetting iOS
   text-size adjustment on the root — the one difference all the whole
   contexts shared — changed nothing either.

   So the cut exists in exactly one context: this page, top level, on iOS.
   Nothing built outside that context can find it. This runs inside it: it
   clones the real placeholder field's whole controller row, one rule per
   clone, and adds two rows that are not the component at all — a bare
   <input> and a contenteditable div in the same box — so a page-level cause
   shows as ALL rows cut, and a component-level one as the bare rows whole.

   `?bisect&noclip` additionally lifts the root's overflow-x: clip, the one
   top-level-only rule this project added, so it can be ruled in or out.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var AR = 'ج ح خ ع';
  var q = location.search;

  var VARIANTS = [
    ['V0', 'stock clone of the live field', ''],
    ['V1', 'membrane canvas hidden', 'canvas{visibility:hidden!important}'],
    ['V2', '.jelly-content without stacking context', '.jelly-content{z-index:auto!important}'],
    ['V3', 'input on its own compositing layer', 'input{transform:translateZ(0)!important}'],
    ['V4', 'input font-weight 400', 'input{font-weight:400!important}'],
    ['V5', 'input line-height = control height', 'input{line-height:56px!important}'],
    ['V7', 'input on the REAL Medium face, no override', 'input{font-family:"29LT Idris Round Medium",sans-serif!important}'],
    ['V8', 'input in flow, not absolute', 'input{position:static!important}'],
    ['V9', 'input with padding-block 8', 'input{padding-top:8px!important;padding-bottom:8px!important}'],
    /* not covered by V0-V9: what Jelly sets on the input that a bare input does not have */
    ['V10', 'input appearance none', 'input{-webkit-appearance:none!important;appearance:none!important}'],
    ['V11', 'input font set explicitly, not inherited', 'input{font:500 18px/28px "29LT Idris Round Medium Field",sans-serif!important}'],
    ['V12', 'input text-fill-color currentColor', 'input{-webkit-text-fill-color:currentColor!important}'],
    ['V13', 'input caret-color and color plain', 'input{color:#FBF0DC!important;caret-color:#FBF0DC!important;-webkit-text-fill-color:#FBF0DC!important}']
  ];

  function label(row, text) {
    var nm = row.querySelector('.ctl-name');
    if (nm) { nm.textContent = text; nm.style.cssText = 'color:#FA937D;font-weight:700'; }
  }

  /* The control rows: the field's own box — 280x56, 18/28, padding 0 20, LTR —
     with no Jelly. Built with the DOM and cssText, NOT an HTML style attribute:
     the first version put "29LT Idris Round Medium Field" in double quotes
     inside a double-quoted attribute, the attribute ended at the first inner
     quote, and both rows silently lost their font and size. They rendered in
     SF Arabic at the UA default, whole, and looked like evidence. */
  var TXT = 'position:absolute;inset:0;width:100%;height:56px;margin:0;padding:0 20px;border:0;background:transparent;' +
            'color:#FBF0DC;box-sizing:border-box;font-family:"29LT Idris Round Medium Field",sans-serif;' +
            'font-size:18px;line-height:28px;direction:ltr;-webkit-appearance:none;appearance:none;';
  function bareRow(kind, title) {
    var row = document.createElement('div');
    row.className = 'ctl';
    var name = document.createElement('span');
    name.className = 'ctl-name'; name.textContent = title; name.style.cssText = 'color:#FA937D;font-weight:700';
    var box = document.createElement('div');
    box.style.cssText = 'position:relative;width:280px;height:56px;border:1px solid rgba(251,240,220,.45);border-radius:9999px;';
    var el;
    if (kind === 'input') { el = document.createElement('input'); el.value = AR; el.autocomplete = 'off'; el.spellcheck = false; }
    else if (kind === 'textarea') { el = document.createElement('textarea'); el.value = AR; el.rows = 1; el.spellcheck = false; el.style.resize = 'none'; }
    else { el = document.createElement('div'); el.textContent = AR; if (kind === 'editable') { el.contentEditable = 'true'; el.spellcheck = false; } }
    el.style.cssText = TXT + (kind === 'input' || kind === 'textarea' ? '' : 'display:flex;align-items:center;white-space:nowrap;overflow:hidden;outline:none;');
    box.appendChild(el); row.appendChild(name); row.appendChild(box);
    row.__probe = el;
    return row;
  }

  function run() {
    var noclip = /[?&]noclip/.test(q);
    if (noclip) document.documentElement.style.setProperty('overflow-x', 'visible', 'important');

    var orig = document.getElementById('in-placeholder');
    var row = orig && orig.closest('.ctl');
    var status = document.createElement('div');
    status.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;padding:8px 12px;font:600 11px/1.45 ui-monospace,monospace;' +
                           'color:#FBF0DC;background:rgba(0,38,75,.94);white-space:pre-wrap;max-height:42vh;overflow:auto';
    document.body.appendChild(status);
    if (!row) { status.textContent = 'bisect: placeholder field not found'; return; }

    var on = orig.shadowRoot && orig.shadowRoot.querySelector('input');
    if (on) { on.value = AR; on.dispatchEvent(new Event('input', { bubbles: true })); }
    label(row, 'LIVE — the original field');

    var made = [], after = row;
    VARIANTS.forEach(function (v) {
      var c = row.cloneNode(true);
      c.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
      var ji = c.querySelector('jelly-input');
      ji.setAttribute('value', AR); ji.setAttribute('aria-label', v[0]);
      label(c, v[0] + ' — ' + v[1]);
      after.insertAdjacentElement('afterend', c); after = c;
      made.push({ id: v[0], ji: ji, css: v[2] });
    });
    /* four controls, none of them Jelly, all on the Field face at the field's size */
    var controls = [
      bareRow('input',    'BARE — a plain <input>, no Jelly'),
      bareRow('textarea', 'TEXTAREA — a plain <textarea>, no Jelly'),
      bareRow('editable', 'EDITABLE — a contenteditable div'),
      bareRow('static',   'STATIC — a plain div, not editable')
    ];
    controls.forEach(function (r) { after.insertAdjacentElement('afterend', r); after = r; });

    setTimeout(function () {
      var lines = [];
      controls.forEach(function (r) {
        var el = r.__probe, cs = getComputedStyle(el);
        lines.push(r.querySelector('.ctl-name').textContent.split(' — ')[0] + '  ' +
          [cs.fontFamily.split(',')[0].replace(/"/g, ''), cs.fontSize, 'lh ' + cs.lineHeight,
           Math.round(el.getBoundingClientRect().height) + 'px'].join(' · '));
      });
      made.forEach(function (m) {
        var sr = m.ji.shadowRoot;
        if (!sr) { lines.push(m.id + '  no shadow root'); return; }
        if (m.css) { var st = document.createElement('style'); st.textContent = m.css; sr.appendChild(st); }
        var n = sr.querySelector('input');
        if (n) { n.value = AR; n.dispatchEvent(new Event('input', { bubbles: true })); }
        var cs = n && getComputedStyle(n);
        lines.push(m.id + '  ' + (cs ? [cs.fontFamily.split(',')[0].replace(/"/g, ''), cs.fontSize, 'lh ' + cs.lineHeight,
          'w' + cs.fontWeight, cs.position, Math.round(n.getBoundingClientRect().height) + 'px'].join(' · ') : 'no input'));
      });
      var rcs = getComputedStyle(document.documentElement);
      status.textContent = 'BISECT, top level, in the live page — tap into a field, screenshot the column\n' +
        lines.join('\n') +
        '\nhtml overflow-x: ' + rcs.overflowX + (noclip ? '  (noclip)' : '') +
        ' · text-size-adjust: ' + (rcs.textSizeAdjust || rcs.webkitTextSizeAdjust) +
        ' · DPR ' + devicePixelRatio + ' · ' + innerWidth + 'x' + innerHeight + '\n' +
        (navigator.userAgent.match(/(iPhone OS [\d_]+|Windows NT [\d.]+|Mac OS X [\d_]+)/) || ['?'])[0];
      row.scrollIntoView({ block: 'start' });
      setTimeout(function () { window.scrollBy(0, -(status.offsetHeight + 8)); }, 300);
    }, 1200);
  }

  if (document.readyState === 'complete') setTimeout(run, 4500);
  else window.addEventListener('load', function () { setTimeout(run, 4500); });
}());
