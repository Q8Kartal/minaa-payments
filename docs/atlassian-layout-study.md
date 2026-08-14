# Atlassian Navigation System — Layout

A study of <https://atlassian.design/components/navigation-system/layout>
(Examples, Usage, Custom theming, Code), and what of it applies to Minaã.

Read alongside `DESIGN.md`. Nothing here overrides the Figma Foundations —
Atlassian is a reference for *structure*, the way their Button page was our
reference for documentation structure. Their numbers are theirs, not ours.

---

## 1. The model

One `Root` element wraps the entire view. Every layout area is an **immediate
child** of Root — not nested inside one another. There are five:

| Area | Required | Purpose |
|------|----------|---------|
| **Banner** | optional | Always at the very top of the screen |
| **Top nav** | — | Global bar, **fixed 56px height**, sits below the banner |
| **Side nav** | — | Left of the screen, **320px** default. Collapsible, resizable, responsive, flyout |
| **Main** | — | **Page header + main page content.** Expands to fill available space |
| **Panel** | optional | Right of main. Supporting/supplementary content. Collapsible, resizable |

The top nav visually **overlaps** the side nav when it is expanded, so the side
nav reads as full-height.

### Slots

Both navs are flexbox containers with named slots, and you position content by
choosing a slot rather than by writing alignment rules:

- **Top nav** — `TopNavStart` (left-aligned; appears *inside* the side nav when
  it is expanded, which is what produces the full-height sidebar illusion),
  `TopNavMiddle` (centred), `TopNavEnd` (right-aligned).
- **Side nav** — `SideNavHeader` (fixed top), `SideNavBody` (middle; **the
  scroll container**, and it grows to absorb free space), `SideNavFooter`
  (fixed bottom).

> Their note: you must render `SideNavBody` for the footer to sit at the bottom.
> The footer is not `position: sticky` — it is pushed down by a growing middle.
> This is the same technique as a flex `1fr` middle row.

---

## 2. The numbers

| Area | Default | Min | Max |
|------|---------|-----|-----|
| Side nav | 320px | 240px | 50% of viewport width |
| Panel | 365px (settable) | same as default | 50% of the *content area* (viewport − side nav) |
| Top nav | 56px fixed height | — | — |

Resizing is opt-in: render a `PanelSplitter` (or `SideNavPanelSplitter`) inside
the area. Resized width survives collapse/expand; persisting it across reloads
is the app's job via `defaultWidth`. Double-clicking the splitter collapses.
Any open popups/dropdowns/tooltips close while resizing.

### Responsive

| Breakpoint | Viewport | Side nav | Panel |
|------------|----------|----------|-------|
| xxs | 320–479 | collapsed; opens as overlay | overlay |
| xs | 480–767 | collapsed; opens as overlay | overlay |
| s | 768–1023 | collapsed; opens as overlay | overlay |
| m | 1024–1439 | expanded inline | inline |
| l | 1440–1767 | expanded inline | inline |
| xl | 1768+ | expanded inline | inline |

Below 1024px the side nav auto-collapses to give content room, and the user can
still open it — as an overlay, never inline. Below 768px the overlay side nav is
capped at **min(320px, 90% of screen width)**.

Main gets its own scroll container on large viewports; on small ones it always
uses body scroll, because a tall page is easier to scroll that way.

---

## 3. The rules worth stealing

These are the parts that are principle rather than API.

1. **DOM order is fixed: banner → top nav → side nav → main → panel.** Always,
   as direct children of root. It sets keyboard tab order, screen reader order,
   and skip-link order in one go. Order is an accessibility decision, not a
   visual one — visual position comes from CSS.

2. **The grid belongs to main, and only to main.** Their one Do/Don't on the
   page: *"use grid to position content within the main area only… Don't
   include side nav or panel areas as part of your grid."* The columns describe
   the content area; chrome sits outside them.

3. **Landmarks need names.** Side nav, panel and top-nav-end are landmarks and
   each needs a unique, meaningful label — and *"don't repeat the landmark's
   role in the label"* (so "Payments", not "Payments navigation"). The slots
   already provide the roles, so don't add or duplicate roles inside them.

4. **Skip links sparingly.** Every extra one makes the skip menu noisier.

5. **Panel vs modal is a behaviour decision, not a size one.** A panel sits
   *alongside* main and lets someone keep working — contextual info, tertiary
   actions, multitasking. A modal sits *above* the page and demands a decision
   before returning. If the user must finish before continuing, it is a modal.

6. **Custom theming is deliberately two knobs**: `backgroundColor` and
   `highlightColor`. Text is then automatically black or white, whichever
   contrasts better — the system will not let you choose an unreadable label.

---

## 4. What this means for Minaã

Our app shell (`minaa-payments.html`) is already close to this model:

```
.shell
├── aside.side-nav   (88px icon rail)
└── main.main-col
    ├── .topbar      (page title, date, rates, invoice CTA)
    └── .grid        (12 / 6 / 2 columns)
```

**Where we already agree**

- **The grid is scoped to main.** `.shell` is `calc(1296px + 88px)` — the
  1296px grid plus the rail *added on top*, explicitly outside it. That is
  their Do, and we got there independently.
- **Our `.topbar` lives inside main**, which matches their model exactly: a
  page title is a *page header inside main*, not a top nav. Their top nav is a
  thin 56px global bar for app-level actions, which we do not have and do not
  need.
- **DOM order** is side nav → main, consistent with their sequence.
- **Breakpoints line up.** Ours step at 1024 / 768 / 480 (12 / 6 / 2 columns);
  theirs at the same values.

**Where we do not, and it is a real gap**

- **No landmark has an accessible name.** `<aside>` and `<main>` are landmarks;
  an unlabelled `<aside>` announces only as "complementary". There is not one
  `aria-label` in the static markup of any of the three pages. This is their
  rule 3 and it is cheap to fix.
- **No skip link.** With a 5-button icon rail before main, a keyboard user
  passes the whole rail on every page.

**Where we differ on purpose**

- **Direction.** Everything they write as "left" is our **inline-start = right**.
  Our rail is already on the inline-start side via logical properties. Their
  docs are LTR-only; do not copy `left`/`right` literally.
- **Rail width.** Ours is an 88px icon rail — closer to their *collapsed* side
  nav than their 320px expanded one. We have no expanded state, so none of the
  collapse/expand/flyout/resize machinery applies.
- **Small screens.** They collapse the side nav to an overlay below 1024px. We
  turn the rail into a horizontal bar below 640px. Theirs preserves the
  navigation model at the cost of a tap; ours keeps everything visible at the
  cost of vertical space. Ours suits a 5-item rail; theirs suits a deep tree.
- **No panel.** We have no supplementary column. If one is ever wanted — a
  detail view beside the payments grid — their panel-vs-modal rule is the test
  to apply, and our invoice/edit dialogs are correctly modals by it.

---

## 5. If we act on this

In rough order of value:

1. Name the landmarks (`aside`, `main`, and the payments regions). Small, and
   it is the one thing here that is an outright defect.
2. Add a single skip link to main.
3. Leave the structure alone. The grid scoping and the page-header-in-main
   placement are already right, and the collapse behaviour we chose fits our
   rail better than theirs would.
