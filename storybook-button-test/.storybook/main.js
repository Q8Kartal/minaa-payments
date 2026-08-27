/** @type { import('@storybook/web-components-vite').StorybookConfig } */
export default {
  stories: ['../src/**/*.stories.js'],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  /* The three production files are served verbatim from where they already
     live. Nothing is copied into this folder and nothing upstream is touched,
     so the Storybook always shows whatever `buttons.css` and `buttons.js`
     currently say — it cannot drift from the real implementation.

     Mapped file by file rather than serving the whole project root: a bare
     `staticDirs: ['../..']` also copies node_modules and .git into
     `storybook-static` at build time. `fonts/` is required because
     buttons.css declares its @font-face src relative to itself
     (`fonts/29LTIdrisRound-*.woff2`), so serving the CSS at `/buttons.css`
     makes the browser resolve the faces to `/fonts/...`. */
  staticDirs: [
    { from: '../../buttons.css', to: '/buttons.css' },
    { from: '../../buttons.js', to: '/buttons.js' },
    { from: '../../fonts', to: '/fonts' },
    /* The same passphrase gate the two library pages use, so there is one
       copy of it and one hash to change. It no-ops off the published host,
       which is why localhost stays unprompted. */
    { from: '../../gate.js', to: '/gate.js' },
  ],
};
