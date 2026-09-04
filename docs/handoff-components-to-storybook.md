# Handoff — the component library: rename, clean, move, Storybook

2026-09-05 · written for a fresh chat · read this first, then `CLAUDE.md`

## The mission, in order

1. **Rename every component** on the components page to Minaã names.
2. **Sanitize and clean** the code: dead code out, duplicated helpers merged, diagnostics removed.
3. **Move the library into its own local folder** on Ahmad's PC (not inside the payments repo).
4. **Stand up Storybook** there, with the components and the stories living locally.

Do them in that order. Renaming first means the clean-up and the stories are written once, against the final names.

## What you are moving — the inventory

The library is `components/` in the repo `Q8Kartal/minaa-payments` (public), plus five files it pulls from the repo root.

| file | lines | role | line endings |
|---|---|---|---|
| `components/index.html` | 2652 | the page: 38 entries, C-01 … C-40 (C-03 and C-23 don't exist) | LF |
| `components/showcase.js` | 3235 | one `wire*Demo()` per entry, the controllers, snippets, direction switch, squircle cards | LF |
| `components/showcase.css` | 1624 | page chrome, `@font-face`, `.entry`, `.ctl`, masthead | **CRLF** |
| `components/minaa-jelly.css` | 3002 | **the token bridge**: 89 `--m-*` tokens, 118 `--jelly-*` overrides, light + dark | **CRLF** |
| `components/minaa-jelly.js` | 1267 | shadow-root patcher: `patchAll`, `dressAll`, squircle (`minaaSquirclePath` on `window`) | LF |
| `components/micons.js` | 274 | Micons sprite for the page (Bold tier) | LF |
| `components/vendor/jelly.js` | — | **Jelly UI, vendored, forked.** Read `vendor/README.md` before touching. | — |
| `../field-mirror.js` | 234 | paints a `jelly-input`'s text in a div (iOS descender fix). Shared with the app. | LF |
| `../button-family.css` / `.js` | 268 / 472 | the Minaã Button and Icon Button (C-39, C-40). Shared with the button library pages. | LF |
| `../gate.js` | 147 | passphrase gate. Obscurity, not security. Drop it in the local build. | LF |
| `../fonts/*.woff2` | — | 29LT Idris Round, three weights, self-hosted. Licensed: keep local, never CDN. | — |

Keep the line endings per file when editing in place. A tool that normalises them turns a one-line fix into a 3000-line diff.

### The 38 entries

| # | title | # | title |
|---|---|---|---|
| C-01 | `jelly-theme` | C-21 | `jelly-tooltip` |
| C-02 | language switch | C-22 | `jelly-menu` |
| C-04 | `jelly-checkbox` | C-24 | `jelly-alert` |
| C-05 | `jelly-input` — **the field reference** | C-25 | `jelly-badge` |
| C-06 | `jelly-label` | C-26 | `jelly-progress` |
| C-07 | `jelly-otp` | C-27 | `jelly-skeleton` |
| C-08 | `jelly-radio` | C-28 | `jelly-spinner` |
| C-09 | `jelly-radio-group` | C-29 | `jelly-tabs` |
| C-10 | `jelly-range` | C-30 | `jelly-chip` |
| C-11 | `jelly-segmented` | C-31 | `jelly-collapsible` |
| C-12 | `jelly-select` | C-32 | `jelly-accordion` |
| C-13 | `jelly-slider` | C-33 | `jelly-card` |
| C-14 | `jelly-switch` | C-34 | `jelly-divider` |
| C-15 | `jelly-textarea` | C-35 | `jelly-resizable` |
| C-16 | theme switch | C-36 | `jelly-pagination` |
| C-17 | toasts | C-37 | `jelly-breadcrumbs` |
| C-18 | `jelly-dialog` | C-38 | `jelly-kbd` |
| C-19 | `jelly-drawer` | C-39 | Button (`button-family.*`) |
| C-20 | `jelly-popover` | C-40 | Icon Button (`button-family.*`) |

Three entries are Minaã compositions, not Jelly tags: the language switch, the theme switch, and toasts. Button and Icon Button are Minaã components built on `jelly-button`.

## Renaming — decide these with Ahmad before writing a line

The page still shows Jelly's tag names as the entry titles. Renaming means three layers, and each is a decision:

1. **Display names** in the entry titles (`<h2 class="entry-title">`). Cheap and safe.
2. **Custom-element tag names.** Jelly registers `jelly-input`; a Minaã tag means either a wrapper element or re-registering Jelly's class under a new name. Every file matches on `jelly-*` selectors and `TAG` constants: 639 references in `minaa-jelly.css`, 158 in `showcase.js`, 77 in `minaa-jelly.js`, 6 in `field-mirror.js` (counted 2026-09-05), so this touches everything. Recommend: **wrapper by registration** (`customElements.define('mn-input', class extends JellyInput {})`), one file, Jelly untouched.
3. **CSS class and token names.** `--jelly-*` are Jelly's own API and must stay. `--m-*` are ours and can become whatever the naming decision says.

Questions for Ahmad, not for the chat to answer alone:
- The prefix. `mn-` is what the Button already uses (`jelly-button.mn-btn`).
- Whether Jelly's tags stay reachable, or every page must use the Minaã tag.
- Whether the numbering C-01 … C-40 survives the move, and whether C-03 and C-23 get filled or the gaps closed.

## Clean-up list — known before you start

Confirmed dead or stale. Remove, or verify then remove:

- `font-ios-check.html`, `font-ios-bisect.js`, and the `?bisect` hook at the bottom of `showcase.js` (~line 3228). Diagnostics for a fixed bug. **Remove all three together.** One open question gates it: Ahmad has not yet hard-reloaded C-05 on the PC. Ask.
- `font-check.html` — still says `descent-override: 43%`; the shipped value is 54%. Stale harness.
- `<link rel="preconnect" href="https://jelly-ui.com">` in `index.html` line 16 — Jelly is vendored; nothing is fetched from there.
- `gate.js` and its script tag — not wanted in a local build.
- **Fields carry two strokes**: ours via `::part(ring)` and Jelly's 1px canvas border. `vendor/README.md` records it and says collapsing them "has not been done". A design decision, so raise it, do not decide it.
- The disabled-Outline stroke rule in `button-family.*` was flagged as unreachable (`restRing` only on the CONTROLS branch). Verify with a grep before deleting.

Structural, the real sanitising work:

- `showcase.js` defines a local `snippet`, `pills` or `sync` inside almost every `wire*Demo`. Same shape, ~30 copies. Merge into one controller helper before the stories are written, or every story duplicates them again.
- `minaa-jelly.js` and `vendor/jelly.js` both carry the squircle exponent (`se = 0.5`, N = 4). Known, documented, cannot share across the module boundary. Leave it, but keep both in sync.
- Every shared file is cache-busted by hand (`?v=20260909y`). In the local build this goes away; do not carry it over.

## Rules that survive the move — do not relearn these

All in `CLAUDE.md` and `.claude/skills/squircle`; the short list:

- **Never touch Jelly's physics.** The fork adds tokens only, every edit marked `MINAA`. Read `vendor/README.md`.
- **Never clip a Jelly control.** ~44–48px of canvas bleed on every side; a clipping ancestor slices the press. Reserve room (`--space-600`), keep the page-level `html { overflow-x: clip }` as the backstop.
- **Squircle is painted, never clipped.** `/squircle` skill: four traps that each shipped once. The dialog/drawer panels are still clipped and that is why the dialog's × renders square on iPhone — open item, Ahmad's call.
- **Direction is fixed per build, never content-adaptive.** No `unicode-bidi: plaintext`, no `direction: ltr` islands. The page has a switch; each state is a whole build.
- **No `letter-spacing` on Arabic.** WebKit applies it and breaks every join.
- **Fonts: one family name per weight, `font-weight: 100 900` on every face**, `font-synthesis: none`. The two `…Field` faces with `descent-override: 54%` are used only by `::part(input)` / `::part(textarea)`.
- **The field mirror stays.** iOS cuts Arabic bowls in any single-line native input; `field-mirror.js` is the fix, confirmed on the iPhone 2026-09-04. It hooks `jelly-input` by tag name, so a rename must update its `TAG`.
- **Tokens only, no raw px/hex** outside the `:root` block. Spacing: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80. Name the Foundations step in a comment.
- **No black type. Red is secondary, not destructive. Payment types are all blue.**
- **Emulated mobile is not a mobile browser.** Anything touching SVG, flex, `::part` or text needs Ahmad's iPhone. His read of his screen beats any screenshot.

## Storybook — recommendation, to confirm with Ahmad

- Framework: **`@storybook/web-components-vite`**. The components are custom elements with no framework; this is the matching renderer and needs no wrapper.
- Load order in `.storybook/preview`: fonts → `vendor/jelly.js` (module) → `minaa-jelly.css` → `minaa-jelly.js` → `field-mirror.js` → `button-family.*` → `micons.js`. Same order as `index.html` today; the patcher must run after Jelly defines its elements.
- **Direction and theme as toolbar globals**, applied to `document.documentElement` (`dir`, `lang`) and to the `jelly-theme` host. The mirror and the bridge already watch those attributes and repaint.
- Fonts stay local files under the Storybook project. Never a CDN.
- One story file per entry, named after the Minaã name, args = the entry's own observed attributes (that is exactly what each `wire*Demo` already exposes as pills).
- Stories must reserve the bleed: a decorator with `padding: var(--space-600)` around every canvas-backed control, or every press in Storybook will be sliced at the story frame.

## Verification before "done"

- Both directions, both themes, on the PC **and on the iPhone**.
- No element computes `direction: ltr` in the RTL build; no clipped element carries a `border`.
- Grep the moved files for `jelly-ui.com`, `gate`, `bisect`, `?v=`: all zero.
- The three CLAUDE.md checks: scan for raw values, check the step not the palette, grep the source not the CSSOM.

## Open items carried over from 2026-09-04

- Push of `d7a6834` (docs) and this file — waiting on "push".
- PC hard reload of C-05 — Ahmad.
- `maxlength`: 40 on the placeholder controller, 64 on demo/value — Ahmad's numbers to confirm.
- Dialog/drawer paint-don't-clip restructure — Ahmad's decision.

## Where the rest is

- `CLAUDE.md` — project rules, Known Quirks, file map.
- `DESIGN.md` — colour, type, spacing, components.
- `docs/input-field-descenders.md` — the field problem and fix, one page.
- `components/vendor/README.md` — the Jelly fork and its rules.
- `.claude/skills/squircle/SKILL.md` — the shape and its four traps.
- Figma: Foundations file (spacing `4415:1705`, colours `4008:11512`), Micons `BlltPtiVnS9ULiuMVKo2oM` page `108:30`.

## Paste this into the new chat

> Read `docs/handoff-components-to-storybook.md`, then `CLAUDE.md` and `components/vendor/README.md`. The mission is in the handoff, in order: rename, clean, move to a local folder, Storybook. Start by asking me the three renaming questions in the handoff. Show me locally before any commit; I approve every push.
