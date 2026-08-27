/* ═══════════════════════════════════════════════════════════════════════════
   The whole adaptation layer.

   `buttons.js` is a page script, not a module: one script scope, no exports,
   nothing written to `window`. It also does three things that matter here.

     1. It DRAWS THE COMPONENT. The Outline appearance's stroke and the Active
        fill are not CSS — they are derived from Jelly's own canvas every
        frame (`readBlob`, `layerFor`, `RING_STEPS`), because a CSS border
        would stay a rigid capsule while the body squashes. So the real
        appearance cannot be had without running the real script.

     2. It captures its buttons ONCE, at load:
             const ALL_BUTTONS = [...document.querySelectorAll('jelly-button, …')]
        Anything rendered afterwards is never wired. Storybook renders after
        load and re-renders on every control change, so the script has to be
        re-executed per render.

     3. It mounts into the demo page through an unguarded
             const fill = (id, html) => document.getElementById(id).innerHTML = html
        so it throws immediately in a DOM that lacks those sixteen ids.

   The adapter therefore does the minimum that lets the real file run unchanged:
   define the strings it reads, provide the mount points it demands, and
   execute its source in a fresh function scope. A short epilogue is appended
   at runtime to hand back its private `button()` factory — that is how the
   stories emit exactly the markup production emits, rather than a copy of it
   that could drift.

   The source file itself is never modified, never patched, never parsed.
   ═════════════════════════════════════════════════════════════════════════ */

/* Verbatim from the inline <script> in buttons-en.html. `buttons.js` reads it
   as `const T = window.MINAA_BUTTONS_STRINGS` and will throw on a missing key,
   so it is copied whole rather than trimmed to the parts a button needs. */
const STRINGS = {
  dir: 'ltr',
  otherHref: 'buttons.html',
  langTo: { ar: 'العربية — switch to Arabic', en: 'English — current page' },
  search: 'Search',
  baseNote: 'Primary · 48px · text only',
  group: {
    pair: 'Primary and secondary',
    pairNote: 'Blue for the key action, red for the secondary button',
    quiet: 'Primary and a quieter action',
    quietNote: 'Ghost for a lower-emphasis supporting action',
    withIcon: 'With an icon button',
    withIconNote: 'The icon button carries an accessible name',
  },
  states: {
    rest: 'At rest', restNote: 'Hover to see the deformation',
    ghost: 'Ghost appearance', ghostNote: 'Same physics, different colour',
    icon: 'Icon button', iconNote: 'Same response',
  },
  disabled: {
    icon: 'Icon button',
    compare: 'Enabled and disabled, side by side',
    compareNote: 'Same size, same width — only the colour changes',
  },
  dirs: {
    rtl: 'RTL — عربي', rtlNote: 'Icon on the right',
    ltr: 'LTR — English', ltrNote: 'Icon on the left',
  },
  tones: {
    info: { label: 'Info', message: 'List updated' },
    success: { label: 'Success', message: 'Payment saved' },
    warning: { label: 'Warning', message: 'Exchange rate is stale' },
    danger: { label: 'Error', message: 'Could not save' },
  },
  table: {
    size: 'Size', config: 'Configuration', icons: 'Icons', gaps: 'Gaps',
    padding: 'Padding', expected: 'Expected width', actual: 'Actual width',
    height: 'Height', square: 'square',
    pending: '— waiting for Jelly —',
    footnote: "Padding and gap are read from inside Jelly's shadow root. " +
      'Expected width = padding + icons + gaps + text — no space is reserved ' +
      'for content that is not there. A ✓ on the width means the size matches ' +
      'its content exactly.',
  },
};

/* Every id `buttons.js` reaches for. Ten are `fill()` targets, the rest are
   read directly. All of them only need to exist — the script writes into them
   and we never look. */
const MOUNT_IDS = [
  'ex-base', 'ex-config', 'ex-icon', 'ex-appearance', 'ex-size',
  'ex-group', 'ex-states', 'ex-disabled', 'ex-dir', 'ex-toast',
  'stat-examples', 'measure-table', 'scrub', 'scrub-out', 'trace', 'lang',
];

/* Resolved against the preview iframe's own URL rather than the server root,
   so the same build works on localhost and under a project path such as
   /minaa-payments/storybook/. An absolute '/buttons.js' would 404 there. */
const SOURCE_URL = new URL('./buttons.js', document.baseURI).href;

let sourcePromise = null;
let api = null;

function loadSource() {
  if (!sourcePromise) {
    sourcePromise = fetch(SOURCE_URL).then((r) => {
      if (!r.ok) throw new Error(`Could not fetch ${SOURCE_URL}: ${r.status}`);
      return r.text();
    });
  }
  return sourcePromise;
}

/* Rebuilt before every execution. The script fills these with the whole demo
   page; emptying them first stops that accumulating across renders. */
function resetScaffold() {
  let host = document.getElementById('minaa-scaffold');
  if (!host) {
    host = document.createElement('div');
    host.id = 'minaa-scaffold';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
  }
  host.innerHTML = '';
  for (const id of MOUNT_IDS) {
    const node = document.createElement('div');
    node.id = id;
    host.appendChild(node);
  }
  return host;
}

/* `buttons.js` appends its Micons <symbol> sprite to documentElement on every
   run. Duplicate ids would resolve to the first copy and still work, but the
   DOM would grow one sprite per control change. */
function dropPreviousSprite() {
  document
    .querySelectorAll('svg[data-minaa-sprite]')
    .forEach((n) => n.remove());
}

function tagNewSprite() {
  document.querySelectorAll(':root > svg').forEach((n) => {
    if (!n.hasAttribute('data-minaa-sprite')) n.setAttribute('data-minaa-sprite', '');
  });
}

/* Executes the real file in a fresh function scope.

   Fresh scope matters twice over: `buttons.js` declares everything with
   top-level `const`, which would collide on a second run in one shared scope;
   and re-running is the only way `ALL_BUTTONS` can pick up whatever Storybook
   has just rendered. Verified safe to repeat — the file registers no document
   or window listeners and writes no globals, so nothing accumulates. */
export async function runMinaa() {
  window.MINAA_BUTTONS_STRINGS = STRINGS;
  resetScaffold();
  dropPreviousSprite();

  const source = await loadSource();
  const epilogue = '\n;return { button: button, micon: micon, STYLES: STYLES, SIZES: SIZES, CONFIGS: CONFIGS };';
  api = new Function(`${source}${epilogue}`)();

  tagNewSprite();
  return api;
}

/* Runs once before the first story so the factory is available synchronously
   inside render(). */
export async function bootMinaa() {
  if (!api) await runMinaa();
  return api;
}

/* The production markup factory, exactly as `buttons.js` defines it:
     button(config, variantCls, size, dir, disabled)
   Nothing here builds markup of its own. */
export function buildMarkup(config, appearance, size, dir, disabled) {
  if (!api) throw new Error('Minaa runtime not booted');
  return api.button(config, appearance, size, dir, disabled);
}

/* Called after Storybook has attached the story to the document, so the
   re-execution sees the new button and wires it like any button on the real
   page — physics, reveal layer, outline ring, focus ring, disabled blocking.

   setTimeout rather than requestAnimationFrame: rAF does not fire in a tab
   that is not compositing (a background tab, or a hidden preview pane), which
   would leave the button rendered but unwired with no error to show for it.
   A macrotask is enough — Storybook has attached the story by then. */
export function wireAfterMount() {
  setTimeout(() => {
    runMinaa().catch((err) => console.error('[minaa] rewire failed', err));
  }, 0);
}
