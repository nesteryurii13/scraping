# Modern LaptopRent UI

The implemented design uses warm ivory, charcoal and electric lime, with large sans-serif headings paired with italic serif accents. Real photography leads the mobile hero and fills an asymmetric event/workspace grid. The desktop quote form sits next to the hero. Rounded equipment cards, a delivery collage, photo-backed closing CTA, oversized footer wordmark and hover effects complete the visual direction.

## Previews

- [Desktop first screen](1280-first-screen.png) · [Desktop full page](1280-full-page.png)
- [Mobile first screen](375-first-screen.png) · [Mobile full page](375-full-page.png)
- [Tablet gallery](tablet-gallery.png)

## Verification

- Build and ESLint passed.
- Chrome checked at 375, 768, 1280 and 1920 px: no horizontal overflow or runtime errors.
- Quote-form checks passed with simulated HTTP responses; no real leads sent. [Results](form-checks.json).
- The mobile menu closes on section selection, outside clicks and Escape; Escape restores focus. The FAQ opens normally and reduced motion disables smooth scrolling.
- Equipment headings reserve equal space on tablet, keeping the card links aligned.
- The native confirmation page and favicon use the updated palette.
- The same 10 licensed stock photographs and optimized local variants remain in use. [Credits](../../assets/PHOTO-CREDITS.md).

## Lighthouse mobile

Measured serially on an uncompressed local Python static server before the final tablet spacing and photo-overlay contrast refinements: performance 89, accessibility 100, best practices 100 and SEO 100. LCP 3.688 s, CLS 0, image transfer 77,902 B. This is a lab measurement; the 2.5 s LCP target still needs verification on compressed Netlify hosting. [Report](lighthouse-mobile.report.html).

## Animation update

Added hero entrances, staggered scroll reveals, photo parallax, cursor-responsive cards/buttons, FAQ/menu transitions and scroll progress. [Watch the preview](animations/laptoprent-motion-preview.webm) and [read the animation checks](animations/README.md).
