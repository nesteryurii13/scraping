# State map color correction — October 9, 2026

The live development preview on port 3001 served an older stylesheet without `.map-state` or `.map-inset-labels` rules. Chrome reproduced 51 black divisions with no state strokes, while the static export on port 4176 rendered the intended colors.

State paths now include SVG presentation attributes for green fills, light borders, stroke widths and joins. Inset labels include their font and color attributes. Stylesheet rules still provide hover effects, and the map's base appearance renders correctly when these stylesheet rules are unavailable.

The production build and ESLint pass. `browser-checks.json` and `map-*.png` verify correct green fills, light borders, inset labels and fallback attributes at 375 and 1280 pixels on both the development and production previews.
