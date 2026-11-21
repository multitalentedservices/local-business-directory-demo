/* Gujranwala Gazette Directory — Node test battery. Run: node tests.js > tests-output.log 2>&1 */
const fs = require("fs"), path = require("path");
const L = require("./js/logic.js");
const ROOT = __dirname;
let pass = 0, fail = 0; const lines = [];
function t(name, cond, extra) { lines.push((cond ? "PASS" : "FAIL") + " | " + name + (extra ? " | " + extra : "")); cond ? pass++ : fail++; }
function eq(name, a, b) { t(name, a === b, "got " + JSON.stringify(a) + " want " + JSON.stringify(b)); }

/* --- Catalogue data --- */
eq("listing count", L.LISTINGS.length, 18);
eq("category count", L.CATEGORIES.length, 6);
eq("area count", L.AREAS.length, 5);
L.CATEGORIES.forEach(function (c) { eq("3 listings in " + c.id, L.filterListings({ category: c.id }).length, 3); });
eq("area Satellite Town", L.filterListings({ area: "Satellite Town" }).length, 5);
eq("area Model Town", L.filterListings({ area: "Model Town" }).length, 5);
eq("area Civil Lines", L.filterListings({ area: "Civil Lines" }).length, 3);
eq("area People's Colony", L.filterListings({ area: "People's Colony" }).length, 3);
eq("area DHA Gujranwala", L.filterListings({ area: "DHA Gujranwala" }).length, 2);
eq("featured count", L.LISTINGS.filter(b => b.featured).length, 5);
L.LISTINGS.forEach(function (b) {
  t("listing fields " + b.id, b.name.length > 2 && b.address.indexOf("Gujranwala") > -1 && L.validPhone(b.phone) &&
    b.rating >= 1 && b.rating <= 5 && b.reviews > 0 && b.tags.length >= 2 && b.services.length >= 3 && fs.existsSync(path.join(ROOT, b.img)),
    b.name + " · " + b.rating + " · " + b.reviews + " reviews");
  t("hours sane " + b.id, L.DAYS.every(function (d) { var h = L.hoursFor(b, d); return h === null || (h.open >= 0 && h.close > h.open && h.close <= 1440); }));
});

/* --- Search / filter / sort exact counts (combined AND) --- */
eq("no filters = all", L.filterListings({}).length, 18);
eq("search karahi", L.filterListings({ q: "karahi" }).length, 2);
eq("search pharmacy (category label)", L.filterListings({ q: "pharmacy" }).length, 1);
eq("search AC service (tags/services)", L.filterListings({ q: "AC service" }).length, 2);
eq("search satellite (area in haystack)", L.filterListings({ q: "satellite" }).length, 5);
eq("combined food + Satellite Town", L.filterListings({ category: "food", area: "Satellite Town" }).length, 1);
eq("combined food + open now", L.filterListings({ category: "food", openNow: true }).length, 3);
eq("combined salon + open now (Glow closed at boundary)", L.filterListings({ category: "salon", openNow: true }).length, 2);
eq("combined health + open now (2 of 3 closed Sundays)", L.filterListings({ category: "health", openNow: true }).length, 1);
eq("combined empty retail + Civil Lines", L.filterListings({ category: "retail", area: "Civil Lines" }).length, 0);
eq("combined q + category + area", L.filterListings({ q: "karahi", category: "food", area: "People's Colony" }).length, 1);
eq("sort rating first (4.9 Glow)", L.sortListings(L.LISTINGS, "rating")[0].id, "glow-studio");
t("sort rating monotonic", L.sortListings(L.LISTINGS, "rating").every((x, i, a) => i === 0 || a[i - 1].rating >= x.rating));
eq("sort name first", L.sortListings(L.LISTINGS, "name")[0].id, "autoglow");
eq("sort name last", L.sortListings(L.LISTINGS, "name")[17].id, "torque-auto");
t("sort featured: first 5 all featured", L.sortListings(L.LISTINGS, "featured").slice(0, 5).every(b => b.featured));
t("sort featured: rest none featured", L.sortListings(L.LISTINGS, "featured").slice(5).every(b => !b.featured));

/* --- Open-now against the fixed demo clock, boundary pairs (lesson 33) --- */
eq("demo clock is Sunday 14:30", L.DEMO_DAY + " " + L.DEMO_TIME_MIN, "Sunday 870");
eq("open-now count at demo time", L.filterListings({ openNow: true }).length, 12);
const glow = L.getListing("glow-studio");
t("boundary: Glow Sun 2:29 PM (869) = open", L.isOpenAt(glow, "Sunday", 869));
t("boundary: Glow Sun 2:30 PM (870, exactly closing) = closed", !L.isOpenAt(glow, "Sunday", 870));
t("boundary: Glow Sun 10:00 AM (600, exactly opening) = open", L.isOpenAt(glow, "Sunday", 600));
t("boundary: Glow Sun 9:59 AM (599) = closed", !L.isOpenAt(glow, "Sunday", 599));
t("boundary: Glow is closed at the demo instant", !L.isOpenNow(glow));
const cc = L.getListing("city-care");
t("closed-day: City Care Sunday midday = closed", !L.isOpenAt(cc, "Sunday", 700));
t("boundary: City Care Mon at opening 540 = open", L.isOpenAt(cc, "Monday", 540));
t("boundary: City Care Mon at closing 1260 = closed", !L.isOpenAt(cc, "Monday", 1260));
t("midnight close: Neelum Sun 23:59 open, Chargha Sun 23:00 closed",
  L.isOpenAt(L.getListing("neelum-bbq"), "Sunday", 1439) && !L.isOpenAt(L.getListing("chargha-house"), "Sunday", 1380));
eq("hours label Glow Sunday", L.hoursLabel(glow, "Sunday"), "10:00 AM – 2:30 PM");
eq("hours label City Care Sunday", L.hoursLabel(cc, "Sunday"), "Closed");
eq("fmtTime midnight close", L.fmtTime(1440), "12:00 AM (midnight)");

/* --- Enquiry + claim + suggest validation (errors name the constraint) --- */
const goodE = L.validateEnquiry({ name: "Ahmed Raza", phone: "0321 5550199", message: "Do you take walk-ins today?", listingId: "chargha-house" });
eq("valid enquiry -> no errors", Object.keys(goodE).length, 0);
const badE = L.validateEnquiry({ name: "Al", phone: "123", message: "hi", listingId: "chargha-house" });
t("bad enquiry name names constraint", /at least 3 characters/.test(badE.name || ""));
t("bad enquiry phone names constraint", /11 digits starting 03/.test(badE.phone || ""));
t("bad enquiry message names constraint", /at least 10 characters/.test(badE.message || ""));
const goodC = L.validateClaim({ listingId: "chargha-house", name: "Ahmed Raza", role: "owner", phone: "0321 5550199", email: "ahmed@charghahouse.example", proof: "Trade licence in the business name, available to show." });
eq("valid claim -> no errors", Object.keys(goodC).length, 0);
const badC = L.validateClaim({ listingId: "", name: "Al", role: "", phone: "123", email: "nope", proof: "mine" });
t("bad claim listing named", /Choose the listing/.test(badC.listing || ""));
t("bad claim role names options", /owner or manager/.test(badC.role || ""));
t("bad claim email names format", /valid business email/.test(badC.email || ""));
t("bad claim proof names constraint", /at least 10 characters/.test(badC.proof || ""));
const goodS = L.validateSuggest({ bizName: "New Bakery", category: "food", area: "Model Town", phone: "0321 5550199" });
eq("valid suggestion -> no errors", Object.keys(goodS).length, 0);
const badS = L.validateSuggest({ bizName: "X", category: "nope", area: "Lahore", phone: "123" });
t("bad suggestion fields all named", !!(badS.bizName && badS.category && badS.area && badS.phone), JSON.stringify(Object.keys(badS)));
t("phone plain 11 digits ok", L.validPhone("03215550199"));
t("phone with spaces ok", L.validPhone("0321 5550199"));
t("phone +92 rejected (rule is 03 form)", !L.validPhone("+923215550199"));
t("phone 10 digits rejected", !L.validPhone("0321555019"));

/* --- References: format + determinism --- */
const cref = L.makeClaimRef("chargha-house", "Ahmed Raza");
t("claim ref format CL-DEMO-####", /^CL-DEMO-\d{4}$/.test(cref), cref);
eq("claim ref deterministic", L.makeClaimRef("chargha-house", "Ahmed Raza"), cref);
t("suggest ref format CL-DEMO-####", /^CL-DEMO-\d{4}$/.test(L.makeSuggestRef("New Bakery", "03215550199")));
t("enquiry ref format EN-DEMO-####", /^EN-DEMO-\d{4}$/.test(L.makeEnquiryRef("chargha-house", "Ahmed Raza")));
t("refs differ claim vs enquiry namespace", cref !== L.makeEnquiryRef("chargha-house", "Ahmed Raza"));

/* --- Claim-state cross-surface logic (lessons 30/38): one predicate, both surfaces --- */
const claims = [{ ref: cref, type: "claim", listingId: "chargha-house", status: "Pending review (demo)" },
                { ref: "CL-DEMO-0001", type: "new", listingId: "", listingName: "New Bakery", status: "New listing — pending (demo)" }];
t("pending predicate true for claimed listing", L.claimPendingFor(claims, "chargha-house"));
t("pending predicate false for unclaimed listing", !L.claimPendingFor(claims, "chai-khana"));
t("pending predicate ignores new-listing records", !L.claimPendingFor(claims, ""));
t("pending predicate false for empty record set", !L.claimPendingFor([], "chargha-house"));
/* Suggested businesses never enter the public catalogue (honesty rule). */
t("suggested business absent from catalogue", !L.getListing("new-bakery") && L.filterListings({ q: "New Bakery" }).length === 0);

/* --- Persistence round-trip --- */
const sampleClaim = { ref: cref, type: "claim", listingId: "chargha-house", listingName: "Chargha House", status: "Pending review (demo)" };
const rt = JSON.parse(JSON.stringify([sampleClaim]))[0];
t("claim persistence round-trip", rt.ref === cref && rt.status === "Pending review (demo)" && L.claimPendingFor([rt], "chargha-house"));
const sampleEnq = { ref: "EN-DEMO-9068", listingId: "chargha-house", listingName: "Chargha House", message: "Do you take walk-ins today?" };
const rt2 = JSON.parse(JSON.stringify([sampleEnq]))[0];
t("enquiry persistence round-trip", rt2.listingName === "Chargha House" && rt2.message.length >= 10);

/* --- WhatsApp link construction --- */
const wa = L.waLink(L.getListing("chargha-house"));
t("wa link number+business", wa.indexOf("https://wa.me/" + L.WA_NUMBER) === 0 && decodeURIComponent(wa).indexOf("Chargha House") > -1);
t("wa text mentions demo directory", L.waText(L.getListing("chargha-house")).indexOf("DEMO") > -1);

/* --- Contrast from hex (lesson 23): every text pairing >= 4.5, focus >= 3 --- */
function lum(hex) { const h = hex.replace("#", ""); const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(parseInt(h.slice(0, 2), 16)) + 0.7152 * f(parseInt(h.slice(2, 4), 16)) + 0.0722 * f(parseInt(h.slice(4, 6), 16)); }
function cr(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
[["ink on paper", "#191817", "#FAF7EF"], ["ink on card", "#191817", "#FFFFFF"], ["ink on band", "#191817", "#EFE9DB"],
 ["accent on paper", "#0B4F6C", "#FAF7EF"], ["accent on card", "#0B4F6C", "#FFFFFF"], ["accent on band", "#0B4F6C", "#EFE9DB"],
 ["white on accent (buttons)", "#FFFFFF", "#0B4F6C"], ["accent-dark on paper (hover)", "#083C53", "#FAF7EF"],
 ["paper on ink (dark band/footer)", "#FAF7EF", "#191817"], ["muted on paper", "#59524A", "#FAF7EF"],
 ["muted on card", "#59524A", "#FFFFFF"], ["error on paper", "#B3261E", "#FAF7EF"], ["error on card", "#B3261E", "#FFFFFF"]
].forEach(function (p) { const v = cr(p[1], p[2]); t("contrast " + p[0], v >= 4.5, v.toFixed(2) + ":1"); });
t("contrast focus accent on paper >= 3", cr("#0B4F6C", "#FAF7EF") >= 3, cr("#0B4F6C", "#FAF7EF").toFixed(2) + ":1");

/* --- Source checks: DEMO labelling, links, no lorem, no live endpoints, no map embeds --- */
const PAGES = ["index.html", "browse.html", "listing.html", "claim.html", "mine.html", "about.html"];
PAGES.forEach(function (p) {
  const html = fs.readFileSync(path.join(ROOT, p), "utf8");
  t("DEMO labelled " + p, html.indexOf("DEMO") > -1);
  t("title+meta " + p, /<title>[^<]{8,}<\/title>/.test(html) && /name="description"/.test(html));
  const refs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|mailto:|tel:)/.test(u)).map(u => u.split("?")[0])
    .filter(r => !/['+\s]/.test(r)); /* amended: skip JS template fragments from inline scripts (e.g. '<img src="' + c.img) — disclosed in BUILD-NOTES.md */
  t("local refs exist " + p, refs.every(r => fs.existsSync(path.join(ROOT, r))), refs.join(","));
});
const allText = PAGES.map(p => fs.readFileSync(path.join(ROOT, p), "utf8")).join("") +
  fs.readFileSync(path.join(ROOT, "js/logic.js"), "utf8") + fs.readFileSync(path.join(ROOT, "css/style.css"), "utf8");
t("no lorem ipsum anywhere", !/lorem ipsum/i.test(allText));
t("no live analytics endpoints", !/google-analytics|googletagmanager|connect\.facebook/.test(allText));
t("no external map embeds", !/google\.com\/maps|maps\.googleapis|openstreetmap\.org\/export/.test(allText));
t("map placeholder honestly labelled in source", fs.readFileSync(path.join(ROOT, "listing.html"), "utf8").indexOf("Map placeholder — demo") > -1);
L.CATEGORIES.forEach(function (c) { t("category image exists " + c.img, fs.existsSync(path.join(ROOT, c.img))); });
t("hero image exists", fs.existsSync(path.join(ROOT, "assets/hero.jpg")));

/* --- Weight budgets --- */
function sizeOf(p) { return fs.statSync(p).size; }
let codeBytes = 0;
PAGES.forEach(p => codeBytes += sizeOf(path.join(ROOT, p)));
codeBytes += sizeOf(path.join(ROOT, "css/style.css"));
fs.readdirSync(path.join(ROOT, "js")).forEach(f => codeBytes += sizeOf(path.join(ROOT, "js", f)));
t("code < 400 KB", codeBytes < 400 * 1024, codeBytes + " B");
let mediaBytes = 0, maxImg = 0;
fs.readdirSync(path.join(ROOT, "assets")).filter(f => /\.jpg$/.test(f)).forEach(f => { const s = sizeOf(path.join(ROOT, "assets", f)); mediaBytes += s; maxImg = Math.max(maxImg, s); });
t("each image <= 120 KB", maxImg <= 120 * 1024, "max " + maxImg + " B");
t("media total <= 1.6 MB", mediaBytes <= Math.floor(1.6 * 1024 * 1024), mediaBytes + " B total");

lines.push("----");
lines.push("TOTAL: " + pass + " PASS / " + fail + " FAIL");
console.log(lines.join("\n"));
process.exit(fail ? 1 : 0);
