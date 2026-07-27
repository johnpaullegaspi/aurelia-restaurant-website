# AURELIA — Premium Fine Dining Restaurant Website

A single-page, elegant, minimalist fine-dining restaurant website for a brand called **AURELIA**, built to spec from the "Premium Restaurant Website" brief. Static HTML/CSS/JS, deploy-ready for Netlify as-is.

**Staff can edit the site's content — menu items, prices, photos, hours, testimonials, hero/about copy — through a web-based admin panel at `/admin`, powered by Decap CMS.** No coding or GitHub account needed on their end. Setting this up (one-time, for a developer) and how staff use it day-to-day is all covered in **[DEPLOYMENT.md](./DEPLOYMENT.md)** — start there if that's what you're here for.

## What's included

One long page (`index.html`) with anchor navigation and smooth scrolling:

- **Sticky nav** — transparent over the hero, turns to a frosted-glass bar on scroll, with a "Reserve a Table" CTA and an animated hamburger menu on mobile
- **Hero** — full-screen cinematic background, animated headline entrance (GSAP), parallax on scroll, animated scroll indicator
- **About** — two-column story/chef intro with an interior photo, a smaller overlapping chef portrait, and four animated stat counters (15+ years, 20,000+ guests, 100+ dishes, 4.9★ rating)
- **Featured Menu** — 8 category tabs (Starters, Main Courses, Seafood, Steaks, Pasta, Desserts, Drinks, Signature Specials) filtering 16 dishes with images, prices, and "Popular" badges
- **Signature Dishes** — 3 large chef's-recommendation features with ingredients and pricing
- **Gallery** — 12-image responsive masonry grid (interior, dining, dishes, chef, cocktails, desserts, guests, outdoor) with hover zoom and a GLightbox lightbox
- **Testimonials** — 7 reviews in an auto-sliding Swiper carousel with star ratings and dates
- **Reservation** — full form (name, email, phone, guests, date, time, special requests) with custom validation and an animated success confirmation, alongside opening hours / capacity / dress code / policy panels
- **Why Choose Us** — 6 feature cards with icons and hover lift
- **Contact** — address, phone (click-to-call), email (click-to-email), hours, embedded Google Map, and social links
- **Footer** — logo, quick links, newsletter signup, copyright

Also implemented sitewide: page loader, back-to-top button, toast notifications, button ripple effects, floating decorative blur shapes, JSON-LD `Restaurant` structured data, and Open Graph/Twitter meta tags.

## Stack

Tailwind CSS (Play CDN) with a custom AURELIA color/type config, Google Fonts (Playfair Display for headings, Poppins for body/UI), AOS for scroll-reveal animations, GSAP (+ ScrollTrigger) for the hero entrance and parallax, Swiper.js for the testimonials carousel, GLightbox for the gallery — all loaded via CDN, no npm install required for the front end. Content editing runs through [Decap CMS](https://decapcms.org) with [DecapBridge](https://decapbridge.com) for auth (Netlify Identity, the old standard pairing, was discontinued).

```
css/styles.css        design system: nav states, buttons, ripple, hero, masonry gallery, forms, glassmorphism panels, etc.
js/data.js             fetches this site's content (from /data) at runtime and exposes it to the render functions below
js/script.js           all rendering + interactions: nav, mobile menu, menu tabs, counters, reservation form, newsletter, ripple, AOS/GSAP/Swiper/GLightbox init
content/                the actual editable content — what staff change through /admin. One JSON file per menu item / dish / photo / testimonial / feature, plus a handful of "settings" files for restaurant info, hero copy, About copy, and section headings.
data/                   compiled from content/ by scripts/build-content.js — this is what js/data.js actually fetches. Regenerated automatically on every Netlify deploy; also checked into the repo as a working baseline.
scripts/build-content.js  the (zero-dependency) Node build step that produces data/ from content/
admin/                  the Decap CMS admin panel (index.html + config.yml)
netlify.toml            Netlify build/deploy configuration
DEPLOYMENT.md            full setup guide: GitHub, Netlify, DecapBridge, inviting staff
```

**To edit content by hand instead of through the CMS** (e.g. you're a developer making a bulk change), edit the files under `content/` directly, then run `node scripts/build-content.js` to regenerate `data/` before deploying — or just push to GitHub and let Netlify run that step for you automatically.

## A robustness note worth knowing about

Nearly every scroll animation on this page is driven by two CDN libraries — AOS (section reveals) and GSAP (the hero entrance). Both are built so that if either CDN script fails to load (network hiccup, ad blocker, corporate firewall), the affected content does **not** stay invisible: `js/script.js` detects the missing library and falls back to instantly showing that content instead of leaving it hidden behind an `opacity: 0` that nothing would ever clear. This was verified directly — the automated test suite runs the whole page twice, once with AOS/GSAP/Swiper/GLightbox working normally and once with those specific requests blocked, confirming the hero and every major section still render and stay visible either way.

## Before going live

1. Replace all Unsplash placeholder photography (dining room, dishes, chef, cocktails) with your own professional food and interior photography — do this through `/admin` once it's set up (see DEPLOYMENT.md), or by editing the image fields under `content/` directly.
2. Compile Tailwind for production instead of using the Play CDN, for performance.
3. Wire the reservation form to a real booking backend (OpenTable, Resy, SevenRooms, or your own API) — it currently validates and shows a styled success state client-side only, with no email or database write.
4. Wire the newsletter form to a real ESP (Mailchimp, Klaviyo, etc.).
5. Replace the placeholder address/phone/email, hours, and social links — all editable through `/admin` → Site Settings once set up — and update the JSON-LD schema in `index.html` (kept static/developer-edited since it needs to be present before any JavaScript runs, for search engine crawlers).
6. Swap the favicon placeholder (an inline "A" monogram) for a real logo mark.
7. Follow **DEPLOYMENT.md** to actually get this live on Netlify with staff CMS access — steps 1-6 above are all much easier to do once that's set up.

## Verification notes

This build environment has no outbound internet access, so the Tailwind/Google Fonts/AOS/GSAP/Swiper/GLightbox CDNs and the Unsplash images could not be visually screenshot-tested here — they're all standard, widely-used CDN endpoints and will render correctly once deployed somewhere with normal internet access.

What *was* verified in this environment: HTML structure (no duplicate IDs, balanced tags, every `href="#..."` anchor resolves to a real section), both JS files and the page's inline script are syntax-valid, and a full Playwright headless run (with every CDN mocked so real JavaScript executes) drove the entire experience end-to-end — nav, mobile menu, menu category filtering, animated counters, gallery, testimonials, the full reservation form (including validation errors and the success state), newsletter validation, ripple effects, and back-to-top — 29/29 checks passed with zero console errors, including a second pass that deliberately blocked the AOS/GSAP/Swiper/GLightbox requests to confirm the page degrades gracefully instead of showing blank/invisible content. Two real bugs were caught and fixed during this process: a duplicate `id` attribute on the hamburger button (browsers silently keep only the first, so the JS toggling its "open" class was hitting `null`), and the newsletter form's native `required type="email"` validation silently blocking the custom validation/toast from ever running (fixed by adding `novalidate`, matching the reservation form). A real visual pass in an actual browser with internet access is still recommended before launch to confirm the Tailwind-based layout and photography look right.

### Mobile/tablet responsive audit (added after initial delivery)

Since most guests will book on a phone, the layout got a dedicated pass across 10 real device viewports (iPhone SE/12/11/Pro Max, a small Android, iPad in portrait and landscape at 768/810/1024px, and iPad Air landscape at 1180px). This used a real compiled Tailwind stylesheet (built from the site's actual class usage, not a JS stub) injected into headless Chromium, so — unlike the first pass — spacing, sizing, and overlaps reflect true CSS, not just DOM/JS behavior. Every viewport was checked for horizontal overflow, undersized tap targets (<30px), and overlap between adjacent interactive elements, then screenshotted in full and at the mobile-menu-open, reservation, footer, and true-page-bottom scroll positions for visual review.

Real bugs found and fixed:

- **Off-canvas mobile menu caused real horizontal scroll** on nearly every viewport. `body{overflow-x:hidden}` doesn't stop it because the menu is `position:fixed`, which is positioned against the viewport/root rather than clipped by `body`'s own overflow. Fixed by moving `overflow-x:hidden` onto `html`.
- **Hamburger button's tap target was only 26×18px**, well under the ~44×44px minimum mobile guidelines call for. Restructured the markup so the button itself is a full 44×44px target, with the small visual icon nested inside it.
- **The floating back-to-top button could sit directly on top of the footer's newsletter "Join" button**, obscuring it, once that button scrolled into the same bottom-right corner (most reliably reproduced by scrolling all the way to the bottom on a short phone screen). Fixed by having the button detect that specific collision and lift itself clear, then return to its normal resting spot once the collision clears.
- **Signature-dish cards and the gallery masonry grid had no background fallback and, for the gallery, no reserved space at all** — the gallery's `<a>` tiles are inline by default, and CSS `aspect-ratio` has no effect on inline elements, so the whole 12-photo gallery could silently collapse to zero height while its images were still loading (worse than a placeholder: the entire section visually disappeared between the heading and Testimonials). Fixed by making the tiles `display:block` so their per-image aspect-ratio actually reserves space, and adding a neutral background color to both the gallery tiles and signature-dish cards so a slow or failed image load — more likely on the mobile connections most guests are on — shows a solid placeholder instead of a blank hole or a layout jump.

Also confirmed clean (no changes needed): the 768–1023px range where the "Reserve a Table" button and hamburger both show at once is intentional and has enough width budget; the desktop nav at exactly the 1024px breakpoint has comfortable margins on both sides; the horizontally-scrollable menu-category tab bar on narrow phones is a deliberate, standard mobile pattern, not an overflow bug.

Result: all 10 viewports now show zero horizontal overflow, zero element overlaps, and zero undersized tap targets, confirmed by both the automated checks and a full visual review of every section's screenshots.
