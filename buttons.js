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
    /* arrows/internet-12-solid */
    config: '<path d="M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2ZM9.375 7.21191C8.96079 7.21191 8.625 7.5477 8.625 7.96191V14.0459L7.31348 12.5537C7.04017 12.2429 6.56599 12.2123 6.25488 12.4854C5.94388 12.7586 5.91348 13.2328 6.18652 13.5439L8.81152 16.5332C8.95392 16.6953 9.15927 16.7881 9.375 16.7881C9.59073 16.7881 9.79609 16.6953 9.93848 16.5332L12.5635 13.5439C12.8365 13.2328 12.8061 12.7586 12.4951 12.4854C12.184 12.2123 11.7098 12.2429 11.4365 12.5537L10.125 14.0459V7.96191C10.125 7.5477 9.78921 7.21191 9.375 7.21191ZM14.625 7.21191C14.4093 7.21192 14.2039 7.30474 14.0615 7.4668L11.4365 10.4561C11.1635 10.7672 11.1939 11.2414 11.5049 11.5146C11.816 11.7877 12.2902 11.7571 12.5635 11.4463L13.875 9.95312V16.0381C13.875 16.4523 14.2108 16.7881 14.625 16.7881C15.0392 16.7881 15.375 16.4523 15.375 16.0381V9.95312L16.6865 11.4463C16.9598 11.7571 17.434 11.7877 17.7451 11.5146C18.0561 11.2414 18.0865 10.7672 17.8135 10.4561L15.1885 7.4668C15.0461 7.30474 14.8407 7.21191 14.625 7.21191Z" fill="currentColor"/>',
    /* interface/filter-3-solid */
    iconbutton: '<rect x="16.4016" y="7.75009" width="8.80305" height="8.80305" rx="4.40153" transform="rotate(90 16.4016 7.75009)" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M1.99999 12.1516H7.38513" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16.5435 12.1516L22.0001 12.1516" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    /* education/reward-52-solid */
    appearance: '<path d="M11.5391 2C16.2903 2 23.1817 3.80005 21.8271 9.86523C21.5209 11.2359 20.2014 12.0467 18.8291 12.3457C12.3061 13.767 17.6299 17.4811 15.0449 20.2305C13.2421 22.1478 10.0844 22.2592 7.69531 21.1553C4.34138 19.6054 2 16.0892 2 12C2 6.47716 6.27078 2.00002 11.5391 2ZM10 14.8125C8.89543 14.8125 8 15.7079 8 16.8125C8 17.9171 8.89543 18.8125 10 18.8125C11.1046 18.8125 12 17.9171 12 16.8125C12 15.7079 11.1046 14.8125 10 14.8125ZM10 16.3125C10.2761 16.3125 10.5 16.5364 10.5 16.8125C10.5 17.0886 10.2761 17.3125 10 17.3125C9.72386 17.3125 9.5 17.0886 9.5 16.8125C9.5 16.5364 9.72386 16.3125 10 16.3125ZM6.75 9.60938C5.64543 9.60938 4.75 10.5048 4.75 11.6094C4.75003 12.7139 5.64545 13.6094 6.75 13.6094C7.85455 13.6094 8.74997 12.7139 8.75 11.6094C8.75 10.5048 7.85457 9.60938 6.75 9.60938ZM6.75 11.1094C7.02614 11.1094 7.25 11.3332 7.25 11.6094C7.24997 11.8855 7.02612 12.1094 6.75 12.1094C6.47388 12.1094 6.25003 11.8855 6.25 11.6094C6.25 11.3332 6.47386 11.1094 6.75 11.1094ZM13.8096 9.58301C13.6311 8.49298 12.6027 7.75417 11.5127 7.93262C10.4227 8.11112 9.68386 9.13947 9.8623 10.2295C10.0409 11.3194 11.0692 12.0583 12.1592 11.8799C13.2491 11.7014 13.988 10.673 13.8096 9.58301ZM11.7549 9.41309C12.0273 9.36849 12.2844 9.55281 12.3291 9.8252C12.3737 10.0976 12.1893 10.3546 11.917 10.3994C11.6446 10.444 11.3876 10.2596 11.3428 9.9873C11.2982 9.71489 11.4825 9.45783 11.7549 9.41309ZM16.9219 5.60938C15.8173 5.60938 14.9219 6.50481 14.9219 7.60938C14.9219 8.71392 15.8173 9.60938 16.9219 9.60938C18.0264 9.60938 18.9218 8.71392 18.9219 7.60938C18.9219 6.50481 18.0264 5.60938 16.9219 5.60938ZM16.9219 7.10938C17.198 7.10938 17.4219 7.33323 17.4219 7.60938C17.4218 7.88549 17.198 8.10938 16.9219 8.10938C16.6458 8.10938 16.4219 7.88549 16.4219 7.60938C16.4219 7.33323 16.6457 7.10938 16.9219 7.10938Z" fill="currentColor"/>',
    /* brand/ruler — brand is the first choice, so Sizes takes it */
    size: '<path d="M16.3563 2.40016C16.9094 1.84088 17.7393 1.88345 18.2801 2.43043L21.5868 5.76149C22.0415 6.22241 22.0657 7.01524 21.6356 7.50075L20.7694 8.38551L15.8827 13.2908L15.0477 14.1326L7.84459 21.3543L7.54967 21.6609C7.08878 22.0788 6.32622 22.1345 5.84068 21.6922C5.2937 21.1943 4.80156 20.6653 4.27916 20.1306L2.35631 18.1882C1.94457 17.7703 1.96913 17.0145 2.35631 16.572L3.8983 14.9929C3.97205 14.913 4.13257 14.8883 4.21861 14.9744L5.72349 16.4675C5.87098 16.6089 6.11131 16.5664 6.23424 16.4558C6.38784 16.3084 6.40614 16.0991 6.27721 15.9148L4.72838 14.366C4.7038 14.323 4.68497 14.1997 4.71568 14.1629L6.43053 12.448C6.52886 12.3498 6.67695 12.3627 6.77525 12.4548L8.26842 13.9295C8.41592 14.0708 8.66756 14.0091 8.77818 13.8923C8.90107 13.7633 8.95008 13.5235 8.8026 13.3699L7.24791 11.8093H7.26646C7.22959 11.7725 7.22959 11.6431 7.26646 11.6062L7.69713 11.1638L8.95689 9.90407C9.06751 9.79356 9.22731 9.86074 9.31334 9.95289L10.7508 11.3855C10.8922 11.5269 11.1318 11.483 11.2547 11.3601C11.3838 11.2311 11.4455 10.992 11.2919 10.8445L9.78599 9.32594C9.70031 9.23379 9.71304 9.11109 9.79283 9.02516L11.4276 7.38454C11.5198 7.29235 11.6674 7.31021 11.7596 7.39625L13.16 8.79762C13.3259 8.96354 13.5661 8.99445 13.7381 8.83473C13.9164 8.66879 13.8917 8.41014 13.7196 8.23805L12.3495 6.88649C12.2758 6.81282 12.1465 6.69596 12.2381 6.59157L12.5028 6.29664L13.9344 4.85817C14.0266 4.76598 14.1622 4.80952 14.242 4.88942L15.6864 6.3152C15.8338 6.46227 16.0915 6.37633 16.1962 6.25368C16.3006 6.13081 16.344 5.86633 16.1844 5.71266L14.7342 4.26246C14.6728 4.20101 14.6851 4.09581 14.7342 4.04664L16.3563 2.40016Z" fill="currentColor"/>',
    /* interface/category-2-solid */
    group: '<rect x="2" y="2" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="2" y="13.0448" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="13.0448" y="2" width="8.95523" height="8.95523" rx="4.47762" fill="currentColor"/><rect x="13.0448" y="13.0448" width="8.95523" height="8.95523" rx="3" fill="currentColor"/>',
    /* education/reward-63-solid */
    interaction: '<rect x="3.25" y="15.1184" width="17.5" height="6.13158" rx="3.06579" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><rect x="7.68359" y="2.75" width="8.63333" height="2.71053" rx="1.35526" stroke="currentColor" stroke-width="1.5"/><path d="M4.14648 16.0131L8.36266 11.864C8.74468 11.488 8.95982 10.9745 8.95982 10.4385V5.48682" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.8535 16.0131L15.6373 11.864C15.2553 11.488 15.0402 10.9745 15.0402 10.4385V5.48682" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    /* date-time/alarm-bell-6-solid */
    feedback: '<path d="M6.24978 9.27176V8.71875C6.24978 5.40504 8.93607 2.71875 12.2498 2.71875C15.5635 2.71875 18.2498 5.40504 18.2498 8.71875V9.94624C18.2498 11.1612 18.7324 12.3264 19.5915 13.1855L19.9229 13.5169C21.5193 15.1133 20.6736 17.8453 18.4546 18.2606C14.1884 19.0591 9.81114 19.0591 5.54499 18.2606C3.32593 17.8453 2.48026 15.1133 4.07662 13.5169L4.78466 12.8089C5.72276 11.8708 6.24978 10.5984 6.24978 9.27176Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M9.25 18.3125V18.5313C9.25 20.05 10.4812 21.2813 12 21.2813C13.5188 21.2813 14.75 20.05 14.75 18.5313V18.3125" stroke="currentColor" stroke-width="1.5"/><path d="M18.5918 2.71875L20.9783 5.10524" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.41016 2.71875L3.02367 5.10524" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    /* transportation/deliverycar-solid */
    direction: '<path d="M12 2.75C12.8888 2.75 13.6094 3.47054 13.6094 4.35938V21.25H10.3906V4.35938C10.3906 3.47054 11.1112 2.75 12 2.75Z" stroke="currentColor" stroke-width="1.5"/><path d="M5.00365 5.97339H10.375V10.5266H5.00366C4.57716 10.5266 4.36391 10.5266 4.17388 10.4444C3.98384 10.3621 3.83784 10.2067 3.54586 9.89582L3.28606 9.61923C2.67664 8.97039 2.37193 8.64597 2.37193 8.24998C2.37193 7.854 2.67664 7.52958 3.28606 6.88074L3.54586 6.60415C3.83784 6.29328 3.98384 6.13784 4.17388 6.05561C4.36391 5.97339 4.57716 5.97339 5.00365 5.97339Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M18.9963 15.0797L13.625 15.0797L13.625 10.5266L18.9963 10.5266C19.4228 10.5266 19.6361 10.5266 19.8261 10.6088C20.0162 10.691 20.1622 10.8464 20.4541 11.1573L20.7139 11.4339C21.3234 12.0827 21.6281 12.4072 21.6281 12.8031C21.6281 13.1991 21.3234 13.5236 20.7139 14.1724L20.4541 14.449C20.1622 14.7599 20.0162 14.9153 19.8261 14.9975C19.6361 15.0797 19.4228 15.0797 18.9963 15.0797Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    /* arrows/maxi-7-solid */
    verified: '<path d="M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2ZM7.18262 12.8379C6.7685 12.834 6.42977 13.167 6.42578 13.5811C6.42202 13.9951 6.75484 14.334 7.16895 14.3379L8.58789 14.3506L6.46875 16.4707C6.17586 16.7636 6.17586 17.2393 6.46875 17.5322C6.76161 17.8247 7.23651 17.8248 7.5293 17.5322L9.64844 15.4121L9.66211 16.8311C9.66602 17.2452 10.0048 17.578 10.4189 17.5742C10.8331 17.5703 11.1659 17.2315 11.1621 16.8174L11.1318 13.6113C11.1278 13.2031 10.7978 12.8725 10.3896 12.8682L7.18262 12.8379Z" fill="currentColor"/>',
    /* The four toast marks. These replace Jelly's coloured dot: a dot can only
       say "something happened", and it says it in colour alone. The glyph says
       which of the four it is, and keeps saying it to anyone who cannot tell
       the hues apart. Tier order holds — warning and danger are brand, info
       and success are solid, none outline. */
    /* The two interface glyphs are drawn to a 20-unit ink area inside the
       24-unit grid — a 2-unit safe margin the brand icons do not observe:
       measured, warning is 24×24 and danger 23.2×24, both edge to edge. Given
       the same 20px box, that made them draw 20px of ink against 16.7px, so
       the triangle sat visibly heavier than the tick beside it.

       These two are scaled to match rather than the brand pair scaled down —
       all four toast marks are now 24×24, edge to edge. translate(-2.4) is
       scale(1.2) applied to the 2-unit inset, so the ink stays centred. The
       path data is untouched inside the wrapper, so it still matches Figma
       exactly and the transform can simply be deleted if the masters are ever
       redrawn to the same grid. */
    /* interface/info-2-solid */
    toastInfo: '<g transform="translate(-2.4 -2.4) scale(1.2)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.9951 14.0918C11.4431 14.092 10.9953 14.5398 10.9951 15.0918C10.9951 15.644 11.443 16.0916 11.9951 16.0918H12.0039C12.5562 16.0918 13.0039 15.6441 13.0039 15.0918C13.0037 14.5397 12.5561 14.0918 12.0039 14.0918H11.9951ZM11.9951 7.25C11.5811 7.2502 11.2451 7.58591 11.2451 8V12.5391C11.2451 12.9531 11.5811 13.2889 11.9951 13.2891C12.4093 13.2891 12.7451 12.9533 12.7451 12.5391V8C12.7451 7.58579 12.4093 7.25 11.9951 7.25Z" fill="currentColor"/></g>',
    /* interface/done-2-solid */
    toastSuccess: '<g transform="translate(-2.4 -2.4) scale(1.2)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.5303 9.46973C15.2374 9.17683 14.7626 9.17683 14.4697 9.46973L11 12.9395L9.53027 11.4697C9.23738 11.1768 8.76262 11.1768 8.46973 11.4697C8.17683 11.7626 8.17683 12.2374 8.46973 12.5303L10.4697 14.5303C10.7626 14.8232 11.2374 14.8232 11.5303 14.5303L15.5303 10.5303C15.8232 10.2374 15.8232 9.76262 15.5303 9.46973Z" fill="currentColor"/></g>',
    /* brand/warning — exported at #EC4120, not the usual #E8411D, so the
       re-colour to currentColor is spelled out rather than assumed. */
    toastWarning: '<path d="M23.4238 18.3068L22.0809 15.7352L17.8083 7.52918L16.8621 5.70251L14.872 1.88197C14.7546 1.65649 14.6194 1.46647 14.4687 1.27393C14.1518 0.866031 13.7662 0.551875 13.3296 0.328925C12.5296 -0.0764373 11.6676 -0.109373 10.8476 0.245319C10.4443 0.420132 10.0898 0.676017 9.77064 1.00791C9.48255 1.31193 9.24986 1.65649 9.05042 2.04412L7.53019 4.95006L4.66704 10.4706L0.554016 18.3422C-0.0465379 19.4924 -0.203879 20.8403 0.308033 22.069C0.622714 22.8265 1.17451 23.4169 1.85706 23.7285C2.23379 23.9008 2.63047 23.9768 3.03823 23.9996H21.0017C21.4249 23.9692 21.8305 23.883 22.2094 23.7006C23.2909 23.1635 23.9623 21.9804 23.9978 20.6376C24.0222 19.8117 23.8072 19.0085 23.4238 18.3118V18.3068ZM10.3645 7.3417C10.3645 6.85273 10.5529 6.39163 10.8499 6.05974C10.9806 5.91533 11.1202 5.81399 11.2753 5.72025C11.7141 5.45423 12.3125 5.4517 12.7468 5.73292C12.933 5.85199 13.1014 5.9888 13.2432 6.18895C13.4626 6.49804 13.631 6.89833 13.631 7.31383V13.635C13.631 14.1163 13.4382 14.5977 13.1368 14.927C12.4521 15.6744 11.3573 15.6035 10.7501 14.7902C10.4886 14.4406 10.3557 13.9972 10.3557 13.5311L10.3601 7.34677L10.3645 7.3417ZM12 21.3394C10.9341 21.3394 10.072 20.3538 10.072 19.1352C10.072 17.9166 10.9341 16.9311 12 16.9311C13.0659 16.9311 13.928 17.9166 13.928 19.1352C13.928 20.3538 13.0659 21.3394 12 21.3394Z" fill="currentColor"/>',
    /* brand/danger — exported at #EB3F1D, same reason. */
    toastDanger: '<path d="M22.2202 4.90514L20.8919 3.56126L18.2188 0.878261C17.8176 0.475889 17.1948 0.146245 16.6399 0.0450593C16.4602 0.0118577 16.2946 0 16.1078 0L7.02283 0.00158103C6.37565 0.00158103 5.5172 0.357312 5.06 0.81502L4.37734 1.49881L1.28017 4.61818L0.90968 5.00395C0.353151 5.58261 0.0425674 6.42213 0 7.22925V16.7565L0.0583331 17.1763C0.11036 17.5565 0.251463 17.8988 0.439074 18.2292C0.633781 18.5731 0.86869 18.8601 1.14538 19.1399L2.41846 20.4277L3.54492 21.5708L5.17115 23.2134C5.72295 23.6727 6.43634 24 7.16156 24H16.0794C16.7621 24 17.6 23.6466 18.0722 23.1731L18.892 22.3502L20.5734 20.6506L22.232 18.9715C22.4496 18.751 22.6119 18.4996 22.7649 18.2348C23.0282 17.7794 23.1551 17.2806 23.1984 16.7518L23.2 7.06561C23.1275 6.24743 22.794 5.48538 22.2202 4.90435V4.90514ZM14.2277 5.00079C14.2601 4.94229 14.3318 4.88775 14.4154 4.88933L15.1477 4.90751L15.6301 4.92095L16.1117 4.92648C16.2465 4.92806 16.3908 4.93202 16.5177 5.00316C16.7022 5.10672 16.7597 5.34071 16.662 5.52332L15.7775 7.17075C15.7357 7.24901 15.6364 7.28696 15.5592 7.29091C15.4843 7.29486 15.3739 7.25929 15.3329 7.18814L14.9088 6.45376L14.2191 5.22609C14.1789 5.15415 14.1931 5.06561 14.2285 5L14.2277 5.00079ZM17.4101 10.0245C17.3557 10.9138 17.0608 11.8095 16.6021 12.5708C16.4089 12.8901 16.1874 13.1731 15.936 13.4506C15.6506 13.7652 15.3298 14.034 14.979 14.2727L14.5123 14.5597C14.1308 14.7621 13.7453 14.9265 13.3291 15.0435C12.961 15.147 12.6291 15.3407 12.5361 15.7257L12.4959 15.9628L12.4943 17.6253C12.4943 17.751 12.518 17.8688 12.5873 17.97C12.6961 18.1296 12.868 18.2601 13.0674 18.2625L14.3878 18.2743C14.789 18.2783 15.1666 18.7336 15.0775 19.1826C15.005 19.5162 14.7535 19.7715 14.413 19.8174H8.78701C8.33138 19.7565 8.03498 19.3241 8.128 18.8743C8.20446 18.5526 8.47169 18.3202 8.80198 18.268H10.1429C10.4763 18.2079 10.7081 17.9391 10.7025 17.5984V15.9004C10.7017 15.9004 10.6828 15.7636 10.6828 15.7636C10.604 15.4822 10.399 15.2538 10.1373 15.1304L9.76369 15.0119C8.74602 14.6885 7.87181 14.147 7.17181 13.3336C6.61607 12.6877 6.21326 11.9304 6.00752 11.1012C5.93263 10.7992 5.87824 10.5075 5.85301 10.1976L5.84119 10.0561V9.41581L5.8538 9.16522L5.9074 8.64901L6.05008 7.57866L6.39614 5.11621C6.4324 4.8585 6.62553 4.7004 6.88409 4.7004L12.5219 4.70198C12.7757 4.74466 12.9247 4.99051 12.8569 5.23241L12.7828 5.41265L11.7391 7.80395C11.706 7.88063 11.6706 7.94704 11.6974 8.03083C11.7423 8.16838 11.8889 8.22134 12.0205 8.15731L13.5656 7.41186C13.6728 7.35968 13.7918 7.37708 13.8919 7.43241C13.9763 7.47905 14.0362 7.57945 14.0504 7.69012C14.0638 7.79289 14.0393 7.88221 14.0125 7.98419L13.6231 9.45771C13.6011 9.54071 13.6444 9.62688 13.6996 9.66798C13.7634 9.71542 13.8612 9.73597 13.9392 9.6917L15.4575 8.8332L16.8685 8.01976C16.9867 7.95178 17.1318 7.95652 17.2429 8.03083C17.3131 8.07747 17.3801 8.16996 17.3832 8.26087L17.4108 9.09644L17.4077 10.0253L17.4101 10.0245Z" fill="currentColor"/>',
    /* interface/search-5-line — the one outline face on the page, and chosen
       as such. This icon is not a section marker: it sits inside the example
       buttons at 16-20px, where a solid magnifier collapses into a filled disc
       with a stick and stops reading as search. The glint arc inside the lens
       is what separates this face from plain search-line. Both builds draw
       their buttons from this one entry, so the two cannot drift. */
    search: '<circle cx="11.7236" cy="10.7236" r="8.72358" stroke="currentColor" stroke-width="1.5"/><path d="M17.1758 18.3567L20.0271 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 11C7 8.23858 9.23858 6 12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
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

  /* One button of a given configuration, variant and size. */
  function button(config, variantCls, size, dir) {
    if (config === 'icononly')
      return '<jelly-icon-button shape="circle" label="' + T.search + '" data-config="icononly" ' +
             'class="' + variantCls + ' s' + size + '">' + ICON + '</jelly-icon-button>';
    const build = CONFIGS.find(c => c[0] === config)[2];
    return '<jelly-button dir="' + dir + '" data-config="' + config + '" ' +
           'class="' + variantCls + ' s' + size + '">' +
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

  /* ═══════════════════════════════════════════════════════════════════════
     COLOUR DRIVEN BY JELLY'S LIVE DEFORMATION

     Jelly emits no motion events and exposes no progress API, but it repaints
     its blob into <canvas part="jelly"> every frame. Measured during a real
     drag: the alpha count moved 523 -> 586 and the alpha centroid shifted
     204.6 -> 195.8, returning to rest afterwards. The canvas transform never
     changes, so the deformation lives purely in those pixels — which means it
     can be read rather than guessed at.

     So each frame, for the one button being touched:
       intensity  = how far the blob has departed from its resting shape
       lean       = which way its centroid has moved
     and the colour is composited into Jelly's own silhouette with
     `source-in`, so it can only ever appear exactly where the deformed body
     is. Origin is the real contact point; the spread leans with the blob;
     when Jelly springs back, intensity falls and the spread retracts along
     the same path. One response, one source of truth.
     ═════════════════════════════════════════════════════════════════════ */
  const CONTROLS = [...document.querySelectorAll('jelly-button, jelly-icon-button')];
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  /* Reading the deformation */
  const SAMPLE_STEP   = 6;      // pixel stride when reading the blob
  const AREA_SPAN     = 0.14;   // +14% area ~ full intensity
  const SHIFT_SPAN    = 10;     // 10 canvas px of centroid travel ~ full
  const BASELINE_EASE = 0.08;   // how fast the resting sample re-learns when untouched

  /* Knowing when it has settled */
  const STILL_EPS     = 0.004;  // frame-to-frame movement counted as "not moving"
  const STILL_FRAMES  = 12;     // consecutive still frames before the loop lets go

  /* Drawing the wave */
  const CORE      = 0.88;       // solid share of the wave before it fades; the label
                                // uses the same figure so the two cannot drift
  const LEAN_GAIN = 2;          // how far the origin leans with the body's centroid
  const MIN_BAND  = 12;         // floor for the soft edge on the smallest buttons
  const FALLBACK_ACTIVE = 'rgb(232,65,29)';   // only if --fill-active resolves to nothing

  const setP = (el, p) => {
    const v = clamp01(p);
    el.__p = v;
    el.style.setProperty('--p', v.toFixed(4));
  };

  const jellyCanvas = el => el.shadowRoot && el.shadowRoot.querySelector('canvas');

  /* Reads Jelly's rendered blob: area + centroid, cheaply and only on demand. */
  function readBlob(el) {
    const c = jellyCanvas(el);
    if (!c || !c.width) return null;
    if (!el.__ctx) el.__ctx = c.getContext('2d', { willReadFrequently: true });
    const d = el.__ctx.getImageData(0, 0, c.width, c.height).data;
    let n = 0, sx = 0, sy = 0;
    for (let y = 0; y < c.height; y += SAMPLE_STEP)
      for (let x = 0; x < c.width; x += SAMPLE_STEP) {
        if (d[(y * c.width + x) * 4 + 3] > 16) { n++; sx += x; sy += y; }
      }
    return n ? { n, cx: sx / n, cy: sy / n } : null;
  }

  /* Both layers are canvases stacked on Jelly's own, pixel for pixel. They are
     slotted into .jelly-content, its own stacking context above the jelly
     canvas, so a negative z-index puts them between the body and the label —
     tinting or outlining the blob, never the text.

       reveal (z -1)  the colour, composited inside the silhouette
       ring   (z -2)  the outline variant's stroke, derived from the silhouette

     One factory builds both: they differ only in class and depth, and letting
     them drift apart is what let the ring keep a stale size while the reveal
     stayed correct. */
  const LAYERS = {
    reveal: { className: 'reveal-layer', z: -1, node: '__overlay', ctx: '__octx' },
    ring:   { className: 'ring-layer',   z: -2, node: '__ring',    ctx: '__rctx' },
  };

  function layerFor(el, kind) {
    const spec = LAYERS[kind];
    if (el[spec.node]) return el[spec.node];
    const jc = jellyCanvas(el);
    if (!jc) return null;
    const c = document.createElement('canvas');
    c.className = spec.className;
    c.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
                      'pointer-events:none;z-index:' + spec.z + ';';
    el.appendChild(c);
    el[spec.node] = c;
    el[spec.ctx] = c.getContext('2d');
    syncLayer(c, jc);                 // sole owner of layer geometry
    return c;
  }

  /* ── Outline ────────────────────────────────────────────────────────────
     The outline variant needs a real stroke, and Jelly has no ring API — the
     --jelly-ring properties we were setting are Jelly's focus ring, not a
     border, which is how the outline quietly became a plain cream fill when
     the buttons moved onto Jelly. A CSS border is not an option
     either: it would stay a rigid capsule while the body squashes. So the
     stroke is derived from Jelly's own silhouette every frame — draw the blob
     smeared around a small circle, punch the undisplaced blob back out, and
     what is left is an even rim that deforms with the body exactly. */
  const RING_STEPS = 16;

  /* Our layers are composited 1:1 with Jelly's canvas, so any drift in size
     puts the stroke and the fill in different places. Jelly resizes its canvas
     when the button does — after a webfont swap, a reflow, a container change —
     and a layer created before that keeps the old geometry. This re-syncs on
     every paint, so a layer can never stay stale. Returns true if it changed,
     since assigning width/height also clears the canvas. */
  function syncLayer(c, jc) {
    const jcs = getComputedStyle(jc);
    let changed = false;
    if (c.width !== jc.width || c.height !== jc.height) {
      c.width = jc.width; c.height = jc.height; changed = true;
    }
    if (c.style.width !== jcs.width || c.style.height !== jcs.height) {
      c.style.width = jcs.width; c.style.height = jcs.height; changed = true;
    }
    return changed;
  }

  function paintRing(el) {
    const cs = getComputedStyle(el);
    const colour = cs.getPropertyValue('--stroke').trim();
    const widthCss = parseFloat(cs.getPropertyValue('--stroke-width')) || 0;
    if (!colour || widthCss <= 0) return;
    const jc = jellyCanvas(el), c = layerFor(el, 'ring');
    if (!jc || !c) return;
    syncLayer(c, jc);
    const ctx = el.__rctx;
    const scale = jc.width / parseFloat(getComputedStyle(jc).width);
    const w = widthCss * scale;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < RING_STEPS; i++) {
      const a = (i / RING_STEPS) * Math.PI * 2;
      ctx.drawImage(jc, Math.cos(a) * w, Math.sin(a) * w);
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(jc, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* The pieces of copy the wave has to repaint. jelly-button wraps them in a
     .jelly-label; jelly-icon-button carries a bare icon instead, which the
     wave used to miss entirely — a red glyph then sat on a fully red fill and
     vanished. Our own canvas layers are children too, so they are excluded. */
  function labelParts(el) {
    const wrapped = el.querySelectorAll('.jelly-label > *');
    if (wrapped.length) return wrapped;
    return el.querySelectorAll(':scope > :not(canvas)');
  }

  /* Wipes the colour and puts the label back to its resting colour. The stroke
     is left alone — it belongs to the resting state, not the interaction. */
  function clearReveal(el) {
    if (el.__octx && el.__overlay) el.__octx.clearRect(0, 0, el.__overlay.width, el.__overlay.height);
    resetLabel(el);
  }

  /* Paints the active colour into Jelly's silhouette, from the contact point. */
  function paint(el, intensity, lean) {
    const jc = jellyCanvas(el), o = layerFor(el, 'reveal');
    if (!jc || !o) return;
    syncLayer(o, jc);
    const ctx = el.__octx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, o.width, o.height);
    if (intensity <= 0.001 || !el.__contact) { resetLabel(el); return; }

    const scale = jc.width / parseFloat(getComputedStyle(jc).width);   // device px per css px
    // contact point, host coords -> canvas coords
    const hb = el.getBoundingClientRect();
    const jb = jc.getBoundingClientRect();
    let ox = (el.__contact.x - jb.left) * scale;
    let oy = (el.__contact.y - jb.top)  * scale;
    // let the spread lean the way the body is leaning
    ox += lean.x * LEAN_GAIN; oy += lean.y * LEAN_GAIN;

    /* Reach = the distance from this contact point to the furthest corner of
       the button, so intensity 1 means "just covered" wherever you touched and
       intensity 0.5 really is half way. A fixed reach saturated long before 1:
       the canvas diagonal by p≈0.45, the button diagonal by p≈0.5 from centre. */
    const cx = el.__contact.x - hb.left, cy = el.__contact.y - hb.top;
    const reach = Math.hypot(Math.max(cx, hb.width - cx),
                             Math.max(cy, hb.height - cy)) * scale;
    const r = Math.max(1, reach * intensity);

    ctx.drawImage(jc, 0, 0);                     // exact deformed silhouette
    ctx.globalCompositeOperation = 'source-in';  // colour only inside the body
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    const active = activeColour(el);
    g.addColorStop(0, active);
    g.addColorStop(CORE, active);
    g.addColorStop(1, active.replace('rgb(', 'rgba(').replace(')', ',0)'));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, o.width, o.height);
    ctx.globalCompositeOperation = 'source-over';

    paintLabel(el, hb, cx, cy, reach / scale, intensity);
  }

  /* Repaints each label part as the same wave front passes over it, so the
     text and icons turn where the colour actually arrives rather than fading
     on a separate timer. */
  function paintLabel(el, hb, cx, cy, reachCss, intensity) {
    const parts = labelParts(el);
    if (!parts.length) return;
    const front = reachCss * intensity * CORE;          // same front as the fill
    const band = Math.max(MIN_BAND, reachCss * (1 - CORE));   // same soft edge
    parts.forEach(part => {
      const pb = part.getBoundingClientRect();
      const d = Math.hypot(pb.left + pb.width / 2 - hb.left - cx,
                           pb.top + pb.height / 2 - hb.top - cy);
      part.style.setProperty('--t', clamp01((front - d) / band + 0.5).toFixed(3));
    });
  }

  function resetLabel(el) {
    labelParts(el).forEach(p => p.style.setProperty('--t', '0'));
  }

  /* --fill-active may be any CSS colour, and the canvas needs a concrete rgb()
     to build a gradient from. A throwaway element resolves it. The answer is
     fixed by the variant class, so it is worked out once per button rather
     than on every interaction. */
  function activeColour(el) {
    if (el.__activeColour) return el.__activeColour;
    const v = getComputedStyle(el).getPropertyValue('--fill-active').trim();
    let rgb = FALLBACK_ACTIVE;
    if (v) {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:fixed;left:-9999px;color:' + v;
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      if (resolved.startsWith('rgb')) rgb = resolved;
    }
    el.__activeColour = rgb;
    return rgb;
  }

  /* One loop per active button. It follows Jelly rather than leading it, and
     stops on its own once the body has settled back to rest. */
  function track(el) {
    if (el.__tracking) return;
    el.__tracking = true;
    activeColour(el);
    if (!el.__rest) el.__rest = readBlob(el);
    let still = 0, prev = null;
    const step = () => {
      const now = readBlob(el);
      const rest = el.__rest;
      if (!now || !rest) { el.__tracking = false; return; }

      /* While nothing is touching it, ease the baseline toward what we see.
         The baseline is read from a live canvas, so it can be captured
         mid-wobble; without this it stays wrong and the button keeps a
         phantom colour forever. */
      if (!el.__engaged) {
        rest.n  += (now.n  - rest.n)  * BASELINE_EASE;
        rest.cx += (now.cx - rest.cx) * BASELINE_EASE;
        rest.cy += (now.cy - rest.cy) * BASELINE_EASE;
      }

      const dArea = (now.n - rest.n) / rest.n;
      const dx = now.cx - rest.cx, dy = now.cy - rest.cy;
      const shift = Math.hypot(dx, dy);
      const intensity = clamp01(Math.max(dArea / AREA_SPAN, shift / SHIFT_SPAN));

      setP(el, intensity);
      paint(el, intensity, { x: dx, y: dy });
      paintRing(el);                             // the stroke deforms with the body

      /* Stop on frame-to-frame stillness, not on distance from the baseline —
         a bad baseline must never be able to keep the loop alive. */
      const moved = prev
        ? Math.abs(now.n - prev.n) / rest.n + Math.hypot(now.cx - prev.cx, now.cy - prev.cy)
        : Infinity;
      prev = now;
      still = moved < STILL_EPS ? still + 1 : 0;
      if (still > STILL_FRAMES && !el.__engaged) {   // settled and no longer touched
        el.__tracking = false; setP(el, 0); clearReveal(el); return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  CONTROLS.forEach(el => {
    setP(el, 0);
    const contact = e => { el.__contact = { x: e.clientX, y: e.clientY }; };

    el.addEventListener('pointerenter', e => { el.__engaged = true; contact(e); track(el); });
    el.addEventListener('pointermove',  e => { contact(e); track(el); });
    el.addEventListener('pointerdown',  e => { el.__engaged = true; contact(e); track(el); });
    el.addEventListener('pointerup',    e => { contact(e); });
    ['pointerleave','pointercancel'].forEach(t =>
      el.addEventListener(t, () => { el.__engaged = false; }));   // loop unwinds itself

    // Keyboard has no contact point and no deformation to follow.
    el.addEventListener('focus', () => {
      /* Jelly delegates focus into its shadow button, and that inner element is
         the one that matches :focus-visible — the host never does. Testing the
         host meant this returned on every tab stop and keyboard users saw no
         colour at all. */
      const inner = el.shadowRoot && el.shadowRoot.querySelector('button');
      if (!(inner || el).matches(':focus-visible')) return;
      const b = el.getBoundingClientRect();
      el.__contact = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
      setP(el, 1); paint(el, 1, { x: 0, y: 0 });
    });
    el.addEventListener('blur', () => { setP(el, 0); clearReveal(el); });
  });

  /* On resize the resting shape has changed, so the old baseline would read as
     a permanent deformation and has to go.

     The stroke is repainted here as well as by the observer below. The observer
     watches the layout box, but a change in device pixel ratio rewrites Jelly's
     backing store while the CSS box stays put — measured after a viewport
     switch: our layer held 468x288 against Jelly's 410x252 at an identical
     234px on screen, which would have drawn the stroke at 0.88 scale. */
  addEventListener('resize', () => CONTROLS.forEach(el => {
    el.__rest = null;
    settleRing(el);
  }));

  /* Repaint until Jelly has finished resizing rather than once on the event.
     Painting immediately syncs to the size Jelly is about to abandon, and the
     observer cannot cover it — a device-pixel-ratio change rewrites the
     backing store while the layout box it watches stays identical. So watch
     the backing store directly and stop as soon as it holds still. */
  function settleRing(el) {
    if (el.__settling) return;
    el.__settling = true;
    let stable = 0, frames = 0;
    const step = () => {
      const jc = jellyCanvas(el), c = el.__ring;
      if (!jc || ++frames > 40) { el.__settling = false; return; }
      const matched = c && c.width === jc.width && c.height === jc.height;
      if (!matched) { paintRing(el); stable = 0; } else stable++;
      if (stable >= 3) { el.__settling = false; return; }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* At rest nothing is tracking, so the stroke has to be repainted whenever the
     button changes size. Fixed timeouts were not enough: the RTL 40px outline
     settled to its final width after the last one, leaving a stroke drawn at
     the old size sitting 16px off the fill.

     The observer watches Jelly's canvas, not the host. Watching the host fires
     while Jelly still holds its previous canvas size, so the stroke resynced to
     stale dimensions and stayed exactly one resize behind — correct until the
     first reflow, then 42px out. The canvas is what we composite against, so it
     is what to follow. */
  const ringWatch = new ResizeObserver(entries => {
    entries.forEach(e => {
      const host = e.target.__host;
      if (host && !host.__tracking) paintRing(host);
    });
  });
  function restRing(el) {
    const attach = () => {
      const jc = jellyCanvas(el);
      if (!jc) { setTimeout(attach, 100); return; }   // the element may not have upgraded yet
      jc.__host = el;
      ringWatch.observe(jc);
      paintRing(el);
    };
    attach();
  }
  CONTROLS.forEach(restRing);

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
    setTimeout(measure, 300);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
