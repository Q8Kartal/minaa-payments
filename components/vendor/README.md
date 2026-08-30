# Jelly UI — vendored, with a small deliberate diff

`jelly.js` is Jelly UI, MIT-licensed, by [bmson.com](https://bmson.com),
downloaded verbatim from `https://jelly-ui.com/dist/jelly.js`.

**The physics is untouched.** Not one spring constant, damping figure or paint
routine has been changed. The diff adds tokens and nothing else.

## Why it is vendored at all

Because four things the Minaã specification asks for turned out to be
structurally unreachable from outside the library, and each one had to be
bolted on from the page instead:

| What the specification wants | What Jelly offers | The bolt-on it forced |
|---|---|---|
| A stroke on every field | A 1px canvas border, hardcoded width (see note) | `::part(ring)` repurposed as a permanent edge |
| A stroke on the OTP digits | No `part` attributes at all | A rule injected into the shadow root |
| A 56px segmented control | A size scale of 36 / 44 / 52 and no height token | Forced host height plus an injected pill min-height |
| A Secondary 600 knob on a Primary 700 fill | One `--jelly-accent` painting both | **A rigid overlay knob, which visibly desynced from the deforming blob during a drag** |

**Correction to the first row.** It used to read "No border concept -- only a
transparent focus ring", and that is wrong. `surfaceBorder()` is overridden on
input, textarea and select and paints a 1px edge on the canvas each frame. What
Jelly lacks is a *width* token for it: the 1 is hardcoded, so the specified
1.5px still cannot come from the bridge. The bolt-on therefore stays, but the
reason is narrower than the table claimed -- and because the note said no
border existed, nobody noticed the fields carry two strokes, ours and Jelly's.
Driving Jelly's border from a forked token would collapse them into one that
deforms with the blob; it has not been done.

The last one is why this exists. The overlay was measurably correct at rest and
wrong in motion, which is the worst kind of wrong: it passed every static check
and failed the moment anyone touched it.

## The diff

Two changes, one per control, both the same shape — in the slider's paint
function and again in the range's:

```js
// before — one colour paints the filled track AND the knob
C = this.resolveColor(`var(--jelly-accent, …)`);
…
this.paintBody(e, { fill: C, … });

// after — the knob resolves its own token, falling back to the accent
C          = this.resolveColor(`var(--jelly-accent, …)`),
MINAA_KNOB = this.resolveColor(`var(--jelly-slider-knob, var(--jelly-accent, …))`);
…
this.paintBody(e, { fill: MINAA_KNOB, … });
```

`paintBody` is Jelly's soft-body renderer, so the knob now **deforms with the
blob** instead of sitting on top of it as a rigid circle.

The fallback matters: anyone who does not set `--jelly-slider-knob` gets
exactly the previous behaviour. The change is invisible upstream, which is what
makes it safe to re-apply and reasonable to offer back to the project.

## Rules for changing this file

1. **Add tokens, change nothing else.** Every edit must have a fallback that
   preserves stock behaviour. That is what keeps the diff re-appliable when
   Jelly updates, and keeps it contributable upstream.
2. **Never touch the simulation.** The spring constants at the top of the file
   are the entire value of the library. If a change requires editing them, it
   is the wrong change.
3. **Mark every edit** with an identifier containing `MINAA` so the whole diff
   can be found with one search.
4. **Prefer the fork to a bolt-on.** A token here is better than a shadow-root
   injection in `minaa-jelly.js`; when the fork can express something, delete
   the injection.

## Updating

Re-download `dist/jelly.js`, search the old copy for `MINAA` to list the edits,
and re-apply them. Then re-run the component checks — the colours the page
expects are recorded in the Minaã Components Figma file, page `Components`.

## Current diff inventory

| Marker | Component | Token added |
|---|---|---|
| `MINAA_KNOB` | slider | `--jelly-slider-knob` |
| `MINAA_KNOB` | range | `--jelly-range-knob`, falling back through `--jelly-slider-knob` so one value drives both |
| `MINAA_BORDER` etc. | switch | `--jelly-switch-thumb-size` and `--jelly-switch-inset` |
| `MINAA FORK` in `gt()` | *(none — geometry, not a token)* | optional corner exponent `se`, default `1` |

### The corner exponent is the only NON-token change in this file

`gt()` builds the rest positions of every physics membrane, and its four corner
arcs were `cos/sin` at the radius — a circle. It now takes an optional fifth
argument, `se`, and **`se = 1` is the default and reproduces that circle
exactly**: the original line is kept verbatim behind an `if (se === 1)` fast
path, so a component that asks for nothing is bit-identical. `se = 0.5` gives
the Minaã squircle, superellipse N = 4.

Two things make this safe to keep and easy to drop:

- **Nothing in this library opts in.** `class D` passes
  `this.config.superellipse ?? 1`, and the only thing that ever sets it is
  `minaaSkeletonSquircle()` in `../minaa-jelly.js`, for `jelly-skeleton` with
  `shape="rect"` and nothing else. Verified by measurement: with the rect
  active, **1 of 85** canvas-backed elements on the page has a non-default
  exponent.
- **The exponent is duplicated, and that is the one real cost.** It also lives
  in `minaaSquirclePath()` in `../minaa-jelly.js`, which is the SVG half of the
  same shape. The two cannot share code across the module boundary. If N ever
  changes, it changes in both places.

A blanket version of this shipped for about ten minutes and was reverted: with
every component opted in, `jelly-radio` stopped being a circle and became
near-indistinguishable from our checkbox. Roundness is an affordance. If this
is ever widened, exempt anything whose radius is half its short side.

The switch pair is a different shape of problem and worth reading before
touching either token. Jelly derives the thumb diameter AND its resting inset
from one number, `sizeConfig.inset`: the thumb is `height - inset * 2`, and
travel is `width - height`, which necessarily leaves the thumb exactly `inset`
from the rim. The two insets cannot differ.

The Minaa theme switch needs them to. Its track is laid out with
`padding-inline: 8` and its children centred, so a 32 thumb in a 40 track sits
8 from each end and 4 from the top and bottom. Under the stock derivation that
is unreachable -- asking for a 32 thumb forces a 4 horizontal inset too, and
the thumb no longer lines up with the icon opposite it.

So `--jelly-switch-thumb-size` sets the diameter and `--jelly-switch-inset`
sets the resting inset, independently. Substitute the stock defaults into the
new travel expression -- `width - inset*2 - (height - inset*2)` -- and it
collapses back to `width - height`, which is why a switch that sets neither
token is unchanged. Verified rather than argued: the library page's own
switches still measure 48x24 with a 14 thumb at inset 5, and 64x32 with a 20,
exactly as before the fork.

The value is read once per shape rebuild and cached, not read per frame.
`travel` is called several times a frame and getComputedStyle is not free.

Range needed the same change for a reason worth recording: it *does* expose
`part="knob"` on two real elements, so colouring those looked like the clean
fix — but Jelly **also** paints knobs on its canvas from `--jelly-accent`. The
red DOM element ended up sitting on a blue canvas one, and the mismatch showed
as a blue halo around each knob. Exposing a `part` does not mean that part is
what you can see.
