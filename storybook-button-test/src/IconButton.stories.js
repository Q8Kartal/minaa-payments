import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { buildMarkup, wireAfterMount } from './minaa-runtime.js';

/* A separate family, not a Button with its label hidden: the production
   factory returns a <jelly-icon-button shape="circle"> whose side equals the
   button height, carrying an accessible name and no label. It takes no
   direction — the square has no reading order to mirror. */

export default {
  title: 'Minaã/Icon Button',
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
    disabled: { name: 'Disabled', control: { type: 'boolean' } },
  },
  args: {
    appearance: 'primary',
    size: '48',
    disabled: false,
  },
};

const render = (args) => {
  const markup = buildMarkup(
    'icononly',
    args.appearance,
    args.size,
    'ltr', // ignored by the factory for this family
    args.disabled,
  );

  wireAfterMount();

  return html`<div>${unsafeHTML(markup)}</div>`;
};

export const IconButton = { render };
