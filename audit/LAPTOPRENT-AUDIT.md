# LaptopRent: conversion, imagery, UX and performance audit

Reviewed October 8, 2026. Application code has not been changed. The PNGs are proposed designs, not implemented pages. Laptop illustrations are placeholders for approved photography; they do not depict verified rental inventory. The image generation service timed out twice, so the final mockups were rendered directly with HTML/CSS/SVG and Chrome, with precise interface text.

## 1. Executive summary

The current site is a clean lead-capture starter, but a B2B buyer cannot verify the business, available equipment, delivery commitments, or rental terms. **There are no product, event or lifestyle photographs in the repository or rendered page.** Image optimization is preparation for the redesign, rather than a current image-weight problem.

Prioritize these nine changes:

1. Replace the placeholder email and phone, confirm the business identity and publish an accurate privacy notice. The current fallback contacts cannot help a buyer whose submission fails.
2. Give the form a safe native POST fallback. With JavaScript disabled, it currently submits by GET and puts name, email and phone in the address bar. Verify a deployed Netlify submission and notification before launch.
3. Move the mobile form upward. At 375 × 812, it begins at y=665 and the submit button begins at y=1043. The proposed mobile layout puts the form immediately after a shorter introduction, ahead of imagery.
4. Show verified equipment choices with consistent product photography and practical specs. Until inventory is confirmed, use workload categories as an explanatory concept; do not publish them as actual available products.
5. Add evidence of fulfillment: owned event/setup photographs, approved customer references, an identifiable team and accurate service commitments. Add only proof that can be substantiated.
6. Repair form feedback: clear stale phone errors on edit, connect errors to inputs, accept supported phone formats, announce submission success and manage focus. Consider optional phone and collapsed optional rental details, subject to sales requirements.
7. Standardize the principal action as **“Get a quote.”** Keep one visible form and return other CTAs to it. Add quantity, dates and location as optional context instead of making a long form mandatory.
8. Establish build-time responsive image processing before adding photographs. Preserve the static export and enforce byte budgets on the delivered variants.
9. Fix the confirmed CTA contrast failure, heading skip and reduced-motion behavior; remove the unused Geist Mono preload. Confirm compressed delivery on Netlify before treating local Lighthouse timing as production performance.

These are ranked design and engineering recommendations, not measured conversion uplift. No visitor or lead-conversion dataset was supplied.

## 2. Review method, image inventory and performance

Read all seven requested files, plus AGENTS.md, package.json, netlify.toml and README.md. Consulted the installed Next.js 16.4 guides for images, static export, metadata/OG images, icons, fonts, robots and sitemap. Ran `npm run dev` on 127.0.0.1:3001, `npm run build`, and `npm run lint`. Build and lint passed. Served `out/` with Python's static HTTP server on port 4173; reviewed both dev and built pages in Chrome at all four requested widths. No deployment or production Netlify form submission was performed because no deployed URL/access was supplied.

### Complete existing image inventory

Searched `public/` and `src/`, image references, rendered `<img>` elements and CSS `url(...)` backgrounds. There is one source image, exported twice by Next.js. ICO frames were read from the file header, and the 48px frame was inspected visually: it is the default white Next.js “N” on black.

| File | Section | Dimensions | Size | Format | Rendered size | Over budget? | Alt text OK? | Action |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| `src/app/favicon.ico` | Browser identity | 48×48, 32×32, 16×16 frames | 15,086 B / 14.73 KiB | ICO | Browser-controlled; no DOM box | No: below 80 KB; hero/card budgets do not apply | N/A, icon link | Replace default Next.js mark with LaptopRent favicon |
| `out/favicon.ico` | Exported favicon requested by browser | Same three frames | 15,086 B / 14.73 KiB | ICO | Browser-controlled | No | N/A | Generated copy of source |
| `out/_next/static/media/favicon.117ezoe8m31dk.ico` | Framework-generated export asset | Same three frames | 15,086 B / 14.73 KiB | ICO | No page-rendered size; not requested in measured initial load | No | N/A | Framework-generated duplicate; do not manually delete build output |

No files exceed the stated hero or card limits. No hero image, photo cards, logo image assets, CSS image backgrounds, stock-photo licenses, broken image alt text, or responsive image variants exist to audit. Emoji are text glyphs, not repository image files. No important words are baked into site imagery. No user-added unused photographs are shipped.

Total image bytes in `out/`: **30,172 B**, accounting for both favicon copies. Total export size: **886,987 B / 866.2 KiB**, across 36 files. The complete export is not a first-load page-weight measurement; it also contains unused font subsets, error pages and route payloads.

### Lighthouse before changes

Lighthouse 13.5.0, Chrome 154.0.8037.97; fresh browser runs against the built export. Mobile used the default simulated slow-4G/4× CPU profile at 412×823; desktop used the desktop preset at 1350×940. Layout screenshots use the separately requested widths. Final runs were serial and emitted no run warnings. Initial concurrent runs were discarded because CPU interference affected timing; their artifacts remain only in the temporary audit folder.

| Metric | Mobile baseline | Desktop baseline | Redesign target |
| --- | ---: | ---: | --- |
| Performance | 86/100 | 100/100 | ≥90 mobile; ≥95 desktop on deployed site |
| Accessibility | 94/100 | 94/100 | 100 automated score plus manual keyboard/form checks |
| Best practices | 100/100 | 100/100 | Maintain |
| SEO | 100/100 | 100/100 | Maintain; add metadata completeness separately |
| LCP | 4.119 s | 0.818 s | ≤2.5 s; desktop design goal ≤1.5 s |
| CLS | 0 | 0 | ≤0.1; design goal ≤0.05 |
| First contentful paint | 0.946 s | 0.259 s | ≤1.8 s mobile |
| Total blocking time | 101 ms | 0 ms | ≤200 ms mobile |
| Total transfer including response overhead | 583,415 B / 569.7 KiB | Same | ≤1.25 MB mobile initial total; ≤1 MB initial images |
| Content image transfer | 0 B | 0 B | Hero ≤200 KB; other images ≤80 KB each |
| Favicon transfer, classified “Other” by Lighthouse | 15,290 B | Same | Custom small favicon |

The local server does **not** compress responses or reproduce Netlify caching. These are valid local export measurements, not Netlify speed scores. Of measured transfer, scripts account for 460,941 B, fonts 52,776 B, HTML 29,759 B and CSS 24,649 B. Six scripts load. Lighthouse estimates 198 KiB of unused JS in the initial view; this includes framework code and does not imply that all of it can be removed safely.

Offline gzip compression of the exact requested file bodies totals **203,417 B**, compared with 581,283 B uncompressed; Brotli totals 180,565 B. Those are compression estimates, not a measured deploy. Check actual `Content-Encoding` and caching on Netlify before diagnosing the mobile 4.12s simulated LCP as an application defect. Remove the unused 23,108 B Geist Mono Latin preload first, then profile any remaining delay.

The measured LCP element is the **hero h1**, on both devices. It is already in exported HTML, as is the form. There is no image dependency delaying their initial markup. Form interactivity still requires hydration. The targets follow [Google's LCP guidance](https://web.dev/articles/optimize-lcp) and [CLS guidance](https://web.dev/articles/optimize-cls/); real-user assessment requires the 75th percentile, rather than a single lab score.

### Responsive review

| Viewport | Measured layout | Assessment |
| --- | --- | --- |
| 375×812 | Hero 1142px tall; form 343×482 at y=665; submit 295×48 at y=1043; page 4066px tall | No overflow. Long introduction delays completion; sticky quote link remains available. Form anchor lands at y=96, clearing header. |
| 768×1024 | Two 344px hero columns; headline 192px tall; form 344×514 at y=186; submit at y=572 | No overflow, but desktop composition starts too early. Long headline and small field width feel cramped. Prefer stacking through tablet or more compact type at this breakpoint. |
| 1280×900 | Two 536px columns; form at y=165; submit at y=551 | Strong form visibility; 1152px capped container is appropriate. Add proof imagery without making three competing hero columns. |
| 1920×1080 | Same 536px hero columns and page height as 1280; wider surrounding margins | Container restraint is sound. Do not stretch photos and body copy to fill the full display. |

Dev and export layouts match at each width; no page JavaScript exceptions were observed. Native FAQ opens with Enter and has visible focus. The logo also retains a browser `:focus-visible` outline. Footer text contrast is **6.78:1**, so the suspected footer contrast failure is rejected. White submit text passes at **5.25:1**. The final CTA paragraph fails at **4.29:1** in Lighthouse, against 4.5:1 for its normal 16px text.

## 3. Image delivery recommendation

**Choose (a): pre-optimize with Sharp at build time.** For this single static marketing page, a bounded library of owned photos needs predictable sizes, alternate crops and enforceable byte limits. This choice works in plain local dev, a static preview and Netlify, and avoids a runtime image-service dependency. Its cost is an extra asset-generation step and maintaining a small manifest/component.

| Option | Build time | Netlify cost | Caching | Developer experience / decision |
| --- | --- | --- | --- | --- |
| (a) Sharp pre-generation | Additional work for each width/crop/format; AVIF can dominate cold builds. Cache by source hash + crop + encoder settings and process only referenced images. Measure once actual photos exist. | Ordinary asset requests and bandwidth; no on-demand transformation dependency. More stored variants do not mean every variant is downloaded. | Content-hashed filenames can use long immutable browser caching; HTML/manifest must update on deploy. | Small explicit server-rendered `<picture>` wrapper; output works everywhere. Recommended for this page. |
| (b) Netlify Image CDN custom loader | No local encoding step | Account-plan dependent; image delivery uses requests/bandwidth, and legacy plans can meter transformations | Edge caches each transformation; changed source assets are transformed again across atomic deploys | Less pipeline code; preview requires Netlify Dev/CDN support. Strong alternative for frequent CMS image changes. |
| (c) Static export optimizer package | Adds optimization pass and generated artifacts | Static serving costs, plus build work | Package may cache generated images by hash | Convenient Next-style wrapper, but adds package compatibility and format/crop constraints. Validate against exact Next 16.4 before adopting. |

Netlify's documented CDN supports `/.netlify/images?url=…&w=…&q=…`, negotiated formats and cached transformations; local image transformation testing uses Netlify Dev. Do not assume the Next adapter automatically configures a **plain static export**. [Netlify Image CDN documentation](https://docs.netlify.com/build/image-cdn/overview/).

For credit plans, current published rates include 20 credits/GB bandwidth and 2 credits/10,000 requests, including static image delivery; production deploys consume 15 credits. Existing legacy and enterprise accounts differ, so exact dollars require the actual plan and traffic. Pre-optimization is not free hosting; it reduces transferred bytes. [Credit billing](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/), [legacy billing](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/billing-for-legacy-plans/).

For example, [next-image-export-optimizer](https://github.com/Niels-IO/next-image-export-optimizer) documents a Sharp post-build pass and an `ExportedImage` wrapper. Its documented output defaults to WebP. Do not assume that it supplies the required AVIF/WebP/JPEG art-direction pipeline or verified Next 16.4 compatibility without a prototype.

### Concrete changes after approval

- Keep `output: "export"`. **For the recommended native `<picture>` pipeline, no `next.config.ts` change is required:** its existing `images.unoptimized: true` can stay. It does not create responsive variants or `srcset`; the new picture component will use a generated manifest explicitly.
- Add Sharp as a direct build dependency and an `images:build` step before `next build`. Masters go in `assets/image-originals/` outside `public/`, preventing large originals being automatically exported. Emit only referenced derivatives under `public/images/{hero,models,use-cases,showcase,brand}/`.
- Use meaningful names plus content hashes. Record source/owner, permission/license URL, approved usage, capture/download date, alt purpose, crop and focal point in a manifest. Do not hotlink unreviewed stock files.
- Generate AVIF, WebP and JPEG fallback variants, with no enlargement. Start with useful widths 320, 480, 640, 768, 1024, 1280 and 1600; only generate widths needed by each slot and source resolution. Sharp supports [these output formats](https://sharp.pixelplumbing.com/api-output/). Tune quality visually rather than applying one arbitrary setting to every photo.
- Server-render AVIF `<source>`, WebP `<source>` and JPEG `<img>` with width descriptors, matching `sizes`, intrinsic dimensions and fixed container ratio. A mobile crop can be a separate media-specific source. Preserve the ratio before any source loads.
- Example card sizes for the existing use-case grid with images spanning the full card: `(min-width: 1184px) 270px, (min-width: 1024px) calc((100vw - 104px) / 4), (min-width: 640px) calc((100vw - 56px) / 2), calc(100vw - 32px)`. Recalculate for the approved mockup's 20/28px gutters and changed grid; do not copy this blindly.
- For a desktop LCP photograph, load eagerly and assign high fetch priority, or use one format/media-matched responsive preload when justified. Avoid downloading AVIF, WebP and JPEG simultaneously through multiple preloads. The proposed mobile hero image follows the form and should be lazy if below the actual viewport. Use a breakpoint-aware loading strategy rather than eagerly fetching both hidden desktop and mobile copies.
- If choosing `next/image` instead: current Next 16 deprecates `priority` in favor of `preload`. Its guide advises choosing preload or the loading/fetch-priority strategy, rather than combining them indiscriminately. For option (b), remove global `unoptimized`, set `loader: "custom"` and `loaderFile`, and return properly encoded CDN URLs containing source, width and quality. Option (b) still needs dimensions, accurate `sizes`, and crop decisions.
- Set lazy loading for below-fold gallery/case photos, remembering that browsers may fetch nearby lazy images before scrolling. Measure **all** images requested on initial mobile navigation against the 1 MB limit. Target 350–650 KB of initial imagery, keeping headroom for the app.
- Budget-check every generated delivered file: hero ≤200 KB; all card/thumb derivatives ≤80 KB. Masters are production inputs, not first-load transfers. Audit AVIF/WebP and fallback variants; do not hide an oversized fallback behind a small AVIF result.
- Use SVG for logos/icons. ICO and raster apple-touch icons are appropriate browser-platform exceptions to the logo rule. Keep important body copy in HTML, even when social preview artwork includes brand text.
- Put cache rules in Netlify configuration/headers, not Next server headers unsupported by static export. Restrict immutable caching to content-hashed assets. Inspect final `out/` and deployed headers.

## 4. Findings and starting-point verification

Severity reflects the current behavior or a clearly marked future implementation risk. “High” does not mean an unverified production outage. No confirmed sitewide production failure justifies a Critical label from this evidence.

| Severity | Category | Location | Problem | Evidence / verdict | Recommended fix |
| --- | --- | --- | --- | --- | --- |
| High | Trust | `src/lib/site.ts:7` | Placeholder email and phone undermine credibility and error recovery | Confirmed `hello@example.com`, `+1 (555) 000-0000` in visible footer | Replace with verified contacts and identify business/operator |
| High | Conversion | `src/components/LeadForm.tsx:66` | Native submission sends personal data in URL | New finding: no `method` or `action`; no-JS browser test produced `/?form-name=lead&…&name=Audit+Test&email=…&phone=…` | Native `method="POST"`, suitable static action/success path and no-JS feedback; verify on Netlify |
| High | Conversion | `LeadForm.tsx:31`; `public/__forms.html` | Live lead capture is not proven | Local dev 405; plain static server 501; deployed form/dashboard/notifications unavailable | Existing URL encoding, form-name and static blueprint are structurally consistent; verify detection, stored fields and delivery notification on deploy |
| High | Trust | Whole page | No inventory/specs/pricing basis | Confirmed: no models, RAM/storage/OS or price/minimum information anywhere | Show factual product choices and quote factors; add prices only when approved and qualified |
| High | Trust | Whole page | No fulfillment/customer/company proof | Confirmed no logos, references, testimonials, numbers or identifiable about content | Add owned proof and approved references; customer headshots optional, permission required |
| High | Images-Visual | Hero and use cases | No visual evidence of the offer | Confirmed zero `<img>`; emoji communicate categories, not rental equipment | Prioritize owned fleet, real event/training and preparation photos |
| High | Trust | Form/footer | No privacy or rental terms pages | Confirmed no pages/links; short data-use sentence is the only notice | Publish accurate data-handling notice and relevant rental terms; operator must approve content |
| Medium | Layout | `page.tsx:78` | Mobile form sits late | Measured form y=665, submit y=1043 at 375×812; initial form is partly visible | Shorten hero, form before photo; preserve sticky quote access |
| Medium | Layout | `page.tsx:78` | Tablet hero is cramped | Two 344px columns and 192px-tall headline at 768px | Start full two-column layout later, or tailor tablet type and spacing |
| Medium | Conversion | `LeadForm.tsx:19` | Phone check only counts digits | Confirmed: 11-digit `22025550143` passed; spaces/punctuation stripping is supported but leading country code is not checked | Accept 10-digit NANP or 11-digit starting 1; define extensions/international contacts policy; optional phone if sales allows |
| Medium | Accessibility | `LeadForm.tsx:92` and `:137` | Phone error persists and is not associated | After correcting field, `aria-invalid` stayed true; no `aria-describedby` | Clear/revalidate on edit; stable error id and description association; focus invalid field |
| Medium | Accessibility | `LeadForm.tsx:44` | Success removes focused form without announcement | Mocked 200 led to focus BODY and zero live/status regions; form panel changed 482px→258px | Stable status region plus focused success heading; preserve sensible panel height and next action |
| Medium | Conversion | `LeadForm.tsx:104` | Error asks buyer to contact directly without direct link | Confirmed generic alert; entered values are correctly retained | Include verified clickable email/phone; retry controls and bounded waiting state |
| Medium | Accessibility | `LeadForm.tsx:71` and `:50` | Form/success headings skip h2 | Confirmed h1→h3; Lighthouse flags heading-order | Use h2 and name form region appropriately |
| Medium | Accessibility | `page.tsx:166` | Final CTA paragraph contrast fails | Confirmed 4.29:1; 16px regular blue-100 on blue-600 | Use white text or darker background; retest with actual computed colors |
| Medium | Accessibility | `globals.css:8`; `page.tsx:154` | Smooth scroll/rotation ignore reduced motion | `prefers-reduced-motion: reduce` still computes smooth scrolling | Disable smooth scrolling and unnecessary transition for reduced motion |
| Medium | Images-Perf | `next.config.ts:6` | Future originals would be served without transformation | Config concern confirmed; present image-weight problem rejected because no photos exist | Add pre-generated variants before photo-heavy redesign; budgets and explicit picture sources |
| Medium | Code | `layout.tsx:11` | Unused font is preloaded | Geist Mono applied as variable but never used; 23,108 B Latin WOFF2 is fetched | Remove unused font import/init/variable; maintain Geist Sans |
| Medium | SEO | `layout.tsx:16`; export | Missing canonical, OG image and Twitter card | Confirmed existing title/description/basic OG pass Lighthouse, but no canonical/OG image/Twitter metadata | Confirm domain; set metadata base and canonical; add 1200×630 social artwork |
| Medium | Conversion | Whole page / form | No conversion measurement | Confirmed no analytics or submission event code | Measure quote click, start, confirmed success/error and qualified leads; exclude personal data |
| Low | Images-Visual | `page.tsx:6`, `:58`, `:81` | Emoji style varies by platform | Confirmed emoji/flag glyphs; Windows rendering was not tested here | Consistent outline SVGs; visible country names without flag dependency; hide decorative icons from AT |
| Low | Layout | `page.tsx:61` | Mobile section navigation is hidden | Confirmed no mobile replacement; sticky quote CTA is still present | Simple mobile menu becomes useful as gallery/proof sections grow; do not imply every one-page site requires one |
| Low | Conversion | `page.tsx:70`, `:171`; `LeadForm.tsx:101` | CTA wording varies | “Get a quote”, “Get a free quote”, “Request my quote” all mean same action | Standardize “Get a quote”; preserve submitting label “Sending…” |
| Low | Accessibility | `page.tsx:57`; header | Ambiguous top anchor and no skip link | `href="#"`; browser focus visible and FAQ keyboard behavior pass | Explicit `#top` or `/`; add skip-to-main and consistent focus-visible styles |
| Low | SEO | Export | No robots, sitemap or structured data | Confirmed absent; missing robots alone does not block indexing | Add static robots/sitemap once domain known; accurate Organization or LocalBusiness schema as appropriate |
| Low | Code | `page.tsx:179` | Copyright is fixed at export build | Confirmed server component computes year during build | Annual rebuild/scheduled deployment; avoid adding client JS solely for the year |
| Low | Images-Visual | `src/app/favicon.ico` | Default Next.js favicon | Visually inspected white “N” | Branded favicon, apple-touch icon, light/dark SVG brand variants |

### Checks that should not be reported as current defects

- There is no image lazy-loading, intrinsic-dimension, `sizes`, crop, overlay contrast or stock-photo license failure to prove: the relevant images do not exist. These are requirements for the next design.
- Mobile and desktop serial Lighthouse CLS are zero. Initial concurrent desktop run recorded a small shift, but it did not reproduce in the valid serial run. No basis to blame nonexistent images.
- Footer contrast passes at 6.78:1. Form labels exist via wrapping labels, and inputs have appropriate name/email/tel autocomplete tokens. Input errors already expose `aria-invalid`; transport error already has `role="alert"`.
- Native `<details>` works with keyboard; its decorative plus should be hidden from assistive technology when refining semantics.
- `/__forms.html` is an appropriate static blueprint pattern, not inherently a wrong endpoint. Static blueprint field names match `name`, `email`, `phone`, `form-name` and `bot-field` in the client. Netlify requires form detection plus redeploy; JavaScript form POSTs need URL encoding and a matching form name. [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/).
- A 200 mocked response tested UI behavior only. It is not evidence of stored production leads. Local failure is expected because Next dev and plain file hosting do not provide Netlify Forms.
- Basic SEO score is already 100; metadata completeness, actual business trust and social previews are broader than that automated check. Product schema is optional, not a reason to invent offers or reviews. Add accurate product imagery only after a genuine model gallery exists; use business schema appropriate to verified identity/address rather than guessing LocalBusiness details.

## 5. Section-by-section design notes

| Section | Retain | Revise |
| --- | --- | --- |
| Header | Sticky conversion access, constrained width | Branded outline mark; clear top anchor; mobile menu once page expands; uniform focus and useful contact access |
| Hero/form | Immediate offer and desktop adjacency | Shorter headline/support, earlier mobile form, one purposeful laptop/setup image after form on mobile; precise expectation after submission |
| Use cases | Four relevant buyer needs | Replace emoji with consistent photos/icons; relate equipment and service to each need; avoid four unrelated stock aesthetics |
| How it works | Simple three-step format | Ask for requirements rather than only contact details; explain confirmation/delivery/returns accurately; “30 seconds” claim must be checked after adding optional context |
| FAQ | Native disclosure and compact scanning | Answer availability, minimums, quote factors, setup, delivery/returns, support and data handling after business confirmation |
| Final CTA | One route back to the existing form | Uniform wording, readable white text, actual next-step promise without fabricated response time |
| Footer | Region and direct-contact opportunity | Real identity/contact, privacy/terms, custom brand mark; existing muted-text contrast may stay |

The current spacing is consistent but repetitive: large padding and similarly weighted centered headings make sections feel like a template. Use a stronger product/proof narrative, a restrained 8px spacing scale, 16px mobile body text, 36–40px mobile hero type and 52–60px desktop hero type. Limit body copy width and keep inputs legible. More photography should serve offer comprehension, not decorate every empty space.

## 6. Redesign concept and mockups

Proposed direction: **practical equipment supplier**—white/off-white surfaces, navy headings, cobalt actions, subtle borders, Geist Sans and one outline icon set. Use cool natural light and neutral backgrounds; product shots share angle/scale, while event photos show equipment in use. Avoid text over photography, busy gradients, competing animations and photographic claims about customers that are not real.

- [Full desktop PNG](mockups/laptoprent-desktop.png)
- [Full mobile PNG](mockups/laptoprent-mobile.png)
- [Desktop first screen](mockups/laptoprent-desktop-first-screen.png)
- [Mobile first screen](mockups/laptoprent-mobile-first-screen.png)

The desktop was rendered at a 1440px CSS viewport and mobile at 390px, each at 2× pixel density. They are visual concepts with nonfunctional forms. Mobile form completion fits within the proposed 844px first screen. Product and use-case illustrations are explicitly placeholders, not approved photos or models. Privacy/terms links depict required future content, not existing pages.

### Wireframe and photography brief

| Section | Text wireframe / content | Image need and crop | Design direction |
| --- | --- | --- | --- |
| Header | `[LaptopRent] [Laptops · Use cases · How it works · FAQ] [Get a quote]`; mobile compact menu | Light/dark vector mark, no photo | White, restrained border, clear primary action |
| Hero | Desktop `[offer + explanation + laptop visual] [quote form]`; mobile `[offer] [form] [visual]` | Owned event-registration desk with actual rental laptops; desktop 16:9, tighter mobile 16:9 or 4:3 crop keeping keyboards/screens; never imply a stock setup is your customer work | Navy headline on white, photograph separate from copy; quote card is most actionable element |
| Quote form | `[Name] [Work email] [Phone optional] [+ Rental details optional] [Get a quote] [Privacy]` | None; imagery should not compete with inputs | Full-width labels/fields, clear states, large CTA; verify optional phone with sales |
| Service/trust strip | Current concept `[Events] [Training] [Temporary teams] [Remote work]`; with proof `[approved client SVGs or verified commitments]` | Client SVGs only with permission, no invented logos; no customer endorsement implied by category labels | Quiet strip; do not let unverified proof dominate |
| Model gallery | `[model photograph] [verified model/specs + best-fit use] [Ask about availability]` × 3 | Owned actual stock or manufacturer imagery with permission; 4:3 canvas, consistent 3/4 angle and neutral backdrop; use `contain` for product silhouette | 3 columns desktop, stacked mobile; current mockup uses provisional workload categories |
| Use cases | `[photo + Event] [photo + Training] [photo + Project staff] [photo + Remote]` | Owned examples preferred, 4:3; tightly composed equipment/workspace view; licensed stock can illustrate a scenario but is not fulfillment proof | 4 desktop columns, 2 tablet/mobile where readable; consistent grading |
| Process | `[1 Share needs] → [2 Confirm setup] → [3 Delivery/return]` | SVG icons sufficient; optional owned technician preparing devices at 3:2 if it adds proof | Concise copy, no three additional large photos required |
| Event/setup showcase, conditional | `[real project photo] [what equipment/setup was supplied] [buyer outcome]` | Owned project photos, 3:2 or 16:9, two images maximum; approved venue/customer identification | Add only when factual case details available; omitted from PNG to avoid invented case study |
| Delivery coverage | `[USA/Canada coverage] [location/date guidance]` | Optional SVG country map without invented depots; PNG uses country chips instead | Small tinted panel; do not visually guarantee every remote destination |
| Customer proof / about, conditional | `[approved quote + identity] [brief business/team description]` | Approved headshot optional, 1:1; owned staff/preparation photo 3:2; no stock person posed as a client | One strong genuine reference beats invented metrics; omitted from PNG pending evidence |
| FAQ | `[availability] [minimums/terms] [delivery] [configuration] [quote requirements]` | No photo needed | Native disclosures, large hit areas, simple dividers |
| Final CTA + footer | `Let's plan your laptop rental. [Get a quote]` then `[identity/contact] [Privacy] [Rental terms]` | SVG brand mark; no background photo | Navy CTA with high contrast; footer provides legitimacy and recovery route |

Revised hero: **“Laptop rentals. Ready for your team.”** Support: **“For events, training, projects and remote teams.”** Explanation: **“Tell us what you need. We'll confirm available laptops and delivery options.”** Main action and submit label: **“Get a quote.”** Form helper: **“Start with your contact details.”** Final action: **“Let's plan your laptop rental.”** These avoid guessing specifications, minimums or turnaround times.

For approved service copy, replace general discussion with concrete details where possible. Example informative alt: “Rental laptops arranged at a conference registration desk,” only when that depicts an actual setup. If nearby model text fully conveys a repetitive product image's purpose, empty alt may be appropriate; otherwise describe the actual verified model/configuration. Decorative brand or UI icons can be hidden from assistive technology while the visible wordmark remains the link name.

## 7. Implementation plan and questions

No implementation is authorized by approval of this document's existence or by requesting mockup PNGs. User requested code changes only after approving the audit and design direction.

### Quick wins: each under one hour

| Order | Task | Rough effort | Dependency / form blueprint change |
| --- | --- | --- | --- |
| 1 | Replace contact placeholders and audit existing promises | 15–30 min | Requires verified business facts; no blueprint change |
| 2 | Add native POST/action fallback and recovery contact links | 30–50 min | Verify deployed Netlify behavior; review static form method/action where relevant; keep name `lead` |
| 3 | Link/clear phone errors and validate supported formats | 35–55 min | No new field names; optional phone requires native/client required behavior to agree |
| 4 | Success announcement/focus and proper form h2 | 30–50 min | No blueprint field change |
| 5 | Fix CTA contrast, reduced motion, explicit anchors, decorative icon semantics | 30–50 min | No blueprint change |
| 6 | Uniform CTA wording and remove unused Geist Mono preload | 20–40 min | No blueprint change |

These are individual task estimates, not a claim that the whole quick-win set takes under one hour. Deployed verification can require additional access/setup time.

### Larger work

| Order | Task | Rough engineering/design effort | Dependency |
| --- | --- | --- | --- |
| 7 | Publish privacy/rental terms and finalize business/service copy | 2–4 hours integration | Owner-approved wording; drafting/review time separate |
| 8 | Add collapsed optional rental detail fields | 2–4 hours | Quantity, start/end dates, delivery city/state/province, use case, notes; sales confirms required vs optional |
| 9 | Implement image processor, manifest, picture wrapper and byte checks | 4–8 hours | Actual source images and approved crop/format choices; cold-build duration measured afterwards |
| 10 | Acquire/approve photographs and real product content | 1–2 days preparation | Shoot, supplier permissions and licensing lead time separate |
| 11 | Implement responsive hero, gallery, use cases and mobile navigation | 1–2 days | Approved mockup direction; preserve static export and server-rendered content |
| 12 | Add genuine trust/showcase content | 3–6 hours | Approved references and project facts; not fabricated to fill a layout |
| 13 | Canonical, static robots/sitemap, social image/icons and accurate schema | 2–4 hours | Production domain/identity known; OG 1200×630 and apple-touch-icon; valid static output verified |
| 14 | Conversion events and lead-quality reporting | 2–4 hours | Analytics choice/permissions; event payloads contain no entered personal data |
| 15 | Production verification and four-width regression review | 3–5 hours | Netlify access; verify one submitted lead stored, notifications, spam routing, failures, optional fields, no-JS path, keyboard/focus and actual compressed Lighthouse delivery |

For optional fields, add exact matching names to `public/__forms.html` and the client: proposed `quantity`, `rental-start`, `rental-end`, `delivery-location`, `use-case`, `notes`. Keep `form-name=lead` and `bot-field` synchronized. The current `Field` helper sets `required` by default, so explicitly support optional inputs rather than silently retaining mandatory behavior. Preserve submitted values after failure, prevent overlapping requests, check end date follows start when both supplied, and redeploy so Netlify detects the updated blueprint. Do not send all field contents to analytics.

Success tracking should fire only after an accepted submission, not on button click. Track starts, accepted submissions, errors and qualified leads, then connect this with follow-up outcomes. A frontend 200 is still weaker operational evidence than confirming that the lead exists in Netlify and reaches the responsible team. Add real-user performance measurement if traffic allows; Lighthouse cannot establish field INP.

### Questions pending before factual content or implementation

1. Which actual models, OS versions, RAM/storage, accessories and software/setup services are available? Can inventory be guaranteed, or is everything subject to availability?
2. Are there publishable prices, currency rules, minimum quantities/durations, deposits, shipping/setup charges or longer-term terms?
3. What are the real business/operator name, contact email/phone, operating hours, approved address if relevant, and production domain?
4. What quote-response and delivery timelines can be promised? Which locations are excluded? How do pickup/returns, support and device-data handling work?
5. Which customers, logos, quotes, reviews, volumes or service commitments are approved and substantiated for publication?
6. Do you own fleet, event, delivery and staff photos? If using stock/manufacturer imagery, what usage rights can be documented?
7. Is phone required for sales, or can email-only requests be accepted? Which optional rental details help qualify a lead most?
8. Who receives Netlify notifications, what plan is used, and what analytics system/permissions are available? What traffic or lead baseline should guide evaluation?

The first six subjects were raised during the audit; no answers were available when these artifacts were prepared. The mockups intentionally leave unverified specs, pricing, contact details and customer proof out.

### Evidence

See `evidence/` for valid serial Lighthouse HTML/JSON reports, browser measurements, accessibility measurements, complete image/export inventories, and screenshots of the current dev and built pages at 375, 768, 1280 and 1920px. The PNG mockups are separate from those baseline screenshots. Next.js guide sources used are the installed `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`, `01-app/02-guides/static-exports.md`, `01-app/01-getting-started/14-metadata-and-og-images.md`, and corresponding metadata/font references.
