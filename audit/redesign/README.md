# LaptopRent redesign verification

The implemented site uses 10 real stock photographs across 14 placements, with a laptop gallery, use-case cards, process and coverage collages, FAQ and a photo-led final call to action. Sources and license records: [PHOTO-CREDITS.md](../../assets/PHOTO-CREDITS.md).

## Previews

- [Desktop full page](1280-full-page.png) and [first screen](1280-first-screen.png)
- [Mobile full page](375-full-page.png) and [first screen](375-first-screen.png)
- [Tablet first screen](768-first-screen.png)
- [Wide desktop first screen](1920-first-screen.png)

## Checks

- `npm run build`: passed, static export in `out/`.
- `npm run lint`: passed.
- Chrome: no horizontal overflow or JavaScript errors at 375, 768, 1280 and 1920 px.
- 90 responsive photo variants: all within the 200,000 B hero / 80,000 B other-image limits. Original source photographs excluded from the export. [Inventory](image-inventory.csv).
- Hero image loads eagerly at high priority; secondary images load lazily with reserved dimensions. The FAQ photo is hidden and therefore unloaded on mobile.
- Quote form: invalid phone and reversed dates rejected; phone errors clear on editing; failed POST preserves details; success moves focus and announces receipt; all optional fields included; name/email alone accepted; no-JavaScript fallback uses POST. [Results](form-checks.json). Tests intercepted responses and did not send real leads.

## Lighthouse

Measured serially on the built page using a local, uncompressed Python static server. These are lab measurements, not deployed Netlify results.

| Run | Performance | LCP | TBT | CLS | Total transfer | Image transfer |
|---|---:|---:|---:|---:|---:|---:|
| mobile | 92 | 3.383 s | 53.5 ms | 0 | 688,486 B | 77,902 B |
| desktop | 72 | 0.938 s | 629.0 ms | 0 | 698,620 B | 88,036 B |
| desktop-recheck | 99 | 0.974 s | 0.0 ms | 0 | 698,620 B | 88,036 B |

Accessibility, best practices and SEO scored 100 in all three runs. The first desktop run had an unexplained 658 ms unattributable main-thread task; a single serial recheck did not reproduce it. Both reports are retained rather than discarding the outlier. Mobile LCP still exceeds the 2.5 s target on this uncompressed server; verify with Netlify compression and real users after deployment. The mobile image transfer is well below the 1 MB first-load budget.

The page identifies photographs as illustrative and avoids presenting stock laptops as confirmed inventory or depicted people as customers. Placeholder business contacts are not displayed. Live Netlify form processing requires deployment; local tests validate browser behavior and field encoding only.
