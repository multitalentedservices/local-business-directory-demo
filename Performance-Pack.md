# PERFORMANCE PACK — The Gujranwala Gazette Directory (Queue #11)

Purpose: everything the served-preview measurement needs from the build side. The main agent serves finished sites via GitHub Pages; this pack records the measured local weights and the weight-discipline choices made so the served numbers can pass when measured. **No Lighthouse or Core Web Vitals numbers are claimed anywhere in this pack — none exist yet (see the pending section).**

## Measured weights (local, 2026-11-21, from the test battery + filesystem)
- Code (6 HTML pages + css/style.css + all js/): **80,785 B total** — budget < 400 KB, using ~20% of it.
  - Largest single file: js/logic.js (the shared data + logic module, ~16 KB).
- Media: **825,998 B total across 7 photographs** — budget ≤ 1.6 MB, using ~49% of it.
- Per-image sizes (each compressed under the ≤ 120 KB ceiling loop BEFORE any HTML referenced it, lesson 39):
  - assets/hero.jpg — 122,383 B (1200×800, quality stepped down until under ceiling)
  - assets/cat-food.jpg — 120,504 B
  - assets/cat-health.jpg — 120,493 B
  - assets/cat-retail.jpg — 118,319 B (needed a width step to 1100px to fit the ceiling — the loop working as designed)
  - assets/cat-auto.jpg — 117,251 B
  - assets/cat-salon.jpg — 114,671 B
  - assets/cat-home.jpg — 112,377 B
  - assets/favicon.svg — text, negligible.

## Weight-discipline choices (why the served numbers should pass)
- **Zero JavaScript libraries and zero CSS frameworks.** Hand-coded vanilla JS + one stylesheet; the only third-party request is Google Fonts (Barlow Condensed + Barlow, `display=swap`, with `preconnect` hints — text renders on the system fallback first, no blocked first paint waiting on font files).
- **No synchronous third-party loads beyond the font stylesheet** — no analytics, no embeds, no map tiles, no trackers (battery-asserted: no live analytics endpoints, no external map embeds in source).
- **One image per category, reused** across that category's 3 listing cards, its detail page and its home tile (lesson 32): 18 listings are served by 6 photographs, so the browse page's total image weight stays bounded even with 18 cards. Below-the-fold card images carry `loading="lazy"`; the hero is a single 122 KB photograph (no video, no carousel, no slideshow JS).
- **No layout-shift machinery:** images sit in fixed-height card frames (190px) and a framed hero, cards have stable structure, and there are no sticky bars, popups, cookie banners or late-injected banners (lesson 35). The only animation is a subtle hero scale drift, disabled under `prefers-reduced-motion`.
- **Reveal-by-default:** content is visible without JS; nothing waits on IntersectionObserver or a framework hydration step, so first paint is HTML + CSS + the hero image only.
- **Small DOM:** the heaviest page (Browse, 18 cards) is generated from a ~16 KB logic module — no per-listing HTML files, no duplicated markup payloads.

## Served-preview CWV: PENDING — to be measured on the GitHub Pages preview by the main agent
- LCP / INP / CLS: **not measured** — the build is not deployed, and no numbers are estimated or invented here (honesty rule).
- Expected risk points to check at measurement: hero image weight on slow mobile (122 KB, single image — should be the LCP element), font swap behaviour, and the 18-card browse page's image decode cost (mitigated by lazy loading).
- Fixed by: the main agent deploying the GitHub Pages preview and filing a measured Lighthouse report against this pack; Area 7 of the scorecard is scored on partial (weight) evidence until then.
