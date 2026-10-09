# Visible animation update

The previous hero animations mostly finished within one second and moved only 16–22 pixels. Chrome confirmed they ran without runtime errors, but their short duration and small movement made them easy to miss. Screenshots cannot display motion.

The updated entrance waits for the hero photograph to decode. Headline lines slide into view in sequence over 1.3 seconds, the photograph zooms from 1.24× to its normal scale over 1.8 seconds, and the workspace badge settles into place. Section reveals now move 54–64 pixels over 1.1–1.3 seconds; gallery cards enter 160 milliseconds apart. All entrances are finite.

**Replay animations** repeats the hero sequence and resets section reveals. Repeated clicks return the photograph to its normal scale. An actively focused form stays still. Reduced-motion settings cancel effects and disable replay with an explanation. Content and the fallback form remain available without JavaScript.

Validation: production build and ESLint passed. `checks.json` records 14 successful browser checks, including replay, repeated clicks, form focus, gallery reveals, pointer tilt, changing reduced-motion preferences and responsive layouts at 375, 768, 1280 and 1920 pixels. No browser runtime errors or horizontal overflow were observed.

`laptoprent-motion-preview.webm` shows the current logo and generated photographs, initial entrance, replay, scrolling, hover effects and FAQ expansion. The four hero PNGs are static layout references.
