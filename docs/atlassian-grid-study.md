# Atlassian Foundations — Grid

A study of <https://atlassian.design/foundations/grid>, and an audit of the
Minaã grid against it.

Companion to `atlassian-layout-study.md`: **Layout** defines everything *around*
the content area; **Grid** governs what happens *inside* it. The two never
overlap, and that separation is the single most important idea on the page.

---

## 1. What the grid is

> "A layout guide for aligning content **within the app's main content area**."

Three elements only:

- **Columns** — divide the main content area into 12 equal parts.
- **Gutters** — the gaps between columns.
- **Margins** — the space between the outer columns and the edge of the main
  content area.

Content spans any number of columns (12, 6, 4…) or sits centred within them
(8, 10, 12). In Figma it is a layout guide; in code it is built from box /
stack / inline primitives. **It is a guide, not a container** — the grid does
not place anything, it only tells you where things may line up.

**Don't:** let content overflow into gutters or margins. It breaks alignment
and makes layouts unpredictable.

---

## 2. What aligns to the grid — the rule most systems get wrong

| Aligns to the grid | Does **not** align |
|---|---|
| Content **containers**: cards, images, text blocks, tables, forms | **Small elements**: buttons, icons |
| Only **top-level** containers | Anything *inside* a container |
| | Overlays: modals, tooltips, dropdowns — they float above the page |

Inside a container — and between small elements — you use **space tokens**, not
columns. Same for nested grids: the Figma grid component is for the main
content area only; inside a container, use space tokens.

This is the same division we already keep between the Spacing scale and the
layout grid, stated from the other side: **columns position containers, tokens
position everything else.**

---

## 3. Breakpoints

Breakpoints are measured on the **viewport width, not the content area width**.
Showing or hiding the side nav or a panel does not change the breakpoint.

| Device | Breakpoint | Viewport | Columns | Gutter | Margin |
|---|---|---|---|---|---|
| Mobile | xxs | 320–479 | 2 | space.150 (12px) | space.200 (16px) |
| Tablet | xs | 480–767 | 6 | space.150 (12px) | space.200 (16px) |
| Tablet | s | 768–1023 | 6 | space.150 (12px) | space.200 (16px) |
| Desktop | m | 1024–1439 | 12 | space.200 (16px) | space.400 (32px) |
| Desktop | l | 1440–1767 | 12 | space.200 (16px) | space.400 (32px) |
| Desktop | xl | 1768+ | 12 | space.200 (16px) | space.400 (32px) |

Note the gutters and margins are **space tokens**, not free numbers — the grid
is built out of the spacing scale, which is exactly our own rule.

Their guidance: design for at least two sizes, **always including mobile (xxs)**.

---

## 4. Grid types

| Type | Max width (margins included) | Use when | Examples |
|---|---|---|---|
| **Fixed-wide** (default) | **1296px** | Content benefits from structure but doesn't need full width | Dashboards, directories, search results |
| **Fixed-narrow** | **864px** | Long-form reading is the primary activity | Blogs, articles, docs |
| **Fluid** | none | Content expands horizontally with no natural max | Kanban boards, whiteboards |

Fixed grids sit **centred** in the main content area. Below their maximum they
behave identically to fluid. Fluid is to be used sparingly — at very large
viewports lines get too long and visual relationships break down.

The stated Don'ts are the mirror of the Dos: no fixed-wide for long-form (line
length), no fixed-narrow for content needing width, no fluid for structured
content (elements lose their relationship at large sizes).

---

## 5. Applying it

- **Span only the main content area.** Exclude side nav and panel. (Same Do/Don't
  as the Layout page — stated in both places, which is how you know it matters.)
- **Change breakpoint via the responsive setting**, not by resizing the frame —
  resizing maps the linked grid styles incorrectly.
- **Set the breakpoint to the full viewport width**, not the content width.
- **Use auto layout** to build responsive layouts along the columns. Never
  absolute-position or drag-to-place: manual placement doesn't adapt and breaks
  the responsive layout.
- Figma: `Shift + G` toggles grid visibility.

---

## 6. Audit — Minaã against this spec

Measured on the rendered page (`buttons.html`), not read off the stylesheet, at
one viewport per breakpoint band.

| Band | Viewport | Columns | Gutter | Margin | Spec | Result |
|---|---|---|---|---|---|---|
| xxs | 375 | 2 | 12 | 16 | 2 / 12 / 16 | pass |
| xs | 600 | 6 | 12 | 16 | 6 / 12 / 16 | pass |
| s | 900 | 6 | 12 | 16 | 6 / 12 / 16 | pass |
| m | 1178 | 12 | 16 | 32 | 12 / 16 / 32 | pass |
| l | 1500 | 12 | 16 | 32 | 12 / 16 / 32 | pass |
| xl | 1800 | 12 | 16 | 32 | 12 / 16 / 32 | pass |

**Fixed-wide cap.** At 1500 and 1800 the shell measures exactly **1296px**, with
a grid of 1232px inside it — 1232 + 2×32 = 1296, margins included, as specified.
Correct type, too: this is a dashboard/directory, which is what fixed-wide is for.

**Alignment rules.**

- Direct children of the grids are `div.stat-card` (`span 3`) and
  `section.panel` (`1 / -1`) — containers only.
- **Zero small elements are direct grid children.** Every button and icon lives
  inside a container and is positioned with space tokens.
- **No child overflows the grid** into a gutter or margin at any band.

**Chrome excluded from the grid.** In the app, `.shell` is
`calc(1296px + 88px)` — the fixed-wide grid *plus* the icon rail added outside
it, with a comment saying so. That is their "exclude the side nav" Do, reached
independently.

**Breakpoints are viewport-based.** Ours are plain `@media (max-width: …)`
queries, which measure the viewport — not container queries. Correct by their
rule, and it stays correct if a rail or panel is ever added.

### The one thing to know

Our margin steps 32 → 16 at 1023px, but our **page padding** (the space outside
`.shell`) steps at 767px. They are different things — the grid margin is inside
the content area, the page padding is outside it — so this is not a conflict,
but it does mean between 768 and 1023 the two are equal at 16px and the shell
edge reads slightly tighter than elsewhere. Worth a look if we ever revisit
the outer frame; not a spec violation.

---

## 7. Verdict

The Minaã grid is a faithful implementation of the Atlassian fixed-wide grid:
the same 12/6/2 column counts, the same token-valued gutters and margins at the
same viewport breakpoints, the same 1296px cap, the same containers-only
alignment rule, and the same exclusion of navigation chrome.

Nothing here calls for a change. The value of the page for us is that it names
and justifies rules we were already following, and gives two we should keep in
mind if the pages grow:

1. **Fixed-narrow (864px) for long-form.** If a documentation or article page
   is ever added to this project, it should not use the 1296px grid.
2. **Fluid only for horizontally expanding content.** A kanban-style view would
   qualify; a dashboard never does.
