import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { buildMarkup, wireAfterMount } from './minaa-runtime.js';

/* Every value below is read off buttons.js, not chosen here:
     STYLES  → primary · secondary · outline · ghost · ghostsec
     SIZES   → 56 · 48 · 40
     CONFIGS → text · leading · trailing · both   (icononly is the other family)
   `disabled` writes aria-disabled rather than Jelly's own disabled attribute,
   which is what the production factory does and why the control stays
   keyboard-focusable. */

export default {
  title: 'Minaã/Button',
  argTypes: {
    appearance: {
      name: 'Appearance',
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'ghostsec'],
    },
    size: {
      name: 'Size',
      control: { type: 'inline-radio' },
      options: ['56', '48', '40'],
    },
    config: {
      name: 'Content',
      control: { type: 'radio' },
      options: ['text', 'leading', 'trailing', 'both'],
    },
    direction: {
      name: 'Direction',
      control: { type: 'inline-radio' },
      options: ['ltr', 'rtl'],
    },
    disabled: { name: 'Disabled', control: { type: 'boolean' } },
  },
  args: {
    appearance: 'primary',
    size: '48',
    config: 'leading',
    direction: 'ltr',
    disabled: false,
  },
};

const render = (args) => {
  /* The production factory builds the markup — this file never writes any. */
  const markup = buildMarkup(
    args.config,
    args.appearance,
    args.size,
    args.direction,
    args.disabled,
  );

  /* Re-runs buttons.js once the story is attached, so this button is wired
     exactly like a button on the real page. */
  wireAfterMount();

  return html`<div dir=${args.direction}>${unsafeHTML(markup)}</div>`;
};

export const Button = { render };
