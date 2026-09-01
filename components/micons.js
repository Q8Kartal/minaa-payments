/* ═══════════════════════════════════════════════════════════════════════════
   Micons — the Forms set.

   Exported from the Minaã Icons library (Figma file BlltPtiVnS9ULiuMVKo2oM,
   page 108:30) and inlined as one <symbol> sprite. No third party, no CDN, no
   network hop: the glyphs paint with the first frame.

   THE MOON IS ONE FILLED OUTLINE, AND THE STROKED VERSION WAS UNRECOVERABLE.
   It used to be the three vectors Figma exports from the 24px icon -- a filled
   crescent and two stroked sparkles. Reported from the page as "the icon lost
   its detail", and both sparkles were wrong, for two different reasons:

     the larger  exported with stroke-linejoin="round", which rounds a
                 four-pointed star into a blob. Figma's canvas draws mitre.
     the smaller exported DEGENERATE -- four curve segments where a star needs
                 eight, spanning 0.085 units against a 1.5 stroke. No join can
                 make a star out of that; the shape simply is not in the path.

   Both were measured, not guessed, and a scan of all 39 paths in this file for
   the same signature -- a span smaller than twice its own stroke -- found only
   these two. The fix for the first was a join; there was no honest fix for the
   second, because the geometry was gone.

   So the glyph is now the OUTLINE, taken from node 312:67 of the Components
   file, where the moon is drawn large and flattened to a single boolean shape:
   three subpaths, 45 curves, one fill, no strokes at all. Nothing to infer --
   no join, no weight, no reconstruction.

   IT IS REGISTERED, NOT EYEBALLED. The source frame is 133x141; it is scaled
   by 19.866/141 and offset so its bounding box lands exactly where the old
   crescent PAINTED -- 18.81 x 19.866 at (2.339, 2.134). That target was
   computed from the old path plus half its 1.5 stroke, and independently
   confirmed by Figma's own per-vector export, which reports the crescent as
   18.8096 x 19.866. Two routes to the same number.

   A LARGE FLATTENED NODE BEATS A SMALL STROKED ONE for any glyph whose detail
   lives in the stroke. If another Micon ever loses its detail, ask for it at
   size before trying to repair the export.

   HOW THESE WERE PRODUCED, AND HOW NOT TO PRODUCE THEM
   Via Figma's own SVG exporter — node.exportAsync({ format: 'SVG' }) — and
   then only two textual edits: the library's paint (#E8411D) swapped for
   currentColor, and the wrapping clipPath dropped because it clips to the
   24x24 viewBox and therefore does nothing.

   The first version of this file did NOT do that. It walked the node tree and
   rebuilt each glyph from vectorPaths, translating by absoluteBoundingBox —
   which INCLUDES the stroke extent, so every stroked path landed offset by
   half its stroke weight — and clamped corner radii by eye. The results were
   not subtly off, they were different drawings: `select` came out as three
   vertical lines where the real mark is three horizontal ones, and `otp` as a
   rounded rectangle with three stray lines instead of a circle with a key
   knocked out of it. Most of these glyphs are ONE compound path whose detail
   is a knockout, not a shape with strokes laid over it, and rebuilding them
   by hand loses exactly that.

   If a glyph is ever added here, export it. Do not reconstruct it.

   Paths carry fill/stroke="currentColor", so an icon takes the colour of the
   text beside it and the colour rules keep working untouched. Stroke weights
   are the library's own on a 24-unit grid — never rescale a stroke when you
   change the rendered size, or they stop matching Figma.

   TIER — brand first; if nothing in brand fits the subject, solid; outline
   only after that. Decided for the whole set, because one outline mark among
   solid neighbours reads visibly lighter and breaks the row. This set is
   SOLID, with two brand exceptions where brand genuinely fits the subject:

     input  → brand/pencil   writing into a field
     range  → brand/ruler    an interval is a measured span
   ═════════════════════════════════════════════════════════════════════════ */

const MICONS = {
  /* interface/done-2-solid — a circle with the tick knocked out */
  checkbox: '<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.5303 9.46973C15.2374 9.17683 14.7626 9.17683 14.4697 9.46973L11 12.9395L9.53027 11.4697C9.23738 11.1768 8.76262 11.1768 8.46973 11.4697C8.17683 11.7626 8.17683 12.2374 8.46973 12.5303L10.4697 14.5303C10.7626 14.8232 11.2374 14.8232 11.5303 14.5303L15.5303 10.5303C15.8232 10.2374 15.8232 9.76262 15.5303 9.46973Z" fill="currentColor"/>',

  /* brand/rope-knot (Figma 224:277) -- Minaa's own link mark. The
     reference library reaches for a chain link here; a rope knot is what
     this brand ties things together with. Four paths, recoloured from the
     exported #E8411D to currentColor like every other glyph. */
  ropeknot: '<path d="M6.98794 9.48611C7.76437 8.77935 8.91901 8.6594 9.87465 9.15701C10.3326 9.39593 10.7411 9.71501 11.1393 10.0535L13.3893 11.9451L14.862 11.367C15.1008 11.8447 15.1906 12.4224 15.0016 12.9002L13.6481 13.4578L10.9997 14.6023C10.4322 14.8412 9.84497 15.0409 9.1979 15.1404V15.1101C7.8739 15.3192 6.61999 14.5927 6.25161 13.3484L7.97329 13.3289C8.32169 13.5578 8.69058 13.6972 9.12856 13.5877C10.0344 13.3687 10.9007 13.0499 11.7965 12.6218C10.9802 11.8653 10.2132 11.2084 9.35708 10.6111C8.50105 10.0139 8.05309 10.2822 7.65493 10.8992H6.11196C6.25136 10.2722 6.56992 9.86432 6.98794 9.48611Z" fill="currentColor"/><path d="M11.7165 9.92361C13.3889 9.05753 15.3007 8.44035 16.4157 10.2322C17.0328 11.2276 17.1617 12.5118 16.7438 13.6267C16.3356 14.7318 15.1705 15.1607 14.1452 14.7127C13.787 14.5535 13.4888 14.3639 13.1803 14.1052L14.7731 13.4177H14.7829C15.0715 13.2984 15.3398 13.2983 15.4293 12.9002C15.5288 12.4325 15.5094 11.8953 15.3502 11.4275C15.1213 10.7605 14.4541 10.422 13.7672 10.6609L12.8913 10.9793L11.7165 9.92361Z" fill="currentColor"/><path d="M10.7506 12.2332C10.0936 12.5119 9.43669 12.7912 8.69008 12.8211C6.7588 12.9007 4.88677 12.8609 2.91567 12.8211H2.9059C2.36861 12.811 2.01075 12.572 2.00063 12.0447C1.99068 11.5174 2.09949 11.5264 2.24868 11.3972C2.48749 11.1982 2.71683 11.2279 3.01528 11.2478C4.64788 11.3474 6.24108 11.3174 7.87368 11.3074L9.40688 11.1287L10.7506 12.2332Z" fill="currentColor"/><path d="M17.2418 10.989C18.5857 10.999 19.9394 11.0192 21.2633 11.1785C22.5874 11.3378 21.7213 11.6863 21.7213 11.9451C21.7212 12.204 21.5419 12.6718 21.1637 12.6619V12.6717L17.4108 12.532C17.4406 12.0243 17.4011 11.5465 17.2418 10.989Z" fill="currentColor"/>',

  /* brand/pencil */
  input: '<path d="M19.4174 2.60121C18.4535 1.62797 16.9612 1.92458 16.0435 2.86075L13.3555 5.6229L7.46045 11.6477L3.58599 15.6149L2.31617 20.8426C2.15859 21.5007 2.81666 22.0753 3.44695 21.9919L8.341 20.7035L10.2875 18.6922L16.4791 12.38L20.9097 7.88453C21.9015 6.87421 22.0127 5.26141 20.9932 4.23255L19.3896 2.61048L19.4174 2.60121Z" fill="currentColor"/>',

  /* communication/text-2-solid — speech bubble, bars knocked out */
  label: '<path d="M14 2.41071C17.7712 2.41071 19.6566 2.41101 20.8281 3.58258C21.9997 4.75415 22 6.63947 22 10.4107V15.0386C22 16.9008 20.4901 18.4107 18.6279 18.4107H16C15.1019 18.4107 15.448 19.103 15.3809 19.9986C15.2752 21.4069 13.6087 22.0923 12.543 21.1656L10.2832 19.2007C9.69748 18.6914 8.9471 18.4107 8.1709 18.4107H7.36719C6.09552 18.4107 5.45937 18.4105 4.93848 18.2672C3.5794 17.8931 2.51765 16.8313 2.14355 15.4722C2.00021 14.9513 2 14.3152 2 13.0435V10.4107C2 6.63947 2.0003 4.75415 3.17188 3.58258C4.34345 2.41101 6.22876 2.41071 10 2.41071H14ZM8.0625 10.3902C7.64843 10.3902 7.31273 10.7262 7.3125 11.1402V12.8589C7.3125 13.2732 7.64829 13.6089 8.0625 13.6089C8.47671 13.6089 8.8125 13.2732 8.8125 12.8589V11.1402C8.81227 10.7262 8.47657 10.3902 8.0625 10.3902ZM12 8.2027C11.5859 8.2027 11.2502 8.53868 11.25 8.9527V12.8589C11.25 13.2732 11.5858 13.6089 12 13.6089C12.4142 13.6089 12.75 13.2732 12.75 12.8589V8.9527C12.7498 8.53868 12.4141 8.2027 12 8.2027ZM15.9375 6.04645C15.5234 6.04645 15.1877 6.38243 15.1875 6.79645V12.8589C15.1875 13.2732 15.5233 13.6089 15.9375 13.6089C16.3517 13.6089 16.6875 13.2732 16.6875 12.8589V6.79645C16.6873 6.38243 16.3516 6.04645 15.9375 6.04645Z" fill="currentColor"/>',

  /* security/key-01-solid — a circle with a key knocked out */
  otp: '<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM8.42871 9C6.82361 9 5.51293 10.2606 5.43262 11.8457L5.42871 12C5.42872 13.6568 6.77186 15 8.42871 15L8.58301 14.9961C9.91229 14.9287 11.0122 13.9959 11.333 12.75H12.5322V13.8398C12.5322 14.2541 12.868 14.5898 13.2822 14.5898C13.6962 14.5896 14.0322 14.2539 14.0322 13.8398V12.75H15.333L15.334 14.3477C15.3341 14.7618 15.6699 15.0977 16.084 15.0977C16.4979 15.0974 16.8339 14.7616 16.834 14.3477L16.833 12.75H17.6543C18.0685 12.75 18.4043 12.4142 18.4043 12C18.4043 11.5858 18.0685 11.25 17.6543 11.25H11.3301C11.009 10.0045 9.91205 9.07124 8.58301 9.00391L8.42871 9ZM8.42871 10.5C9.25713 10.5 9.92871 11.1716 9.92871 12C9.92871 12.8284 9.25713 13.5 8.42871 13.5C7.60029 13.5 6.92872 12.8284 6.92871 12C6.92871 11.1716 7.60029 10.5 8.42871 10.5Z" fill="currentColor"/>',

  /* interface/category-solid — four equal cells */
  radio: '<rect x="2" y="2" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="2" y="13.0448" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="13.0448" y="2" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="13.0448" y="13.0448" width="8.95523" height="8.95523" rx="3" fill="currentColor"/>',

  /* interface/category-2-solid — one cell rounded, the chosen one */
  radiogroup: '<rect x="2" y="2" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="2" y="13.0448" width="8.95523" height="8.95523" rx="3" fill="currentColor"/><rect x="13.0448" y="2" width="8.95523" height="8.95523" rx="4.47762" fill="currentColor"/><rect x="13.0448" y="13.0448" width="8.95523" height="8.95523" rx="3" fill="currentColor"/>',

  /* brand/ruler */
  range: '<path d="M16.3563 2.40016C16.9094 1.84088 17.7393 1.88345 18.2801 2.43043L21.5868 5.76149C22.0415 6.22241 22.0657 7.01524 21.6356 7.50075L20.7694 8.38551L15.8827 13.2908L15.0477 14.1326L7.84459 21.3543L7.54967 21.6609C7.08878 22.0788 6.32622 22.1345 5.84068 21.6922C5.2937 21.1943 4.80156 20.6653 4.27916 20.1306L2.35631 18.1882C1.94457 17.7703 1.96913 17.0145 2.35631 16.572L3.8983 14.9929C3.97205 14.913 4.13257 14.8883 4.21861 14.9744L5.72349 16.4675C5.87098 16.6089 6.11131 16.5664 6.23424 16.4558C6.38784 16.3084 6.40614 16.0991 6.27721 15.9148L4.72838 14.366C4.7038 14.323 4.68497 14.1997 4.71568 14.1629L6.43053 12.448C6.52886 12.3498 6.67695 12.3627 6.77525 12.4548L8.26842 13.9295C8.41592 14.0708 8.66756 14.0091 8.77818 13.8923C8.90107 13.7633 8.95008 13.5235 8.8026 13.3699L7.24791 11.8093H7.26646C7.22959 11.7725 7.22959 11.6431 7.26646 11.6062L7.69713 11.1638L8.95689 9.90407C9.06751 9.79356 9.22731 9.86074 9.31334 9.95289L10.7508 11.3855C10.8922 11.5269 11.1318 11.483 11.2547 11.3601C11.3838 11.2311 11.4455 10.992 11.2919 10.8445L9.78599 9.32594C9.70031 9.23379 9.71304 9.11109 9.79283 9.02516L11.4276 7.38454C11.5198 7.29235 11.6674 7.31021 11.7596 7.39625L13.16 8.79762C13.3259 8.96354 13.5661 8.99445 13.7381 8.83473C13.9164 8.66879 13.8917 8.41014 13.7196 8.23805L12.3495 6.88649C12.2758 6.81282 12.1465 6.69596 12.2381 6.59157L12.5028 6.29664L13.9344 4.85817C14.0266 4.76598 14.1622 4.80952 14.242 4.88942L15.6864 6.3152C15.8338 6.46227 16.0915 6.37633 16.1962 6.25368C16.3006 6.13081 16.344 5.86633 16.1844 5.71266L14.7342 4.26246C14.6728 4.20101 14.6851 4.09581 14.7342 4.04664L16.3563 2.40016Z" fill="currentColor"/>',

  /* interface/filter-3-solid — a knob on a track */
  segmented: '<rect x="16.4016" y="7.75009" width="8.80305" height="8.80305" rx="4.40153" transform="rotate(90 16.4016 7.75009)" fill="currentColor" stroke="currentColor" stroke-width="1.5"/><path d="M1.99999 12.1516H7.38513" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16.5435 12.1516L22.0001 12.1516" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',

  /* interface/sort-solid — three horizontal rules, narrowing */
  select: '<path d="M3 6L21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 12L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 18L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',

  /* interface/setting-2-solid — squircle with an inner square knocked out */
  slider: '<path d="M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2ZM12 8C11.07 8 10.6051 8.00032 10.2236 8.10254L10.0322 8.16016C9.08927 8.48133 8.36262 9.25302 8.10254 10.2236L8.06836 10.3711C7.99985 10.7284 8 11.1862 8 12C8 12.93 8.00032 13.3949 8.10254 13.7764L8.16016 13.9678C8.48133 14.9107 9.25302 15.6374 10.2236 15.8975L10.3711 15.9316C10.7284 16.0001 11.1862 16 12 16C12.93 16 13.3949 15.9997 13.7764 15.8975C14.8116 15.6201 15.6201 14.8116 15.8975 13.7764C15.9997 13.3949 16 12.93 16 12C16 11.07 15.9997 10.6051 15.8975 10.2236C15.6201 9.18836 14.8116 8.37994 13.7764 8.10254C13.3949 8.00032 12.93 8 12 8ZM12 9.5C13.0265 9.5 13.246 9.51255 13.3887 9.55078C13.906 9.68954 14.3105 10.094 14.4492 10.6113C14.4874 10.754 14.5 10.9735 14.5 12C14.5 13.0265 14.4874 13.246 14.4492 13.3887C14.3105 13.906 13.906 14.3105 13.3887 14.4492C13.246 14.4874 13.0265 14.5 12 14.5C10.9735 14.5 10.754 14.4874 10.6113 14.4492C10.094 14.3105 9.68954 13.906 9.55078 13.3887C9.51255 13.246 9.5 13.0265 9.5 12C9.5 10.9735 9.51255 10.754 9.55078 10.6113C9.68954 10.094 10.094 9.68954 10.6113 9.55078C10.754 9.51255 10.9735 9.5 12 9.5Z" fill="currentColor"/>',

  /* interface/power-solid — a circle with a bolt knocked out */
  switch: '<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM14.498 6.93945C14.1885 6.66438 13.7146 6.69241 13.4395 7.00195L9.43945 11.502C9.24333 11.7227 9.19446 12.0382 9.31543 12.3076C9.43645 12.5769 9.70472 12.75 10 12.75H12.3301L9.43945 16.002C9.16438 16.3115 9.19241 16.7854 9.50195 17.0605C9.81154 17.3356 10.2854 17.3076 10.5605 16.998L14.5605 12.498C14.7567 12.2773 14.8055 11.9618 14.6846 11.6924C14.5635 11.4231 14.2953 11.25 14 11.25H11.6699L14.5605 7.99805C14.8356 7.68846 14.8076 7.21461 14.498 6.93945Z" fill="currentColor"/>',

  /* communication/text-solid — speech bubble, two lines knocked out */
  textarea: '<path d="M14 2.41113C17.7709 2.41113 19.6565 2.41073 20.8281 3.58203C21.9997 4.7536 22 6.6399 22 10.4111V15.0391C22 16.9012 20.49 18.4111 18.6279 18.4111H16C15.1019 18.4111 15.448 19.1034 15.3809 19.999C15.275 21.4071 13.6086 22.0924 12.543 21.166L10.2832 19.2002C9.69751 18.691 8.947 18.4111 8.1709 18.4111H7.36719C6.09552 18.4111 5.45937 18.4109 4.93848 18.2676C3.57926 17.8935 2.51759 16.8309 2.14355 15.4717C2.00026 14.9508 2 14.3148 2 13.043V10.4111C2 6.6399 2.0003 4.7536 3.17188 3.58203C4.34347 2.41073 6.22906 2.41113 10 2.41113H14ZM8 11.1074C7.58581 11.1074 7.25003 11.4432 7.25 11.8574C7.25 12.2716 7.58579 12.6074 8 12.6074H16C16.4142 12.6074 16.75 12.2716 16.75 11.8574C16.75 11.4432 16.4142 11.1074 16 11.1074H8ZM9.5 7.46387C9.08583 7.46387 8.75007 7.79971 8.75 8.21387C8.75 8.62808 9.08579 8.96387 9.5 8.96387H14.5C14.9142 8.96387 15.25 8.62808 15.25 8.21387C15.2499 7.79971 14.9142 7.46387 14.5 7.46387H9.5Z" fill="currentColor"/>',

  /* interface/setting-solid — a gear with its centre knocked out */
  theme: '<path d="M13.7539 3.82922C14.2237 3.03962 15.2436 2.75889 16.0332 3.22864L17.7617 4.21887C18.6712 4.73864 18.9816 5.90822 18.4619 6.80774C17.5529 8.37663 18.2919 9.65522 20.1006 9.6554C21.14 9.6554 22 10.5054 22 11.5548V13.3136C21.9999 14.353 21.15 15.213 20.1006 15.213C18.2918 15.2132 17.5524 16.4925 18.4619 18.0616C18.9814 18.9712 18.6712 20.1308 17.7617 20.6505L16.0332 21.6398C15.2437 22.1094 14.2237 21.8296 13.7539 21.0402L13.6445 20.8507C12.745 19.2815 11.265 19.2815 10.3555 20.8507L10.2461 21.0402C9.7763 21.8296 8.75633 22.1094 7.9668 21.6398L6.23828 20.6505C5.32882 20.1308 5.01855 18.9612 5.53809 18.0616C6.44757 16.4925 5.70824 15.2132 3.89941 15.213C2.85002 15.213 2.00013 14.353 2 13.3136V11.5548C2.00004 10.5154 2.84996 9.6554 3.89941 9.6554C5.70806 9.65522 6.44714 8.37663 5.53809 6.80774C5.01837 5.90822 5.32882 4.73864 6.23828 4.21887L7.9668 3.22864C8.7564 2.75889 9.77633 3.03962 10.2461 3.82922L10.3555 4.01868C11.255 5.58765 12.735 5.58765 13.6445 4.01868L13.7539 3.82922ZM12 8.46204C9.80633 8.46223 8.02734 10.241 8.02734 12.4347L8.03223 12.6388C8.13525 14.6696 9.76415 16.2982 11.7949 16.4015L12 16.4064C14.125 16.4062 15.8603 14.7374 15.9668 12.6388L15.9717 12.4347C15.9717 10.3094 14.3029 8.57333 12.2041 8.46692L12 8.46204ZM12 9.96204C13.3652 9.96223 14.4717 11.0694 14.4717 12.4347C14.4714 13.7998 13.3651 14.9062 12 14.9064C10.6349 14.9062 9.5276 13.7998 9.52734 12.4347C9.52734 11.0694 10.6348 9.96223 12 9.96204Z" fill="currentColor"/>',

  /* weather/* -- the two states of the theme switch. Imported by key from the
     published library (8b153aa5... and e9ffbd72...) rather than exported from
     the instances that use them, because an instance can carry overrides an
     export would silently bake in. Path data verified identical either way.

     Both are filed in the library under the name `weather/emailbox-solid`,
     which describes neither a moon nor a sunrise and is the same name for two
     different components. The names are wrong upstream; the drawings are
     right. Renaming them in BlltPtiVnS9ULiuMVKo2oM is worth doing before
     anyone else goes looking for "moon".

     TIER, and worth knowing before reusing these as a pair: they do NOT
     match. The moon is a SOLID glyph and the sun is an OUTLINE one at stroke
     2. Against the rule at the top of this file that says decide the tier for
     a whole set, that is a mismatch -- the moon carries visibly more weight
     than the sun at the same size. It is what the library holds today. */
  moon: '<path d="M58.5215 0.0993528C63.8827 -0.83526 67.3853 5.00474 65.2393 10.0242C51.3198 42.5711 49.6451 91.4951 126.246 95.4949C131.212 95.7547 134.644 100.779 132.185 105.116C120.016 126.548 97.0426 141 70.709 141C31.6577 141 0 109.222 0 70.0222C0.00123151 34.9956 25.279 5.89675 58.5215 0.0993528ZM113.651 36.0798C114.161 36.0808 114.437 36.9249 114.991 38.6023L115.329 39.6003L116.518 43.2117C117.613 46.5311 118.164 48.1912 119.349 49.3806C120.534 50.57 122.187 51.1222 125.494 52.2224L131.184 54.1218C132.125 54.4589 132.598 54.7158 132.6 55.0994C132.599 55.4839 132.126 55.7395 131.184 56.0769L129.092 56.7761L125.494 57.9753L123.36 58.697C121.412 59.3807 120.246 59.9175 119.349 60.8171C118.164 62.0062 117.613 63.6679 116.518 66.9861L115.329 70.5906L114.991 71.5954L114.625 72.698C114.345 73.4869 114.119 73.9452 113.831 74.0769L113.651 74.1189C113.141 74.1186 112.866 73.2749 112.312 71.5954L111.98 70.5906L110.786 66.9861C109.691 63.6674 109.14 62.0063 107.955 60.8171C107.059 59.9178 105.896 59.3798 103.95 58.697L101.81 57.9753L98.2188 56.7761L97.2178 56.4441C95.7521 55.9566 94.9271 55.6839 94.7451 55.279L94.7041 55.0994C94.7067 54.5884 95.547 54.3104 97.2178 53.7546L98.2188 53.4148L101.81 52.2224C105.116 51.1226 106.77 50.5698 107.955 49.3806C109.139 48.1913 109.691 46.5301 110.786 43.2117L111.98 39.6003L112.678 37.5007C113.014 36.5554 113.268 36.08 113.651 36.0798ZM87.8955 15.2439C88.2989 15.3259 88.5302 16.032 88.9932 17.4343L89.3037 18.3562C90.0372 20.5574 90.492 21.7635 91.3066 22.7087L92.0244 23.4294L92.9014 24.0535C93.8743 24.6182 95.1856 25.0553 97.2793 25.7517L98.8682 26.3269C99.2246 26.4928 99.4205 26.6533 99.4619 26.8542C99.4793 26.9434 99.479 27.0423 99.4619 27.1316L99.3994 27.2771C99.1904 27.5986 98.5001 27.827 97.2793 28.2331C94.4894 29.1612 93.0897 29.6306 92.0244 30.5554C91.7688 30.7775 91.528 31.0196 91.3066 31.2761C90.3847 32.3454 89.9176 33.7502 88.9932 36.5505L88.4199 38.1453C88.2966 38.4122 88.1758 38.5889 88.04 38.6785L87.8955 38.741C87.8059 38.7586 87.7088 38.7585 87.6191 38.741L87.4746 38.6785C87.3384 38.5891 87.2184 38.413 87.0947 38.1453L86.5215 36.5505C85.5969 33.7499 85.13 32.3454 84.208 31.2761C83.9864 31.0193 83.7461 30.7778 83.4902 30.5554C82.5491 29.738 81.3506 29.2733 79.1602 28.5378L78.2354 28.2331C77.0136 27.8267 76.3243 27.5988 76.1152 27.2771L76.0527 27.1316C76.0356 27.0422 76.0354 26.9435 76.0527 26.8542C76.1364 26.4504 76.8394 26.2161 78.2354 25.7517C81.0257 24.8235 82.4249 24.355 83.4902 23.4294C83.7458 23.2072 83.9867 22.9653 84.208 22.7087C85.1292 21.6394 85.597 20.2347 86.5215 17.4343C86.9845 16.0319 87.2156 15.3255 87.6191 15.2439C87.7085 15.2265 87.8062 15.2263 87.8955 15.2439Z" transform="translate(2.3746 2.134) scale(0.1408936)" fill="currentColor"/>',

  sun: '<path d="M7.75 12.75C7.75 10.4028 9.65279 8.5 12 8.5C14.3472 8.5 16.25 10.4028 16.25 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M12 3.25V5.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M2.5 12.75L5 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M19 12.75L21.5 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M18.7168 6.03247L17.3121 7.43713" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M5.28223 6.03247L6.68689 7.43713" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M5 16.75H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M9 20.75H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',

  /* ---- Toast marks ---------------------------------------------------------
     Lifted verbatim from buttons.js, where they were built to replace Jelly's
     coloured dot. A dot can only say "something happened"; these say which of
     the four things it was, which is what keeps meaning off colour alone.

     All four are 24x24 edge to edge. info and success come from a 20-unit
     drawing and carry translate(-2.4) scale(1.2) to fill the same box as the
     other two -- that transform is load-bearing, not decoration, and removing
     it makes two of the four visibly smaller than their neighbours. */
  'toast-info': '<g transform="translate(-2.4 -2.4) scale(1.2)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.9951 14.0918C11.4431 14.092 10.9953 14.5398 10.9951 15.0918C10.9951 15.644 11.443 16.0916 11.9951 16.0918H12.0039C12.5562 16.0918 13.0039 15.6441 13.0039 15.0918C13.0037 14.5397 12.5561 14.0918 12.0039 14.0918H11.9951ZM11.9951 7.25C11.5811 7.2502 11.2451 7.58591 11.2451 8V12.5391C11.2451 12.9531 11.5811 13.2889 11.9951 13.2891C12.4093 13.2891 12.7451 12.9533 12.7451 12.5391V8C12.7451 7.58579 12.4093 7.25 11.9951 7.25Z" fill="currentColor"/></g>',
  'toast-success': '<g transform="translate(-2.4 -2.4) scale(1.2)"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.5303 9.46973C15.2374 9.17683 14.7626 9.17683 14.4697 9.46973L11 12.9395L9.53027 11.4697C9.23738 11.1768 8.76262 11.1768 8.46973 11.4697C8.17683 11.7626 8.17683 12.2374 8.46973 12.5303L10.4697 14.5303C10.7626 14.8232 11.2374 14.8232 11.5303 14.5303L15.5303 10.5303C15.8232 10.2374 15.8232 9.76262 15.5303 9.46973Z" fill="currentColor"/></g>',
  'toast-warning': '<path d="M23.4238 18.3068L22.0809 15.7352L17.8083 7.52918L16.8621 5.70251L14.872 1.88197C14.7546 1.65649 14.6194 1.46647 14.4687 1.27393C14.1518 0.866031 13.7662 0.551875 13.3296 0.328925C12.5296 -0.0764373 11.6676 -0.109373 10.8476 0.245319C10.4443 0.420132 10.0898 0.676017 9.77064 1.00791C9.48255 1.31193 9.24986 1.65649 9.05042 2.04412L7.53019 4.95006L4.66704 10.4706L0.554016 18.3422C-0.0465379 19.4924 -0.203879 20.8403 0.308033 22.069C0.622714 22.8265 1.17451 23.4169 1.85706 23.7285C2.23379 23.9008 2.63047 23.9768 3.03823 23.9996H21.0017C21.4249 23.9692 21.8305 23.883 22.2094 23.7006C23.2909 23.1635 23.9623 21.9804 23.9978 20.6376C24.0222 19.8117 23.8072 19.0085 23.4238 18.3118V18.3068ZM10.3645 7.3417C10.3645 6.85273 10.5529 6.39163 10.8499 6.05974C10.9806 5.91533 11.1202 5.81399 11.2753 5.72025C11.7141 5.45423 12.3125 5.4517 12.7468 5.73292C12.933 5.85199 13.1014 5.9888 13.2432 6.18895C13.4626 6.49804 13.631 6.89833 13.631 7.31383V13.635C13.631 14.1163 13.4382 14.5977 13.1368 14.927C12.4521 15.6744 11.3573 15.6035 10.7501 14.7902C10.4886 14.4406 10.3557 13.9972 10.3557 13.5311L10.3601 7.34677L10.3645 7.3417ZM12 21.3394C10.9341 21.3394 10.072 20.3538 10.072 19.1352C10.072 17.9166 10.9341 16.9311 12 16.9311C13.0659 16.9311 13.928 17.9166 13.928 19.1352C13.928 20.3538 13.0659 21.3394 12 21.3394Z" fill="currentColor"/>',
  'toast-danger': '<path d="M22.2202 4.90514L20.8919 3.56126L18.2188 0.878261C17.8176 0.475889 17.1948 0.146245 16.6399 0.0450593C16.4602 0.0118577 16.2946 0 16.1078 0L7.02283 0.00158103C6.37565 0.00158103 5.5172 0.357312 5.06 0.81502L4.37734 1.49881L1.28017 4.61818L0.90968 5.00395C0.353151 5.58261 0.0425674 6.42213 0 7.22925V16.7565L0.0583331 17.1763C0.11036 17.5565 0.251463 17.8988 0.439074 18.2292C0.633781 18.5731 0.86869 18.8601 1.14538 19.1399L2.41846 20.4277L3.54492 21.5708L5.17115 23.2134C5.72295 23.6727 6.43634 24 7.16156 24H16.0794C16.7621 24 17.6 23.6466 18.0722 23.1731L18.892 22.3502L20.5734 20.6506L22.232 18.9715C22.4496 18.751 22.6119 18.4996 22.7649 18.2348C23.0282 17.7794 23.1551 17.2806 23.1984 16.7518L23.2 7.06561C23.1275 6.24743 22.794 5.48538 22.2202 4.90435V4.90514ZM14.2277 5.00079C14.2601 4.94229 14.3318 4.88775 14.4154 4.88933L15.1477 4.90751L15.6301 4.92095L16.1117 4.92648C16.2465 4.92806 16.3908 4.93202 16.5177 5.00316C16.7022 5.10672 16.7597 5.34071 16.662 5.52332L15.7775 7.17075C15.7357 7.24901 15.6364 7.28696 15.5592 7.29091C15.4843 7.29486 15.3739 7.25929 15.3329 7.18814L14.9088 6.45376L14.2191 5.22609C14.1789 5.15415 14.1931 5.06561 14.2285 5L14.2277 5.00079ZM17.4101 10.0245C17.3557 10.9138 17.0608 11.8095 16.6021 12.5708C16.4089 12.8901 16.1874 13.1731 15.936 13.4506C15.6506 13.7652 15.3298 14.034 14.979 14.2727L14.5123 14.5597C14.1308 14.7621 13.7453 14.9265 13.3291 15.0435C12.961 15.147 12.6291 15.3407 12.5361 15.7257L12.4959 15.9628L12.4943 17.6253C12.4943 17.751 12.518 17.8688 12.5873 17.97C12.6961 18.1296 12.868 18.2601 13.0674 18.2625L14.3878 18.2743C14.789 18.2783 15.1666 18.7336 15.0775 19.1826C15.005 19.5162 14.7535 19.7715 14.413 19.8174H8.78701C8.33138 19.7565 8.03498 19.3241 8.128 18.8743C8.20446 18.5526 8.47169 18.3202 8.80198 18.268H10.1429C10.4763 18.2079 10.7081 17.9391 10.7025 17.5984V15.9004C10.7017 15.9004 10.6828 15.7636 10.6828 15.7636C10.604 15.4822 10.399 15.2538 10.1373 15.1304L9.76369 15.0119C8.74602 14.6885 7.87181 14.147 7.17181 13.3336C6.61607 12.6877 6.21326 11.9304 6.00752 11.1012C5.93263 10.7992 5.87824 10.5075 5.85301 10.1976L5.84119 10.0561V9.41581L5.8538 9.16522L5.9074 8.64901L6.05008 7.57866L6.39614 5.11621C6.4324 4.8585 6.62553 4.7004 6.88409 4.7004L12.5219 4.70198C12.7757 4.74466 12.9247 4.99051 12.8569 5.23241L12.7828 5.41265L11.7391 7.80395C11.706 7.88063 11.6706 7.94704 11.6974 8.03083C11.7423 8.16838 11.8889 8.22134 12.0205 8.15731L13.5656 7.41186C13.6728 7.35968 13.7918 7.37708 13.8919 7.43241C13.9763 7.47905 14.0362 7.57945 14.0504 7.69012C14.0638 7.79289 14.0393 7.88221 14.0125 7.98419L13.6231 9.45771C13.6011 9.54071 13.6444 9.62688 13.6996 9.66798C13.7634 9.71542 13.8612 9.73597 13.9392 9.6917L15.4575 8.8332L16.8685 8.01976C16.9867 7.95178 17.1318 7.95652 17.2429 8.03083C17.3131 8.07747 17.3801 8.16996 17.3832 8.26087L17.4108 9.09644L17.4077 10.0253L17.4101 10.0245Z" fill="currentColor"/>',
  /* communication/message-2-solid, and it is a SETTLE, not a match. The
     library has 1,895 components and not one of them draws a dialog, a
     modal or a window -- searched for every word for it. CLAUDE.md says a
     gap like that is worth filling in the library rather than settling, so
     this stands in until it is: a dialog is a conversation with the reader,
     which is the nearest subject the set actually holds. */
  dialog: '<path d="M21.0889 5.4707C21.999 6.6607 22 8.53324 22 12C22 15.7712 21.9997 17.6566 20.8281 18.8281C19.6566 19.9997 17.7712 20 14 20H10C6.22876 20 4.34345 19.9997 3.17188 18.8281C2.0003 17.6566 2 15.7712 2 12C2 8.53369 2.00041 6.66072 2.91016 5.4707L7.61328 10.1738C7.37903 10.7377 7.25 11.3556 7.25 12C7.25 12.8906 7.50026 13.7361 7.94238 14.4531C8.18356 14.8597 8.49284 15.2277 8.84863 15.5361C9.68017 16.2901 10.7829 16.75 12 16.75C13.7298 16.75 15.236 15.8264 16.0576 14.4531L16.0586 14.4541C16.3122 14.0434 16.5031 13.5757 16.6113 13.0947L16.6104 13.0938C16.7026 12.7379 16.75 12.3731 16.75 12C16.75 11.3562 16.6177 10.7403 16.3818 10.1777L21.0889 5.4707ZM14 4C16.9094 4 18.6956 4.0021 19.8984 4.54004L15.5654 8.87305C15.5525 8.8583 15.5405 8.8427 15.5273 8.82812H15.5264C14.6657 7.85226 13.3947 7.25 12 7.25C10.6712 7.25 9.45932 7.7964 8.59277 8.68652C8.53595 8.74497 8.48053 8.80484 8.42676 8.86621L4.10059 4.54004C5.30341 4.00173 7.08993 4 10 4H14Z" fill="currentColor"/><path d="M12 8.5C13.933 8.5 15.5 10.067 15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5ZM12 9.75C11.5858 9.75 11.25 10.0858 11.25 10.5V11.25H10.5C10.0858 11.25 9.75 11.5858 9.75 12C9.75 12.4142 10.0858 12.75 10.5 12.75H11.25V13.5C11.25 13.9142 11.5858 14.25 12 14.25C12.4142 14.25 12.75 13.9142 12.75 13.5V12.75H13.5C13.9142 12.75 14.25 12.4142 14.25 12C14.25 11.5858 13.9142 11.25 13.5 11.25H12.75V10.5C12.75 10.0858 12.4142 9.75 12 9.75Z" fill="currentColor"/>',

  /* interface/cross-2-line, and the ONLY reason it is an outline mark in a set
     that is otherwise solid is that the library has no alternative: there is no
     bare cross in Micons at all. cross-solid, cross-line, cross-2/3/4-line and
     tag-cross-line are every cross it holds, and each one encloses the mark in
     a shape -- rounded square, circle, starburst, hexagon. Searched close,
     dismiss, remove, exit, times and multiply before accepting that.

     Consequence to fix upstream rather than live with: the dialog puts this on
     a filled disc on hover, so a ring lands inside a disc. A plain
     interface/close-line would remove the problem in one component.

     Exported, not redrawn, per the rule at the top of this file -- and it is
     STROKED, not filled, so the 1.5 weight on the 24 grid is real geometry.
     Never render it at a size other than 24 without regenerating: scaling the
     box scales the stroke off the grid, and Figma clips the artwork rather
     than scaling it, which sliced the right edge off the circle when it was
     first tried at 20. */
  close: '<path d="M9.87868 10.1213L14.1213 14.364" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
         '<path d="M14.1213 10.1213L9.87868 14.364" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
         '<circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.5"/>',

  /* ── Overlays ──────────────────────────────────────────────────────────
     Four of these five are SETTLES, and the reason is structural rather than
     bad luck. Micons has no UI-chrome vocabulary at all: scanning all 1,895
     names for panel, layout, window, sidebar, drawer, tab, modal, popup,
     tooltip, badge, chip, divider, accordion, progress, skeleton, spinner,
     breadcrumb and pagination returns NOTHING. The library covers the
     business -- shipping, storage, finance, weather -- plus generic interface
     actions, and it was never asked to name the parts of an interface.

     So these are chosen on AFFORDANCE, which is the honest reading available:
     the mark a user would touch to summon the thing, not a picture of the
     thing. Where even that fails it is said so.

     Names here are entry names, not library names -- the library path is on
     each line, so a mark can always be traced back to what the library calls
     it. The DRAWER no longer carries one: it used to be interface/menu-2-solid
     and is now drawn, for reasons kept at its entry. It is the only glyph in
     this file with no library path, and that is deliberate, not an omission. */

  /* DRAWN FOR THIS SET -- the only glyph here that is not lifted from Micons.

     The hamburger was here, with a documented reason: it is the control that
     opens a drawer, and the most universally read affordance for one. Two
     things broke it.

     It is the MENU's glyph. interface/menu-2-solid is what the library itself
     calls the menu mark, so one drawing was doing duty for two entries four
     apart on the same page -- and entry 22 documents jelly-menu.

     And it was the only OUTLINE mark among five solid siblings. Dialog,
     popover, tooltip, menu and menu-item are all solid; three stroked lines
     read visibly lighter and broke the row.

     A REPLACEMENT WAS LOOKED FOR FIRST, VISUALLY, AND THERE IS NONE. The scan
     recorded above searched names; this one searched pictures, which matters,
     because names in that file cannot be trusted: navigation/side-* are turn
     arrows, arrows/stage-* is a bar chart, e-commerce/rbox is a shipping box,
     communication/inbox is an envelope, and all ten glyphs in the first row of
     the code-design frame -- ten different drawings -- are called clock-6. The
     three closest SHAPES each mean something else: date-time/calander (a panel
     with a header band), code-design 234:1137 (a terminal window) and
     interface/category (2x2 tiles).

     So it is drawn ON THE LIBRARY'S OWN SILHOUETTE rather than a new one. The
     first subpath is subpath 0 of interface/done-solid, copied verbatim -- the
     same squircle carrying menuitem, tooltip and popover. Only the knockout is
     new, so this sits in the row as family rather than as a guest.

     evenodd, container then page: the page is cut out of a solid body, leaving
     a frame plus a band. The band is on the RIGHT, the start edge in Arabic,
     which is the side a drawer opens from here.

     IT IS NOT IN FIGMA YET. Until it is added to Micons the sprite holds a
     mark the library does not, and that is real drift. This is the record. */
  drawer: '<path fill-rule="evenodd" fill="currentColor" d="'
          + 'M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2Z'
          + 'M8.25 4.75H14.5V19.25H8.25A3.5 3.5 0 0 1 4.75 15.75V8.25A3.5 3.5 0 0 1 8.25 4.75Z'
          + '"/>',

  /* communication/sms-solid, and the WEAKEST mark in this file -- it is an
     envelope. A popover is a small panel tethered to its trigger, so the mark
     that fits is a bubble with a tail, and the library holds no such thing:
     every cross-checked candidate was an envelope, a grid or an arrow. It sits
     beside dialog, which settled on communication/message-2-solid for the same
     missing idea, so at least the two overlays fail consistently. Replace both
     the day a bubble exists. */
  popover: '<path d="M14 4C17.7712 4 19.6566 4.0003 20.8281 5.17188C21.9997 6.34345 22 8.22876 22 12C22 15.7712 21.9997 17.6566 20.8281 18.8281C19.6566 19.9997 17.7712 20 14 20H10C6.22876 20 4.34345 19.9997 3.17188 18.8281C2.0003 17.6566 2 15.7712 2 12C2 8.22876 2.0003 6.34345 3.17188 5.17188C4.34345 4.0003 6.22876 4 10 4H14ZM16.5303 7.46973C16.2374 7.17683 15.7626 7.17683 15.4697 7.46973L14.2979 8.6416C13.6164 9.32309 13.157 9.7796 12.7695 10.0752C12.3995 10.3575 12.1843 10.4219 12 10.4219C11.8157 10.4219 11.6005 10.3575 11.2305 10.0752C10.843 9.7796 10.3836 9.32309 9.70215 8.6416L8.53027 7.46973C8.23738 7.17683 7.76262 7.17683 7.46973 7.46973C7.17683 7.76262 7.17683 8.23738 7.46973 8.53027L8.6416 9.70215C9.29312 10.3537 9.83411 10.8966 10.3203 11.2676C10.8239 11.6518 11.3559 11.9219 12 11.9219C12.6441 11.9219 13.1761 11.6518 13.6797 11.2676C14.1659 10.8966 14.7069 10.3537 15.3584 9.70215L16.5303 8.53027C16.8232 8.23738 16.8232 7.76262 16.5303 7.46973Z" fill="currentColor"/>',

  /* interface/why-solid. A question mark, and the one overlay glyph that is
     not a settle: a tooltip exists to answer "what is this?", so the mark for
     asking is the subject rather than a stand-in for it. */
  tooltip: '<path d="M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2ZM11.5488 14.9785C11.2598 14.9785 11.0293 15.0625 10.8574 15.2305C10.6855 15.3945 10.5996 15.6016 10.5996 15.8516C10.5996 16.0937 10.6855 16.2988 10.8574 16.4668C11.0293 16.6348 11.2598 16.7188 11.5488 16.7188C11.834 16.7187 12.0625 16.6348 12.2344 16.4668C12.4102 16.2988 12.498 16.0937 12.498 15.8516C12.498 15.6016 12.4102 15.3945 12.2344 15.2305C12.0625 15.0625 11.834 14.9785 11.5488 14.9785ZM11.666 8C11.1699 8 10.7227 8.08594 10.3242 8.25781C9.92578 8.42578 9.60742 8.68555 9.36914 9.03711C9.13477 9.38477 9.01172 9.82617 9 10.3613H10.6992C10.7031 10.1191 10.75 9.92383 10.8398 9.77539C10.9336 9.62695 11.0527 9.51758 11.1973 9.44727C11.3418 9.37305 11.498 9.33594 11.666 9.33594C11.8691 9.33594 12.0371 9.375 12.1699 9.45312C12.3066 9.53125 12.4082 9.64648 12.4746 9.79883C12.5449 9.94727 12.5801 10.1348 12.5801 10.3613C12.5801 10.5566 12.541 10.7344 12.4629 10.8945C12.3848 11.0508 12.2773 11.2031 12.1406 11.3516C12.0039 11.5 11.8437 11.6563 11.6602 11.8203C11.4414 12.0234 11.2656 12.2285 11.1328 12.4355C11.0039 12.6426 10.9121 12.875 10.8574 13.1328C10.8066 13.3867 10.7793 13.6895 10.7754 14.041H12.2695C12.2734 13.7402 12.3145 13.4805 12.3926 13.2617C12.4746 13.043 12.627 12.834 12.8496 12.6348C13.1074 12.3926 13.3438 12.1582 13.5586 11.9316C13.7734 11.7051 13.9473 11.4609 14.0801 11.1992C14.2129 10.9336 14.2793 10.6309 14.2793 10.291C14.2793 9.80273 14.1758 9.38867 13.9688 9.04883C13.7617 8.70508 13.4629 8.44531 13.0723 8.26953C12.6816 8.08984 12.2129 8 11.666 8Z" fill="currentColor"/>',

  /* interface/more-solid. Three dots -- the overflow control, which is how a
     jelly-menu is actually summoned. Same affordance logic as drawer. */
  menu: '<rect x="2.75" y="9.75" width="4.5" height="4.5" rx="2.25" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="9.75" y="9.75" width="4.5" height="4.5" rx="2.25" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="16.75" y="9.75" width="4.5" height="4.5" rx="2.25" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',

  /* interface/done-solid. A menu item is a choice, and this is a chosen one.
     Note it is the same drawing as the checkbox entry at a glance -- they are
     different components (checkbox is the plain tick, this is the ringed one)
     but if the two ever sit in one row, split them. */
  menuitem: '<path d="M12 2C14.7597 2 16.1397 2.00007 17.251 2.38184C19.3017 3.0866 20.9134 4.69827 21.6182 6.74902C21.9999 7.86026 22 9.24028 22 12C22 14.7597 21.9999 16.1397 21.6182 17.251C20.9134 19.3017 19.3017 20.9134 17.251 21.6182C16.1397 21.9999 14.7597 22 12 22C9.24028 22 7.86026 21.9999 6.74902 21.6182C4.69827 20.9134 3.0866 19.3017 2.38184 17.251C2.00007 16.1397 2 14.7597 2 12C2 9.24028 2.00007 7.86026 2.38184 6.74902C3.0866 4.69827 4.69827 3.0866 6.74902 2.38184C7.86026 2.00007 9.24028 2 12 2ZM15.5303 9.46973C15.2374 9.17683 14.7626 9.17683 14.4697 9.46973L11 12.9395L9.53027 11.4697C9.23738 11.1768 8.76262 11.1768 8.46973 11.4697C8.17683 11.7626 8.17683 12.2374 8.46973 12.5303L10.4697 14.5303C10.7626 14.8232 11.2374 14.8232 11.5303 14.5303L15.5303 10.5303C15.8232 10.2374 15.8232 9.76262 15.5303 9.46973Z" fill="currentColor"/>',
};

/* One sprite, referenced by <use>, so each path is stored once no matter how
   many times its icon appears.

   `mi-` IS THIS SPRITE'S NAMESPACE. NOTHING ELSE ON A PAGE MAY TAKE AN id FROM
   IT. The sprite is appended to documentElement, so it is the LAST thing in the
   document: any element in the body holding the same id wins getElementById and
   wins the <use> lookup, and the icon silently renders as nothing. That is not
   theoretical -- a demo <jelly-menu id="mi-menu"> in the overlays section ate
   #mi-menu and entry 22's title went bare. It reads exactly like a missing
   glyph, and the glyph was here the whole time. */
(function injectSprite() {
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
   call sites. */
const micon = (name) =>
  '<svg class="mi" aria-hidden="true" focusable="false"><use href="#mi-' + name + '"/></svg>';
