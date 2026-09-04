  /* ── Micons ──────────────────────────────────────────────────────────────
     The page used to pull eleven lucide glyphs from iconify's CDN. These are
     the official Minaa icons instead, exported from the Micons library and
     inlined as one <symbol> sprite: no third party, no CDN round-trip, no
     api.iconify.design lookup, and they paint with the first frame instead of
     after a network hop.

     Every path carries stroke/fill="currentColor", so an icon takes the colour
     of the text beside it and the existing colour rules keep working untouched.
     Strokes are 1.5 on a 24-unit grid, which is the library's own
     construction — never rescale the stroke when you change the rendered
     size, or they stop matching Figma.

     Which icon a slot gets is not a free choice. The system's order of
     preference is brand first; if nothing in brand fits the subject, solid;
     and outline only after that. Every heading below is solid except Sizes,
     which takes brand/ruler, and `search`, which is explained at its own
     entry. Do not swap one for a nicer-looking glyph from a lower tier.

     The sprite is defined once and referenced by <use>, so each path is stored
     once no matter how many times its icon appears. `search` sits inside every
     example button on the page, which is why that matters. */
  const MICONS = {
    /* e-commerce/id-803-solid */
    button: '<path d="M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2ZM12 7.85645C11.5858 7.85645 11.25 8.19223 11.25 8.60645V10.1895L10.0303 8.96973C9.73738 8.67683 9.26262 8.67683 8.96973 8.96973C8.67702 9.26264 8.6769 9.73744 8.96973 10.0303L10.1895 11.25H8.60645C8.19223 11.25 7.85645 11.5858 7.85645 12C7.85646 12.4142 8.19224 12.75 8.60645 12.75H10.1895L8.96973 13.9697C8.67699 14.2626 8.67689 14.7374 8.96973 15.0303C9.26258 15.3229 9.73743 15.3229 10.0303 15.0303L11.25 13.8105V15.3945C11.2503 15.8085 11.586 16.1445 12 16.1445C12.414 16.1445 12.7497 15.8085 12.75 15.3945V13.8105L13.9697 15.0303C14.2626 15.3229 14.7374 15.3229 15.0303 15.0303C15.3231 14.7374 15.323 14.2626 15.0303 13.9697L13.8105 12.75H15.3945C15.8085 12.7497 16.1445 12.414 16.1445 12C16.1445 11.586 15.8085 11.2503 15.3945 11.25H13.8105L15.0303 10.0303C15.3231 9.73744 15.323 9.26264 15.0303 8.96973C14.7374 8.67683 14.2626 8.67683 13.9697 8.96973L12.75 10.1895V8.60645C12.75 8.19223 12.4142 7.85645 12 7.85645Z" fill="currentColor"/>',
    /* Micons/Bold/Settings, Fine Tuning/Tuning */
    config: '<path d="M16.959 9.75C16.5448 9.75 16.209 9.41421 16.209 9L16.209 2C16.209 1.58579 16.5448 1.25 16.959 1.25C17.3732 1.25 17.709 1.58579 17.709 2L17.709 9C17.709 9.41421 17.3732 9.75 16.959 9.75Z" fill="currentColor"/><path d="M7 12.5C5.34315 12.5 4 11.1569 4 9.5C4 7.84315 5.34315 6.5 7 6.5C8.65685 6.5 10 7.84315 10 9.5C10 11.1569 8.65685 12.5 7 12.5Z" fill="currentColor"/><path d="M17 11.5C15.3431 11.5 14 12.8431 14 14.5C14 16.1569 15.3431 17.5 17 17.5C18.6569 17.5 20 16.1569 20 14.5C20 12.8431 18.6569 11.5 17 11.5Z" fill="currentColor"/><path d="M6.20901 15C6.20901 14.5858 6.5448 14.25 6.95901 14.25C7.37322 14.25 7.70901 14.5858 7.70901 15V22C7.70901 22.4142 7.37322 22.75 6.95901 22.75C6.5448 22.75 6.20901 22.4142 6.20901 22V15Z" fill="currentColor"/><path d="M16.959 22.75C16.5448 22.75 16.209 22.4142 16.209 22V20C16.209 19.5858 16.5448 19.25 16.959 19.25C17.3732 19.25 17.709 19.5858 17.709 20V22C17.709 22.4142 17.3732 22.75 16.959 22.75Z" fill="currentColor"/><path d="M6.20901 2C6.20901 1.58579 6.5448 1.25 6.95901 1.25C7.37322 1.25 7.70901 1.58579 7.70901 2V4C7.70901 4.41421 7.37322 4.75 6.95901 4.75C6.5448 4.75 6.20901 4.41421 6.20901 4V2Z" fill="currentColor"/>',
    iconbutton: '<rect x="16.4016" y="7.75009" width="8.80305" height="8.80305" rx="4.40153" transform="rotate(90 16.4016 7.75009)" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M1.99999 12.1516H7.38513" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16.5435 12.1516L22.0001 12.1516" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    /* Micons/Bold/Design, Tools/Palette */
    appearance: '<path fill-rule="evenodd" clip-rule="evenodd" d="M10 6V18C10 19.4001 10 20.1002 9.72752 20.635C9.48783 21.1054 9.10538 21.4878 8.63498 21.7275C8.1002 22 7.40013 22 6 22C4.59987 22 3.8998 22 3.36502 21.7275C2.89462 21.4878 2.51217 21.1054 2.27248 20.635C2 20.1002 2 19.4001 2 18V6C2 4.59987 2 3.8998 2.27248 3.36502C2.51217 2.89462 2.89462 2.51217 3.36502 2.27248C3.8998 2 4.59987 2 6 2C7.40013 2 8.1002 2 8.63498 2.27248C9.10538 2.51217 9.48783 2.89462 9.72752 3.36502C10 3.8998 10 4.59987 10 6ZM7 19.75C7.41421 19.75 7.75 19.4142 7.75 19C7.75 18.5858 7.41421 18.25 7 18.25H5C4.58579 18.25 4.25 18.5858 4.25 19C4.25 19.4142 4.58579 19.75 5 19.75H7Z" fill="currentColor"/><path d="M19.0599 10.6144L13.2219 16.704C12.492 17.4653 12.1271 17.8459 11.8135 17.7199C11.5 17.5939 11.5 17.0666 11.5 16.0119L11.5 7.7738C11.5012 7.11381 11.7633 6.48107 12.2291 6.01357L13.2839 4.95882L13.7141 4.62987C14.7183 3.86212 15.2204 3.47825 15.7673 3.3603C16.2175 3.26322 16.6857 3.29236 17.1204 3.4445C17.6484 3.62934 18.099 4.0725 19.0003 4.95883C19.9999 5.95839 20.4997 6.45818 20.685 7.03056C20.843 7.51871 20.847 8.04366 20.6964 8.53417C20.5199 9.10931 20.0332 9.61101 19.0599 10.6144Z" fill="currentColor"/><path d="M12.7897 22H17.8994C19.2995 22 19.9996 22 20.5344 21.7275C21.0048 21.4878 21.3872 21.1054 21.6269 20.635C21.8994 20.1002 21.8994 19.4001 21.8994 18C21.8994 16.5999 21.8994 15.8998 21.6269 15.365C21.3872 14.8946 21.0048 14.5122 20.5344 14.2725C19.9996 14 19.2995 14 17.8994 14H17.6797L11.878 19.798C11.636 20.0399 11.5 20.3391 11.5 20.6813C11.5 21.3936 12.0774 22 12.7897 22Z" fill="currentColor"/>',
    size: '<path d="M2 15.6157C2 16.463 2.68179 17.1448 4.04537 18.5083L5.49167 19.9546C6.85525 21.3182 7.53704 22 8.38426 22C9.23148 22 9.91327 21.3182 11.2769 19.9546L19.9546 11.2769C21.3182 9.91327 22 9.23148 22 8.38426C22 7.53704 21.3182 6.85525 19.9546 5.49167L18.5083 4.04537C17.1448 2.68179 16.463 2 15.6157 2C14.8623 2 14.2396 2.53926 13.1519 3.61778C13.1817 3.63981 13.2103 3.66433 13.2373 3.69135L14.6515 5.10556C14.9444 5.39846 14.9444 5.87333 14.6515 6.16622C14.3586 6.45912 13.8837 6.45912 13.5908 6.16622L12.1766 4.75201C12.1494 4.7248 12.1247 4.69601 12.1026 4.66595L11.0299 5.73861C11.06 5.76077 11.0888 5.78545 11.116 5.81267L13.2373 7.93399C13.5302 8.22688 13.5302 8.70176 13.2373 8.99465C12.9444 9.28754 12.4695 9.28754 12.1766 8.99465L10.0553 6.87333C10.0281 6.84612 10.0034 6.81733 9.98125 6.78726L8.90859 7.85993C8.93865 7.88209 8.96744 7.90678 8.99465 7.93399L10.4089 9.3482C10.7018 9.6411 10.7018 10.116 10.4089 10.4089C10.116 10.7018 9.6411 10.7018 9.3482 10.4089L7.93399 8.99465C7.90678 8.96744 7.88209 8.93865 7.85993 8.90859L6.78727 9.98125C6.81733 10.0034 6.84612 10.0281 6.87333 10.0553L8.99465 12.1766C9.28754 12.4695 9.28754 12.9444 8.99465 13.2373C8.70176 13.5302 8.22688 13.5302 7.93399 13.2373L5.81267 11.116C5.78545 11.0888 5.76077 11.06 5.73861 11.0299L4.66595 12.1026C4.69601 12.1247 4.7248 12.1494 4.75201 12.1766L6.16622 13.5908C6.45912 13.8837 6.45912 14.3586 6.16622 14.6515C5.87333 14.9444 5.39846 14.9444 5.10556 14.6515L3.69135 13.2373C3.66433 13.2103 3.63981 13.1817 3.61778 13.1519C2.53926 14.2396 2 14.8623 2 15.6157Z" fill="currentColor"/>',
    group: '<path d="M12 6C12 4.11438 12 3.17157 12.5858 2.58579C13.1716 2 14.1144 2 16 2H18C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V8C22 9.88562 22 10.8284 21.4142 11.4142C20.8284 12 19.8856 12 18 12H16C14.1144 12 13.1716 12 12.5858 11.4142C12 10.8284 12 9.88562 12 8V6Z" fill="currentColor"/><path d="M10.5 7.00048C8.94286 7.00504 8.11735 7.05425 7.5858 7.5858C7.00001 8.17159 7.00001 9.1144 7.00001 11V13C7.00001 14.4372 7.00001 15.3267 7.2594 15.9279C7.32969 16.0908 7.41903 16.2325 7.53258 16.3582C7.54976 16.3773 7.56749 16.3959 7.58579 16.4142C8.17157 17 9.11438 17 11 17H13C14.8856 17 15.8284 17 16.4142 16.4142C16.9458 15.8827 16.995 15.0572 16.9995 13.5L15.9105 13.5C15.0449 13.5001 14.2512 13.5002 13.6056 13.4134C12.8946 13.3178 12.1432 13.0929 11.5251 12.4749C10.9071 11.8568 10.6822 11.1054 10.5866 10.3944C10.4998 9.74881 10.4999 8.95514 10.5 8.08951L10.5 7.00048Z" fill="currentColor"/><path d="M5.50001 12.0005C3.94285 12.005 3.11733 12.0542 2.58579 12.5858C2 13.1716 2 14.1144 2 16V18C2 19.8856 2 20.8284 2.58579 21.4142C3.17157 22 4.11438 22 6 22H8C9.88562 22 10.8284 22 11.4142 21.4142C11.9458 20.8827 11.995 20.0572 11.9995 18.5L10.9105 18.5C10.0449 18.5001 9.25122 18.5002 8.6056 18.4134C7.89464 18.3178 7.14319 18.0929 6.52514 17.4749C5.90709 16.8568 5.6822 16.1054 5.58661 15.3944C5.49981 14.7488 5.4999 13.9551 5.50001 13.0895L5.50001 12.0005Z" fill="currentColor"/>',
    interaction: '<path d="M16.5744 19.1999L12.6361 15.2616L11.4334 16.4643C10.2022 17.6955 9.58656 18.3111 8.92489 18.1658C8.26322 18.0204 7.96225 17.2035 7.3603 15.5696L5.3527 10.1205C4.15187 6.86106 3.55146 5.23136 4.39141 4.39141C5.23136 3.55146 6.86106 4.15187 10.1205 5.35271L15.5696 7.3603C17.2035 7.96225 18.0204 8.26322 18.1658 8.92489C18.3111 9.58656 17.6955 10.2022 16.4643 11.4334L15.2616 12.6361L19.1999 16.5744C19.6077 16.9821 19.8116 17.186 19.9058 17.4135C20.0314 17.7168 20.0314 18.0575 19.9058 18.3608C19.8116 18.5882 19.6077 18.7921 19.1999 19.1999C18.7921 19.6077 18.5882 19.8116 18.3608 19.9058C18.0575 20.0314 17.7168 20.0314 17.4135 19.9058C17.186 19.8116 16.9821 19.6077 16.5744 19.1999Z" fill="currentColor"/>',
    disabled: '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 9.50853 21.0889 7.22987 19.5816 5.47906L5.47905 19.5816C7.22987 21.0889 9.50853 22 12 22Z" fill="currentColor"/><path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.4915 2.91114 16.7701 4.41839 18.5209L18.5209 4.41839C16.7701 2.91114 14.4915 2 12 2Z" fill="currentColor"/>',
    feedback: '<path d="M8.35179 20.2418C9.19288 21.311 10.5142 22 12 22C13.4858 22 14.8071 21.311 15.6482 20.2418C13.2264 20.57 10.7736 20.57 8.35179 20.2418Z" fill="currentColor"/><path d="M18.7491 9V9.7041C18.7491 10.5491 18.9903 11.3752 19.4422 12.0782L20.5496 13.8012C21.5612 15.3749 20.789 17.5139 19.0296 18.0116C14.4273 19.3134 9.57274 19.3134 4.97036 18.0116C3.21105 17.5139 2.43882 15.3749 3.45036 13.8012L4.5578 12.0782C5.00972 11.3752 5.25087 10.5491 5.25087 9.7041V9C5.25087 5.13401 8.27256 2 12 2C15.7274 2 18.7491 5.13401 18.7491 9Z" fill="currentColor"/>',
    direction: '<path d="M10.25 4.00003C10.25 3.69074 10.0602 3.41317 9.77191 3.30105C9.48366 3.18892 9.15614 3.26524 8.94715 3.49324L3.44715 9.49324C3.24617 9.71248 3.19374 10.0298 3.3135 10.302C3.43327 10.5743 3.70259 10.75 4.00002 10.75H20C20.4142 10.75 20.75 10.4142 20.75 10C20.75 9.58582 20.4142 9.25003 20 9.25003L10.25 9.25003V4.00003Z" fill="currentColor"/><path d="M13.75 20L13.75 14.75H4.00002C3.5858 14.75 3.25002 14.4142 3.25002 14C3.25002 13.5858 3.5858 13.25 4.00002 13.25L20 13.25C20.2974 13.25 20.5668 13.4258 20.6865 13.698C20.8063 13.9703 20.7539 14.2876 20.5529 14.5068L15.0529 20.5068C14.8439 20.7348 14.5164 20.8111 14.2281 20.699C13.9399 20.5869 13.75 20.3093 13.75 20Z" fill="currentColor"/>',
    verified: '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.5924 3.20027C9.34888 3.4078 9.22711 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522C6.6787 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.6787 4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.22711 3.40781 9.34887 3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076C3.40778 14.6511 3.51158 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.278 19.8288 6.6787 19.8608 7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008C19.8608 6.6787 19.8288 6.278 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027ZM16.3735 9.86314C16.6913 9.5453 16.6913 9.03 16.3735 8.71216C16.0557 8.39433 15.5403 8.39433 15.2225 8.71216L10.3723 13.5624L8.77746 11.9676C8.45963 11.6498 7.94432 11.6498 7.62649 11.9676C7.30866 12.2854 7.30866 12.8007 7.62649 13.1186L9.79678 15.2889C10.1146 15.6067 10.6299 15.6067 10.9478 15.2889L16.3735 9.86314Z" fill="currentColor"/>',
    toastInfo: '<path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="currentColor"/>',
    toastSuccess: '<path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="currentColor"/>',
    toastWarning: '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.31171 10.7615C8.23007 5.58716 9.68925 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.31034 17.856 2.52291 15.7061 4.94805 11.4063L5.31171 10.7615ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>',
    toastDanger: '<path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>',
    search: '<path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" fill="currentColor"/>',

  };

  /* One hidden <svg> holding every symbol, mounted before anything references
     it. aria-hidden and focusable=false keep the sprite out of the
     accessibility tree and out of the tab order; the icons are decorative and
     each one sits beside text that already says what it means. */
  (function mountMicons() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.position = 'absolute';
    svg.style.width = svg.style.height = '0';
    svg.innerHTML = Object.entries(MICONS)
      .map(([k, body]) => '<symbol id="mi-' + k + '" viewBox="0 0 24 24" fill="none">' + body + '</symbol>')
      .join('');
    document.documentElement.appendChild(svg);
  })();

  /* Markup for one icon, so the class and the aria-hidden cannot drift between
     call sites. The headings in both builds use the same helper. */
  const micon = name => '<svg class="mi" aria-hidden="true" focusable="false"><use href="#mi-' + name + '"/></svg>';

  const STYLES = [
    ['primary',   'Primary'],
    ['secondary', 'Secondary'],
    ['outline',   'Outline'],
    ['ghost',     'Ghost'],
    ['ghostsec',  'Ghost Secondary'],
  ];
  const SIZES = ['56', '48', '40'];

  /* "56 px" is a single technical token, not prose. Dropped into an RTL panel
     the bidi algorithm puts the number to the right of the unit and it reads
     "px 56". Measured, not assumed: unicode-bidi:isolate and :embed both still
     produced "px 56"; only an isolated LTR run produced "56 px". Scoped to
     measurement values, so it stays an isolated run inside an RTL block rather
     than direction chosen from content. */
  const metric = text => '<span class="metric">' + text + '</span>';

  /* ── Configurations ─────────────────────────────────────────────────────
     Icon presence is what the button IS, not something done to it. Each of
     these authors its own content, so each has one intrinsic width derived
     from exactly what it contains. Nothing is generated by hiding part of
     another: there used to be a single icon+label+icon button with a switch
     that set display:none on its icons, which gave one configuration two
     widths — 145.8px and 89.8px at 56px — and reflowed the row on every
     toggle. "Leading" and "trailing" are DOM order, which the flex row maps
     to reading order, so RTL mirrors without any physical flipping. */
  const ICON = micon('search');

  const CONFIGS = [
    ['text',     'Text only',      label => '<span>' + label + '</span>'],
    ['leading',  'Leading icon',   label => ICON + '<span>' + label + '</span>'],
    ['trailing', 'Trailing icon',  label => '<span>' + label + '</span>' + ICON],
    ['both',     'Leading + trailing', label => ICON + '<span>' + label + '</span>' + ICON],
    ['icononly', 'Icon only',      null],   // a different element: jelly-icon-button
  ];

  /* Every string the page shows comes from T, which each build defines before
     loading this file. Behaviour, measurement and layout are identical in both
     languages, so only the words differ — nothing here is duplicated per build,
     and a fix lands in both at once. */
  const T = window.MINAA_BUTTONS_STRINGS;

  const LABEL = { ltr: 'Button', rtl: 'دقمة' };

  /* One button of a given configuration, variant and size.
     `disabled` writes aria-disabled rather than Jelly's own `disabled`
     attribute — see the Disabled block in buttons.css for why. */
  function button(config, variantCls, size, dir, disabled) {
    const aria = disabled ? ' aria-disabled="true"' : '';
    if (config === 'icononly')
      return '<jelly-icon-button shape="circle" label="' + T.search + '" data-config="icononly"' + aria + ' ' +
             'class="mn-btn ' + variantCls + ' s' + size + '">' + ICON + '</jelly-icon-button>';
    const build = CONFIGS.find(c => c[0] === config)[2];
    /* mn-btn is what button-family.css keys every one of its rules on -- the
       family now lives in a file three pages load, and the marker is what
       keeps it off the component library's own jelly-buttons. */
    return '<jelly-button dir="' + dir + '" data-config="' + config + '"' + aria + ' ' +
           'class="mn-btn ' + variantCls + ' s' + size + '">' +
           '<span class="jelly-label">' + build(LABEL[dir]) + '</span></jelly-button>';
  }

  /* One specimen: the thing itself, and a caption naming what varies. Sections
     are built from these rather than from a matrix, so each row of examples
     changes exactly one variable and nothing is demonstrated twice. */
  const specimen = (caption, markup, note) =>
    '<figure class="specimen">' + markup +
    '<figcaption>' + caption +
    (note ? '<span class="cap-note">' + note + '</span>' : '') +
    '</figcaption></figure>';

  const fill = (id, html) => { document.getElementById(id).innerHTML = html; };

  /* Each build authors every section in its own direction, and shows the other
     one only in the direction section, where the comparison is the point. */
  const DIR = T.dir;
  const BASE_SIZE = '48';
  const BASE_STYLE = 'primary';

  fill('ex-base', specimen('Button', button('text', BASE_STYLE, BASE_SIZE, DIR),
                           T.baseNote));

  fill('ex-config', CONFIGS.filter(([c]) => c !== 'icononly')
    .map(([config, name]) => specimen(name, button(config, BASE_STYLE, BASE_SIZE, DIR)))
    .join(''));

  fill('ex-icon', SIZES.map(size =>
    specimen(metric(size + ' px'), button('icononly', BASE_STYLE, size, DIR))).join(''));

  fill('ex-appearance', STYLES.map(([cls, name]) =>
    specimen(name, button('leading', cls, BASE_SIZE, DIR))).join(''));

  fill('ex-size', SIZES.map(size =>
    specimen(metric(size + ' px'), button('leading', BASE_STYLE, size, DIR))).join(''));

  /* Groups — the only place buttons sit next to each other, so the only place
     the spacing between them is on show, and the only place the colour
     hierarchy is legible as a hierarchy.

     Per Colour Foundations: Primary 700 carries the key action, and Secondary
     600 is the secondary button — "these labels show hierarchy, not brand
     importance". Red is not a destructive colour here; the system reserves no
     brand hue for destruction, and errors are the semantic Orange 500. */
  fill('ex-group', [
    specimen(T.group.pair,
      '<span class="group">' + button('text', 'primary', BASE_SIZE, DIR) +
      button('text', 'secondary', BASE_SIZE, DIR) + '</span>',
      T.group.pairNote),
    specimen(T.group.quiet,
      '<span class="group">' + button('text', 'primary', BASE_SIZE, DIR) +
      button('text', 'ghost', BASE_SIZE, DIR) + '</span>',
      T.group.quietNote),
    specimen(T.group.withIcon,
      '<span class="group">' + button('leading', 'primary', BASE_SIZE, DIR) +
      button('text', 'outline', BASE_SIZE, DIR) +
      button('icononly', 'ghost', BASE_SIZE, DIR) + '</span>',
      T.group.withIconNote),
  ].join(''));

  fill('ex-states', [
    specimen(T.states.rest,  button('leading', BASE_STYLE, BASE_SIZE, DIR), T.states.restNote),
    specimen(T.states.ghost, button('leading', 'ghost', BASE_SIZE, DIR),    T.states.ghostNote),
    specimen(T.states.icon,  button('icononly', BASE_STYLE, BASE_SIZE, DIR), T.states.iconNote),
  ].join(''));

  /* ── Disabled ───────────────────────────────────────────────────────────
     The row is the argument: all five appearances collapse onto the same
     neutral pair, so what the button was stops mattering once it is
     unavailable. The last specimen puts an enabled and a disabled button side
     by side, which is the only way to judge whether the difference reads. */
  fill('ex-disabled',
    STYLES.map(([cls, name]) =>
      specimen(name, button('leading', cls, BASE_SIZE, DIR, true))).join('') +
    specimen(T.disabled.icon, button('icononly', BASE_STYLE, BASE_SIZE, DIR, true)) +
    specimen(T.disabled.compare,
      '<span class="group">' + button('text', BASE_STYLE, BASE_SIZE, DIR) +
      button('text', BASE_STYLE, BASE_SIZE, DIR, true) + '</span>',
      T.disabled.compareNote));

  /* Both directions, always in the same order, so the two builds show the same
     comparison rather than each flattering its own. */
  fill('ex-dir', [
    specimen(T.dirs.rtl, button('leading', BASE_STYLE, BASE_SIZE, 'rtl'), T.dirs.rtlNote),
    specimen(T.dirs.ltr, button('leading', BASE_STYLE, BASE_SIZE, 'ltr'), T.dirs.ltrNote),
  ].join(''));

  /* ── Feedback ───────────────────────────────────────────────────────────
     Jelly's four tones, each fired by an identical button so the only thing
     that varies is the tone. "error" and "neutral" are not tones — measured,
     both fall back to Info — so the set is exactly these four. */
  const TONES = [
    ['info',    'Info',    T.tones.info.label,    T.tones.info.message],
    ['success', 'Success', T.tones.success.label, T.tones.success.message],
    ['warning', 'Warning', T.tones.warning.label, T.tones.warning.message],
    ['danger',  'Danger',  T.tones.danger.label,  T.tones.danger.message],
  ];

  /* The button carries the tone's own word, not the sentence it will show.
     Full sentences made four buttons of four different widths and then the
     caption repeated them; a short label keeps the row even and leaves the
     caption to say what the toast will actually read. */
  /* Base class is primary only so the button arrives with no stroke; the
     data-tone rules replace its fill and label. Outline would have ringed a
     green button in blue. */
  fill('ex-toast', TONES.map(([, name, , message]) =>
    specimen(name, button('leading', 'primary', BASE_SIZE, DIR), '«' + message + '»')).join(''));

  document.querySelectorAll('#ex-toast jelly-button').forEach((el, i) => {
    const [tone, , label, message] = TONES[i];
    el.dataset.tone = tone;
    el.querySelector('.jelly-label > span').textContent = label;
    el.addEventListener('click', () => jellyToast(message, { tone }));
  });

  /* ── Dressing Jelly's toasts ─────────────────────────────────────────────
     Jelly builds every toast identically: part="toast", a coloured dot, the
     text, and a dismiss button. There is no tone on the element — the only
     thing that differs between the four is which custom property the dot's
     inline background points at. So a stylesheet has nothing to hook a
     per-tone card colour onto, and we add the hook here.

     Read the tone from that custom property rather than from the spoken
     prefix beside it. The prefix is Jelly's English "Success:" / "Error:",
     which is fine for a screen reader but is a string we do not own; the
     property name is structural and identical in both builds.

     Then append a second part name. `part` is a space-separated list, so the
     element answers to both ::part(toast) and ::part(tone-success), and the
     rules that already target `toast` keep applying untouched.

     The dot itself becomes the icon: its inline background is cleared and the
     Micon goes inside it, drawing from currentColor so the colour still comes
     from a token in the stylesheet rather than from anything written here. */
  const TOAST_TONE = {
    azure: 'info', mint: 'success', amber: 'warning', rose: 'danger',
  };
  const TOAST_ICON = {
    info: 'toastInfo', success: 'toastSuccess',
    warning: 'toastWarning', danger: 'toastDanger',
  };

  /* Jelly writes the dot's inline background *after* it appends the toast, so
     reading it during the mutation callback races that write and comes back
     empty — measured: firing all four dressed exactly one of them. Hence the
     retry across frames rather than a single read. Two frames is enough in
     practice; the cap stops a toast we cannot classify from spinning forever,
     and such a toast simply keeps Jelly's own dot. */
  function dressToast(toast, tries) {
    if (!toast || toast.dataset.dressed) return;
    const dot = toast.querySelector('.dot');
    if (!dot) return;

    const key = (dot.getAttribute('style') || '').match(/--jelly-color-background-(\w+)/);
    const tone = key && TOAST_TONE[key[1]];
    if (!tone) {
      if ((tries || 0) < 5) requestAnimationFrame(() => dressToast(toast, (tries || 0) + 1));
      return;
    }

    toast.dataset.dressed = '1';
    toast.setAttribute('part', toast.getAttribute('part') + ' tone-' + tone);
    dot.style.background = 'none';
    /* width and height are spelled out, and they are not decoration. An <svg>
       carrying only a viewBox has an intrinsic size of auto; Chrome resolves
       that against the parent box, Safari collapses it to zero when the svg is
       a flex item — which is exactly what it was, since ::part(dot) laid the
       dot out with flex. The icons rendered on desktop and vanished on iPhone.
       100% of a box whose side is a token is still token-derived, so nothing
       raw enters here. */
    dot.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" ' +
                    'fill="none" aria-hidden="true" focusable="false" ' +
                    'style="display:block">' + MICONS[TOAST_ICON[tone]] + '</svg>';
  }

  /* The toaster builds its rail lazily, and a toast is added long after this
     file runs, so the observer is attached once the shadow root exists and
     then left in place. Toasts fired from anywhere get dressed, not only the
     four specimen buttons above. */
  (function watchToasts() {
    const toaster = document.querySelector('jelly-toaster');
    if (!toaster) return;
    const attach = () => {
      const root = toaster.shadowRoot;
      if (!root) return false;

      /* The stack between toasts is Jelly's `.rail { gap: 10px }` — measured,
         and 10 is not a step on the Minaã scale. Everything else on the pill
         is bound from buttons.css through ::part(toast), but .rail carries no
         part attribute, so no outside selector can reach it. One rule injected
         into the shadow root is the only way in. It reads the token off the
         host, so the value still comes from the scale and not from here. */
      if (!root.querySelector('[data-minaa-rail]')) {
        const rule = document.createElement('style');
        rule.setAttribute('data-minaa-rail', '');
        rule.textContent = '.rail{gap:var(--space-150)}';
        root.appendChild(rule);
      }
      new MutationObserver(records => {
        for (const r of records)
          for (const node of r.addedNodes)
            if (node.nodeType === 1) {
              if (node.classList.contains('toast')) dressToast(node);
              node.querySelectorAll && node.querySelectorAll('.toast').forEach(dressToast);
            }
      }).observe(root, { childList: true, subtree: true });
      root.querySelectorAll('.toast').forEach(dressToast);
      return true;
    };
    if (!attach()) customElements.whenDefined('jelly-toaster').then(attach);
  })();

  /* Counted from the DOM rather than written down, so the figure cannot drift
     away from the page the way the old "90 components" line had. Scoped to the
     example rows: the language switch is a button too, but it is page chrome,
     not a specimen, and counting it made the figure claim one example more
     than the page shows. */
  document.getElementById('stat-examples').textContent =
    document.querySelectorAll('.examples jelly-button, .examples jelly-icon-button').length;

  /* ── The family's runtime ────────────────────────────────────────────────
     Was 418 lines here. It now lives in button-family.js, which the component
     library loads too -- see the header there. The handles come back because
     the scrubber and the init below still use them. */
  const { CONTROLS, DISABLED, setP } = minaaButtonFamily(document);
  /* ── Manual scrubber — forces the spread from each button's centre ─────── */
  const scrub = document.getElementById('scrub');
  const scrubOut = document.getElementById('scrub-out');
  scrub.addEventListener('input', () => {
    const v = parseFloat(scrub.value);
    scrubOut.textContent = v.toFixed(2);
    CONTROLS.forEach(el => {
      const b = el.getBoundingClientRect();
      el.__contact = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
      setP(el, v);
      paint(el, v, { x: 0, y: 0 });
    });
    measureWhenSettled();
  });

  /* ── Live measurement — reads what actually rendered, per size ─────────── */
  const SCALE = new Set([0,2,4,6,8,12,16,20,24,32,40,48,64,80,96]);
  const r1 = n => Math.round(n * 10) / 10;

  /* Reads what each configuration actually rendered, and rebuilds its width
     from the parts that are really in it: padding on both sides, each visible
     icon, and one gap per join. A configuration passes only when the rendered
     width equals that sum — which is the same as saying it carries no spacing
     for content it does not have. Text-only has no icon and no gap in the sum,
     so if it still measured icon-width the reservation would show up here. */
  function measureConfig(host) {
    const inner = host.shadowRoot && host.shadowRoot.querySelector('button');
    if (!inner) return null;
    const ics = getComputedStyle(inner);
    const pad = parseFloat(ics.paddingInlineStart);
    const gap = parseFloat(ics.gap) || 0;

    /* The icon button is not padded to its width — it is square by
       construction, so its expected width is its own height. Reporting a
       padding of 0 here would read as a violation of the 24/20/16 rule when
       the rule simply does not apply to this family. */
    if (host.dataset.config === 'icononly') {
      const box = host.getBoundingClientRect();
      return { square: true, icons: 1, gaps: 0,
               expected: r1(box.height), actual: r1(box.width), h: r1(box.height) };
    }
    const label = host.querySelector('.jelly-label');
    const kids = [...label.children];
    /* Matched on the class, not the tag name. This used to read
       tagName === 'ICONIFY-ICON'; when the icons became inline Micons the
       test silently found none, so every configuration with an icon reported
       its width as text-only and the table filled with ✗ — a 20px shortfall
       at 56px. The class is what the stylesheet sizes, so the two now agree
       by construction. */
    const icons = kids.filter(k => k.classList.contains('mi'));
    const text = kids.find(k => k.tagName === 'SPAN');
    const iconW = icons.reduce((a, k) => a + k.getBoundingClientRect().width, 0);
    const textW = text ? text.getBoundingClientRect().width : 0;
    const gaps = Math.max(0, kids.length - 1);
    return { pad, gap, icons: icons.length, gaps, text: r1(textW),
             expected: r1(pad * 2 + iconW + gaps * gap + textW),
             actual: r1(host.getBoundingClientRect().width),
             h: r1(host.getBoundingClientRect().height) };
  }

  const CONFIG_NAME = Object.fromEntries(CONFIGS.map(([c, n]) => [c, n]));

  /* Measures the examples the page actually shows, one row per distinct
     configuration-and-size pair. Nothing is rendered just to be measured, and
     a pair that appears in several sections is still measured once — the same
     no-duplication rule the sections follow. */
  function measure() {
    const onScale = v => SCALE.has(Math.round(v));
    const seen = new Set(), rows = [];
    document.querySelectorAll('[data-config]').forEach(host => {
      const size = (host.className.match(/\bs(\d+)\b/) || [])[1];
      const config = host.dataset.config;
      const key = config + '@' + size;
      if (!size || seen.has(key)) return;
      seen.add(key);
      rows.push({ size, config, name: CONFIG_NAME[config], m: measureConfig(host) });
    });
    rows.sort((a, b) => b.size - a.size ||
      CONFIGS.findIndex(c => c[0] === a.config) - CONFIGS.findIndex(c => c[0] === b.config));

    const yes = (v, ok) => '<td class="' + (ok ? 'ok' : 'off') + '">' + v + (ok ? ' ✓' : ' ✗') + '</td>';
    const H = T.table;
    document.getElementById('measure-table').innerHTML =
      '<tr><th>' + H.size + '</th><th>' + H.config + '</th><th>' + H.icons + '</th>' +
      '<th>' + H.gaps + '</th><th>' + H.padding + '</th><th>' + H.expected + '</th>' +
      '<th>' + H.actual + '</th><th>' + H.height + '</th></tr>' +
      rows.map(x => !x.m
        ? '<tr><th>' + metric(x.size + ' px') + '</th><td colspan="7">' + H.pending + '</td></tr>'
        : '<tr><th>' + metric(x.size + ' px') + '</th><td>' + x.name + '</td>' +
          '<td dir="ltr">' + x.m.icons + '</td>' +
          (x.m.square ? '<td>—</td><td>' + H.square + '</td>'
                      : '<td dir="ltr">' + x.m.gaps + ' × ' + x.m.gap + 'px</td>' +
                        yes(x.m.pad + 'px', onScale(x.m.pad))) +
          '<td dir="ltr">' + x.m.expected + 'px</td>' +
          yes(x.m.actual + 'px', Math.abs(x.m.actual - x.m.expected) < 0.6) +
          yes(x.m.h + 'px', x.m.h === Number(x.size)) + '</tr>').join('') +
      '<tr><td colspan="8" style="white-space:normal">' + H.footnote + '</td></tr>';
  }

  /* Nothing transitions any more, so a single frame is enough for layout to
     settle. (The old 620ms wait existed because padding animated over 550ms
     and measuring immediately reported values mid-flight.) */
  const measureWhenSettled = () => requestAnimationFrame(() => requestAnimationFrame(measure));

  const toggle = (id, cls) =>
    document.getElementById(id).addEventListener('change', e => {
      document.body.classList.toggle(cls, e.target.checked);
      measureWhenSettled();
    });
  toggle('trace', 'trace');

  /* Language switch. On means English, so its state is simply which build you
     are reading and nothing here has to remember it.

     Navigation is guarded by comparing the requested language with the current
     one, and the state is asserted on load. Without both, the page navigated to
     itself the moment it opened: the browser restores the checkbox across a
     same-form navigation, Jelly emits change when it takes that value, and an
     unguarded handler read that as a request to switch. */
  /* The Translation icon from the Minaã icon library, node 5:173, inlined so it
     costs no request and so its halves can be coloured apart. AR is the
     upper-left bubble with its two marks; EN is the lower-right one. Which
     half gets which colour is decided in CSS from the page direction, so this
     stays the same in both builds. */
  /* AR is the upper-left bubble with its two marks; EN the lower-right one.
     Kept as two separate strings because each is now its own button. */
  const LANG_AR_PATHS =
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.09 2.08C12.56 2.09 13.01 2.15 13.48 2.26C14.64 2.53 15.29 3.38 15.44 4.55C15.61 5.89 15.61 7.21 15.49 8.56C15.37 9.67 14.86 10.43 13.73 10.62C11.94 10.92 9.86 10.37 8.82 11.62H8.84C8.72 11.74 8.6 11.77 8.44 11.77C7.26 11.72 6.12 11.95 5.4 12.93L4.92 13.58C4.57 14.06 3.96 14.19 3.44 13.87C3.15 13.69 2.97 13.32 2.96 12.96C2.87 10.68 2.82 8.43 2.86 6.14C2.87 5.47 2.93 4.84 3.08 4.21C3.41 2.85 4.48 2.14 5.87 2.09L9.11 2L12.09 2.08ZM10.14 4.65H10.13C9.92 4.65 9.74 4.79 9.74 5.02L9.78 8.52C9.89 8.72 10.37 8.71 10.49 8.59C10.55 8.55 10.58 8.45 10.58 8.36L10.61 7.21C10.92 7.15 11.22 7.13 11.5 7.2C11.71 7.27 11.79 7.46 11.83 7.67L11.91 8.37C11.94 8.64 12.17 8.74 12.42 8.71C12.53 8.7 12.64 8.65 12.7 8.58C12.76 8.49 12.77 8.37 12.72 8.27C12.52 7.89 12.86 7.39 12.36 6.99C12.31 6.94 12.28 6.88 12.28 6.82C12.3 6.67 13.03 6.28 12.68 5.4C12.5 4.96 12.14 4.65 11.64 4.64H10.15L10.14 4.65ZM7.56 4.64C7.39 4.64 7.09 4.65 7.02 4.85L5.75 8.27C5.72 8.37 5.71 8.46 5.75 8.54C5.79 8.61 5.89 8.63 5.98 8.66C6.28 8.75 6.53 8.59 6.6 8.3C6.63 8.17 6.68 7.89 6.83 7.89L8.13 7.86C8.23 8.01 8.28 8.14 8.31 8.29C8.37 8.6 8.62 8.74 8.92 8.67C9.01 8.65 9.11 8.63 9.14 8.57C9.17 8.49 9.17 8.4 9.14 8.32L7.99 4.95C7.92 4.74 7.73 4.64 7.56 4.64Z"/>' +
    '<path d="M11.45 5.39C11.71 5.4 11.9 5.62 11.92 5.86C11.94 6.07 11.81 6.34 11.54 6.4H11.53C11.22 6.48 10.9 6.43 10.58 6.41V5.56C10.58 5.47 10.65 5.39 10.75 5.39H11.45Z"/>' +
    '<path d="M7.9 7.13C7.61 7.2 7.33 7.17 6.99 7.14C7.1 6.68 7.24 6.27 7.44 5.8L7.9 7.13Z"/>';

  const LANG_EN_PATHS =
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.06 10.36C18.57 10.36 19.06 10.47 19.53 10.66C20.1 10.9 20.53 11.32 20.75 11.88C20.93 12.28 21.06 12.7 21.08 13.16L21.06 13.17H21.05L21.15 15.21L21.06 20.96C21.05 21.25 20.92 21.58 20.72 21.75C20.27 22.16 19.6 22.04 19.24 21.59L18.48 20.65C17.88 19.92 17.05 19.77 16.1 19.76L12.03 19.68C11.46 19.67 10.93 19.6 10.39 19.46C9.07 19.13 8.69 18.01 8.61 16.74C8.56 15.86 8.56 15.02 8.61 14.15C8.67 13.18 8.96 12.27 9.88 11.89C10.28 11.71 10.71 11.68 11.16 11.66L13.57 11.55C14.46 11.51 15.19 10.99 15.75 10.33L18.06 10.36ZM15.45 13.58C15.25 13.57 15.04 13.71 15.04 13.95V17.22C15.04 17.47 15.23 17.63 15.44 17.63C15.68 17.64 15.84 17.49 15.84 17.22L15.86 15.3C15.96 15.26 16.05 15.33 16.1 15.42L17.28 17.35C17.39 17.56 17.56 17.63 17.8 17.63C18.01 17.62 18.18 17.5 18.18 17.27L18.17 17.26L18.2 14.01C18.2 13.91 18.22 13.85 18.09 13.71C17.97 13.56 17.75 13.56 17.6 13.64C17.46 13.72 17.37 13.88 17.37 14.06V15.71C17.37 15.8 17.34 15.93 17.23 15.93L16.02 13.94C15.88 13.71 15.73 13.58 15.45 13.58ZM12.11 13.62C11.89 13.62 11.72 13.8 11.72 14.01V17.2C11.72 17.4 11.89 17.62 12.11 17.62H13.97C14.09 17.62 14.21 17.56 14.26 17.5C14.33 17.4 14.33 17.31 14.33 17.2C14.32 17.02 14.21 16.89 14.02 16.89H12.8C12.67 16.89 12.57 16.82 12.58 16.67V16.11C12.6 16 12.67 15.94 12.79 15.93H13.84C14.05 15.93 14.16 15.78 14.17 15.59C14.18 15.37 14.04 15.21 13.81 15.21L12.58 15.18C12.53 14.92 12.52 14.65 12.58 14.42C12.61 14.33 12.75 14.34 12.8 14.33H14.06C14.26 14.33 14.34 14.1 14.31 13.94C14.29 13.78 14.16 13.62 13.97 13.62H12.11Z"/>';

  /* Two buttons sharing one 24-unit square, each drawing only its own glyph so
     they line up exactly as they do in the icon. */
  const langPart = (which, paths, label) =>
    '<button class="lang-part" type="button" data-lang="' + which + '" aria-label="' + label + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g>' + paths + '</g></svg>' +
    '</button>';

  const pair = document.getElementById('lang');
  pair.className = 'lang-pair';
  pair.innerHTML = langPart('ar', LANG_AR_PATHS, T.langTo.ar)
                 + langPart('en', LANG_EN_PATHS, T.langTo.en);

  /* Each bubble is drawn with its letters cut out of it — one evenodd path
     whose first subpath is the outline and whose other two are the A and R (or
     E and N) knocked through. Hit-testing follows the painted fill, so those
     letters were holes: a quarter of the AR bubble did not answer the mouse,
     and hovering them did not read as a button. Measured before the fix, 66 of
     272 sampled points inside AR's own box were dead.

     So each glyph gets an unpainted twin of its outline subpath, sitting under
     the artwork with pointer-events:all — which hit-tests a fill region whether
     or not it is painted. The silhouette answers everywhere, the letters
     included, while the empty corners still fall through to neither button,
     which is what keeps the upper bubble from swallowing the lower's clicks.
     It lives inside the same group, so it deforms with the press and the hit
     area never separates from the shape. */
  const SVGNS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('.lang-part g').forEach(g => {
    const outline = g.querySelector('path').getAttribute('d').split(/(?=M)/i)[0];
    const hit = document.createElementNS(SVGNS, 'path');
    hit.setAttribute('d', outline);
    hit.setAttribute('class', 'lang-hit');
    g.insertBefore(hit, g.firstChild);
  });

  /* ── Soft body, our shape ───────────────────────────────────────────────
     Jelly only paints a capsule or a rounded square, so it cannot carry this
     silhouette. The behaviour is written here instead, on the glyph itself.

     Same feel, same rules as the rest of the page: it follows the finger for
     as long as it is held rather than playing a fixed animation, it squashes
     toward the point actually touched, and it never completes on its own. The
     spring is under-damped so the release wobbles instead of snapping, which
     is the part that reads as jelly.

     It drives transforms rather than repainting pixels, so it costs the
     compositor a matrix and nothing else — worth having on a phone, where the
     canvas approach would not be. */
  const SPRING = 0.36, DAMP = 0.72, SQUASH = 0.22, LEAN = 3, HOVER = 0.34;
  /* A mouse click presses and releases inside a single frame, so a press read
     purely as a state is never sampled and the button looks dead to a mouse
     while working under a finger that rests. Every press is therefore held for
     at least this long, which is what makes a click on a desktop feel like
     anything at all. Measured: it reaches the squash and wobbles out. */
  const MIN_PRESS = 110;

  document.querySelectorAll('.lang-part').forEach(part => {
    /* The whole glyph, not one path of it — AR is three. */
    const path = part.querySelector('g');
    let down = false, hovered = false, hx = 0.5, hy = 0.5;
    let pressedAt = 0, held = false;
    let v = 0, k = 0, raf = 0;             // spring velocity and displacement

    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    function frame() {
      held = down || performance.now() - pressedAt < MIN_PRESS;
      const target = held ? 1 : (hovered ? HOVER : 0);
      v += (target - k) * SPRING;
      v *= DAMP;
      k += v;
      if (!held && !hovered && Math.abs(k) < 0.001 && Math.abs(v) < 0.001) {
        k = 0; v = 0; raf = 0;
        ['--sx','--sy','--tx','--ty'].forEach(p => path.style.removeProperty(p));
        return;
      }
      path.style.setProperty('--sx', (1 + SQUASH * k).toFixed(4));
      path.style.setProperty('--sy', (1 - SQUASH * k).toFixed(4));
      path.style.setProperty('--tx', ((hx - 0.5) * LEAN * k).toFixed(2) + 'px');
      path.style.setProperty('--ty', ((hy - 0.5) * LEAN * k).toFixed(2) + 'px');
      raf = requestAnimationFrame(frame);
    }

    const aim = e => {
      const b = part.getBoundingClientRect();
      hx = (e.clientX - b.left) / b.width;
      hy = (e.clientY - b.top) / b.height;
      path.style.setProperty('--ox', (hx * 100).toFixed(1) + '%');
      path.style.setProperty('--oy', (hy * 100).toFixed(1) + '%');
    };

    const release = () => { if (!down) return; down = false; wake(); };

    path.addEventListener('pointerdown', e => {
      down = true; pressedAt = performance.now(); aim(e); wake();
    });

    /* Move and release are watched on the window, not on the glyph. Pointer
       capture was the obvious way to follow a drag, but it retargets events to
       the capturing element and this button is pointer-events:none so the
       paths can own the hit area — so the release never came back and the
       press stuck down. The window sees it wherever the finger ends up. */
    addEventListener('pointermove', e => { if (held) aim(e); }, { passive: true });
    ['pointerup', 'pointercancel'].forEach(t => addEventListener(t, release));
    /* A drag that leaves the window entirely still has to let go. */
    addEventListener('blur', release);

    /* Hover is the desktop equivalent of a finger resting on it, and gives the
       mouse the same live response the rest of the page has. Touch never
       reports hover, so this stays a pointer-device affordance. */
    path.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch') return;
      hovered = true; aim(e); wake();
    });
    path.addEventListener('pointerleave', () => { hovered = false; wake(); });

    /* Keyboard gets the same squish, from the centre, since there is no
       contact point to squash toward. */
    part.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      hx = hy = 0.5; down = true; pressedAt = performance.now();
      path.style.setProperty('--ox', '50%'); path.style.setProperty('--oy', '50%');
      wake();
    });
    part.addEventListener('keyup', release);

    /* Pressing the language you are already reading does nothing. */
    part.addEventListener('click', () => {
      const wants = part.dataset.lang;
      const here = T.dir === 'rtl' ? 'ar' : 'en';
      if (wants !== here) location.href = T.otherHref;
    });
  });

  /* Jelly upgrades its elements asynchronously; measure once they exist. */
  Promise.all([
    customElements.whenDefined('jelly-button'),
    customElements.whenDefined('jelly-icon-button')
  ]).then(() => {
    CONTROLS.forEach(el => setP(el, 0));
    /* The inner shadow button is the element assistive technology actually
       reads — the host alone would not be announced — so it carries
       aria-disabled too. It has to wait for the upgrade: before Jelly runs
       there is no shadow root to reach into. Note this deliberately does NOT
       set `disabled`, which would drop it to tabIndex -1. */
    DISABLED.forEach(el => {
      const inner = el.shadowRoot && el.shadowRoot.querySelector('button');
      if (inner) inner.setAttribute('aria-disabled', 'true');
    });
    setTimeout(measure, 300);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
