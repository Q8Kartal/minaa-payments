/* ═══════════════════════════════════════════════════════════════════════════
   Micons — the Forms set.

   Exported from the Minaã Icons library (Figma file BlltPtiVnS9ULiuMVKo2oM,
   page 108:30) and inlined as one <symbol> sprite. No third party, no CDN, no
   network hop: the glyphs paint with the first frame.

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
  moon: '<path d="M10.8077 2.89062C10.8184 2.8957 10.8392 2.9088 10.8605 2.94141C10.9067 3.01239 10.9275 3.13131 10.8761 3.25098C9.86031 5.61727 9.21856 8.73023 10.3927 11.3799C11.602 14.1089 14.5903 16.0485 20.1544 16.3379C20.2616 16.3435 20.3394 16.399 20.3761 16.4561C20.3933 16.4828 20.3979 16.5041 20.3986 16.5166C20.399 16.526 20.3979 16.5436 20.381 16.5732C18.7879 19.3682 15.7829 21.25 12.339 21.25C7.23036 21.25 3.08899 17.1086 3.08899 12C3.08899 7.43579 6.3959 3.64215 10.7443 2.88672C10.7843 2.87984 10.8011 2.88752 10.8077 2.89062Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M18.4121 9.24512C18.3384 9.3808 18.2498 9.509 18.1367 9.62207C18.0238 9.73494 17.8962 9.82381 17.7607 9.89746C17.8962 9.97111 18.0238 10.06 18.1367 10.1729C18.2496 10.2857 18.3385 10.4134 18.4121 10.5488C18.4858 10.4134 18.5746 10.2857 18.6875 10.1729C18.8006 10.0598 18.9288 9.97119 19.0645 9.89746C18.9288 9.82373 18.8006 9.73515 18.6875 9.62207C18.5744 9.50899 18.4858 9.38081 18.4121 9.24512Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M14.75 5.89453C14.7361 5.90894 14.7224 5.92358 14.708 5.9375C14.7222 5.95126 14.7362 5.96525 14.75 5.97949C14.7639 5.96509 14.7786 5.95142 14.793 5.9375C14.7784 5.92342 14.7641 5.90911 14.75 5.89453Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',

  sun: '<path d="M7.75 12.75C7.75 10.4028 9.65279 8.5 12 8.5C14.3472 8.5 16.25 10.4028 16.25 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M12 3.25V5.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M2.5 12.75L5 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M19 12.75L21.5 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M18.7168 6.03247L17.3121 7.43713" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M5.28223 6.03247L6.68689 7.43713" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M5 16.75H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
       '<path d="M9 20.75H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};

/* One sprite, referenced by <use>, so each path is stored once no matter how
   many times its icon appears. */
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
