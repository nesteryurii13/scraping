# US state boundaries — October 9, 2026

The USA/Canada delivery map now draws all 50 US states plus the District of Columbia, using matching Natural Earth 1:110m administrative polygons. Light borders and subtle alternating green fills distinguish neighboring states. Alaska and Hawaii appear in labeled insets; each state has a native SVG hover title. Canada and the existing example destination links remain in the map.

Source and public-domain license are recorded in `assets/maps/README.md`. Map geometry is generated locally during the existing image build, without runtime requests or new dependencies.

`npm run build` and `npm run lint` pass. Chrome checks at 375, 768, 1280 and 1920 pixels verified 51 uniquely identified divisions, two insets, all geometry inside the SVG view box, no horizontal overflow, no browser errors and working keyboard destination links. The automated WCAG A/AA scan found zero violations.

See `map-*.png`, `browser-checks.json` and `accessibility.json`. Earlier reference-redesign screenshots and performance reports document the preceding design version.
