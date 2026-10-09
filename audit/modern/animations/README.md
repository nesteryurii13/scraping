# Website animation preview

[Watch the recorded preview](laptoprent-motion-preview.webm).

The preview shows the actual static website in Chrome: hero entrances, staggered scroll reveals, pointer tilt on laptop cards, magnetic button arrows, parallax photography, delivery-collage hover motion, FAQ transitions and scroll progress. Real photos and the established ivory/charcoal/lime design remain in place.

Effects use native CSS and Web Animations, with no additional runtime animation package. Scroll work is limited to one requestAnimationFrame callback per frame, and pointer effects reset on exit. Reveals run once per target; content remains readable before hydration and with JavaScript disabled. Keyboard focus completes a reveal, and reduced-motion preferences cancel active effects and disable motion at load.

Build and lint passed. Browser checks:

- Hero headline remains fully readable during its entrance.
- Scrolling into the gallery starts staggered card reveals.
- Keyboard focus immediately finishes the focused card reveal.
- Pointer tilt works without horizontal overflow.
- Pointer leave resets card tilt.
- Page progress follows scrolling.
- Changing reduced-motion preference cancels active motion and clears offsets.
- Reduced-motion pages have no animations or overflow at all four viewport widths.
- Without JavaScript, all section content remains visible and the form uses POST.
- No browser runtime errors.
