# LaptopRent logo

A custom joined LR monogram pairs a lime L with an ivory R inside a charcoal rounded square. The wordmark uses a heavier Laptop and lighter Rent. The colors and geometric paths live in `logo-v2.json`, shared by the website mark and asset builder.

- `laptoprent-logo-light.svg` / `.png`: wordmark for light backgrounds, transparent background.
- `laptoprent-logo-dark.svg` / `.png`: wordmark for dark backgrounds, transparent background.
- `laptoprent-mark.svg` / `.png`: standalone monogram, transparent outer corners.
- `laptoprent-icon-v1.svg`: archived previous icon.

The logo is original code-native vector artwork. Run `node scripts/build-brand.mjs` to rebuild exports. The normal image build also generates matching browser and app icons. The website uses `src/components/BrandMark.tsx` to keep the mark crisp at every size.

