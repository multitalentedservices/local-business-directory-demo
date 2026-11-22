/* Premium-layer checks — Gujranwala Gazette Directory (separate from tests.js, which is unamended).
   Run: node premium-checks.js — verifies vendored files (sha256 vs Install-Record),
   per-page TOTAL gzip JS against the P8 budgets, and that the audit-fixed base rules
   (P1) survived: base a{text-decoration:none} + the DESIGNED aria-current underline. */
const fs = require('fs'), path = require('path'), zlib = require('zlib'), crypto = require('crypto');
const ROOT = __dirname;
let pass = 0, fail = 0; const lines = [];
function t(name, ok, extra) { lines.push((ok ? 'PASS' : 'FAIL') + ' | ' + name + (extra ? ' | ' + extra : '')); ok ? pass++ : fail++; }
const SHA = {
  'assets/vendor/gsap.min.js': '3d1bea374ab1b703cc5c4105358eec63c4465efdc573931dc116e34a0a190c1b',
  'assets/vendor/ScrollTrigger.min.js': 'b5bb360661f478f0ff6ffa11500d8ce5e2b6aaf6f7288237cdca3aac9548035a',
  'assets/vendor/lenis.min.js': '80f53e77f1c13e379fc246d2b5e299188e20bcb2b2fe7ebb13e8e8c7563a6da7',
  'assets/vendor/lenis.css': '2f668ae84a668327f246faf8a770383a2bf69196d214290fbc4d5548910606c5'
};
Object.entries(SHA).forEach(([f, want]) => {
  const p = path.join(ROOT, f);
  const got = fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : 'MISSING';
  t('vendored ' + f + ' sha256 == Install-Record', got === want);
});
t('Alpine NOT vendored (measured out of browse P8 budget)', !fs.existsSync(path.join(ROOT, 'assets/vendor/alpine.min.js')));
const css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
t('P1 base rule intact: a{color:var(--accent);text-decoration:none}', /a\{color:var\(--accent\);text-decoration:none\}/.test(css));
t('P1 DESIGNED underline intact: nav.main a[aria-current="page"] underline rule', /nav\.main a\[aria-current="page"\]\{color:var\(--accent\);text-decoration:underline/.test(css));
function pageGzipJS(page) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]).filter(s => !/^https?:/.test(s));
  let total = 0; const parts = [];
  srcs.forEach(s => { const b = zlib.gzipSync(fs.readFileSync(path.join(ROOT, s))).length; total += b; parts.push(s.split('/').pop() + ' ' + b); });
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].reduce((a, m) => a + zlib.gzipSync(Buffer.from(m[1])).length, 0);
  return { total: total + inline, parts: parts.join(' + ') + (inline ? ' + inline ' + inline : '') };
}
const idx = pageGzipJS('index.html');
t('P8 index (hero page) total gzip JS <= 90 KB', idx.total <= 90 * 1024, idx.total + ' B = ' + idx.parts);
['browse.html', 'listing.html', 'claim.html', 'mine.html', 'about.html'].forEach(p => {
  const r = pageGzipJS(p);
  t('P8 ' + p + ' (plain page) total gzip JS <= 20 KB', r.total <= 20 * 1024, r.total + ' B = ' + r.parts);
});
const L = require(path.join(ROOT, 'js/logic.js'));
t('editorial data honesty: 18 listings / 6 categories (existing data only)', L.LISTINGS.length === 18 && L.CATEGORIES.length === 6);
const browseCode = fs.readFileSync(path.join(ROOT, 'js/browse.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
t('browse count tween is vanilla (no library used in browse.js code)', !/alpine|gsap/i.test(browseCode));
console.log(lines.join('\n')); console.log('---'); console.log('TOTAL: ' + pass + ' PASS / ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);
