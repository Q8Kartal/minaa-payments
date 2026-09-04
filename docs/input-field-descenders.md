# The input field: Arabic descenders cut — and how it was fixed

2026-09-04 · Ahmad + Claude · confirmed on iPhone the same day

## The problem

Arabic letters with a bowl — **ج ح خ ع** — rendered with the bottom cut off
inside every `<jelly-input>`. Latin was fine. Divs were fine. Only the field.

## Two causes that looked like one

| where | cause | fix |
|---|---|---|
| **Desktop** | 29LT Idris Round declares 0.300 em of descent; its ink reaches 0.429. Chrome sizes an input's inner editor from the declared metric and clips. | `descent-override: 54%` (the foundry's own `usWinDescent`) on two extra `@font-face` families used **only** by `::part(input)` / `::part(textarea)`. Font binary untouched. |
| **iOS** | A single-line native `<input>` cuts these glyphs **at any metric**, and nothing set on it helps. iOS doesn't apply `descent-override` at all. A `<textarea>` or any `<div>` in the same box renders whole. | The input stops painting text. `field-mirror.js` paints the value in a div beneath it. |

## What failed first (don't re-chase)

Glyph mis-mapping · more descent headroom · `direction` · focus ·
`text-size-adjust` · the root `overflow-x: clip`. Six hypotheses, six wrong.

The reason it took a day: **every harness rendered whole**, including the
live page inside an iframe. Each one had silently removed the cause. The
answer came only from bisecting *inside* the live page at top level, and from
reading the cut off Ahmad's screen, not a downscaled screenshot.

## The fix — `field-mirror.js`

Loaded by the component library **and** the app. For every `jelly-input`:

- **Native input keeps everything Jelly binds to** — focus, blur, input,
  change, `selectionStart`, `scrollLeft`, keyboard, autofill, forms, password
  masking. Membrane and physics untouched.
- It loses only its ink: `-webkit-text-fill-color: transparent`. **Never
  `color`** — the caret draws in it and the mirror copies it.
- **The mirror**, a div beneath the input in the same shadow root, carries the
  input's *copied* font, size, weight, spacing and line-height, so caret and
  glyphs share one baseline. Colour re-read every paint, so the theme follows
  (light = Secondary 600). Clips at the content box like the native editor.
  Follows `scrollLeft` in LTR and RTL. Draws the selection band itself. Shows
  the placeholder in the input's own `::placeholder` colour.
- `type="password"` stays native — bullets have nothing to clip.
- Reflects `maxlength`, which Jelly doesn't pass through.

## Fixed on the way

- Mirror colour was frozen at attach → light mode showed dark-mode cream. Now live.
- Mirror clipped at the padding box → text ran under the pill. Now the content box.
- **RTL eyebrow broke every join on iPhone**: `letter-spacing: .14em` on Arabic.
  Blink ignores tracking on cursive scripts, WebKit doesn't. `html[dir="rtl"]`
  zeroes it. Not from this work — dated from the first library commit.
- `-webkit-text-size-adjust: 100%` on the root — didn't fix this, stays as a reset.

## Status

- ✅ iPhone: C‑05 whole, light mode correct, long text follows the caret, eyebrow joined.
- ⏳ PC: needs a hard reload — its cut was never cache-checked.
- ⏳ `maxlength`: 40 on the placeholder controller, 64 on demo/value — Ahmad's numbers to confirm.
- 🧪 Diagnostics (`font-ios-check.html`, `font-ios-bisect.js`, `?bisect` hook) stay
  until the PC question is answered, then come out together.

## Reference

The field's typography, sizing and baseline: **C‑05 on the component
library**, not `minaa-payments.html`. Full detail: `CLAUDE.md` → Known Quirks.
