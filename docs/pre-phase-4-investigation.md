# Pre-Phase-4 investigation — Buttons Figma system

Record of the investigation carried out between **Phase 3 approval** and the start of
Phase 4. It covers the nested-`Size` blocker (D3), two architecture probes, and the
icon-ink blocker — which is now **resolved**.

- **Opened:** 2026-08-26 · **Closed:** 2026-08-26
- **Outcome:** Option C **approved as the structural architecture**. Icon ink
  **solved** by the Micons `Icon Color` collection. **No Foundations change and no
  Micons hygiene pass are required.**
- **Phase 4 was approved, built and completed on 2026-08-26** on the strength of
  this investigation — manual testing of both families passed. Its build record,
  verification and scope proof live in `buttons-figma-system.md` §5d — not here.
  This document is closed.
- No repo code changed, no commit, no push.
- All scratch probe pages and nodes created during this investigation have been removed.

---

## 1. Final status

| Item | State |
|---|---|
| Phase 4 architecture | **Option C approved** |
| Icon-ink blocker | **Resolved** — `Icon Color` modes, verified against the published library |
| Foundations `Icons` collection change | **Not required.** Proposal withdrawn |
| Micons hygiene pass | **Not required.** Three icons were fixed by the Figma Agent; nothing else outstanding |
| Phase 4 implementation | **Complete 2026-08-26** — 90 `Button` + 45 `Icon Button`, 0 audit failures, manual testing passed. Unpublished; Ahmad publishes by hand. See `buttons-figma-system.md` §5d |
| Web repo / Git | **Untouched** |

---

## 2. Decisions taken during this investigation

| # | Decision | Outcome |
|---|---|---|
| D1 | `Active` and `Focus` render identically | **Approved.** Mirrors production (`setP(el,1)`). Focus differs by trigger and origin, not visually. The missing visible focus ring is recorded as an **accessibility gap** for a later web-and-Figma alignment phase. No Figma-only ring invented. |
| D2 | Icon Button appearances | **Approved — all five.** 45 Icon Button variants. |
| D3 | Nested `Size` leak | **Blocker → resolved by adopting Option C** (§4–§6) |
| D4 | Naming | **Approved:** `Button` and `Icon Button`. Legacy Foundations sets untouched; hiding them is a later, separately-approved task. |
| D5 | Icon ink | **Resolved** by `Icon Color` mode on each icon instance root (§7) |

---

## 3. The D3 problem, and the API evidence

**The leak and the feature are the same mechanism.** The Plugin API offers exactly one
control for nested-property exposure:

```
readonly exposedInstances: InstanceNode[]
isExposedInstance: boolean     // one boolean, per instance, all-or-nothing
```

`componentProperties` includes `VARIANT` entries, so `Direction` and `Size` ride the same
switch. Selective nested-property exposure does not exist.

`componentPropertyReferences` is limited to `visible` / `characters` / `mainComponent` —
no variant key — so a parent set cannot drive a nested set's variant. And Direction cannot
avoid being a variant: `layoutMode` is `'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID'` with
no reversed form and no variable binding, and `itemReverseZIndex` is z-order only.

Supporting scan: **0 exposed nested instances** existed anywhere — 12 instances in the
Components file, 270 on the Foundations `Buttons` page.

---

## 4. Option A probe — three size-locked Content Rows

Built by cloning the production set and splitting it, so internals stayed byte-identical.

**Passed:** no nested `Size` at any of 7 measurement points; parent Size authoritative
(nested main component tracked 48→56→40→48); Label, both booleans, both swaps and Direction
survived every switch; text style and icon box followed parent Size; no detachment; box
round trip exact (193×48 → 212×56 → 166×40 → 193×48).

**Failed — icon rescale on swap.** In the **RTL Leading Icon** slot a swapped Micon was not
rescaled:

| | group x | group w | art extent | verdict |
|---|---|---|---|---|
| Correct (LTR, and Trailing in both) | 1.67 | 16.67 | 20 × 20 | scaled |
| RTL Leading, after swap | **2.00** | **20.00** | **22 × 22** | unscaled, cropped |

Reproduced on a second fresh instance, present at swap time, persistent. **Direct,
non-nested instances of the identical component scaled correctly in both directions** — so
nesting was the cause.

**Regrouping reassigns property identities.** `Label#23:14` → detached
`Label#23:16 / #23:15 / #23:17 …` → regrouped `Label#54:0` / `#54:5` / `#54:10`.
Designer-facing names stay stable and all 15 references re-resolved, but any script or Code
Connect mapping keyed to a `#23:xx` id would need regenerating.

---

## 5. Option C probe — direct children, Direction as a variant axis

Matrix probed: Appearance(2) × Size(3) × State(2) × Direction(2) = 24 variants, default
`Primary/48/Rest/RTL`, 120 `componentPropertyReferences` wired.

- Panel exposed **exactly the nine required properties**, all first-class on the set.
- `exposedInstanceCount: 0` at every step — no nested instances at all.
- Arabic+Latin label, both booleans and both swaps survived all 8 round-trip steps.
- **Icon scaling correct everywhere** — 8 steps × 3 instances, both slots, both directions,
  all sizes; scale 0.8333 at 20px, 0.6667 at 16px, aspect 1.0, no detachment.
  The Option A nested defect did not occur.

---

## 6. Option A vs Option C

| Axis | Option A | Option C | Winner |
|---|---|---|---|
| Variant count | 45 + 45 + 6 helpers = 96; 126 with Disabled | 90 + 45 = 135; 180 with Disabled | A |
| Maintenance | edited in 6 helper variants, propagates | every change is a 90-variant sweep | A |
| Property safety | passed, but exposure is all-or-nothing; split reassigns every `#id` | nine first-class properties, **zero** exposed instances | **C** |
| Icon scaling after swap | **fails** (RTL Leading, 22×22 in a 20 box) | correct in every configuration | **C** |
| RTL/LTR correctness | correct | correct | tie |
| Designer usability | two-level panel with a nested section | one flat list of nine | **C** |
| Design-to-code traceability | Button→Content Row has no analogue in the CSS | mirrors production markup | **C** |

**Option C approved**, accepting 90 Button variants: reliability and structural correctness
outrank matrix size.

---

## 7. Icon ink — RESOLVED

### 7.1 The original problem

An instance swap **discards per-path paint overrides** — proven, including a swap to the
*same* component. Authored ink held until a swap, then reverted. This affected Option A and
Option C identically, because it is Figma replacing the icon subtree.

### 7.2 The solution shipped by the Figma Agent

The Micons library now owns a **local, published** `Icon Color` collection. Icon artwork is
bound to a single variable whose value is chosen by mode, so colour is selected at the
instance root rather than painted onto paths.

| | |
|---|---|
| Collection | `Icon Color` — key `de25ac2c90026845965c15e7547e953dba1b8e41`, local to the Micons file, published from `Minaa - Icons` |
| Seen from Minaa Components | `VariableCollectionId:de25ac2c…/311:3`, `remote: true` |
| Structure | **one** colour variable, **three** modes |
| Variable | `icon-color`, key `dbe40dbc727d1b62b8cc406648bac94de14b40e1`, `ALL_SCOPES` |
| Modes | `icon-default` `311:0` **(collection default)** · `icon-brand` `311:1` · `icon-brand-secondary` `311:2` |
| Alias targets | Foundations `icon-default` → **#FBF0DC** · `icon-brand` → **#0062AD** · `icon-brand-secondary` → **#E8411D** |

`icon-brand-secondary` is stored **both** ways: it is not the collection default
(`icon-default` is), but **all 1,895 main components carry an explicit pin to it** — which
is why the library reads red, and why parent inheritance does not work.

### 7.3 Library coverage, after the Figma Agent's fix

| | Count |
|---|---|
| Total main components | **1,895** |
| Every solid paint bound to `icon-color` | **1,437** |
| Using **any other variable** | **0** |
| Raw paints in total | 579 |
| Raw paints that actually render | **0** |
| Visible raw offenders | **none** |

The 579 remaining raw paints are all disabled (`visible: false`) and never render.
**Effective coverage: 100%.**

### 7.4 The three corrected icons

| Icon | Node ID | Key | Solid paints | Bound to `icon-color` | Raw |
|---|---|---|---|---|---|
| `Micons/brand/vhf-radio` | `234:1146` | `c7471add…` | 10 | 10 | 0 |
| `Micons/interface/love-solid` | `224:230` | `06b2db8e…` | 10 | 10 | 0 |
| `Micons/e-commerce/deliverybox-02-solid` | `232:105` | `05dfd8e0…` | 21 | 21 | 0 |

Each was instanced from the **published** library in Minaa Components and resolved under
all three modes. Every one rendered **exactly one colour**, matching the mode, with **zero
visible raw paints**:

| Icon | `icon-default` | `icon-brand` | `icon-brand-secondary` |
|---|---|---|---|
| vhf-radio | #FBF0DC | #0062AD | #E8411D |
| love-solid | #FBF0DC | #0062AD | #E8411D |
| deliverybox-02-solid | #FBF0DC | #0062AD | #E8411D |

### 7.5 Swap survival — the decisive test

The mode is stored as `explicitVariableModes` on the instance node — a first-class node
property, **not** a paint override. That is precisely why a swap cannot discard it.

Verified in Minaa Components against the remote published collection, one instance pinned
`icon-default`, swapped through seven steps —
`search-5-line → vhf-radio → love-solid → deliverybox-02-solid → emailsend-5-line →
love-line → search-5-line`. At every step: still an `INSTANCE`, mode still `icon-default`,
rendered colour **#FBF0DC only**, zero visible raw paints.

Also verified (on a Button-shaped harness with the real Phase 4 mechanisms — `INSTANCE_SWAP`
property, `BOOLEAN` visibility, `Direction` variants): the mode survives property-driven
swaps on both slots, Direction changes, Boolean hide/show, reparenting, wrapper
reconfiguration, fresh instances and already-swapped instances — 12 steps, all cream.

### 7.6 Mechanism A vs B — use A

| | Result |
|---|---|
| **A — mode on the icon instance root** | Works in all three colours, survives every swap. **Use this.** |
| **B — mode on a parent frame, icon inherits** | **Fails as-is.** A fresh instance inside a parent set to `icon-default` stays **red**, because it inherits the main component's explicit pin. Works only after clearing each icon's own mode — three actions per variant instead of two. |

### 7.7 Ink mapping for Phase 4

| Appearance | Rest | Active | Focus |
|---|---|---|---|
| Primary | `icon-default` | `icon-default` | `icon-default` |
| Secondary | `icon-default` | `icon-default` | `icon-default` |
| Outline | **`icon-brand`** | `icon-default` | `icon-default` |
| Ghost | **`icon-brand`** | `icon-default` | `icon-default` |
| Ghost Secondary | **`icon-brand-secondary`** | `icon-default` | `icon-default` |

Across 90 Button variants: `icon-brand` on 12, `icon-brand-secondary` on 6, `icon-default`
on 72 — 180 slot assignments. Icon Button (45, one slot): 3 / 3 / 3 / 36.

Derived from `buttons.css:651-659`; no colours invented. `Focus` equals `Active` because
production runs `setP(el, 1)`.

---

## 8. Corrections to earlier findings in this investigation

Recorded because both were stated with more confidence than the evidence supported.

1. **The "24.5% of Micons cannot follow a mode" figure was wrong.** The original scan
   counted raw paints without checking `paint.visible`, so it counted 461 components that
   were carrying *disabled* placeholder paints. Re-measured with the visibility check, only
   3 icons ever had visible raw paint — and the Figma Agent has since fixed all three.
   The remediation plan built on that number (modes on the Foundations `Icons` collection,
   plus a large hygiene pass) was withdrawn.
2. **`arrowround-03-line` is not "artwork drawn at double scale rendering cropped".** The
   glyph (`Ellipse 11` at 2,2 20×20 and `Group 56` at 7,8 10×8) sits entirely inside the
   24×24 frame. The `2,2 → 48,48.5` extent comes from an **unpainted** `24*24` helper vector
   displaced to (24, 24.5). It carries no paint and does not render — the icon renders
   correctly in all three colours. It remains a tidiness defect (it inflates node bounds and
   any bounds-based maths), not a rendering defect.
3. **The superseded mode-simulation.** Before the Micons fix, a 54-variant simulation proved
   that modes on a *local* collection would solve the problem, and proposed adding three
   modes to the Foundations `Icons` collection (which would have consumed its entire
   4-mode pro-tier budget). That proposal is **withdrawn** — the Micons `Icon Color`
   collection achieves the same result without touching Foundations.

### Methodology notes worth keeping

- `absoluteRenderBounds` is clamped by `clipsContent` and reported a false 20×20 for an
  overflowing icon. **Direct-children extents were the honest signal** — the same trap
  Phase 3 recorded.
- A raw paint is only a defect if it **renders**. Check `paint.visible`, `paint.opacity`
  and ancestor visibility before counting one.
- `getVariableCollectionByIdAsync` returns `null` for a remote collection that has not been
  pulled into the file yet. Import a variable by key first; the collection resolves after.

---

## 9. Remaining open items

- **Disabled (Phase 5)** — still deferred; must land in web and Figma together.
- **`arrowround-03-line`** — misplaced unpainted helper vector. Micons tidiness ticket.
- **Duplicate component names in Micons** — the audit surfaced the same names recurring
  across categories (e.g. `clock-6-line`). Not investigated; worth its own ticket.
- **`icon-brand` is used exclusively by no icon** in the library. Harmless under the mode
  mechanism, but it means the semantic layer is not used as originally designed.
- ~~**What becomes of `Button / Content Row` `20:134`**~~ — **resolved.** Proven unused
  (`UNPUBLISHED`, 0 instances across all three pages of 242 scanned) and **deleted** at
  Phase 4 close on Ahmad's instruction. See `buttons-figma-system.md` §5c.

---

## 10. What Option C has not yet proven

The Icon Button family, the Outline stroke, the three remaining appearances, and the real
cost of generating and verifying all 90 variants. Those belong to Phase 4 itself.

---

## 11. Scratch artefacts — removed

All probe artefacts created during this investigation have been deleted:

| Artefact | Where | State |
|---|---|---|
| `🧪 SCRATCH — Option A probe (DELETE)` | Minaa Components | removed |
| `🧪 SCRATCH — Option C probe (DELETE)` | Minaa Components | removed |
| `🧪 SCRATCH — Icon ink mode simulation (DELETE)` | Minaa Components | removed |
| `SIM Icons (DELETE)` local variable collection | Minaa Components | removed |
| `🧪 SCRATCH — published Icon Color verification (DELETE)` | Minaa Components | removed |
| `🧪 SCRATCH — Icon Color swap test (DELETE)` | Micons | removed |

## 12. Scope proof — what was never touched

Verified after every write:

- Foundations `Buttons` page `4246:1302` and the three legacy sets — untouched.
- `Button / Content Row` `20:134` — 6 variants, key `bea20892…`, all 7 property
  definitions unchanged.
- Components `Buttons` page `1:18` — still exactly **1** node.
- Micons: 1,895 main components, names, node IDs, keys, frames, artwork extents and child
  geometry all unchanged; `Icon Color` still 3 modes / 1 variable / default `311:0`;
  no real icon main component modified.
- Foundations variables, `buttons.css`, `buttons.js`, `DESIGN.md`, `CLAUDE.md`,
  Git history — all unchanged. Nothing published by this investigation.
