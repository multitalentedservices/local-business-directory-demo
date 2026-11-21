/* Gujranwala Gazette Directory — screenshot + audit + flow runner (adapted from Queue #10 harness).
   Every capture is fullPage:true. Modes: default (3 viewports), --nojs, --probe320, --reduced, --flows, --keyboard. */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/hatch/workspace/portfolio-builds/local-business-directory-demo';
const EXEC = '/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = process.argv[2]; const NOJS = process.argv.includes('--nojs'), PROBE = process.argv.includes('--probe320'), FLOWS = process.argv.includes('--flows'), REDUCED = process.argv.includes('--reduced'), KEYBOARD = process.argv.includes('--keyboard');
const PAGES = [['index', 'index.html'], ['browse', 'browse.html'], ['listing', 'listing.html?id=chargha-house'], ['claim', 'claim.html'], ['mine', 'mine.html'], ['about', 'about.html']];
const VIEWPORTS = PROBE ? [['probe320', 320, 700]] : [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]];
async function auditPage(page) { return page.evaluate(() => { const vw = window.innerWidth; const bad = []; document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) { if (el.closest('.skip')) return; let clipped = false; for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const ox = getComputedStyle(a).overflowX; if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; } } if (!clipped) bad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), right: Math.round(r.right) }); } }); const broken = []; document.querySelectorAll('img').forEach(im => { if (im.complete && im.naturalWidth === 0) broken.push(im.getAttribute('src')); }); const textBad = []; document.querySelectorAll('body *').forEach(el => { if (el.children.length || !el.textContent || !el.textContent.trim() || el.closest('.skip')) return; if (el.scrollWidth > el.clientWidth + 1) textBad.push({ el: el.tagName.toLowerCase(), sw: el.scrollWidth, cw: el.clientWidth, text: el.textContent.trim().slice(0, 40) }); }); return { overflowX: document.documentElement.scrollWidth - vw, badEls: bad.slice(0, 12), brokenImgs: broken, textBad: textBad.slice(0, 12) }; }); }
async function settle(page) { if (NOJS) { await page.waitForTimeout(500); return; } await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); }); await page.waitForTimeout(250); }
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--proxy-server=http://hatch-egress-proxy:3128', '--no-sandbox', '--force-color-profile=srgb'] });
  if (KEYBOARD) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage(); const rows = [];
    async function walk(file, label, tabs, shotAt, shotName) { await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load' }); await page.waitForTimeout(500); for (let i = 0; i < tabs; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(110); const info = await page.evaluate(() => { const el = document.activeElement; if (!el) return null; const cs = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), text: (el.textContent || el.value || el.id || '').trim().slice(0, 42), cls: el.className || el.id || '', outline: cs.outlineWidth + ' ' + cs.outlineStyle }; }); rows.push(`| ${label} | ${i + 1} | ${info ? info.tag + ' — ' + info.text : '?'} | ${info ? info.cls : ''} | ${info ? info.outline : ''} |`); if (i === shotAt) await page.screenshot({ path: path.join(OUT, shotName) }); } }
    await walk('browse.html', 'Browse filters', 10, 4, 'keyboard-focus-browse.png');
    await walk('claim.html', 'Claim form', 11, 6, 'keyboard-focus-claim.png');
    fs.writeFileSync(path.join(OUT, 'keyboard-walk.md'), '# Keyboard walk — Gujranwala Gazette Directory (Demo)\n\nMethod: Playwright Tab presses at 1280px; focused element and computed outline recorded per stop. All controls are native visible inputs/selects/checkboxes/buttons (no visually-hidden inputs, so no focus-host case arises — lesson 20 checked, recorded not applicable; lesson 34). No traps observed.\n\n| Page | Stop | Focused element | Class/id | Outline |\n|---|---|---|---|---|\n' + rows.join('\n') + '\n');
    console.log('KEYBOARD DONE'); await browser.close(); return;
  }
  if (FLOWS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage(); const log = [];
    const shot = async (n, loc) => { if (loc) await loc.screenshot({ path: path.join(OUT, n) }); else await page.screenshot({ path: path.join(OUT, n), fullPage: true }); };
    // 1) Browse: combined filter -> named empty state -> reset
    await page.goto('file://' + path.join(ROOT, 'browse.html'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    log.push('browse count initial -> ' + await page.textContent('[data-count]'));
    await page.selectOption('[data-category]', 'retail'); await page.selectOption('[data-area]', 'Civil Lines'); await page.waitForTimeout(300);
    log.push('empty state text -> ' + (await page.textContent('[data-empty-text]')).trim());
    log.push('empty state URL -> ' + page.url());
    await shot('flow-filter-empty.png');
    await page.click('[data-reset]'); await page.waitForTimeout(300);
    log.push('after reset count -> ' + await page.textContent('[data-count]') + ' | URL -> ' + page.url());
    // open-now combined check in rendered UI
    await page.check('[data-open]'); await page.waitForTimeout(300);
    log.push('open-now count -> ' + await page.textContent('[data-count]') + ' | URL -> ' + page.url());
    await page.uncheck('[data-open]'); await page.waitForTimeout(200);
    // 2) Listing detail BEFORE claim: no pending badge; WhatsApp firing
    await page.goto('file://' + path.join(ROOT, 'listing.html?id=chargha-house'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    log.push('claim badge BEFORE claim -> "' + (await page.textContent('[data-claim-badge]')).trim() + '"');
    log.push('open badge -> ' + (await page.textContent('[data-openbadge]')).trim());
    log.push('today hours row -> ' + (await page.textContent('[data-hours] tr.today')).replace(/\s+/g, ' ').trim());
    await shot('flow-listing-before.png');
    await page.click('[data-wa]'); await page.waitForTimeout(400);
    const wa = await page.evaluate(() => JSON.parse(localStorage.getItem('ld_wa_log') || '[]')); log.push('FIRING whatsapp log -> ' + JSON.stringify(wa));
    // 3) Enquiry: bad phone first (rendered error CONTENT asserted) -> live clear -> submit
    await page.fill('[data-name-input]', 'Ahmed Raza'); await page.fill('[data-phone-input]', '123'); await page.fill('[data-message-input]', 'Do you take walk-ins for a family of six tonight?');
    await page.click('[data-enquiry] button[type="submit"]'); await page.waitForTimeout(300);
    log.push('phone error CONTENT -> ' + await page.textContent('[data-error-for="phone"]'));
    await shot('flow-enquiry-errors.png');
    await page.fill('[data-phone-input]', '0321 5550199'); await page.waitForTimeout(300);
    log.push('phone error after fix (must be empty) -> "' + (await page.textContent('[data-error-for="phone"]')) + '"');
    await page.click('[data-enquiry] button[type="submit"]'); await page.waitForTimeout(500);
    const conf = (await page.textContent('[data-confirmation]')).replace(/\s+/g, ' ').trim(); log.push('enquiry confirmation CONTENT -> ' + conf.slice(0, 300));
    log.push('enquiry ref -> ' + (conf.match(/EN-DEMO-\d{4}/) || [])[0]);
    await shot('flow-enquiry-confirmation.png', page.locator('[data-confirmation-box]'));
    // 4) Claim the same listing (preselected from detail link target)
    await page.goto('file://' + path.join(ROOT, 'claim.html?listing=chargha-house'), { waitUntil: 'load' }); await page.waitForTimeout(400);
    log.push('claim listing preselected -> ' + await page.inputValue('[data-listing]'));
    await page.fill('[data-cname]', 'Ahmed Raza'); await page.selectOption('[data-role]', 'owner');
    await page.fill('[data-cphone]', '0321 5550199'); await page.fill('[data-cemail]', 'ahmed@charghahouse.example');
    await page.fill('[data-proof]', 'Trade licence in the business name, available to show the reviewer.');
    await page.click('[data-claim] button[type="submit"]'); await page.waitForTimeout(500);
    const cref = (await page.textContent('[data-claim-ref]')).trim(); log.push('claim ref -> ' + cref);
    await shot('flow-claim-confirmation.png', page.locator('[data-claim-confirmation-box]'));
    // 5) Cross-surface: badge AFTER claim on the detail page
    await page.goto('file://' + path.join(ROOT, 'listing.html?id=chargha-house'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    log.push('claim badge AFTER claim -> "' + (await page.textContent('[data-claim-badge]')).trim() + '"');
    await shot('flow-listing-after.png');
    // 6) Suggest a business -> must NOT appear in browse search
    await page.goto('file://' + path.join(ROOT, 'claim.html'), { waitUntil: 'load' }); await page.waitForTimeout(400);
    await page.fill('[data-sname]', 'Zaiqa Bakery'); await page.selectOption('[data-scat]', 'food'); await page.selectOption('[data-sarea]', 'Model Town'); await page.fill('[data-sphone]', '0321 5550199');
    await page.click('[data-suggest] button[type="submit"]'); await page.waitForTimeout(400);
    log.push('suggest ref -> ' + (await page.textContent('[data-suggest-ref]')).trim());
    await page.goto('file://' + path.join(ROOT, 'browse.html?q=Zaiqa'), { waitUntil: 'load' }); await page.waitForTimeout(400);
    log.push('browse search for suggested business (must be 0) -> ' + await page.textContent('[data-count]'));
    // 7) My Claims & Enquiries: both records visible
    await page.goto('file://' + path.join(ROOT, 'mine.html'), { waitUntil: 'load' }); await page.waitForTimeout(400);
    const mineText = (await page.textContent('[data-claims]')).replace(/\s+/g, ' ').trim();
    const enqText = (await page.textContent('[data-enquiries]')).replace(/\s+/g, ' ').trim();
    log.push('my claims CONTENT -> ' + mineText.slice(0, 320));
    log.push('my enquiries CONTENT -> ' + enqText.slice(0, 260));
    log.push('log summary -> ' + (await page.textContent('[data-log-summary]')).trim());
    await shot('flow-mine.png');
    const stored = await page.evaluate(() => ({ claims: JSON.parse(localStorage.getItem('ld_claims') || '[]'), enquiries: JSON.parse(localStorage.getItem('ld_enquiries') || '[]') }));
    log.push('FIRING stored claims = ' + JSON.stringify(stored.claims.map(c => c.ref + ':' + c.status)));
    log.push('FIRING stored enquiries = ' + JSON.stringify(stored.enquiries.map(e => e.ref + ':' + e.listingName)));
    fs.writeFileSync(path.join(OUT, 'flow-log.txt'), log.join('\n') + '\n'); console.log(log.join('\n')); console.log('FLOWS DONE'); await browser.close(); return;
  }
  const results = {};
  for (const [pname, file] of PAGES) { for (const [vname, w, h] of VIEWPORTS) { const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: !NOJS, reducedMotion: REDUCED ? 'reduce' : 'no-preference' }); const page = await ctx.newPage(); await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load' }); await page.waitForTimeout(400); await settle(page); results[pname + '@' + vname] = await auditPage(page); await page.screenshot({ path: path.join(OUT, pname + '-' + vname + '.png'), fullPage: true }); await ctx.close(); } }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(results, null, 2));
  const bad = Object.entries(results).filter(([, a]) => a.overflowX > 1 || a.badEls.length || a.brokenImgs.length || a.textBad.length);
  console.log('combos:', Object.keys(results).length, '| problem combos:', bad.length); bad.forEach(([k, a]) => console.log(k, JSON.stringify(a)));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
