VISUAL QUALITY SCORECARD — VERDICT
Build: The Gujranwala Gazette Directory — Local Business Directory Demo, Portfolio Queue #11  (client-facing owner: BalanceBit Solutions · production: MTS)
Build type / builder (AICOS-105–111): AICOS-105 (Business Website Builds) — executed by builder worker
Preview URL: none (not deployed — local file:// preview only; GitHub Pages preview to be served by the main agent)   Date of pass: 2026-11-21
Scored by: AICOS-115   Pass #: 1

OWNER STANDARD APPLIED (Asad, 2026-11-21 ~22:11 PKT): the bar is 100/100. The two standing evidence gaps were closed from the build side as far as a build can close them — Performance-Pack.md (measured weights + discipline choices) and Signoff-Pack.md (§0 pack: design direction, references used, full token table) are filed in this folder and cited below. What remains is stated exactly, not smoothed over: (1) the served-preview CWV measurement itself, which can only happen on the main agent's GitHub Pages preview, and (2) AICOS-112 recording its §0 sign-off from the prepared pack. No Lighthouse/CWV numbers are claimed anywhere — none exist yet.

 1. Visual identity & originality   13 / 15   Evidence: Signoff-Pack.md (§1 design-direction note + §3 token table, prepared for AICOS-112 §0) + BUILD-NOTES.md (own Gazette register — newsprint paper #FAF7EF, ink #191817, single civic teal-blue accent #0B4F6C, Barlow Condensed + Barlow; references: Yelp-style local-search pattern + TripAdvisor listing pattern, fresh 2026-11-21 research); screenshots/index-desktop.png + index-phone.png match the record — a newspaper-masthead directory that could not belong to a shop, clinic, salon, LMS or SaaS product, and is visually unrelated to all ten predecessors. Held: 2 points — AICOS-112's §0 sign-off itself is still to be recorded (the pack is prepared; the act is theirs).
 2. UI/UX & usability               14 / 15   Evidence: flow captures — flow-filter-empty.png (empty state naming "category = Retail & Shops, area = Civil Lines" with one-click reset restoring "Showing 18 of 18"), flow-listing-before.png / flow-listing-after.png, flow-enquiry-errors.png, flow-enquiry-confirmation.png, flow-claim-confirmation.png, flow-mine.png; the ONE conversion goal (claim a listing end-to-end) completed without assistance — CL-DEMO-3752, status Pending review (demo), badge appearing on the listing page.
 3. Typography & composition        10 / 10   Evidence: screenshots/index-phone.png (condensed gazette headlines over the masthead/dateline, legible card hierarchy), listing-phone.png (hours table + panels calm at 390px), browse-phone.png (18 identical cards); pairing exactly as specified in Signoff-Pack.md §3.
 4. Animation & interactions        9 / 10   Evidence: interactions observed working in the flow run — live filtering/sorting with URL sync, live error clearing, claim badge appearing cross-surface, nav record count updating; hero uses photo + subtle CSS drift motion; REDUCED-MOTION RUN FILED (screenshots/reduced/ — 6 pages × 3 viewports, 0 overflow / 0 text-overflow / 0 broken, motion disabled). Remaining: no CLS measurement exists without a served preview (see Area 7).
 5. Responsive design               10 / 10   Evidence: screenshots/audit.json — 18 page×viewport combos (390×844 / 768×1024 / 1440×900), EVERY capture fullPage: 0 overflow, 0 leaf text-overflow, 0 broken images; screenshots/probe320/audit.json — 6 pages at 320px: 0 findings after the fix-iterate cycle; screenshots/nojs/ run (6 pages × 3 viewports): content visible with JS disabled (dynamic regions carry honest noscript notes). Full-page index captures verified: index-desktop.png 1440×3326, index-phone.png 390×6962 — full-page, not viewport crops. All phone pages read by eye, copy included.
 6. Functionality                   15 / 15   Evidence: tests.js + tests-output.log — 157/157 PASS with the headline requirements proven (lesson 23): search/filter/sort exact counts incl. combined AND cases, open-now boundary pairs against the fixed demo clock (Glow Studio Sun 2:29 PM open / 2:30 PM exactly-closing closed; opening-instant pair; closed-Sunday listings), claim + enquiry + suggest validation naming every constraint, ref format/determinism (CL-DEMO-#### / EN-DEMO-####), claim-state cross-surface predicate in pure logic, suggested-business absence from the catalogue, 14 contrast assertions from hex; flow run (screenshots/flow-log.txt): enquiry completed with rendered error CONTENT asserted + live clearing (EN-DEMO-9068 visible in My Enquiries), INTEGRATION FIRING RECORDED (lesson 21) — WhatsApp click wrote an ld_wa_log entry, CROSS-SURFACE PROOF (lessons 30/38) — claim badge "" before → "Claim pending (demo)" after CL-DEMO-3752, claim + suggestion (CL-DEMO-5690) listed in My Claims, and the suggested business provably absent from Browse search ("Showing 0 of 18").
 7. Performance                     6 / 10   Evidence: Performance-Pack.md — measured weights: code 80,785 B (< 400 KB), media 825,998 B total across 7 photos, max image 122,383 B (battery-verified); discipline choices recorded (zero libraries, fonts display=swap + preconnect, one image per category reused, lazy card images, fixed-height frames, no sticky/injected elements). Missing — THE single external measurement remaining: served-preview Lighthouse / field Core Web Vitals (LCP/INP/CLS) on the GitHub Pages preview, to be measured by the main agent; not estimated, not invented. 4 points held for it.
 8. Accessibility                   5 / 5   Evidence: 14 contrast assertions computed from the token hex values in tests.js, all PASS (every text pairing ≥ 4.5:1 — ink on paper 16.56, accent on paper 8.35, white on accent 8.94, muted on paper 7.18, error on paper 6.11; focus ≥ 3:1 at 8.35); KEYBOARD-WALK RECORD FILED (screenshots/keyboard-walk.md — 21 Tab stops across Browse filters + Claim form, visible 3px solid focus at every stop; all controls are native visible elements, so no focus-host case arises — lesson 20 checked and recorded as not applicable, lesson 34); semantic landmarks, skip link, aria-live count line, ≥44px touch targets (buttons/inputs 52px), 16px form fonts, alt text on all images.
 9. SEO                             5 / 5   Evidence: unique title + meta description per page (test-verified), sitemap.xml (6 pages) + robots.txt present, internal linking across all 6 pages (all refs resolve, tests-output.log).
10. Security                        4 / 5   Evidence: zero third-party packages/CDN libraries (Google Fonts only), no secrets or credentials in source, no backend — claims, enquiries, suggestions and the WhatsApp log write only to the visitor's own localStorage; battery asserts no live analytics endpoints and no external map embeds in source. HTTPS enforcement is a hosting property and the build is not deployed.

TOTAL: 91 / 100   (owner bar: 100 — see verdict reasons; the build-side evidence supports 91 today, with 6 of the 9 held points sitting in two external acts named below, and 3 in Area 2/4/10 margins)

COMPONENT-CONSISTENCY PASS (owner done-gate, 2026-11-21 — every page read from its rendered full-page captures at 1440/768/390 after the final capture run):
- index (index-desktop/tablet/phone + probe320): PASS after one fix — masthead, searchbox (one field system, label above, filled teal Search), numbered category tiles uniform, featured cards identical to browse cards (same image height, badge set, filled "View listing" + ghost "Claim this listing" pair), dark claim band with filled "Start a claim". Defect found on first read: the dark band's white panel note rendered near-white on white (specificity leak) — fixed, re-captured, now reads in muted ink. Palette: paper/ink/teal only.
- browse (browse-desktop/tablet/phone): PASS — filter panel: five controls, one field system, labels above every control, open-now as a native checkbox line; all 18 cards one system (same radius-less gazette card, 190px images, identical tag/badge/button rhythm); OPEN NOW (teal filled) vs CLOSED NOW (outlined) badges uniform, including Glow Studio correctly CLOSED at the boundary; spacing rhythm even across the full 18-card page.
- listing (listing-desktop/tablet/phone): PASS — buttons by role and only by role (ink filled WhatsApp, ghost Claim, teal filled enquiry submit — same heights/radius/weight as every other page); enquiry fields aligned with visible labels, error line position reserved under each field (rendered error state read in flow-enquiry-errors.png); hours table hairline-ruled with today's row in the accent; map placeholder panel in band/accent tokens, honestly labelled; no stray colours.
- claim (claim-desktop/tablet/phone): PASS — claim form and suggest form share the exact field system with browse/listing (52px fields, labels above, placeholders unclipped); filled teal "Submit claim" vs ghost "Suggest this business" roles match the site-wide primary/secondary split; confirmation panels (read in flow-claim-confirmation.png) use the same bordered panel + condensed ref treatment; panels and spacing rhythm match listing/about.
- mine (mine-desktop/tablet/phone + flow-mine.png with records): PASS — record cards one system, status badges identical to listing-page badges (pending = band pill with accent border; sent = accent filled), ref treatment consistent with confirmation panels, empty states use the same dashed-accent panel as browse's empty state; nav count badge updates consistently.
- about (about-desktop/tablet/phone): PASS — text-led page in the same type system, two panels matching the site panel system, single filled teal CTA ("Browse the directory") at the same size/radius as all primaries; copy read in full (lesson 40) — honesty statements accurate, no internal jargon.

BLOCKING FAILURES (security / data integrity / functionality):
- None. The ONE conversion goal (claim-your-listing → demo confirmation with reference) completes; claim state provably propagates to the listing badge and My Claims from one logic-owned record; a suggested business provably cannot leak into the public catalogue; no security or data-integrity findings; no business, rating or review count is presented as real anywhere (DEMO labelling test-asserted on every page).

UNTESTED AREAS (score invalid without evidence):
- None scored as untested. Areas 1 and 7 carry named partial evidence (see above) and were scored down for it rather than marked untested — the same convention as Queue #2–#10, now with both build-side packs filed.

VERDICT:  [ ] APPROVE   [X] REJECT   [ ] REJECT — BLOCKED   [ ] REJECT — INCOMPLETE
Reasons (defects as: what is wrong · where · what fixed looks like):
- The build itself has NO outstanding code or design defects: 157/157 battery, 60 audited capture combos clean, flow proofs complete, component-consistency pass green on all six pages. The verdict cannot be APPROVE — and cannot honestly reach the owner's 100 bar — until the two external acts below land; both are now fully prepared from the build side.
- Remaining item 1 (the single external measurement): served-preview Lighthouse/CWV · Area 7 (4 points held) · fixed by the main agent serving the GitHub Pages preview and measuring against Performance-Pack.md, which is filed and ready to cite.
- Remaining item 2: AICOS-112 §0 sign-off recording · Area 1 (2 points held) · fixed by AICOS-112 recording its sign-off against Signoff-Pack.md, which is filed with the design-direction note, the references actually used, and the full token table.
- Judgement margins (3 points across Areas 2/4/10) stay held under honest scoring until the two items above are read against the served build.

Next step: [ ] To AICOS-025 release gate   [X] Back to Gate 5 (external evidence completions only — both prepared, neither is build work)   [ ] Back to Gate 2

Disclosures: one test assertion amended during the build (local-refs check skips JS template fragments from inline scripts) and two rendered defects found by reading captures and fixed with re-capture (dark-band panel text specificity leak; inline grid-template-columns on the listing hero defeating the mobile media query, plus the homepage h1 floor at ≤560px) — all disclosed in BUILD-NOTES.md. One internal-jargon check was run over all rendered copy (lesson 40): none found in user-facing text.

## Addendum — Round-2 Re-verification FIX RUN (2026-11-22)

Independent round-2 re-verification (`Reverification-2026-11-21/round2/REPORT.md`) found 1 visible
+ 1 minor defect on this site. Both FIXED, re-shot and read; battery **157 PASS / 0 FAIL**
unamended after fixes:

- **LD-1 (visible) — No mobile menu; header 308px tall at 390px, 494px at 320px.** The full
  desktop nav was carried onto small screens unwrapped (4 stacked rows at 320). Fix (the
  round-1 Clinic pattern in the Gazette's own rule-and-ink idiom): all 6 pages gain a
  `.nav-toggle` "Menu" strip (full-width, hairline-ruled, uppercase) and `id="main-nav"`,
  wired in `js/site.js` (aria-expanded, closes on link click and Escape). At ≤768px the nav
  is hidden until opened, then renders as full-width ruled rows; the masthead compresses
  (padding 10px/8px, nameplate 26px at ≤560px) and the dateline centres and sheds its third
  item at ≤560px. Proof: DOM geometry — closed header **179px at 390 (was 308)** and **219px
  at 320 (was 494)**; toggle visible ≤768, open state shows all 5 links with 0 overflow
  (`round2/fix2-local-business-directory/menu-open-phone.png`, read by eye); desktop header
  unchanged (187px, nav on one row). Re-shoot 18 combos + 6 probe320, 0 problems.
- **LD-2 (minor) — Hero search placeholder clipped mid-word at 320px.** Canvas text
  measurement: the old text ("Try: karahi, pharmacy, AC service…") is 259px wide in a 210px
  inner field. Shortened in one measured step to "Try: karahi, pharmacy, AC…" (202px —
  fits, all three example terms kept). Proof: canvas measure + element capture at 320px
  read by eye — the placeholder renders in full.

Score unchanged: **91/100 — REJECT (evidence bar only)** — served-preview CWV + AICOS-112 §0
sign-off still outstanding; defect repairs do not manufacture them.
Push of the changed text files (css/style.css, js/site.js, all 6 HTML pages,
Scorecard-Verdict.md, tests-output.log) is pending the GitHub connector's approval card —
see FIX-REPORT-ROUND2.md.

## Addendum — PREMIUM UPGRADE PASS (2026-11-22, ladder #11)

Premium layer applied per `Premium-Standard-and-Library-Plan.md` §5 #11 (Infatuation + Houzz
patterns). Battery **157 PASS / 0 FAIL, tests.js UNAMENDED** before and after; separate
`premium-checks.js` **15 PASS / 0 FAIL** (vendor hashes vs Install-Record, per-page gzip JS
budgets, P1 rules). Full capture sets re-shot and read (standard 18 combos, flows, nojs,
reduced, probe320, keyboard — 0 problem combos everywhere).

What was added:
- **Rating as display type** — every card now sets the rating as a 52px Barlow Condensed
  numeral (64px in the listing trust panel, 38px in the listing hero line).
- **Written mini-reviews** — each card's existing Gazette listing note (the listing's own
  blurb from the demo record) is now set as a ruled editorial mini-review. No review text
  was invented; the blurb is editorial copy from the existing data, labelled as such.
- **Editorial photo strip (index)** — the six existing category photographs as a magazine
  strip; with the premium JS it becomes the page's ONE signature scene: a GSAP
  ScrollTrigger scrubbed horizontal drift. No-JS/reduced-motion: a plain scrollable strip.
- **Houzz-pattern trust panel ("The Gazette check", listing page)** — rating, demo review
  count, featured/standard status, open state vs the demo clock, services on record, tags,
  area — ALL read from the listing's own existing demo record, with an explicit
  "nothing here is a real-world verification" note. **Deviation recorded:** Houzz's
  response-time and hire-count rows were NOT built — the demo data carries no such fields,
  and P10 forbids inventing them.
- **Animated result count (browse)** — the count is now also a 64px display numeral,
  tweened on filter changes. **Alpine decision (measured):** browse's existing JS is
  8,471 B gzip; Alpine 3.17.5 alone is 19,902 B gzip → 28,373 B total, BREAKING the P8
  plain-page budget (≤20 KB). Alpine was therefore NOT installed on this site; the count
  is animated with a vanilla rAF tween in browse.js (~+430 B gzip) and facet interactions
  remain the existing native controls + URL state. The aria-live count line is set
  instantly, never tweened.
- **Vendor copies (index only):** GSAP 3.15.1 + ScrollTrigger + Lenis 1.3.27 (JS+CSS) in
  `assets/vendor/`, sha256-verified against the Install-Record; deferred, explicit
  `gsap.registerPlugin(ScrollTrigger)`, Lenis↔ScrollTrigger ticker sync. Lenis never
  constructs under prefers-reduced-motion; all GSAP effects run from visible defaults.
- **P7:** CSS View Transitions (400ms) + card/tile/button hover-active micro-interactions
  in the site's own system.

P1 re-probe (the audit's own `default-style-probe.js`, fresh run): **0 offenders on all
12 page×viewport combos, 0 focus offenders; the DESIGNED current-page nav underlines
(aria-current rule) verified present** (desktop; on phone the nav is behind the menu
toggle by design). Base rules untouched by this pass.

JS weights (TOTAL gzip per page, measured by premium-checks.js): index (hero) **60,838 B**
≤ 90 KB ✓ · browse 8,932 B · listing 9,382 B · claim 8,776 B · mine 8,063 B · about
7,246 B — all plain pages ≤ 20 KB ✓.

RE-SCORE: Area 2 UI/UX 14→**15** (module depth: trust panel + animated counts at directory
density, scannability kept — browse battery + flow set green) · Area 4 Animation &
interactions 9→**10** (Lenis + one scrubbed signature scene + masked line-rise hero +
micro-interactions, all reduced-motion-safe and re-captured). All other areas unchanged.
**TOTAL: 91 → 93 / 100 — verdict remains REJECT (evidence bar only):** the same two
external acts hold the remaining 7 points (served-preview CWV, Area 7, 4 pts · AICOS-112
§0 sign-off, Area 1, 2 pts · HTTPS hosting property, Area 10, 1 pt). No new defects;
signature capture: `screenshots/signature-moment.png` (Browse editorial listing moment).
