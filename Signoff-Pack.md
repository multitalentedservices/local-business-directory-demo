# SIGN-OFF PACK — Prepared for AICOS-112 §0 (Design Systems & Template Library)

Build: The Gujranwala Gazette Directory — Local Business Directory Demo, Portfolio Queue #11
Client-facing owner: BalanceBit Solutions · Production: MTS · Date prepared: 2026-11-21
Status: **prepared by the builder for AICOS-112's §0 sign-off — the sign-off itself is AICOS-112's to record; it has NOT been given yet and is not claimed anywhere in this build.**

## 1. Design-direction note
- **Identity:** "Clean Local — Gazette register." The brief named the house system *Clean Local*; this build executes it as a city-newspaper gazette, because a directory is, in print terms, the classifieds and listings pages of the local paper.
- **Register:** a newspaper nameplate masthead (centred wordmark, double rules), a dateline strip carrying the three facts a directory reader needs first (city · the printed demo clock · how many listings), numbered category "shelves" ("No. 1 — Restaurants & Cafés"), condensed uppercase headlines, hairline-ruled cards and tables, and a dark ink band reserved for the owner-facing claim call-to-action — the "advertise / claim" page of the paper.
- **Why it fits a directory:** directories are scanning instruments, not stories. The gazette register gives instant information hierarchy (masthead → dateline → shelves → listings), tabular hours read like printed listings, and the editorial framing ("Featured in this edition", "Listings the editors marked first") makes featured placement legible without pretending it is advertising. The §0 screenshot test: this layout could not belong to a shop (no prices/cart), a clinic (no practitioners), a salon, an LMS or a SaaS product — it reads as a listings publication at a glance, on desktop and phone.
- **Distinctness from all ten predecessors:** no predecessor used a masthead/dateline, a condensed grotesque display face, or a newsprint paper ground with a teal-blue civic accent. Nearest neighbours by ground colour are LMS (warm paper, academic green, Lora serif) and Travel (sand, plum, Playfair) — both serif-led editorial; this build is sans/grotesque-led, teal-accented and structurally a newspaper, not a story page. Full comparison in BUILD-NOTES.md.

## 2. Inspiration references actually used (fresh research, opened 2026-11-21)
- **Yelp-style local search pattern** (system-design + for-business sources via search): search by term/category/location; open-now and rating filters; business pages with photos, hours and reviews; owner claim/manage flow. Patterns taken, no assets or text copied — see BUILD-NOTES.md.
- **TripAdvisor listing pattern** (local-SEO + for-business sources via search): listing completeness (category, tags, hours, contact) as the trust mechanism; free owner claiming with proof; fresh photography per listing. Patterns taken, no assets or text copied — see BUILD-NOTES.md.
- Design-Inspiration-Library: no directory section existed; Stripe/Linear restraint entries informed hierarchy discipline only. This build is offered as the library's first directory reference point.

## 3. Palette & type token table (complete — the only colours in the build)
| Token | Hex | Role |
|---|---|---|
| --paper | #FAF7EF | Newsprint page ground |
| --ink | #191817 | Black ink: headlines, body text, dark band, footer |
| --accent | #0B4F6C | THE civic accent (teal-blue): links, buttons, stars, badges, focus ring, today's hours row |
| --accent-dark | #083C53 | Accent hover state only |
| --band | #EFE9DB | Tinted section band, map placeholder ground, clock note |
| --card | #FFFFFF | Card / panel ground |
| --muted | #59524A | Secondary text |
| --line | #D9D0BE | Hairlines, card borders, tag borders |
| --err | #B3261E | Semantic error red — the ONLY extra hue, form errors only |

Contrast (computed from hex in the battery, all PASS — exact values in tests-output.log): ink on paper 16.56:1 · ink on card 17.73:1 · accent on paper 8.35:1 · accent on card 8.94:1 · white on accent 8.94:1 · accent-dark on paper 11.01:1 · muted on paper 7.18:1 · error on paper 6.11:1 · error on card 6.54:1 · focus ring (accent on paper) 8.35:1 vs the 3:1 bar.

| Type token | Face | Role |
|---|---|---|
| --cond | "Barlow Condensed", Arial, sans-serif | Display: masthead, H1/H2, tile numbers, refs (600/700, uppercase) |
| --sans | "Barlow", system-ui, sans-serif | Body, forms, UI (400/600/700); form fields 16px (no iOS zoom) |

Component tokens: one button system (8px radius, 52px primary / 44px small, filled accent = primary action, ghost = secondary, ink = WhatsApp role), one field system (52px, 1.5px muted border, label above, error line below in --err), one card system (1px --line border, 190px image, identical body rhythm), one badge system (pill; accent filled = open, outlined = closed, ink filled = featured, band + accent border = pending).

## 4. Evidence filed for the sign-off read
- Full-page captures of every page at 1440 / 768 / 390 + 320px homepage probe: `screenshots/` (paths enumerated in the builder's report and in Scorecard-Verdict.md's component-consistency pass).
- Component-consistency pass, page by page: Scorecard-Verdict.md.
- Flow evidence (claim badge before/after, enquiry, suggestion-kept-private): `screenshots/flow-log.txt` + flow captures.
- Test battery: `tests-output.log` — 157 PASS / 0 FAIL, including 14 contrast assertions computed from the tokens above.

## 5. What AICOS-112 is asked to record
- §0 screenshot test result against §1 above (layout could not belong to another industry).
- Palette/type discipline confirmation against §3 (no stray colours in the rendered captures).
- Sign-off, or defects returned as: what is wrong · where · what fixed looks like.
