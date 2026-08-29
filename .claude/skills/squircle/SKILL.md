---
name: squircle
description: Apply the Minaã squircle to any surface — a card, a panel, a box, a component. Use when Ahmad points at something and says it needs the squircle shape, squircle logic, or "the same shape as the dialog". Carries the geometry, the painting method, the four traps that have already cost real bugs, and the verification protocol.
---

# The Minaã squircle

Ahmad points at a surface and says it needs the squircle. This is how, and —
more importantly — this is what has already gone wrong four times.

**The shape is painted, never clipped. That single rule is most of this skill.**

---

## 1. What the shape is

A superellipse with **exponent 4**:

```
|x/r|⁴ + |y/r|⁴ = 1
x = r·(cos t)^0.5,  y = r·(sin t)^0.5,  t ∈ [0, π/2]
```

Exponent 4 is **measured, not chosen**. Binary-searching the boundary Chrome
paints for `corner-shape: squircle` against the analytic curve, on a 150px
corner: **0.80px mean error at exponent 4**, 7.32px at 3, 2.64px at 5. 0.80px on
150 is antialiasing. Do not "improve" it without re-measuring.

CSS spells this `superellipse(2)` — the argument is **not** the exponent, the
curve is `|x|^(2^s) + |y|^(2^s) = 1`. Writing `superellipse(4)` gives exponent
16, which is squarer than a plain rounded rectangle. That mistake shipped once.

### Never use `corner-shape` in CSS

It is the bug that started all of this. `corner-shape` is very new; an engine
without it does not approximate the curve, it **drops the declaration** and
leaves `border-radius` standing alone. At `--radius-full` that is a pure pill,
and an iPhone rendered exactly that while desktop Chrome looked correct.

A superellipse is arithmetic. Generate the path and there is nothing to
feature-detect and no fallback to degrade to.

---

## 2. The generator

`window.minaaSquirclePath(w, h, radius)` — defined in `components/minaa-jelly.js`
(`minaaSquircle`), exposed on `window` precisely so page code can reuse it.
**Never reimplement it.** Two copies of the maths is two shapes the day one is
edited.

```js
const d = minaaSquirclePath(el.clientWidth, el.clientHeight, radius);
```

### The radius is a CAP, not a pin

```css
--m-surface-corner: 64px;   /* minaa-jelly.css, declared once, not per mode */
```

The generator takes `min(cap, half the short side)`. That one value gives:

| surface | size | corner | limited by |
|---|---|---|---|
| dialog | 508×129 | 64.5 | its own geometry |
| drawer (bottom) | 1248×129 | 64 | its own geometry |
| drawer (end) | 360×688 | 64 | the cap |
| popover | 268×87 | 44 | its own geometry |
| tooltip | 138×31 | 15.5 | its own geometry |
| cards | any | 64 | the cap |

Without the cap the corner tracks a panel's **size** instead of its **role**, and
the family comes apart — a tall drawer sheet asks for 180 and stands a capsule
on end. With it, one token, many correct corners.

`64px` is the only raw value in that block. The radius scale stops at 24 because
24 is right for fields and cards; an overlay is neither. **This gap has now cost
something three times** (the dialog radius, the missing Figma Radius collection,
the drawer cap). A `radius-64` step, or a Radius collection both files read,
would absorb it — worth raising, not worth blocking on.

---

## 3. How to apply it

### Page surfaces (light DOM)

`wireSquircleCards()` in `components/showcase.js`. Add the selector, then:

```css
.thing {
  position: relative;                    /* the layer positions against this */
  --m-squircle-fill: var(--m-page);      /* omit → --m-card */
  border-radius: var(--radius-16);       /* pre-paint fallback ONLY */
}
```

The function inserts `[data-sq-fill]` as the first child: `position:absolute;
inset:0; z-index:-1; pointer-events:none`, carrying the fill and the clip. **The
element itself is never clipped.**

`z-index: -1` rather than `isolation: isolate` on the parent. Isolating would
also put the layer behind the content, but it traps any overlay's z-index inside
that element — trading a clipping bug for a layering one.

### Shadow-DOM components

`minaaSquircle()` in `minaa-jelly.js`. Add the tag to `TAGS` and the panel class
to the selector (`.dialog, .sheet, .panel, .bubble`). Give the host
`--m-squircle-radius` if it needs a cap other than the default.

### A visible edge

**A clipped or painted squircle must not have a `border`** — see trap 2. Ask for
a stroked path instead:

```css
.thing { --m-squircle-ring: 1; }
.thing > [data-sq-ring] { color: var(--m-stroke); }
```

Drawn as the same superellipse, stroked at `--control-stroke`, **inset by half
its own width** so the full weight lands inside the shape. A stroke centred on
the boundary loses its outer half and renders at half weight.

---

## 4. The four traps

Each one shipped. Check all four before saying a surface is done.

### 1 · `clip-path` clips `position: fixed` descendants

`overflow: hidden` does not; `clip-path` does. Clipping a card cut the popover
and menu panels off at the card's edge — they are fixed children of it. The
dialog and drawer escaped only because they portal to `document.body`.

**→ Paint the shape on a layer behind the content. Never clip a container.**

### 2 · A border cannot follow a superellipse

A border is painted on the border-box **rectangle**. The clip keeps the straight
middle of each edge and cuts the corners, leaving four hairlines around a shape
they no longer trace.

**→ Use the ring. Never leave a `border` on a squircled surface.**

### 3 · Clipping removes the shadow

Clipping is applied **after** filtering, so a clipped element cannot shadow
itself — verified with two identical boxes, one carrying `drop-shadow`, neither
casting anything. The shadow must live on an **ancestor**:

- dialog → `.wrap`
- drawer → `:host`
- popover → an inserted wrapper, **pinned to the viewport** (`position:fixed;
  inset:0; pointer-events:none`). A plain wrapper broke it: `filter` makes an
  element a containing block for `position:fixed`, and the panel collapsed from
  273×89 to 140×136. Pinning it to the viewport keeps it a containing block but
  an *identical* one, so the panel's coordinates still land.
- tooltip → has no shadow, so it needs no wrapper. `LIFT` names only the popover.

### 4 · Scroll containers

`overflow-x: auto` **forces `overflow-y` to `auto`** — a not-visible value on one
axis computes the other. So a scroller clips vertically too, and an absolutely
positioned layer inside one scrolls away with the content.

**→ Put the scroll on an inner element and the shape on the outer, and put the
padding on the SCROLLER** so focus rings have room inside the clip. The OTP boxes
sat flush at `top: 0` and had their focus ring sliced off.

---

## 5. Figma

**Figma corner smoothing is not a superellipse.** Checked directly: at radius 56
on a 112-tall panel, `cornerSmoothing: 1` renders a **stadium** where the same
radius as a superellipse is a proper squircle. It cannot be the source of truth
for a shape that also ships in code.

Draw a `VectorNode` from the same maths instead — transcribe `squirclePath` into
the `use_figma` script so both sides come from one algorithm. Bind the fill to a
Foundations variable; seed the resolved colour into the paint **and** bind the
variable, because `setBoundVariableForPaint` returns a paint still holding black
and relies on Figma resolving it on assignment, which silently does not always
happen.

Limitation to state, not hide: a drawn path does not stretch. Use MIN/MIN
constraints and regenerate rather than scale — scaling a superellipse
non-uniformly distorts the corners, which is the thing being avoided.

---

## 6. Verify before reporting

Never report a shape as correct from a screenshot alone, and never from a
measurement alone.

1. **Is the pane visible?** `document.visibilityState` / `innerWidth`. A hidden
   pane reports `0×0` for everything. This produced a string of phantom "bugs".
2. **Has it settled?** Overlays animate in through a collapsed state — 33×33,
   47×47, 48×48 are all mid-flight readings I have believed. Poll until the size
   is stable for several reads; do not trust a timer.
3. **Assert the DRAWN corner**, from the clip path itself:
   ```js
   getComputedStyle(el).clipPath.match(/M ([\d.]+) ([\d.]+)/)[2]
   ```
   Not the token — the token is the cap, the drawn value is the answer.
4. **No clipped element has a border:**
   ```js
   [...document.querySelectorAll('*')]
     .filter(el => (getComputedStyle(el).clipPath || '').startsWith('path('))
     .filter(el => parseFloat(getComputedStyle(el).borderTopWidth) > 0)
   ```
   Must be empty.
5. **Both modes**, and reset `jelly-theme` to `auto` afterwards.
6. **Overlays still escape:** open a popover or menu inside the surface and
   confirm the panel is whole where it overhangs.

---

## 7. Reference

| thing | where |
|---|---|
| generator | `components/minaa-jelly.js` → `minaaSquircle()` |
| shadow-DOM application | same file, `TAGS` / `LIFT` |
| page application | `components/showcase.js` → `wireSquircleCards()` |
| corner cap | `components/minaa-jelly.css` → `--m-surface-corner` |
| fill / ring hooks | `--m-squircle-fill`, `--m-squircle-ring`, `--m-squircle-radius` |
| layer + ring styling | `components/showcase.css` → `[data-sq-fill]`, `[data-sq-ring]` |
