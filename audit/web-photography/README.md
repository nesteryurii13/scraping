# Real web photography update

All active AI-generated photo placements were replaced with real Unsplash photographs. The hero uses Annie Spratt's team photograph. The gallery uses laptop photographs by Arnav Singhal, Manix Troy and Ales Nesetril. The FAQ uses the Arnav Singhal photograph. Seven existing real photographs remain in the website, for ten unique sources across fourteen image placements.

The AI-image notice was replaced with accurate example-equipment wording, and the footer now links to Unsplash. Photographer names, source pages and descriptive alt text are recorded in `assets/photos.json` and `assets/PHOTO-CREDITS.md`. Previously generated originals remain outside the static export as archived design work; their public delivery variants were removed by the image pipeline.

Explicit landscape crops keep the screens and keyboards inside the portrait laptop photographs. All ninety responsive AVIF, WebP and JPEG files satisfy the existing per-image budgets. `image-checks.json` records their paths, byte sizes and budgets; no retired AI-image directories or AI-image labels remain in `out/`.

The production build and ESLint passed. Browser reviews at 375, 768, 1280 and 1920 pixels found no horizontal overflow or runtime errors. Every displayed image loaded; the CSS-hidden mobile FAQ image remains lazy-loaded. Replay was verified with the new real hero photograph.

The PNGs document the current layouts. `laptoprent-motion-preview.webm` shows the current real photographs with the entrance, replay, scroll and hover animations. Earlier audit folders retain historical designs.
