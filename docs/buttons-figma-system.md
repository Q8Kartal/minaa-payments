# Minaã Buttons — Figma design-system build

Committed continuity source for the phased work that turns the live button
library into a complete, implementation-ready Figma system.

**A later session must read this file before acting.** It records decided fact,
not intention. Anything not written here has not been approved.

- **Live reference:** <https://q8kartal.github.io/minaa-payments/buttons.html>
  (Arabic RTL) and `buttons-en.html` (English LTR)
- **Current phase:** Phase 3 built and verified in Figma. Awaiting Ahmad's
  manual inspection and approval before Phase 4.
- **Last updated:** 2026-08-25

---

## 1. Files and pages

| Role | File key | Page | Notes |
|---|---|---|---|
| Foundations | `iV0IGAxiWCCjwyIbc6w74W` | `Buttons` `4246:1302` | Existing button components. **Not to be modified.** |
| Foundations | same | variables | Holds `Minaa Button / Metrics` — the only collection this work may write to |
| Components | `AmFwwk4TOdYR4HLbQO16t1` | `Buttons` `1:18` | Empty. Target for Phases 3–7 |
| Micons | `BlltPtiVnS9ULiuMVKo2oM` | `108:30` | Icon library. Read-only |

Library availability, verified by key import into the Components file:
Micons components ✅ · Primitives (colour) ✅ · Spacing ✅ ·
`Minaa Button / Metrics` ✅ · text styles ✅ · **Typography *variables* ❌ not
published** (text styles cover the need; not in scope to change).

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

### Architecture — agreed in principle, not yet built

- **Button** and **Icon Button** are separate families. The live page states it:
  "4 + 1 · Icon Button is its own family".
- Button variant axes: Appearance (5) × Size (3) × State. Direction, icon
  visibility, icon swaps and label are **properties**, not axes.
- **Direction** lives on a nested `Button / Content Row` and is surfaced as an
  exposed nested property, so it does not double the matrix. Structure, not
  bidi, guarantees reading order — bidi orders glyphs within a text run and has
  no opinion about icon layer order.
  - LTR: Leading → Label → Trailing
  - RTL: Trailing → Label → Leading (Minaã is Arabic-first; RTL is the default)
- **State naming follows the CSS**: `--fill-rest` / `--fill-active` →
  `Rest` / `Active`. Hover and press are **not** separate states: `--p` is one
  continuous 0→1 value computed from measured deformation, and `pointerenter`
  and `pointerdown` drive the same path. Focus is genuinely discrete —
  `setP(el, 1)` with the origin at centre.

### Deferred, not decided

- **Disabled** — proposed as opacity 0.38 over the appearance's rest colours,
  no Jelly tracking, `pointer-events: none`. Must land in the web library and
  Figma in the same change. Not approved.
- **Button colour aliases** (21, one set per appearance) and whether they need
  their own button-scoped collection. Not approved.
- **Code Connect** — needs a repository connection that does not exist yet.

---

## 3. Phase status

| # | Phase | Modifies | Status |
|---|---|---|---|
| 0 | Audit and source-of-truth | nothing | ✅ **complete** |
| 1 | Button variable cleanup | Figma variables only | ✅ **complete** |
| 2 | Web alignment — raw icon px → tokens; line heights → 30/28/24 | repo only | ✅ **complete — technically and manually verified** |
| 3 | Content Row + RTL/LTR | Figma only | ✅ **built and verified — awaiting manual approval** |
| 4 | Button + Icon Button sets | Figma only | ⏳ **awaiting approval** — fresh context |
| 5 | Disabled | web **and** Figma together | not started |
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

**File:** Minaa Components `AmFwwk4TOdYR4HLbQO16t1` · **Page:** `Buttons` `1:18`

### Component set

| | |
|---|---|
| Name | `_Button / Content Row` |
| Node ID | `20:134` |
| Key | `bea20892d98a23da88399ecbd65944f4b28a7b13` |
| Variants | 6 |
| Default | `Direction=RTL, Size=56` |

The leading underscore is Figma's native hidden-from-publishing marker: the set
stays usable inside this file but is excluded from the published library, which
is what an internal helper should be. The established Minaã library uses flat
names (`Button`, `Button RTL`, `Icon Button`) with no namespacing, so the
`Button / ` prefix is new — kept because it groups the helper with the family
it serves. **Open to renaming; nothing references it yet.**

### Variant node IDs

| Variant | ID | Variant | ID |
|---|---|---|---|
| `Direction=RTL, Size=56` | `20:50` | `Direction=LTR, Size=56` | `20:92` |
| `Direction=RTL, Size=48` | `20:64` | `Direction=LTR, Size=48` | `20:106` |
| `Direction=RTL, Size=40` | `20:78` | `Direction=LTR, Size=40` | `20:120` |

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

### Known limitation — swapping an icon crops it

**Verified, not assumed.** Swapping to `Micons/interface/done-solid` at a 20px
box leaves the art at 20 units — resized, not scaled — where a correctly scaled
icon would be 16.67. It renders ~20% oversized, and any Micon whose art reaches
the 24-grid edge is clipped outright.

There is no fix inside this component: Figma sizes a swapped instance to the one
it replaced, and Micons cannot be resized. **The real fix belongs to the Icons
library** — set the Micons components' children to `SCALE` constraints, which
makes every Micon resizable everywhere and benefits the whole system. Until
then, a designer who swaps an icon must rescale it by hand. Out of scope here;
Micons must not be modified during the Buttons work.

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
- Default size is **56**, matching the sibling sets' ordering in Foundations.
  Production's base size is **48** — worth revisiting if the default should
  mirror production instead.

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
- Exposed nested properties are lost if a designer swaps the nested instance —
  lock the Content Row instance inside each variant.
- The full matrix (126 variants once Disabled lands) slows the variant picker.
  Accepted in exchange for explicitness.
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

### Conventions in the existing library that the plan disagrees with

The Foundations `Buttons` page already has `Button`, `Button RTL` and
`Icon Button`, each 30 variants, using **`Style`** (not "Appearance") and
**`State = Default / Hover`** (not Rest/Active), and treating direction as a
**separate `Button RTL` set** rather than a nested property. Phase 4 must
settle whether the new system adopts those names or supersedes them. Recorded,
not decided.

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
