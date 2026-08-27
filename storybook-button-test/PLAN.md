# Storybook proof of concept — Minaã Button and Icon Button

**Goal:** prove the *actual* Minaã Button and Icon Button — real Jelly components,
real `buttons.css`, real `buttons.js` — run correctly inside Storybook on localhost.

**Architecture:** Storybook serves the untouched project root as a static
directory, so `buttons.css`, `buttons.js` and `fonts/` are loaded verbatim over
HTTP. A thin runtime adapter executes the real `buttons.js` in a fresh function
scope per render and captures its private `button()` factory, so the stories emit
exactly the markup production emits and get exactly the production behaviour.

**Tech stack:** Storybook + `@storybook/web-components-vite`, Jelly from
`https://jelly-ui.com/package.js`, no framework wrapper.

---

## What the investigation established

These are the facts that decide the design. All verified by reading the source.

| Fact | Consequence |
|---|---|
| Jelly is a **remote module** — `<script type="module" src="https://jelly-ui.com/package.js">` | Load the same URL; the components are genuinely the real ones |
| `buttons.js` **draws the Outline stroke and the Active fill from Jelly's canvas every frame** (`layerFor`, `readBlob`, `RING_STEPS`) | The appearance cannot be reproduced without running the real script. Reimplementing it is not an option |
| `buttons.js` is one **script-scope file, no exports, no `window.*`** | Cannot be imported. Must be executed as source |
| `const ALL_BUTTONS = document.querySelectorAll(...)` runs **at load** | Buttons added later are never wired → must re-execute per render |
| `fill()` is `document.getElementById(id).innerHTML` — **unguarded** | Throws in a bare DOM → the 16 mount points must exist |
| `const T = window.MINAA_BUTTONS_STRINGS` | The strings object must be defined first |
| No `document`/`window` listeners, no globals written | Re-execution is safe; nothing accumulates except the icon sprite |
| The sprite is appended to `documentElement` each run | Remove the previous one before re-running |
| `@font-face` uses **relative** `fonts/*.woff2` | Serving the project root resolves fonts with no copying |

**Property contract, read from `buttons.js`:**

- appearance `primary · secondary · outline · ghost · ghostsec`
- size `56 · 48 · 40` (emitted as `s56 / s48 / s40`)
- config `text · leading · trailing · both · icononly`
- direction `ltr · rtl`, `disabled` → `aria-disabled="true"`
- factory: `button(config, variantCls, size, dir, disabled)`

---

## File structure

| File | Responsibility |
|---|---|
| `package.json` | Storybook + web-components-vite only |
| `.storybook/main.js` | Framework, stories glob, `staticDirs` → project root |
| `.storybook/preview-head.html` | Font preloads, Jelly module, `buttons.css` — copied from `buttons-en.html` |
| `.storybook/preview.js` | Loader that boots the adapter before the first story |
| `src/minaa-runtime.js` | The whole adaptation: strings, stub mounts, fetch + execute, capture `button()` |
| `src/Button.stories.js` | `jelly-button` — five appearances, three sizes, four configs, dir, disabled |
| `src/IconButton.stories.js` | `jelly-icon-button` — five appearances, three sizes, disabled |

---

## Tasks

### Task 1 — scaffold
- [ ] Create `storybook-button-test/` with `package.json` and `.gitignore`
- [ ] `npm install` Storybook and the web-components-vite framework
- [ ] Verify the binary exists: `npx storybook --version`

### Task 2 — serve the real assets
- [ ] `.storybook/main.js` with `staticDirs: ['../..']`
- [ ] `.storybook/preview-head.html` linking `/buttons.css` and the Jelly module
- [ ] Verify in the browser that `/buttons.css`, `/buttons.js` and a font return 200

### Task 3 — the adapter
- [ ] `src/minaa-runtime.js`: `MINAA_BUTTONS_STRINGS`, 16 hidden stub mounts,
      fetch `/buttons.js` once, execute via `new Function(src + 'return {button}')`
- [ ] Verify the captured `button()` returns the expected markup string

### Task 4 — the two stories
- [ ] `Button.stories.js` and `IconButton.stories.js`, controls per the contract
- [ ] Each render: build markup with the real factory → mount → re-execute on rAF

### Task 5 — verify against the live reference
- [ ] Run on localhost, read the console for errors
- [ ] Compare computed height, padding, radius, fill and font against
      `https://q8kartal.github.io/minaa-payments/buttons-en.html`
- [ ] Confirm Jelly deforms on pointer, the Outline stroke tracks the blob,
      focus ring appears on keyboard focus, disabled stays inert but focusable
- [ ] `npm run build-storybook` succeeds

**Verification is behavioural, not unit-tested** — this is an integration proof
that a page script runs under a component harness. Asserting computed styles in
the live browser against the deployed reference is the test that matters.
