# Minaã Buttons — Figma design-system build

Committed continuity source for the phased work that turns the live button
library into a complete, implementation-ready Figma system.

**A later session must read this file before acting.** It records decided fact,
not intention. Anything not written here has not been approved.

- **Live reference:** <https://q8kartal.github.io/minaa-payments/buttons.html>
  (Arabic RTL) and `buttons-en.html` (English LTR)
- **Current phase:** Phase 1 complete, awaiting approval for Phase 2
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
| 0 | Audit and source-of-truth | nothing | ✅ complete |
| 1 | Button variable cleanup | Figma variables only | ✅ **complete** |
| 2 | Web alignment — raw icon px → tokens; line heights → 30/28/24 | repo only | ⏳ awaiting approval |
| 3 | Content Row + RTL/LTR | Figma only | not started — fresh context |
| 4 | Button + Icon Button sets | Figma only | not started — fresh context |
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

**Judgement call, open to reversal:** heights and icon sizes were created as raw
numbers rather than aliases of `space-500` / `space-600` / `space-250`. A
spacing scale governs gaps and padding; a component height is not a spacing
step, and aliasing would make button height move if a spacing step ever changed.
56 and 1.5 have no spacing equivalent at all, so aliasing part of the set would
also be inconsistent.

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
