# Buttons documentation — what is in each section

A readable index of the Minaã Components `Buttons` page, so its content can be
reviewed without opening Figma.

**The Figma page is the artefact; this file is a companion index.** If the two
disagree, the Figma page is what ships.

The page is a **complete reconstruction specification**: a designer, developer or
agent who has never seen the existing components should be able to rebuild both
families in an empty Figma file, build an equivalent production implementation,
and verify that both match — using only what is on that page. It therefore names
no repository, no deployed address, no filename, no package and no framework.

- **File:** Minaã Components · **Page:** `Buttons`
- **Sections:** 13 · **Tables:** 18
- **Last updated:** 2026-08-27

| Section | Node ID | Size |
|---|---|---|
| 01 — Overview | `171:905` | 1440 × 1638 |
| 02 — Component architecture | `171:956` | 1440 × 1914 |
| 03 — Property model | `171:1027` | 1440 × 2070 |
| 04 — Tokens and resolved values | `172:902` | 1440 × 2106 |
| 05 — State matrix | `172:1041` | 1440 × 1834 |
| 06 — Construction procedure | `172:1208` | 1440 × 2442 |
| 07 — Usage guidance | `174:902` | 1440 × 2504 |
| 08 — Runtime and behavioural contract | `174:991` | 1440 × 2110 |
| 09 — Prototype motion in Figma | `153:926` | 1440 × 1610 |
| 10 — Jelly — motion specification | `155:909` | 1440 × 5864 |
| 11 — Accessibility and contrast | `174:1090` | 1440 × 1812 |
| 12 — Verification and parity checklist | `175:902` | 1440 × 2698 |
| 13 — Known limitations and open items | `175:969` | 1440 × 1390 |

Every statement on the page is labelled as one of four kinds: **verified
construction fact**, **requirement**, **recommendation**, or **known
limitation**.

---

## 01 — Overview

What the specification is for and how to read it, the four statement kinds, and
the two families. Icon Button is a separate family, not a Button with its label
hidden: it is square rather than hugging, both dimensions derive from one token,
and it has no direction axis. Includes the family table (120 / 60 variants, axes,
component properties) and the contents list.

## 02 — Component architecture

The exact layer hierarchy of both families.

**Button root** — Auto Layout HORIZONTAL, primary axis AUTO (hug), counter axis
FIXED, both alignments CENTER, clipping OFF, vertical padding 0, constraints
MIN/MIN. Bound: height, padding-left, padding-right, item spacing, all four
radii, fill; Outline adds stroke colour and all four stroke weights.

**Icon slots** — plain FRAMEs, *not* Auto Layout, fixed, both dimensions bound to
the icon-size token, clipping OFF, visibility driven by a Boolean. Each contains
one icon INSTANCE at 0,0 scaled by icon box ÷ 24 with an explicit Icon Color
mode, its main component driven by a swap property.

**Label** — TEXT, auto-resize WIDTH_AND_HEIGHT, hugging both axes, one text
style per size, alignment LEFT/TOP in both directions (no visual effect on a hug
node), fill bound, characters driven by a text property.

**Direction by layer order** — RTL: Trailing · Label · Leading. LTR: Leading ·
Label · Trailing. Nothing else differs. Requirement: direction is structural,
never inferred from text.

**Icon Button root** — both axes FIXED, width *and* height bound to the same
height token, padding and spacing 0, one always-present slot named `Icon`, no
Boolean, no label. Includes a table of the structural differences.

Also explains why the icon wrapper exists: binding a size token to an instance
performs a resize and crops the glyph, so the wrapper carries the binding and the
instance carries the scale.

## 03 — Property model

Full schema. Button's four axes (Appearance 5, Size 3, State 4, Direction 2) with
values in stored order and defaults, and five component properties (`Label` TEXT
`دقمة`; `Leading Icon` BOOLEAN true; `Trailing Icon` BOOLEAN false; two
INSTANCE_SWAPs defaulting to a line-style search glyph with three preferred
values). Icon Button: same three axes, no Direction, one `Icon Swap`.

Explains **which controls are axes and which are properties** — an axis is
anything that changes what is painted; a property is anything a single variant
can carry as an override. Requirement: never add an axis for something a property
can carry, since one extra Size value adds 40 Button and 20 Icon Button variants.

Matrix arithmetic (5 × 3 × 4 × 2 = 120; 5 × 3 × 4 = 60; 180 combined) and the
default variant, including the requirement that the default is decided by
**grid position**, and how to protect the top-left cell.

## 04 — Tokens and resolved values

Every token with its exact member and resolved value — no token family named
without one.

Per size: height (56/48/40), inline padding (24/20/16), icon box (20/20/16),
icon scale factor (0.8333 / 0.8333 / 0.6667), text style and resolved type
(20/30, 18/28, 16/24). Constant across sizes: gap 8, radius 999, Outline stroke
1.5, vertical padding 0, Hug width.

Colour table: `#0062AD`, `#E8411D`, `#FBF0DC`, `#F7E0B6`, `#895A30`, each with
what it is used as. Icon colour mode table with resolved values and which states
use each.

Records the deliberate asymmetry: the spacing tokens **alias** the spacing scale,
while height, icon size and stroke width **do not** — they are component
dimensions and must not move if the spacing scale is revised.

## 05 — State matrix

All 20 Button combinations as one table: appearance, state, fill, label ink, icon
mode, stroke. Identical at all three sizes and in both directions. Icon Button is
identical minus the label column.

Reading notes: Active and Focus are the same paint by design; Disabled collapses
the appearance axis onto one neutral pair with Outline alone keeping a stroke;
quiet appearances invert on interaction.

## 06 — Construction procedure

A 27-step sequential rebuild from an empty file, in six stages: prerequisites,
build one variant, repeat and combine, properties and wiring, Icon Button,
prototype motion, publish and verify.

Includes the traps that silently produce a wrong result: a uniform stroke weight
is stored as four per-side weights; combining variants leaves the set frame at
its pre-layout size; the top-left grid cell decides the default; an instance-swap
default takes a node identifier while preferred values take keys; binding a size
token to an icon instance crops it; publishing and *accepting* a library update
are two separate steps, and publishing is manual in the current workflow; and
explicit icon colour modes must be re-verified after any library operation that
can affect variable-mode assignments — accepting an update is the known case —
with any mode that did not survive re-applied.

## 07 — Usage guidance

Every statement labelled a requirement or a recommendation.

Appearance table (what each is for) and a recommendation to start from emphasis.
**Requirement:** no brand hue represents destruction; semantic errors use the
orange error colour, which is never a button appearance.

Size table and a recommendation to choose from surface density.

**Width** — verified fact: Hug is the default. **Fill Container is allowed** where
the layout requires a full-width or equal-width control; it is a supported
configuration, not a workaround.

Label recommendations. Icon slot table (leading qualifies, trailing follows,
both only when both questions have answers, neither reserves nothing).
**Requirements:** icon colour is a mode never a paint; an Icon Button always
carries an accessible name.

**Direction requirements:** direction is a variant carried by layer order; and
**directional glyphs must be mirrored or replaced with the locale-correct glyph**
— mirroring slot order does not mirror the glyph.

## 08 — Runtime and behavioural contract

How the four Figma states map to real behaviour: what each means, how it is
entered, what it must do.

Input table covering hover, press, release, pointer cancellation, touch and
keyboard. Hover and press are one continuous response. Release retracts rather
than cutting. Cancellation is treated as release. Pressure is optional and must
never be required.

Accessible naming and disabled semantics, including that suppressing pointer
events does not stop a dispatched event — a disabled control must be excluded
from the motion system, not merely made unclickable.

**Reduced motion** stated as a requirement, with the known limitation that the
current web implementation does not yet satisfy it.

Closes with a table separating **invariant behaviour** from **platform choice**.

## 09 — Prototype motion in Figma

*Built in Phase 6; renumbered only.* The division of labour, what the prototype
transition is and is not, why no preset can be the specification, the verified
limitations (no focus trigger, Disabled inert, only named presets, no video
capture), and a placeholder for a production reference recording.

## 10 — Jelly — motion specification

*Built in Phase 6; renumbered, with an implementation-lifecycle section added.*

Purpose and perceptual character · the four-point invariant contract (measured
not timed, never self-completing, origin at the real contact point, no layout
effect) · platform-neutral pseudocode with tunable reference values · reveal,
settling and layout invariance · state behaviour · input requirements including
cancellation and reduced motion · what may be tuned versus what must not change ·
nine acceptance criteria and a nine-step verification checklist · platform
independence.

**Added:** an implementation lifecycle covering attach, update, resize, cancel,
settle and clean up — including that disabled controls are excluded at attach
rather than suppressed later, that the resting baseline is discarded on resize,
and that nothing may be left running behind a removed control.

## 11 — Accessibility and contrast

The applicable threshold is **4.5:1 at every size** — 20, 18 and 16px at Medium
do not reach the large-text threshold.

Full measured table with pass/fail. **PASS:** Primary Rest, Outline and Ghost
Rest, all pale-on-Primary/700 combinations (5.55:1), and Disabled (4.57:1).
**FAIL — known non-conformance at 3.57:1:** Secondary Rest, Ghost Secondary Rest,
Primary Active and Focus, Ghost Secondary Active and Focus — every combination
placing pale ink on `Colors/Secondary/600`.

**Focus indicator requirement:** 3px `Colors/Primary/700` at 3px offset, on both
families, following the rounded silhouette, applying to disabled controls too.
Known limitation: the current Figma Focus variants do not represent it.

**Architectural limitation:** Figma cannot show the ring on a disabled control.
`State` is a single mutually exclusive property — Rest / Active / Focus /
Disabled — so Disabled and Focus cannot both be selected on one variant, and the
combination §08 requires at runtime has no representation in the component set.

Includes the note that a control delegating focus inward matches the
focus-visible condition on the inner element, not the outer one.

Other requirements: accessible names, disabled keyboard order, no state by
opacity alone, reduced motion. Recommendation on touch-target size at 40.

## 12 — Verification and parity checklist

Grouped, observable checks: Figma reconstruction (12), resolved values (5),
prototype motion (3), production parity (4), behaviour (7), accessibility (6).

Closes with the three ways the checklist is commonly failed while appearing to
pass: checking that a value is *bound* rather than what colour is *drawn*;
auditing a hidden slot and believing the result; and trusting a numeric audit for
anything spatial.

## 13 — Known limitations and open items

**Against this specification:** all **45** Focus variants — 30 on Button, 15 on
Icon Button — omit the required focus ring; neither family provides a mechanism
for directional glyphs; reduced motion is not implemented in the current web
build; nine colour combinations fail the contrast requirement; and **Disabled and
Focus cannot be represented together**, because `State` is one mutually exclusive
property while the runtime contract requires a disabled control to stay
keyboard-focusable and show the ring.

**Affecting this documentation:** corner radii are raw values because the radius
tokens are unpublished; the white surface uses the neutral zero step because the
dedicated white token is unpublished; panel stroke weight is a raw 1 because no
stroke-weight token exists.

Each item is a component change, a colour decision, an implementation task, or a
token to publish — none is resolved by editing the page.

---

## Build audit

| Check | Result |
|---|---|
| Raw fills · raw strokes | 0 · 0 |
| Unbound padding · unbound gaps | 0 · 0 |
| Text without a style · text with a raw fill | 0 · 0 |
| Emoji or Unicode symbols | 0 |
| Raw corner radii | 65 — the unpublished radius tokens |

**Variables used** — `Colors/Primary/700` ×780, `Colors/Neutral/200` ×154,
`Colors/Neutral/50` ×52, `Colors/Primary/50` ×18, `Colors/Primary/100` ×18,
`Colors/Neutral/100` ×13, `Colors/Neutral/0` ×13; `space-200` ×305, `space-100`
×52, `space-600` ×39, `space-400` ×34, `space-300` ×31, `space-1000` ×13, plus
`space-150` on table rows.

**Text styles used** — `Text sm/Regular` ×357, `Text md/Regular` ×194,
`Text xl/ExtraBold` ×65, `Text md/Medium` ×56, `Text sm/ExtraBold` ×55,
`Text lg/Regular` ×23, `Display sm/ExtraBold` ×13, `Display xs/Regular` ×13,
`Text md/ExtraBold` ×4.

**Components untouched** — Button 120 variants / 9 properties, Icon Button 60 / 4,
45 Rest variants carrying 90 GENTLE reactions and no others, both sets `CURRENT`.
