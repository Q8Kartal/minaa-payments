# Buttons — reconstruction audit

The audit stage of the expanded Phase 7 objective: turning the `Buttons` page
into a complete, self-contained reconstruction specification.

**This is the audit, not the specification.** It records verified facts,
discrepancies, and the decisions needed before the specification can be written.
Four of the rules currently on the `Buttons` page were introduced without
approval, and the Focus state no longer matches production — writing the
specification before those are settled would bake both problems in.

- **Date:** 2026-08-27
- **Evidence used:** the live Minaã Components file, the deployed English
  reference build, and the current production implementation. The finished
  specification will not depend on any of them.
- **Nothing was modified.** Components, variants, properties, reactions and
  variables are untouched; both sets remain `CURRENT`.

---

## 1 · Verified construction facts

### 1.1 Component set identity

| | Button | Icon Button |
|---|---|---|
| Set name | `Button` | `Icon Button` |
| Variants | **120** | **60** |
| Default variant | `Appearance=Primary, Size=48, State=Rest, Direction=RTL` | `Appearance=Primary, Size=48, State=Rest` |
| Matrix | Appearance (5) × Size (3) × State (4) × Direction (2) | Appearance (5) × Size (3) × State (4) |

The default variant is whichever component occupies the **top-left cell of the
grid**. Layout position decides it — not child order, not name.

### 1.2 Property schema

**Button — 9 properties.** Four variant axes:

| Axis | Values (in stored order) | Default |
|---|---|---|
| `Appearance` | Primary · Secondary · Outline · Ghost · Ghost Secondary | Primary |
| `Size` | 48 · 56 · 40 | 48 |
| `State` | Rest · Active · Focus · Disabled | Rest |
| `Direction` | RTL · LTR | RTL |

Five component properties:

| Property | Type | Default |
|---|---|---|
| `Label` | TEXT | `دقمة` |
| `Leading Icon` | BOOLEAN | **true** |
| `Trailing Icon` | BOOLEAN | **false** |
| `Leading Icon Swap` | INSTANCE_SWAP | `search-5-line`, 3 preferred values |
| `Trailing Icon Swap` | INSTANCE_SWAP | `search-5-line`, 3 preferred values |

**Icon Button — 4 properties.** The same three variant axes (no `Direction`),
plus one `Icon Swap` (INSTANCE_SWAP, `search-5-line`, 3 preferred values).

### 1.3 Layer hierarchy — Button variant

```
COMPONENT  "Appearance=…, Size=…, State=…, Direction=…"
   layoutMode HORIZONTAL · primaryAxisSizing AUTO (hug) · counterAxisSizing FIXED
   primaryAxisAlign CENTER · counterAxisAlign CENTER · clipsContent false
   padding 0 / inline / 0 / inline   (vertical padding is 0; height fixes the box)
   itemSpacing bound · sizingH HUG · sizingV FIXED · constraints MIN/MIN
   bound: height, paddingLeft, paddingRight, itemSpacing, all four radii, fills
          (+ strokes and all four stroke*Weight on Outline only)
   │
   ├─ FRAME "Leading Icon"  |  order depends on Direction
   │     layoutMode NONE (a plain fixed frame, not auto-layout)
   │     clipsContent false · sizingH/V FIXED · bound: width, height
   │     propRef  visible → "Leading Icon"
   │     └─ INSTANCE "icon"
   │           main = a Micon · clipsContent true (from the Micon itself)
   │           scaleFactor = iconBox / 24
   │           explicit Icon Color mode
   │           propRef  mainComponent → "Leading Icon Swap"
   │
   ├─ TEXT "Label"
   │     text style per size · autoResize WIDTH_AND_HEIGHT · sizingH/V HUG
   │     textAlign LEFT / TOP
   │     bound: fills (+ fontSize, fontStyle, fontFamily, lineHeight,
   │            paragraphSpacing, all inherited from the text style)
   │     propRef  characters → "Label"
   │
   └─ FRAME "Trailing Icon"   — same construction as Leading
         propRefs  visible → "Trailing Icon" · mainComponent → "Trailing Icon Swap"
```

**Child order carries direction.** RTL: `Trailing Icon · Label · Leading Icon`.
LTR: `Leading Icon · Label · Trailing Icon`. Nothing else differs between the
two directions.

### 1.4 Layer hierarchy — Icon Button variant

```
COMPONENT  "Appearance=…, Size=…, State=…"
   layoutMode HORIZONTAL · primaryAxisSizing FIXED · counterAxisSizing FIXED
   primaryAxisAlign CENTER · counterAxisAlign CENTER · clipsContent false
   padding 0 all round · itemSpacing 0
   bound: width AND height both to the same Button height token, all four radii, fills
          (+ strokes and stroke*Weight on Outline only)
   │
   └─ FRAME "Icon"
         layoutMode NONE · clipsContent false · sizingH/V FIXED
         bound: width, height
         └─ INSTANCE "icon"   — as above; propRef mainComponent → "Icon Swap"
```

Binding **both** dimensions to one height token is what stops the square drifting.

### 1.5 Tokens and resolved values

| Token | Resolves to |
|---|---|
| `Button height/56` · `/48` · `/40` | 56 · 48 · 40 |
| `Button space/24` → `space-300` | 24 |
| `Button space/20` → `space-250` | 20 |
| `Button space/16` → `space-200` | 16 |
| `Button space/8` → `space-100` | 8 |
| `Button radius/Full` | **999** |
| `Button icon size/20` · `/16` | 20 · 16 |
| `Button stroke width/Outline` | 1.5 |
| `Colors/Primary/700` | `#0062AD` |
| `Colors/Secondary/600` | `#E8411D` |
| `Colors/Neutral/100` | `#FBF0DC` |
| `Colors/Neutral/200` | `#F7E0B6` |
| `Colors/Neutral/700` | `#895A30` |

The four `Button space/*` tokens are **aliases** into the Spacing collection, so
their values follow the spacing scale. The height, icon-size and stroke-width
tokens are deliberately **not** aliased — they are component dimensions, and must
not move if the spacing scale is revised.

### 1.6 Typography per size

| Size | Text style | Resolved | Font |
|---|---|---|---|
| 56 | `Text xl/Medium` | 20 / 30 | 29LT Idris Round Medium |
| 48 | `Text lg/Medium` | 18 / 28 | 29LT Idris Round Medium |
| 40 | `Text md/Medium` | 16 / 24 | 29LT Idris Round Medium |

### 1.7 Icon Color modes

| Mode | Mode id | Alias |
|---|---|---|
| `icon-default` | `311:0` (collection default) | Foundations `icon-default` → `#FBF0DC` |
| `icon-brand` | `311:1` | Foundations `icon-brand` → `#0062AD` |
| `icon-brand-secondary` | `311:2` | Foundations `icon-brand-secondary` → `#E8411D` |
| `icon-disabled` | `330:0` | **`Colors/Neutral/700` directly** → `#895A30` |

`icon-disabled` bypasses the semantic layer deliberately — no `icon-disabled`
exists in the Foundations Icons collection and creating one was out of scope.

### 1.8 The complete state matrix — verified on all 20 combinations

| Appearance | State | Fill | Label ink | Icon mode | Stroke |
|---|---|---|---|---|---|
| Primary | Rest | Primary/700 | Neutral/100 | icon-default | — |
| Primary | Active · Focus | Secondary/600 | Neutral/100 | icon-default | — |
| Secondary | Rest | Secondary/600 | Neutral/100 | icon-default | — |
| Secondary | Active · Focus | Primary/700 | Neutral/100 | icon-default | — |
| Outline | Rest | Neutral/100 | Primary/700 | **icon-brand** | Primary/700 |
| Outline | Active · Focus | Primary/700 | Neutral/100 | icon-default | Primary/700 |
| Ghost | Rest | Neutral/100 | Primary/700 | **icon-brand** | — |
| Ghost | Active · Focus | Primary/700 | Neutral/100 | icon-default | — |
| Ghost Secondary | Rest | Neutral/100 | Secondary/600 | **icon-brand-secondary** | — |
| Ghost Secondary | Active · Focus | Secondary/600 | Neutral/100 | icon-default | — |
| **All five** | **Disabled** | **Neutral/200** | **Neutral/700** | **icon-disabled** | Neutral/700 *(Outline only)* |

### 1.9 Prototype reactions

45 Rest variants (30 Button, 15 Icon Button) carry two reactions each —
`ON_HOVER` and `ON_PRESS` → the matching Active variant, `SMART_ANIMATE`,
easing `GENTLE`, duration `0.3s`. **90 reactions, none on Active, Focus or
Disabled.**

---

## 2 · Figma ↔ production parity

Every measurable value agrees, verified independently on both sides: heights,
inline padding, gap, type sizes and line heights, icon boxes, radius, Outline
stroke colour and weight, and the Disabled pair. The live build serves the
current asset version and includes the Disabled section with seven disabled
controls, `tabIndex 0`, `aria-disabled="true"` and host opacity 1.

**Looks like a mismatch but is not:** Figma's canonical Primary/48/leading
measures **89** wide, production **105.58**. The geometry is identical; the
label differs — Figma's default is Arabic `دقمة` (21px), the English build says
"Button" (37.6px).

---

## 3 · Discrepancies requiring a decision

### 3.1 Focus is no longer visually identical to Active

The fills and inks are identical, as approved. But the focus indicator added
later — **3px Primary/700 at 3px offset** — is drawn by production and **is not
represented on the 30 Figma Focus variants at all**. The Figma Focus state is
therefore an incomplete picture of the real one.

*Either* add the indicator to the Focus variants (a component change needing
approval) *or* state the omission explicitly in the specification.

### 3.2 Directional icons have no RTL mechanism, in either family

Button mirrors **slot order**; it does not mirror the **glyph**. An arrow or
chevron points the same way in both directions. Icon Button has no direction
axis at all — justified as "a centred single icon has no reading order", which
is true for symmetric glyphs and **false for directional ones**.

This is an architectural gap, not a documentation gap.

### 3.3 `prefers-reduced-motion` is absent in production

Confirmed on the live build. The Jelly specification states it as a requirement,
so this is a live conformance gap.

---

## 4 · Contrast, with compliance status

All three sizes are **normal text** for WCAG purposes — 20 / 18 / 16px at Medium
(computed weight 640) does not reach the 18.66px-bold large-text threshold.
**4.5:1 applies at every size.**

| Combination | Ratio | AA |
|---|---|---|
| Primary Rest · Outline Rest · Ghost Rest | 5.55:1 | **PASS** |
| Any cream on Primary/700 — Secondary Active/Focus, Outline & Ghost Active/Focus | 5.55:1 | **PASS** |
| Disabled, all five appearances | 4.57:1 | **PASS** |
| **Secondary Rest** | 3.57:1 | **FAIL** |
| **Ghost Secondary Rest** | 3.57:1 | **FAIL** |
| **Any cream on Secondary/600** — Primary Active/Focus, Ghost Secondary Active/Focus | 3.57:1 | **FAIL** |

**Every combination placing cream on Secondary/600, plus Secondary Rest and
Ghost Secondary Rest, fails AA for normal text.** This is consistent with what
the stylesheet already concedes for toast triggers. It is a product decision,
not something documentation can resolve.

Disabled is exempt under WCAG 1.4.3 regardless, and passes anyway.

---

## 5 · Audit of the seven statements

| Statement | Status |
|---|---|
| Exactly one Primary per view | **Introduced without approval.** Not in any source. Remove, or label a recommendation. |
| Width is never set | **Split.** *Fact:* both families hug and the min-width floor is released. *Recommendation:* "never override it". |
| Secondary has equal structural weight | **Partly sourced.** The source says the labels "show hierarchy, not brand importance"; "equal structural weight" is an extrapolation. |
| Destructive actions never use colour | **Sourced and approved** — the system reserves no brand hue for destruction; errors use semantic Orange. The added claim about "wording and confirmation" is unsourced. |
| Disabled stays in keyboard order | **Approved and verified** — `tabIndex 0`, `aria-disabled="true"` on host and inner element. Fact. |
| Focus identical to Active | **Approved but now inaccurate** — see §3.1. |
| Directional Icon Buttons need no RTL handling | **Wrong as written** — see §3.2. |

---

## 6 · Decisions needed before the specification is written

1. **Focus indicator** — add it to the 30 Figma Focus variants, or document the omission?
2. **Directional icons in RTL** — document as a known limitation, or raise as a component change for a later phase?
3. **The Secondary/600 contrast failures** — document as known non-conformance, or does this warrant a colour decision?
4. **The four unapproved rules** — approve as normative, demote to labelled recommendations, or drop?

Once these are settled the specification can be written with each statement
correctly classified as a **verified construction fact**, an **approved usage
rule**, an **accessibility requirement**, or a **labelled recommendation** — the
separation the expanded objective requires.

---

## 7 · Scope untouched

No component, variant, property, reaction, variable or production file was
modified during this audit. Both component sets remain `CURRENT`. Nothing was
published, committed or pushed.
