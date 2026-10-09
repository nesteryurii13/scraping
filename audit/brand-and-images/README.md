# Generated imagery and custom logo

The website now uses three photorealistic AI-generated images in the hero, all three laptop-gallery cards and the FAQ photo. Seven stock photographs provide event, people and work context elsewhere. The custom LR monogram and differentiated LaptopRent wordmark appear in the header/footer, with matching browser and app icons.

## Previews and assets

- [Desktop preview](1280-full-page.png) · [Mobile preview](375-full-page.png)
- [Logo SVG for light backgrounds](../../assets/brand/laptoprent-logo-light.svg)
- [Logo SVG for dark backgrounds](../../assets/brand/laptoprent-logo-dark.svg)
- [Transparent PNG logo](../../assets/brand/laptoprent-logo-light.png)
- [Standalone mark](../../assets/brand/laptoprent-mark.svg)
- [Generated image originals and final prompts](../../assets/generated/IMAGE-PROMPTS.md)
- [Sources and provenance](../../assets/PHOTO-CREDITS.md)

Generated imagery used the built-in imagegen tool. The logo is code-native vector artwork, with shared geometry in `assets/brand/logo-v2.json`. The first team-scene request timed out; a simpler laptop workspace image succeeded and supplies the final hero and training card.

## Checks

- Production build and ESLint passed.
- Chrome checked at 375, 768, 1280 and 1920 px: no overflow, no runtime errors, all visible images loaded. The decorative FAQ image is hidden on mobile.
- All 90 exported photo variants satisfy their budgets; no obsolete variants or full-size source PNGs are delivered. [Inventory](image-inventory.csv).
- All three generated assets stay below 80 KB per output file, including the workspace hero.
- The page identifies generated laptop visuals as illustrations and states that quotes confirm available equipment.
- SVG and transparent PNG logo exports are saved in the workspace, and previous icon artwork is archived.
