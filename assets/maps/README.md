# USA and Canada map

`north-america.geojson` contains the USA and Canada features from the [Natural Earth 1:110m country dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson). Natural Earth geographic data is [public domain](https://www.naturalearthdata.com/about/terms-of-use/).

`us-states.geojson` contains all 50 US states and the District of Columbia from the matching [Natural Earth 1:110m administrative divisions dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_1_states_provinces.geojson), also public domain. Unused properties were removed; geographic coordinates are preserved. Source and license checked October 9, 2026.

`scripts/build-coverage-map.mjs` projects the outlines with an Albers projection and writes `src/lib/coverage-map.json`. Run `npm run images:build` to regenerate the map alongside the photographs and brand exports.

The illustration shows individual boundaries for all 50 US states, with Alaska and Hawaii in labeled insets. The visible label and accessible map description clarify that these insets are not to scale. State names are available as SVG hover titles. Canada uses the original country outline; some Arctic islands are omitted for this compact view. The eight destination pins link to the quote form; they are examples, not offices or confirmed routes. Availability is confirmed in the quote.
