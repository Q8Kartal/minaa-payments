# Minaã Buttons — Figma design-system build

Committed continuity source for the phased work that turns the live button
library into a complete, implementation-ready Figma system.

**A later session must read this file before acting.** It records decided fact,
not intention. Anything not written here has not been approved.

- **Live reference:** <https://q8kartal.github.io/minaa-payments/buttons.html>
  (Arabic RTL) and `buttons-en.html` (English LTR)
- **Current phase:** **Phase 5 COMPLETE — approved by Ahmad 2026-08-26 after
  visual confirmation.** Disabled landed in the web library and Figma in the
  same change. `Button` **120 variants**, `Icon Button` **60** — the only nodes
  on the Components `Buttons` page. **The Components library needs republishing
  by hand** after the Phase 5 additions. See §5e.
  Phases 0–5 complete. Phase 6 (Motion) not started.
- **Last updated:** 2026-08-26

---

## 1. Files and pages

| Role | File key | Page | Notes |
|---|---|---|---|
| Foundations | `iV0IGAxiWCCjwyIbc6w74W` | `Buttons` `4246:1302` | Existing button components. **Not to be modified.** |
| Foundations | same | variables | Holds `Minaa Button / Metrics` — the only collection this work may write to |
| Components | `AmFwwk4TOdYR4HLbQO16t1` | `Buttons` `1:18` | Holds `Button` `91:680` and `Icon Button` `92:842` — nothing else. Target for Phases 4–7 |
| Micons | `BlltPtiVnS9ULiuMVKo2oM` | `108:30` | Icon library. Read-only |

Library availability, verified by key import into the Components file:
Micons components ✅ · Primitives (colour) ✅ · Spacing ✅ ·
`Minaa Button / Metrics` ✅ · text styles ✅ ·
**`Icon Color` ✅ published from `Minaa - Icons`** (re-verified 2026-08-26; see
§2b) · **Typography *variables* ❌ not published** (text styles cover the need;
not in scope to change).

Note the Micons file now also owns a **local** `Icon Color` variable collection
(`VariableCollectionId:311:5` in that file), **four modes since Phase 5**. It is
published and consumed remotely; it is **not** part of Foundations and needs no
Foundations change.

---

## 2. Confirmed decisions

### Typography — approved

| Button | Label size | Line height | Figma text style |
|---|---|---|---|
| 56 | 20 | 30 | `Text xl/Medium` — key `53c6b85e0229aab4ab1c9470f58bfffbbceeb2b5` |
| 48 | 18 | 28 | `Text lg/Medium` — key `d0da150c839822d879d7b0dcae271dee79e57302` |
| 40 | 16 | 24 | `Text md/Medium` — key `30190bd6c874e0083c5759c37a1cdfadc03c2be8` |

- The **`16 / 16 / 14` scale does not exist** anywhere — not in Foundations
  Typography variables, not in the button variables, not on the existing Figma
  Buttons page, not in the repository. Do not use it.
- Figma binds the approved **text styles**, which already carry family, style,
  size and line height.
- **Do not create `Button font style/Medium`** — redundant against those styles.
- **Production line heights will be aligned to 30 / 28 / 24 in Phase 2.** Today
  the live page computes line-height at exactly 1× (20/18/16). This is the one
  known divergence between Figma and production, and it is scheduled, not
  accepted.

### Phase 4 architecture — APPROVED 2026-08-25, **Direction revised 2026-08-26**

Ahmad approved the **new architecture over the legacy Foundations structure**.
The legacy sets are reference, not template.

| Decision | Approved | Rejected |
|---|---|---|
| Appearance property | **`Appearance`** | `Style` (legacy) |
| State property | **`Rest` / `Active` / `Focus`** | `Default` / `Hover` (legacy) |
| Direction | **top-level variant axis on `Button`** (Option C) | exposed nested property (probed, defective); a separate `Button RTL` set (legacy) |
| Content structure | **direct children of each Button variant** | a nested `Button / Content Row` instance |
| Icon ink | **`Icon Color` mode set on each icon instance root** | per-path paint overrides; modes on Foundations `Icons` |
| Disabled | **not in Phase 4** | — |

**Direction was originally approved as an exposed nested property. That was
revised on 2026-08-26 after probing — see §2a.** The rest of the table stands.

**Why each:**

- **`Appearance`, not `Style`.** The five values are colour treatments, and the
  live page already calls the section *Appearances*. "Style" in Figma also
  collides with text and paint styles, which are a different concept.
- **`Rest` / `Active` / `Focus`, not `Default` / `Hover`.** These follow the
  CSS the buttons actually run on: `--fill-rest` and `--fill-active`. Hover and
  press are **not** separate states — `--p` is one continuous 0→1 value computed
  from measured deformation, and `pointerenter` and `pointerdown` drive the same
  path, so both resolve to `Active`. `Focus` is genuinely discrete:
  `setP(el, 1)` with the origin at centre. Naming states `Default`/`Hover` would
  encode a distinction the implementation does not make.
- **Direction is a variant axis on `Button`, not a nested exposed property.**
  A separate `Button RTL` *set* is still rejected — two sets double every future
  change and let them drift. One set with a Direction axis is edited once.
  Reading order is guaranteed by layer order inside each variant, never by bidi:
  bidi orders glyphs within a text run and has no opinion about icon layer order.
- **Legacy sets are untouchable.** `Button` `4335:1142`, `Button RTL`
  `4335:1428` and `Icon Button` `4335:1594` on the Foundations `Buttons` page
  stay exactly as they are — visual reference only. Not modified, renamed,
  deleted or rebuilt. They also still carry the 966 variable bindings.
- **Disabled is deferred**, unchanged: it must land in the web library and
  Figma together, in its own phase, so the two cannot diverge.

### Architecture — the reasoning behind the above

- **Button** and **Icon Button** are separate families. The live page states it:
  "4 + 1 · Icon Button is its own family".
- Button variant axes: **Appearance (5) × Size (3) × State (3) × Direction (2)
  = 90**. Icon visibility, icon swaps and label are **properties**, not axes.
  Icon Button: Appearance (5) × Size (3) × State (3) = **45**, no Direction —
  a centred single icon has no reading order.
- **Direction** is a variant axis. Layer order inside each variant carries it:
  - LTR: Leading → Label → Trailing
  - RTL: Trailing → Label → Leading (Minaã is Arabic-first; RTL is the default)
- **All nine designer-facing properties sit on the `Button` set itself** —
  `Appearance`, `Size`, `State`, `Direction`, `Label`, `Leading Icon`,
  `Trailing Icon`, `Leading Icon Swap`, `Trailing Icon Swap`. The five content
  properties are wired with `componentPropertyReferences`
  (`characters` / `visible` / `mainComponent`). There is **no nested component
  instance anywhere in the Button**.
- **State naming follows the CSS**: `--fill-rest` / `--fill-active` →
  `Rest` / `Active`. Hover and press are **not** separate states: `--p` is one
  continuous 0→1 value computed from measured deformation, and `pointerenter`
  and `pointerdown` drive the same path. Focus is genuinely discrete —
  `setP(el, 1)` with the origin at centre.

### 2a. Why Direction became an axis — the probe that decided it

Two architectures were built as throwaway probes and measured. Both are now
deleted; the evidence is recorded here and in `pre-phase-4-investigation.md`.

**The Plugin API offers no selective nested-property exposure.** There is one
control — `isExposedInstance: boolean` — and `componentProperties` includes
`VARIANT` entries, so exposing `Direction` necessarily also exposes the nested
`Size`. The leak and the feature are the same switch. `componentPropertyReferences`
covers only `visible` / `characters` / `mainComponent`; there is no variant key.
`layoutMode` has no reversed form and `itemReverseZIndex` is z-order only, so
reading order can come only from layer order.

**Option A** (three size-locked Direction-only Content Rows) removed the `Size`
leak and passed property survival, but **failed the no-clipping requirement**:
in the RTL Leading slot a swapped Micon was not rescaled — inner group at
`2 / 20` instead of `1.67 / 16.67`, art 22×22 inside a 20×20 box. Reproduced on
two independent instances, persistent, and **absent on direct non-nested
instances of the identical component**. Nesting was the cause.

**Option C** (direct children, Direction as an axis) scaled correctly in every
configuration tested — 8 round-trip steps × 3 instances, both slots, both
directions, all three sizes, aspect 1.0, no detachment. It also exposes exactly
the nine properties with **zero** nested instances, and mirrors production
markup, which matters for Phase 8 Code Connect.

Accepted cost: 90 Button variants instead of 45 (135 with Icon Button; 180 once
Disabled lands). Reliability and structural correctness were judged more
important than matrix size.

### 2b. Icon ink — SOLVED by the Micons `Icon Color` collection

Verified 2026-08-26 against the **published** library.

An instance swap **discards per-path paint overrides** — proven, including a
swap to the *same* component. So ink can never be painted onto icon paths.
The Micons library now solves this at the source:

| | |
|---|---|
| Collection | `Icon Color` — key `de25ac2c90026845965c15e7547e953dba1b8e41`, **published from `Minaa - Icons`** |
| In Minaa Components | imported as `VariableCollectionId:de25ac2c…/311:3`, `remote: true` |
| Structure | **one** variable, **three** modes |
| Variable | `icon-color`, key `dbe40dbc727d1b62b8cc406648bac94de14b40e1` |
| Modes | `icon-default` `311:0` (collection default) · `icon-brand` `311:1` · `icon-brand-secondary` `311:2` · **`icon-disabled` `330:0`** (added in Phase 5) |
| Resolves to | `Colors/Neutral/100` #FBF0DC · `Colors/Primary/700` #0062AD · `Colors/Secondary/600` #E8411D · **`Colors/Neutral/700` #895A30** |

`icon-disabled` aliases the primitive `Colors/Neutral/700` **directly**, while the
other three go through the Foundations *Icons* semantic layer. Deliberate: there
is no `icon-disabled` in that collection and creating one would mean modifying
Foundations, which is out of scope. Approved on that basis — not a mistake.

Every one of the **1,895** Micon main components carries an explicit
`icon-brand-secondary` pin, which is why they read red by default.

**The mechanism: set the `Icon Color` mode on each icon instance root.** It is
stored as `explicitVariableModes` — a first-class node property, **not** a paint
override — which is exactly why a swap cannot discard it. Measured: the mode and
the resolved colour held through every swap, in all three colours, on fresh and
already-swapped instances, across Size, Direction, Appearance and State round
trips, through Boolean hide/show, and through reparenting and wrapper
reconfiguration.

**Parent-frame inheritance does not work** and must not be used: a fresh icon
instance carries the main component's explicit pin and stays red inside a parent
set to `icon-default`. It works only after clearing each icon's own mode, which
costs more actions than setting it. **Set the mode on the instance root.**

Ink mapping for Phase 4 — icons take the label colour:

| Appearance | Rest | Active | Focus |
|---|---|---|---|
| Primary | `icon-default` | `icon-default` | `icon-default` |
| Secondary | `icon-default` | `icon-default` | `icon-default` |
| Outline | **`icon-brand`** | `icon-default` | `icon-default` |
| Ghost | **`icon-brand`** | `icon-default` | `icon-default` |
| Ghost Secondary | **`icon-brand-secondary`** | `icon-default` | `icon-default` |

Across the 90 Button variants: `icon-brand` on 12, `icon-brand-secondary` on 6,
`icon-default` on 72 — 180 slot assignments. Icon Button (45, one slot): 3 / 3 /
3 / 36.

**No change to the Foundations `Icons` collection is required**, and no Micons
hygiene pass is required. Library-wide rescan after the fix: 1,895 components,
**0 visible raw paints**, 0 using any other variable; the 579 remaining raw
paints are all disabled (`visible: false`) and never render.

### Deferred, not decided

- **Disabled** — proposed as opacity 0.38 over the appearance's rest colours,
  no Jelly tracking, `pointer-events: none`. Must land in the web library and
  Figma in the same change. Not approved.
- ~~**Button colour aliases** (21, one set per appearance)~~ — **no longer
  needed.** Icon ink is solved by `Icon Color` modes (§2b) and label/fill ink is
  bound directly to Foundations colours per variant. Dropped, not deferred.
- **Code Connect** — needs a repository connection that does not exist yet.

---

## 3. Phase status

| # | Phase | Modifies | Status |
|---|---|---|---|
| 0 | Audit and source-of-truth | nothing | ✅ **complete** |
| 1 | Button variable cleanup | Figma variables only | ✅ **complete** |
| 2 | Web alignment — raw icon px → tokens; line heights → 30/28/24 | repo only | ✅ **complete — technically and manually verified** |
| 3 | Content Row + RTL/LTR | Figma only | ✅ **complete — approved by Ahmad** |
| 4 | Button + Icon Button sets | Figma only | ✅ **complete — approved by Ahmad 2026-08-26.** Option C, 135 variants, 0 audit failures, manual testing passed. **Not yet published** |
| 5 | Disabled | web **and** Figma together | ✅ **complete — approved by Ahmad 2026-08-26.** Neutral treatment, 4th `State` value, +45 variants. See §5e |
| 6 | Motion | Figma only | not started |
| 7 | Documentation page + developer note | Figma only | not started |
| 8 | Code Connect | infrastructure | not started |

Every phase needs explicit approval before it begins and ends with an evidence
report. **No phase begins automatically.**

Web alignment sits at Phase 2, ahead of the component build, deliberately: the
Figma system mirrors production, so production must be correct before it is
mirrored.

---

## 4. `Minaa Button / Metrics` — the only collection this work writes to

Collection id `VariableCollectionId:4335:860`, one mode (`Mode 1`), **18
variables** after Phase 1 (12 before).

### Preserved and aliased — keys unchanged, 966 bindings intact

| Variable | id | key | Now aliases | Resolves |
|---|---|---|---|---|
| `Button space/8` | `4335:861` | `50bf03e1…` | `space-100` `4446:864` | 8 |
| `Button space/16` | `4335:862` | `6a592a12…` | `space-200` `4446:866` | 16 |
| `Button space/20` | `4335:863` | `039738db…` | `space-250` `4446:867` | 20 |
| `Button space/24` | `4335:864` | `aed5c58a…` | `space-300` `4446:868` | 24 |
| `Button space/32` | `4335:865` | `ab245e9f…` | `space-400` `4446:869` | 32 |
| `Button space/48` | `4335:866` | `a89f9269…` | `space-600` `4446:871` | 48 |

Every alias target holds an identical value in all three Spacing modes
(Desktop / Mobile / Tablet), so aliasing introduced **no mode dependency**.

### Untouched

`Button radius/Full` `4335:867` = 999 · `Button font size/Medium` `4335:868` = 16 ·
`Button font size/Large` `4335:869` = 18 · `Button font size/X-Large` `4335:870` = 20 ·
`Button font family/Default` `4335:871` = "29LT Idris Round"

### Added in Phase 1

| Variable | id | key | Value | Scope |
|---|---|---|---|---|
| `Button height/56` | `4711:860` | `eb113d24…` | 56 | `WIDTH_HEIGHT` |
| `Button height/48` | `4711:861` | `16693c2b…` | 48 | `WIDTH_HEIGHT` |
| `Button height/40` | `4711:862` | `f4278826…` | 40 | `WIDTH_HEIGHT` |
| `Button icon size/20` | `4711:863` | `e3110264…` | 20 | `WIDTH_HEIGHT` |
| `Button icon size/16` | `4711:864` | `420d2547…` | 16 | `WIDTH_HEIGHT` |
| `Button stroke width/Outline` | `4711:865` | `8411861c…` | 1.5 | `STROKE_FLOAT` |

**Decided — component metrics stay raw, and this is settled.** Heights, icon
sizes and the outline stroke width are **not** aliased to `space-500` /
`space-600` / `space-250` / `space-200`, even though 40, 48, 20 and 16 match
those steps numerically.

Rationale: these are **component dimensions, not spacing steps**. A button's
height must not move if the Spacing scale is revised later — matching numbers
today is a coincidence, not a dependency. Aliasing part of the set would also be
structurally inconsistent, because 56 and 1.5 have no Spacing equivalent at all.

The same reasoning governs the web side: `--button-icon-size-20` and
`--button-icon-size-16` are their own tokens and are deliberately not aliases of
`--text-xl` / `--text-md`, which is what they used to borrow.

### Deprecated — preserved, not deleted

`Button space/32` · `Button space/48` · `Button font family/font-family-display`

Description set to `Deprecated — do not use in new work. Preserved for
compatibility.` and `scopes` emptied, which removes them from designer pickers
while leaving ids, keys, values, aliases and any binding untouched. Reversible.

**Deletion is not authorised and cannot yet be justified.** The Plugin API has
no cross-file "where used" query, so zero bindings in Foundations proves nothing
about other files. `Button space/32` and `/48` are published (`CURRENT`);
`font-family-display` is `UNPUBLISHED` with no scopes, so it cannot be consumed
elsewhere and is the strongest deletion candidate. Deletion requires a
cross-file audit and separate approval.

---

## 5. Verified production values

Measured on the live site, both builds, identical:

| Button | Label | Line height | Family | Weight |
|---|---|---|---|---|
| 56 | 20px | 20px (1×) | `29LT Idris Round Medium` | computed 640 |
| 48 | 18px | 18px (1×) | same | 640 |
| 40 | 16px | 16px (1×) | same | 640 |

Weight 640 is not a real weight in the system. It renders correctly only
because every `@font-face` declares `font-weight: 100 900`, so any request
resolves to the one registered face with no synthesis.

**The CSS is a hand-copy, not a derivation.** `buttons.css` declares
`--text-xl: 20px` as a literal. There is no token pipeline and no build step;
nothing propagates a Foundations change into the CSS. The sizes agree because
someone typed matching numbers. `--text-lg-lh: 28px` and `--text-md-lh: 24px`
exist and match Foundations but are never applied to a button, and
`--text-xl-lh` does not exist at all.

Appearance colour endpoints, from `buttons.css`:

| Appearance | Fill rest → active | Label rest → active | Stroke |
|---|---|---|---|
| Primary | Primary 700 → Secondary 600 | cream → cream | — |
| Secondary | Secondary 600 → Primary 700 | cream → cream | — |
| Outline | cream → Primary 700 | Primary 700 → cream | Primary 700, 1.5 |
| Ghost | cream → Primary 700 | Primary 700 → cream | — |
| Ghost Secondary | cream → Secondary 600 | Secondary 600 → cream | — |

Foundation colours: `Colors/Primary/700` `4006:127` `#0062AD` ·
`Colors/Secondary/600` `4003:2107` `#E8411D` ·
`Colors/Neutral/100` `4006:264` `#FBF0DC`

---

## 5b. Phase 2 — web alignment, completed

**Files changed:** `buttons.css` (the shared stylesheet, so both builds move
together and cannot drift), `buttons.html` and `buttons-en.html` (asset version
only, `?v=20260824b` → `?v=20260825a`). **`buttons.js` was not touched.**

### Tokens introduced

| Token | Value | Replaces | Figma counterpart |
|---|---|---|---|
| `--text-xl-lh` | `30px` | *nothing — it did not exist* | `Text xl/Medium` line height |
| `--button-icon-size-20` | `20px` | literal `20px`, and `--text-xl` where borrowed | `Button icon size/20` |
| `--button-icon-size-16` | `16px` | literal `16px`, and `--text-md` where borrowed | `Button icon size/16` |
| `--button-label-lh` | per size | *new* — set on each size rule, applied on `.jelly-label` | — |

### Before → after, measured

| Size | Label before | Label after | Icon before | Icon after |
|---|---|---|---|---|
| 56 | 20 / **20** | 20 / **30** | 20px (via `--text-xl`) | 20px (via `--button-icon-size-20`) |
| 48 | 18 / **18** | 18 / **28** | 20px | 20px |
| 40 | 16 / **16** | 16 / **24** | 16px | 16px |

Icon Buttons: 56 → 20px, 48 → 20px, 40 → 16px, before and after — the two
literals are gone.

### Where the line height had to go, and why

Setting it on the host does **not** reach the label. Jelly sets `line-height: 1`
on its inner button inside the shadow root, and the label inherits that; an
inherited value is only beaten by a direct declaration. `.jelly-label` is
**light DOM** — the page builds it — so the declaration goes there, fed by
`--button-label-lh` from each size rule. Verified on the rendered span, not
assumed from the cascade.

### Verification

Both builds, measured on the rendered DOM after Jelly upgraded:

- Label 20/30, 18/28, 16/24 ✅ · icons 20/20/16 ✅
- **Every button width and height byte-identical to before** — 60.39, 88.39,
  90.36, 90.71, 92, 98.66, 103.46, 105.58, 116.39, 74.13 (AR) and 77.58, 88.39,
  89.63, 95, 105.58, 108.81, 114.46, 117.75, 133.58, 89.4 (EN); heights 56/48/40
- 32 examples, stat card reads 32, measurement table **25 ✓ / 0 ✗**
- 32/32 configurations: no clipping, no overflow, **centre offset 0.00px**
  across text-only, leading, trailing, two-icon and Icon Button
- No console errors, no failed requests, no horizontal page scroll
- Responsive at **1280 / 768 / 375** — identical values, table still 25 ✓ / 0 ✗

### Manual verification — closed by Ahmad, both platforms

Automated checking could not reach the interaction layer. The Browser pane was
not displayable in this environment, so there were **no screenshots and no real
mouse input**, and `--p` stays 0 under synthetic events because Jelly derives it
from *measured* deformation that a dispatched `PointerEvent` does not produce.
The pointer wiring was confirmed to engage and clean up (`__engaged`,
`__tracking`, canvas present, both reset on leave), but that is wiring, not
behaviour.

Ahmad closed the gap by hand — **PC on the local preview, and mobile on the
deployed pages** — and reported no noticeable difference or regression:

| Check | PC (local) | Mobile (deployed) |
|---|---|---|
| Arabic RTL page | ✅ passed | ✅ passed |
| English LTR page | ✅ passed | ✅ passed |
| Hover, press, release, colour reveal | ✅ passed | ✅ passed |
| Keyboard focus | ✅ passed | n/a |
| Icon Buttons | ✅ passed | ✅ passed |
| Toast triggers | ✅ passed | ✅ passed |
| Language switch | ✅ passed | ✅ passed |
| Typography and vertical alignment | ✅ passed | ✅ passed |
| Responsive mobile layout | — | ✅ passed |

**No noticeable visual or interaction regression on either platform.**

This is the pattern to keep: emulation and computed DOM prove geometry and
tokens; only a real device and a real hand prove behaviour. A 375px Chromium
viewport once passed a build that was broken on iPhone.

## 5c. Phase 3 — internal Content Row, built

> **DELETED 2026-08-26, on Ahmad's instruction, after Phase 4 closed.**
> Option C builds the Button from direct children, so the Content Row was never
> nested inside it and ended Phase 4 with no consumers. Before deletion it was
> proven unused: publish status **`UNPUBLISHED`** (so no other file could import
> it) and **0 instances of any of its six variants across all three pages of the
> Components file**, from 242 instances scanned. `Button / Content Row`
> `20:134`, key `bea20892d98a23da88399ecbd65944f4b28a7b13`, 6 variants — gone.
>
> **Everything below is kept deliberately as the record of what it proved**, and
> those lessons are live in Phase 4: the icon wrapper pattern (a frame carries
> the size binding, the Micon instance carries `rescale`), that `clipsContent`
> hides cropping from every bounds measurement, that `INSTANCE_SWAP` defaults
> take a node id, and that the default variant follows top-left grid position.
> Do not treat this section as describing anything that still exists.

**File:** Minaa Components `AmFwwk4TOdYR4HLbQO16t1` · **Page:** `Buttons` `1:18`

### Component set

| | |
|---|---|
| Name | `Button / Content Row` |
| Node ID | `20:134` |
| Key | `bea20892d98a23da88399ecbd65944f4b28a7b13` |
| Variants | 6, laid out 2×3 |
| Default | **`Direction=RTL, Size=48`** — 48 is production's base size |

**The default variant is decided by canvas position, not child order.** Proven:
reordering children left `Size` default at 56; moving RTL/48 to top-left changed
it to 48 immediately, and moving it back reverted it. So the grid must put the
intended default in the top-left cell.

That forces a trade-off. Columns run **48, 56, 40** rather than 56, 48, 40,
because 48 has to be leftmost to be the default. Rows are consistent with each
other and RTL is the top row, so RTL is also the default direction. Presentation
spacing uses the real scale — padding `space-300` = 24, gap `space-200` = 16 —
as plain values, since x/y cannot carry a variable binding. Component
measurements were not touched.

**"Hide when publishing" cannot be set — or read — through the Plugin API.**
`hiddenFromPublishing`, `isHiddenFromPublishing` and `publishHidden` all throw
*"no such property on COMPONENT_SET node"*; the only publish-related member is
the read-only `getPublishStatusAsync`, which reports publication state and says
nothing about the hidden flag.

**Renaming a component set CLEARS the flag.** Measured, not assumed: Ahmad set
it by hand, the rename was applied, and afterwards the Assets menu offered
*"Hide when publishing"* again — meaning the component had become visible. He
re-applied it and the menu now reads *"Show when publishing"*.

I expected the rename to leave it alone and said so as an expectation rather
than a fact, which is the only reason it was caught: I asked him to re-check
instead of declaring it verified. **Anything that renames this set must assume
the flag is lost and ask for it to be re-applied.**

The key survived the rename (`bea20892…`, unchanged) and publish status read
`UNPUBLISHED` either side — so publish status is no signal for this at all.

**This state cannot be verified or restored programmatically.** No script can
detect the flag or put it back; it is a UI action only. The component
description carries the same warning, so the next person finds it on the
component rather than only here.

The leading underscore is Figma's native hidden-from-publishing marker: the set
stays usable inside this file but is excluded from the published library, which
is what an internal helper should be. The established Minaã library uses flat
names (`Button`, `Button RTL`, `Icon Button`) with no namespacing, so the
`Button / ` prefix is new — kept because it groups the helper with the family
it serves. **Open to renaming; nothing references it yet.**

### Variant node IDs and final layout

Set box 233×124. Columns 48 · 56 · 40, RTL row on top.

| Variant | ID | x, y | Type | Icon |
|---|---|---|---|---|
| `Direction=RTL, Size=48` **(default)** | `20:64` | 24, 24 | 18/28 | `Button icon size/20` → 20 |
| `Direction=RTL, Size=56` | `20:50` | 91, 24 | 20/30 | `Button icon size/20` → 20 |
| `Direction=RTL, Size=40` | `20:78` | 158, 24 | 16/24 | `Button icon size/16` → 16 |
| `Direction=LTR, Size=48` | `20:106` | 24, 70 | 18/28 | `Button icon size/20` → 20 |
| `Direction=LTR, Size=56` | `20:92` | 91, 70 | 20/30 | `Button icon size/20` → 20 |
| `Direction=LTR, Size=40` | `20:120` | 158, 70 | 16/24 | `Button icon size/16` → 16 |

Gap on all six: `Button space/8`. Approved by Ahmad: default `RTL / 48`,
column order `48, 56, 40`, the compact 2×3 arrangement, and the icon scaling.

### Properties

| Property | Type | Default |
|---|---|---|
| `Direction` | VARIANT | **RTL** (LTR available) |
| `Size` | VARIANT | 56 (48, 40) |
| `Label#23:14` | TEXT | `دقمة` |
| `Leading Icon#23:21` | BOOLEAN | `true` |
| `Trailing Icon#23:28` | BOOLEAN | `false` |
| `Leading Icon Swap#23:35` | INSTANCE_SWAP | `Micons/interface/search-5-line` |
| `Trailing Icon Swap#23:42` | INSTANCE_SWAP | same |

Default icon key `505e0958f66f8315f5a550bef24664260baa24f8` — the icon inside
every example button on the live page, so the Figma default mirrors production.

### Token mapping — no raw values

| Size | Text style | Resolved | Icon variable | Resolved |
|---|---|---|---|---|
| 56 | `Text xl/Medium` `53c6b85e…` | 20 / 30 | `Button icon size/20` `4711:863` | 20 |
| 48 | `Text lg/Medium` `d0da150c…` | 18 / 28 | `Button icon size/20` | 20 |
| 40 | `Text md/Medium` `30190bd6…` | 16 / 24 | `Button icon size/16` `4711:864` | 16 |

Gap on all six: `Button space/8` `4335:861` → alias `space-100` → 8.
Label and icon ink: `Colors/Primary/700` `42d90a35…` — a **placeholder**; the
outer Button owns colour from Phase 4.

### Icon construction — a wrapper, and why it has to be one

Each icon is a **frame** carrying the token, holding a **rescaled Micon
instance**:

```
Leading Icon   FRAME   width/height bound to Button icon size/20 | /16
└─ icon        INSTANCE  Micons/interface/search-5-line, rescale(target/24)
```

They cannot be the same node. **Binding a variable to an instance's width
performs a resize, and Micons cannot be resized** — their children carry
`MIN/MIN` constraints, so a resize crops the artwork instead of scaling it.
Measured: at a 20px box the search glyph kept its 24-grid geometry (ellipse
17.45, stroke 1.5) and its handle, which reaches x 20.45, was cut off.
`rescale()` scales correctly (ellipse 14.54, stroke 1.25 — the same proportion
the web gets from an SVG viewBox), but **re-binding the variable afterwards
reverts the geometry**, because applying a variable is a resize.

So the wrapper carries the binding and the instance carries the scale.

### Two defects found after the first build, and fixed

Both were caught by Ahmad looking at the render, not by my checks:

1. **Icons were cropped.** I verified the box measured 20×20 and never checked
   what drew inside it. `clipsContent` on the Micon masked it — the render
   bounds also read 20×20, because clipping clamps them. The art sizes were the
   only honest signal.
2. **Icons were the library red beside a blue label**, which read as two
   unrelated things. Both now take the same ink.

### Instance swap is safe — an earlier claim here was wrong

An earlier revision of this file recorded that swapping an icon crops it. **That
was incorrect and is retracted.** It rested on an assumed natural art extent for
`done-solid` of 20 units, which was never measured; the real extent is 24, so
"scaled" and "resized" both predicted the same number and the wrong one was
chosen.

Re-tested with a discriminating icon — `search-5-line`, whose ellipse is 17.45
inside a 24 grid and therefore predicts **14.54 if scaled** and **17.45 if
resized**. Across all six variants:

| Box | Ellipse measured | Scaled predicts | Resized predicts | Verdict |
|---|---|---|---|---|
| 20px (sizes 56, 48) | **14.54** | 14.54 | 17.45 | scaled ✅ |
| 16px (size 40) | **11.63** | 11.63 | 17.45 | scaled ✅ |

Figma carries the existing instance's scale onto the swapped one. All six kept
their size bindings, none detached, aspect stayed 1:1, and every render sat
inside its box. **Swapping icons is safe at every size and in both directions.**

The underlying constraint still holds and still matters: a Micon cannot be
*resized*, only rescaled — which is why the wrapper exists.

### Verification — all 18 requirements

Six variants ✅ · RTL default ✅ · text styles correct on all three sizes ✅ ·
icon dimensions bound to Button Metrics and rendering 20/20/16 ✅ · gap bound
to `Button space/8` = 8 on all six ✅ · zero raw spacing, font-size, line-height
or icon-size ✅ · LTR order Leading→Label→Trailing ✅ · RTL order
Trailing→Label→Leading ✅ · both booleans work in both directions ✅ · both
icons on together ✅ · **both off leaves no reserved space — width 23 = label
width exactly** ✅ · label override survives Size *and* Direction changes ✅ ·
both swaps work, icon stays an instance with its size binding intact ✅ · no
icon detached, all main components `Micons/*` ✅ · all rows hug (AUTO/AUTO) ✅ ·
all centred ✅ · nothing unrelated changed ✅

Scope proof — Foundations after: Primitives 163, Typography 29, Spacing 14,
Button Metrics 18, Grid 6, Icons 3; 35 text styles; 55 paint styles; Buttons
page 844 nodes, 3 sets. Components file: 0 local collections, 0 local styles,
`Buttons` page holds exactly one node. A scratch instance was created for the
functional tests and removed.

### Deviations and limitations

- **Figma exposes no paragraph-direction property** on a text node. Direction is
  carried entirely by layer order, which is what was asked for. Each variant
  also sets `textAlignHorizontal` (RIGHT for RTL, LEFT for LTR) to record
  intent, though on a hug-width text node it has no visual effect.
- **`INSTANCE_SWAP` default must be a node id, not a component key** in this
  Figma version. Passing the key throws *"Property value is incompatible with
  component property type"*. `preferredValues` still takes a key. Isolated by
  probe; TEXT and BOOLEAN accept normal values.
- **Label and icon colour are a placeholder**, not a decision. Phase 4 replaces
  both.
- **Micons cannot be resized** — see the limitation above. This will constrain
  Phase 4 too, wherever an icon has to appear at a size other than 24.
- Default size is **48**, matching production's base size. Achieved by placing
  RTL/48 in the top-left cell, because position — not child order — decides the
  default variant.
- **Designer-facing property names are clean**: `Label`, `Leading Icon`,
  `Trailing Icon`, `Leading Icon Swap`, `Trailing Icon Swap`, `Direction`,
  `Size`. The `#23:14`-style suffixes are Figma's internal property ids, part
  of the API key only, and never shown in the properties panel.
- The temporary test instance (`39:226`) was removed on approval. The `Buttons`
  page now holds **exactly one node**: the component set.
- **The properties panel itself cannot be screenshotted** — `get_screenshot`
  renders document nodes, not Figma's application UI. The panel contents are
  reported as data instead.

## 5d. Phase 4 — `Button` and `Icon Button`, built

**File:** Minaa Components `AmFwwk4TOdYR4HLbQO16t1` · **Page:** `Buttons` `1:18`
Built 2026-08-26. **Not published.** The page now holds exactly three nodes.

| Set | Node ID | Key | Variants | Properties | Frame |
|---|---|---|---|---|---|
| `Button` | `91:680` | `75b0d1a3eee44b00eff1813362eb63542b819804` | **90** | 9 | 1473×1644 |
| `Icon Button` | `92:842` | `1e34a9e14ba013f2d7a419866df082391c0be420` | **45** | 4 | 268×1364 |

Defaults, decided by top-left grid position as Phase 3 proved:
`Button` → **`Appearance=Primary, Size=48, State=Rest, Direction=RTL`**;
`Icon Button` → **`Appearance=Primary, Size=48, State=Rest`**.

Grids: `Button` rows = Appearance × State (15), columns = Size × Direction (6),
column order `48-RTL, 48-LTR, 56-RTL, 56-LTR, 40-RTL, 40-LTR` so 48/RTL/Rest
lands top-left. `Icon Button` rows = Appearance × State (15), columns = Size (3).
Presentation padding 24 as a plain value — x/y cannot carry a binding.

### Properties

`Button`: `Appearance` · `Size` · `State` · `Direction` (variants) ·
`Label#91:0` TEXT · `Leading Icon#91:91` BOOLEAN **true** ·
`Trailing Icon#91:182` BOOLEAN **false** · `Leading Icon Swap#91:273` ·
`Trailing Icon Swap#91:364`. **450 `componentPropertyReferences` wired**
(90 × 5). `Icon Button`: `Appearance` · `Size` · `State` · `Icon Swap#92:0`,
45 references.

`preferredValues` on every swap: `search-5-line`, `emailsend-5-line`,
`love-line` — the three verified against all three `Icon Color` modes. This is a
hint, not a restriction; a designer can still pick any Micon.

### Token binding — zero raw values

Height → `Button height/56|48|40` · padding-inline → `Button space/24|20|16` ·
gap → `Button space/8` · all four radii → `Button radius/Full` · icon box →
`Button icon size/20|16` · Outline stroke → `Colors/Primary/700` at
`Button stroke width/Outline`. Label type → `Text xl|lg|md /Medium`.
Fills and label ink bound to `Colors/Primary/700`, `Colors/Secondary/600`,
`Colors/Neutral/100`.

**A uniform `strokeWeight` binding is stored by Figma as the four
`stroke*Weight` sides, not as `strokeWeight`.** An audit that looks for
`boundVariables.strokeWeight` reports a false failure — this cost one
false-alarm cycle here.

### Verification — 0 failures

Every one of the **135** variants was asserted, not sampled: all nine/four
property definitions; every binding present and pointing at the *expected*
variable; fill and label ink correct per Appearance × State; `Icon Color` mode
correct per Appearance × State on every icon slot; text style correct per size;
icon wrappers bound and `clipsContent: false`; icon instances undetached with
`scaleFactor` 0.8333 / 0.6667; heights exactly 56/48/40; Icon Button square;
hug width; child order matching Direction; no stroke on non-Outline appearances.
**Result: 0 failures.**

Functional test on live instances (removed afterwards): custom Arabic+Latin label
survived 12 steps; both booleans survived; both icon swaps survived; ink tracked
Appearance and State throughout — cream on Primary, **blue** on Outline/Ghost
Rest, **red** on Ghost Secondary Rest, cream on every Active and Focus; Direction
reordered correctly; widths 228×48 → 251×56 → 198×40 and back. Icon Button:
square 48/40, ink tracked, swap survived, round trip closed.

Default-state widths measured: leading icon only **89**, both icons **117**,
**no icons 61 = label 21 + padding 40 exactly** — both icons off reserves no
space, reproducing the Phase 3 requirement.

### Scope proof

Components `Buttons` page: **2** nodes — `Button` and `Icon Button`, nothing
else. (It read 3 until `Button / Content Row` was deleted at Phase 4 close;
see §5c.) Components file local collections **0**, paint styles **0**, text
styles **0**. Foundations
identical to the Phase 3 baseline: `Buttons` page 844 nodes and the three legacy
30-variant sets; Primitives 163, Typography 29, Spacing 14, Button Metrics 18,
Grid 6, **Icons 3 (still one mode)**; 55 paint styles, 35 text styles. Micons
untouched.

### Manual testing — passed, and Phase 4 closed

Ahmad tested both families by hand on 2026-08-26 and **both passed**. Automated
checks prove geometry, bindings and modes; only a real hand proves behaviour —
the same division Phase 2 established.

During that review Figma reported *"The properties and values of this variant
are conflicting"* when `Appearance` or `Direction` was changed on a variant
**selected inside the set**, with no visual change. Investigated: **nothing was
damaged** — 90/90 and 45/45 combinations still unique, 0 integrity failures,
identities still matching their rendered fill, ink, icon mode, text style,
height and layer order. Two behaviours were being seen at once, and both are
correct:

1. **Changing a variant property on a main component relabels it, it does not
   restyle it.** Each variant's look is authored. The dropdown moves the variant
   to a different cell of the matrix.
2. **A complete matrix has no free cell to move into**, so any such change
   necessarily collides with an existing variant and Figma refuses it. **That
   refusal is why nothing broke.** A partially-built set would have accepted the
   change and silently left a hole.

**Appearance, Size, State and Direction must be driven on an instance**, never
on the variants inside the set. Two temporary instances were created for the
review and removed afterwards.

### Closed at Phase 4

- ✅ Manual testing passed, both families.
- ✅ `Button / Content Row` proven unused and deleted (§5c).
- ✅ Temporary manual-test instances removed; the page holds only the two sets.

### Still open — Ahmad's action

- **Publish the Components library by hand.** The Plugin API cannot publish, and
  both sets read `UNPUBLISHED`. Until then no other file can consume them.

## 5e. Phase 5 — Disabled, in the web library and Figma together

Built and approved 2026-08-26. This is the phase the file always said had to land
on both sides at once, and it did.

### The treatment — one neutral pair, and why not opacity

All five appearances collapse onto **fill `Colors/Neutral/200`** with **label and
icon `Colors/Neutral/700`**; Outline keeps its rim, also Neutral 700. A button
that is unavailable stops carrying its appearance at all — that is the signal.

The deferred proposal (opacity 0.38 over the rest colours) was **measured and
rejected**. Against the page ground `#FDF9F0`:

| Appearance | label at rest | at 0.38 | body vs page at 0.38 |
|---|---|---|---|
| Primary | 5.55:1 | **1.78:1** | 1.83:1 |
| Secondary | 3.57:1 | **1.64:1** | 1.69:1 |
| Outline / Ghost / Ghost Secondary | 5.55 / 5.55 / 3.57:1 | 1.78 / 1.78 / 1.64:1 | **1.03:1** |

Group opacity composites the label *and* the fill against the page, so internal
contrast collapses too; even 0.6 tops out at 2.62:1. The three quiet appearances
are already only 1.07:1 against the page at full strength, so fading them leaves
nothing. Neutral 200 behind Neutral 700 gives **4.57:1**, and every value stays a
Foundations step. WCAG 1.4.3 exempts disabled controls — these are house numbers,
not a compliance gate.

### Web — `buttons.css`, `buttons.js`, both builds

`--cream-700: #895A30` added (Neutral 200 already existed as `--cream-200`).
Asset version bumped to **`?v=20260826a`** in both HTML files.

**Jelly's native `disabled` attribute is deliberately not used.** Measured on the
live component, setting it forces `opacity: 0.55`, sets the inner button
`disabled` and drops it to `tabIndex -1`. A disabled control the keyboard cannot
reach is undiscoverable, and its fade would compound with the neutral colours.
Note also there is **no `disabled` property on the prototype** — only the
attribute is observed, which is exactly why `el.disabled = x` no-ops.

Instead: `aria-disabled="true"` on the host **and** on the inner shadow button
(the element assistive technology actually reads — the host alone is not
announced), the control stays focusable, and activation is blocked in the
**capture phase** with `stopImmediatePropagation` for click, Enter and Space.
Tab and Escape pass through, or the button becomes a keyboard trap.

**Exclusion from `CONTROLS` is the mechanism, not a safety net.** Measured:
`pointer-events: none` does **not** stop a dispatched event — a synthetic
`pointerenter` still reached the host — so excluding disabled buttons from the
physics wiring is the only thing that actually keeps `--p` at 0.

**Focus ring, closing the Phase 4 accessibility gap:** 3px solid Primary/700 at
3px offset, on every button, disabled included. It cannot be written as
`jelly-button:focus-visible` — Jelly delegates focus into its shadow button and
that inner element is the one that matches, never the host — so a class is set in
the focus handler using the same test the colour reveal already uses.

Verified on both builds: five appearances all reading fill `#F7E0B6` / ink
`#895A30`, Outline the only one with a stroke; host opacity 1; inner `disabled`
false with `tabIndex 0`; `--p` 0 and `__engaged` never set while enabled buttons
still track; **0** activations through on a disabled button against 1 on an
enabled one; Tab not blocked; no console errors. A `Disabled` panel was added to
both language builds using `Micons/interface/ban-solid` — solid, because the
panel icons are a solid set.

### Figma — `Disabled` as the 4th `State` value

`Button` 90 → **120**, `Icon Button` 45 → **60**. Defaults preserved, grids
rebuilt (rows = Appearance × State, so Disabled joins as a 4th row per
appearance and `Primary / 48 / Rest / RTL` stays top-left).

Icon ink uses the new **`icon-disabled`** mode (§2b). Final verification on live
instances **with Trailing Icon switched on**, all 20 appearance × state
combinations, both slots: Primary and Secondary cream throughout; Outline and
Ghost **#0062AD** at Rest; Ghost Secondary **#E8411D** at Rest; every Active and
Focus cream; every Disabled **#895A30**. **0 failures**, confirmed visually by
Ahmad.

### The defect this phase produced, and the lesson

Adding the mode to Micons and republishing was not enough. The Components file
kept a **stale copy** of `Icon Color`, so the mode set against the new reference
did nothing. Accepting the library update then fixed that — and **broke all 135
Phase 4 variants**: the update re-pointed every icon path to a new variable
reference and **orphaned every explicit variable mode set against the old one**.
With no live mode, the icons silently inherited the Micons library's own pin and
rendered red — red on the blue Primary pill, red where Ghost should be blue,
red-on-red on Secondary.

Nothing warns you. The components keep their modes; the modes just stop applying.
Fixed by re-applying the correct mode to all **300** icon slots against the live
reference.

**Two verification failures made this worse, and both are avoidable:**

1. An audit that compared *mode keys* against a collection id reported 225
   failures — flagging the healthy variants and clearing the broken ones. It
   checked that a mode was set, not what colour resulted.
2. A `resolveForConsumer` reading taken while two references coexisted returned
   the *stale* answer and was reported as correct. Ahmad's screenshots were right
   and the instrument was wrong.

**Resolve the rendered colour, on a visible node, and look at it.** A read
artefact to know: auditing main components alone reports false failures on
`Trailing Icon`, because that slot is hidden by default and Figma does not expose
a hidden instance's children — it only verifies once switched on.

## 6. Figma motion vs production Jelly — never conflate these

Every motion artefact in Figma must carry this distinction explicitly.

- **Figma representation** — a Smart Animate transition on a spring curve
  between two variants, or an exported MP4. A canned two-state transition on a
  fixed curve.
- **Production behaviour** — `--p` is recomputed every frame from the button's
  *measured* area change and centroid shift. The colour spreads radially from
  the real contact point, painted on a canvas so it cannot affect layout. Touch
  uses real pressure where the device reports it. Progress **never completes on
  its own**.

A Figma spring can suggest the feel. It is not the specification, and must
never be presented as one.

Verified as available in this environment: `get_motion_context` (keyframes,
easing curves, generated CSS `@keyframes`), `export_video` (MP4 only),
shader tools, and standard interactive components. **"Code layers" could not be
verified** — no API surface was found; do not plan around them. `--ease-spring`
in the briefing document is CSS-variable syntax, not a Figma concept.

---

## 7. Cleanup candidates — recorded, deliberately untouched

**Published text style `Button / Label` is set in Inter.** Size 16,
line-height 24, family **Inter**, style Medium, key
`8b77f7f7825259923dcbbd2986def45a9c80614a`. Published and importable. Used by
neither the live page nor the existing Figma buttons. Its *name* implies
authority over button labels while specifying a font that is not ours — anyone
building from the name alone gets Inter. **Do not touch during the Buttons
work.** It belongs to a later Typography task, after a cross-file usage audit.

**`DESIGN.md:87` is stale.** It states `Minaa Button / Metrics` is "Unverified —
not bound on any node". The collection has **966 bindings**. Correct this during
Phase 7, limited to that button-related statement only.

---

## 8. Known risks

- Cross-file variable usage cannot be proven from the Plugin API. Deprecate
  before deleting, always.
- ~~Exposed nested properties are lost if a designer swaps the nested
  instance~~ — **moot under Option C**: the Button contains no nested component
  instance and exposes nothing.
- The full matrix slows the variant picker. Under Option C: **90 Button + 45
  Icon Button = 135 today, 180 once Disabled lands.** (The old "126" figure
  belonged to the nested Option A shape — 60 + 60 + 6 helper variants — and no
  longer applies.) Accepted in exchange for explicitness and reliability.
- **An instance swap discards per-path paint overrides.** Never colour an icon
  by painting its paths; set the `Icon Color` mode on the instance root (§2b).
- **"The properties and values of this variant are conflicting" is expected**
  when a variant property is changed on a component *inside* a complete set —
  there is no free cell to move into, so Figma refuses. It signals completeness,
  not corruption, and nothing is damaged. Drive Appearance / Size / State /
  Direction on an **instance**. See §5d.
- **A uniform `strokeWeight` binding is stored as the four `stroke*Weight`
  sides.** Auditing `boundVariables.strokeWeight` yields a false failure (§5d).
- **`combineAsVariants` leaves the set frame at its pre-layout size.** After
  repositioning variants, resize the set or its frame will not bound its own
  children — invisible to a numeric audit, obvious in a screenshot (§5d).
- **Accepting a library update orphans explicit variable modes.** The highest-cost
  lesson of Phase 5. Updating a consumed library re-points variable references;
  any `explicitVariableModes` set against the old reference silently stops
  applying and the node inherits the source library's own pin. Nothing warns you
  — it broke all 135 Phase 4 variants' icon ink at once. **After any Micons or
  Foundations library update, re-apply and re-verify every explicit mode.**
- **Publishing the source library is only half of it.** The consuming file must
  also *accept* the update, in the UI. Until it does it keeps a stale copy, and a
  mode set against the fresh reference does nothing. The Plugin API can neither
  publish nor accept.
- **A mode key is not a colour.** Auditing `explicitVariableModes` proves a mode
  is set, not what renders — an audit built that way flagged the healthy variants
  and cleared the broken ones. Resolve the colour, on a **visible** node: a
  hidden slot (`Trailing Icon` by default) does not expose its children, so it
  reports false failures until switched on. And when the render and the API
  disagree, the render is right.
- `arrowround-03-line` carries an **unpainted** `24*24` helper vector displaced
  to (24, 24.5), inflating its reported bounds to `2,2 → 48,48.5` inside a 24×24
  frame. It has no paint and **renders correctly**; only bounds-based maths is
  affected. Logged as a Micons tidiness defect, not a rendering one.
- Figma and production line heights currently disagree. Scheduled for Phase 2.
- **Creating a variable is not the same as publishing it.** Phase 1's six new
  variables were `UNPUBLISHED` and could not be imported into the Components
  file at all — Phase 3 was blocked until Ahmad published the Foundations
  library. The Plugin API cannot publish; it is a UI action. **After any phase
  that adds or changes a variable, the library must be republished before a
  consuming file can use it.** The six aliased `Button space/*` also read
  `CHANGED` until then, meaning consumers still had the pre-alias copy.
- The Minaã Foundations and Micons libraries were **not attached** to the
  Components file initially — only community UI kits were. Both are attached
  now. Without them a designer sees no Micons in the instance-swap picker.

### Conventions in the existing library — SETTLED

The Foundations `Buttons` page has `Button` `4335:1142`, `Button RTL`
`4335:1428` and `Icon Button` `4335:1594`, each 30 variants, using `Style` and
`State = Default / Hover`, with direction as a separate set.

**Resolved 2026-08-25: the new system supersedes them.** See the approved
decisions in §2. The legacy sets remain in place as visual reference and are
not to be modified, renamed, deleted or rebuilt — they also still hold most of
the 966 bindings on the button metrics.

This is the one place the new system deliberately breaks with the existing
library rather than matching it, so it is worth being able to point at the
reason: the legacy names describe a button that behaves differently from the
one in production.

---

## 9. Scope — what may and may not be touched

**May be modified, only in the phase where it is listed and only after
approval:** the `Minaa Button / Metrics` collection · the `Buttons` page in the
Minaa Components file · `buttons.css` and `buttons.js` for the Phase 2
alignment · this file.

**Must not be touched:** any Typography variable or text style, including the
Inter `Button / Label` · any global Colour, Spacing, Semantic or Grid variable
(referenced by alias only, never edited) · any collection or mode outside
`Minaa Button / Metrics` · the Foundations `Buttons` page `4246:1302` · Micons ·
Toast and Feedback components · `DESIGN.md` (until Phase 7) · any other
repository file.
