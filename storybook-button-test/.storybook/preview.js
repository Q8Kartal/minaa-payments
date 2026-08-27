import { bootMinaa } from '../src/minaa-runtime.js';

/** @type { import('@storybook/web-components-vite').Preview } */
export default {
  /* Boots the real buttons.js once before the first story, so the production
     markup factory is available synchronously inside render(). */
  loaders: [async () => ({ minaa: await bootMinaa() })],

  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};
