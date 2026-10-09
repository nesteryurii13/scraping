# LaptopRent — lead capture site

Next.js landing page for laptop rentals (USA & Canada), with real stock photography and **Netlify Forms**. Name and email are required; company, phone, quantity, dates, delivery location and notes are optional.

The first-screen headline, country badges, navigation, quote form and delivery section emphasize rentals for people, businesses and teams in the United States and Canada. The delivery field accepts a city plus a US state or Canadian province. Geographic messaging does not add citizenship checks or change the form's required fields.

## Edit content

- Business name, contact email/phone, description: `src/lib/site.ts` (a rebrand also needs the wordmark in `src/app/page.tsx` and `scripts/build-brand.mjs`)
- Page sections (use cases, steps, FAQ): `src/app/page.tsx`
- Lead form: `src/components/LeadForm.tsx`
- Photo sources and crop sizes: `assets/photos.json`
- Responsive photo rendering: `src/components/Photo.tsx`
- Colors, typography, layouts and hover effects: `src/app/globals.css`
- Mobile menu behavior: `src/components/MobileNavigation.tsx`
- US and Canadian vector country marks: `src/components/CountryFlag.tsx`
- Geographic map and destination links: `src/components/CoverageMap.tsx`, rebuilt by `scripts/build-coverage-map.mjs`
- Scroll reveals, photo parallax and cursor effects: `src/components/MotionEffects.tsx`

If you add or rename form fields, update `public/__forms.html` too. Netlify reads that file to learn the form's fields. Also update the sheet columns: `FIELDS` and `HEADERS` in `netlify/functions/submission-created.mts` (existing sheet rows keep their old layout).

The visual design uses warm ivory, charcoal and lime, with large sans-serif and italic serif headings, a layered photographic hero, four use-case cards, a dark four-step process, a separate quote form, a USA/Canada map and a compact footer. Motion includes staggered headline reveals, a hero photo zoom, scroll reveals, gentle photo parallax, pointer-responsive use-case cards and button arrows, FAQ transitions and a page-progress indicator. The hero's **Replay animations** button repeats its entrance and resets the section reveals for the next scroll through the page. The entrance waits for the hero image to decode, so its animation is visible even when the image takes longer to load.

Motion uses native browser animations and an observer, with no animation library. Content stays visible without JavaScript; keyboard focus finishes all enclosing reveals immediately, and replay avoids moving an actively focused form. Reduced-motion preferences disable effects, including when the preference changes during a visit; the replay control explains when device settings reduce motion. Scroll work runs at most once per animation frame; parallax and cursor effects are limited to devices with a fine pointer. The mobile menu closes on section selection, outside clicks and Escape.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Form submissions only work once deployed to Netlify.

## Photography

Seven real photographs sourced from Unsplash show laptops, teams and workspaces. They do not represent confirmed rental inventory or customers. Photographer credits and source links are recorded in `assets/PHOTO-CREDITS.md`. AI-generated imagery is no longer used or delivered by the website.

A public photo-credits page is generated at `/photo-credits.html`. The map uses public-domain Natural Earth outlines; see `assets/maps/README.md`. Its city pins are example quote destinations, not offices or confirmed delivery routes.

Original JPEGs and PNGs live in `assets/image-originals/` and are never copied into the static export. Both dev and build run `npm run images:build`, producing three sizes in AVIF, WebP and JPEG with Sharp. Generated files live in `public/images/<photo-id>/`; the component reads `src/lib/photo-manifest.json`.

Selected portrait photographs have an explicit `crop` rectangle in `assets/photos.json` to keep the laptop screens and keyboards inside the landscape cards. Crop coordinates refer to the original image pixels after orientation correction; update them when replacing an original.

Each output must stay within its manifest budget: 200 KB for team photography, 120 KB for the hero laptop photo and 80 KB for other photos. Content hashes keep cached filenames stable; changing an original or its crop settings creates fresh filenames and removes obsolete variants. Netlify caches these generated assets for a year. To replace a photo, update its original and its credit/alt text in the manifest, then rebuild.

The primary form submits by POST to Netlify, preserves entered values on failure, and announces success with keyboard focus. `public/thanks.html` is the fallback confirmation for browsers without JavaScript. Local static servers cannot process submissions; browser verification uses intercepted test responses.

## Deploy to Netlify

The build outputs static files to `out/` (configured in `netlify.toml`).

**Option A: Git (recommended, auto-deploys on push)**
1. Push this repo to GitHub/GitLab.
2. Netlify → *Add new site* → *Import an existing project* → pick the repo.
3. Build settings are read from `netlify.toml` (`npm run build`, publish `out`). Click *Deploy*.

**Option B: Drag and drop**
1. Run `npm run build`.
2. Netlify → *Add new site* → *Deploy manually* → drag the `out/` folder in.

Drag-and-drop deploys only static files, so they skip `netlify/functions/` and leads are not copied to Google Sheets. Use Option A (or `netlify deploy`) for that.

## After the first deploy

1. Netlify → your site → **Forms** → enable form detection if prompted, then redeploy once.
2. You should see a form named **`lead`**. Submissions appear there.
3. For email alerts: **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email**.

## Google Sheets lead log

Each lead that passes Netlify's spam filter is also added as a row to a Google Sheet. `netlify/functions/submission-created.mts` runs after every verified submission and appends the lead through the Google Sheets API as a service account. Leads go to their own tab (`Leads` by default), which is created with a header row on the first lead. Values are stored exactly as typed, never as formulas. Netlify Forms still keeps every submission, so a sheet outage loses nothing; failures appear in Netlify's function logs. Visitor IP addresses and browser details are not copied to the sheet.

One-time setup:

1. Use a Google Cloud service account with the Google Sheets API enabled, and share the spreadsheet with its `client_email` as an **Editor**.
2. Netlify → **Site configuration → Environment variables**, scoped to Functions:
   - `GOOGLE_SHEET_ID`: the part of the sheet URL between `/d/` and `/edit`.
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: `client_email` from the service-account JSON key.
   - `GOOGLE_PRIVATE_KEY`: `private_key` from the same key, including the `BEGIN`/`END` lines. Real line breaks or literal `\n` both work.
   - `LEADS_SHEET_TAB` (optional): tab name, default `Leads`.
3. Redeploy, submit a test quote on the live site and check that a row appears.

Never commit the JSON key; `.env*` files are already gitignored.

## Brand assets

The custom LR monogram is defined in `assets/brand/logo-v2.json` and rendered by `src/components/BrandMark.tsx`. SVG and transparent PNG wordmarks for light/dark backgrounds, a standalone mark, and an archived previous icon are in `assets/brand/`. The image build regenerates these exports and matching favicon/app icons.
