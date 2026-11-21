/* Gujranwala Gazette Directory — shared pure logic (site + Node test battery, lesson 13).
   DEMO data only: every business, rating, review count, phone and address below is fictional.
   Fixed demo clock (lesson 29): "now" in this demo is Sunday 22 November 2026, 2:30 PM,
   printed on every page, so open/closed state is deterministic and testable. */
(function (root) {
  "use strict";

  var DEMO_DAY = "Sunday";
  var DEMO_DATE_LABEL = "Sunday 22 November 2026";
  var DEMO_TIME_MIN = 14 * 60 + 30; /* 2:30 PM */
  var DEMO_TIME_LABEL = "2:30 PM";
  var WA_NUMBER = "923001234567"; /* demo number, labelled DEMO in the UI */

  var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  var CATEGORIES = [
    { id: "food", label: "Restaurants & Cafés", img: "assets/cat-food.jpg" },
    { id: "salon", label: "Salons & Barbers", img: "assets/cat-salon.jpg" },
    { id: "health", label: "Clinics & Pharmacies", img: "assets/cat-health.jpg" },
    { id: "auto", label: "Auto Services", img: "assets/cat-auto.jpg" },
    { id: "home", label: "Home Services", img: "assets/cat-home.jpg" },
    { id: "retail", label: "Retail & Shops", img: "assets/cat-retail.jpg" }
  ];
  var AREAS = ["Satellite Town", "Model Town", "Civil Lines", "People's Colony", "DHA Gujranwala"];

  function catLabel(id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].label; return id; }
  function catImg(id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].img; return "assets/hero.jpg"; }

  /* hours: open/close in minutes from midnight, applied Mon–Sat unless the day is in
     closedDays; sunOpen/sunClose override Sunday when present. close 1440 = midnight. */
  function L(id, name, category, area, address, phone, rating, reviews, open, close, closedDays, tags, services, featured, sunHours, blurb) {
    return { id: id, name: name, category: category, area: area, address: address, phone: phone,
      rating: rating, reviews: reviews, open: open, close: close, closedDays: closedDays || [],
      tags: tags, services: services, featured: !!featured, sunHours: sunHours || null, blurb: blurb,
      img: catImg(category) };
  }

  var LISTINGS = [
    L("chargha-house", "Chargha House", "food", "Satellite Town", "14-B Main Boulevard, Satellite Town, Gujranwala (demo address)", "0321 5550141", 4.8, 214, 660, 1380, [], ["Family seating", "Takeaway", "Desi grill"], ["Steam chargha", "Chicken karahi", "Malai boti", "Family platters"], true, null, "Whole chargha, karahi and barbecue from a Satellite Town kitchen that fills up by maghrib."),
    L("chai-khana", "Chai Khana", "food", "Model Town", "7 Link Road, Model Town, Gujranwala (demo address)", "0333 5550142", 4.6, 168, 480, 1380, [], ["Outdoor seating", "Doodh patti", "Late breakfast"], ["Doodh patti chai", "Parathas", "Club sandwiches", "Kashmiri chai"], false, null, "A slow-morning tea house for doodh patti, parathas and long conversations."),
    L("neelum-bbq", "Neelum BBQ & Karahi", "food", "People's Colony", "22 People's Colony Road, Gujranwala (demo address)", "0300 5550143", 4.5, 302, 720, 1440, [], ["Open late", "BBQ", "Family hall"], ["Seekh kebab", "Mutton karahi", "Roghni naan", "Live BBQ counter"], true, null, "Charcoal barbecue and karahi served until midnight on People's Colony Road."),
    L("gents-cut", "The Gents Cut", "salon", "Civil Lines", "3 Civil Lines, near Session Courts, Gujranwala (demo address)", "0322 5550144", 4.7, 189, 600, 1260, [], ["Walk-ins", "Beard styling"], ["Haircut", "Beard trim & shaping", "Hair colour", "Head massage"], true, null, "A tidy Civil Lines barbershop for cuts, beard work and walk-in trims."),
    L("glow-studio", "Glow Studio Salon", "salon", "Satellite Town", "9-C Satellite Town, Gujranwala (demo address)", "0334 5550145", 4.9, 256, 600, 1200, [], ["By appointment", "Bridal"], ["Facials", "Hair treatment", "Manicure & pedicure", "Bridal packages"], false, [600, 870], "A Satellite Town studio salon for facials, hair care and bridal mornings. Sunday hours are shorter: 10:00 AM – 2:30 PM."),
    L("barber-bros", "Barber Bros", "salon", "Model Town", "51 Model Town Main, Gujranwala (demo address)", "0301 5550146", 4.4, 98, 540, 1320, [], ["Walk-ins", "Kids cuts"], ["Haircut", "Shave", "Kids haircut", "Hair styling"], false, null, "No-fuss Model Town barbers — quick cuts, honest prices, no appointment needed."),
    L("sehat-plus", "Sehat Plus Pharmacy", "health", "Model Town", "18 Model City Road, Gujranwala (demo address)", "0323 5550147", 4.6, 143, 480, 1440, [], ["Home delivery", "Open late"], ["Prescription medicines", "Home delivery", "Blood-pressure check", "Baby & mother care"], false, null, "A Model Town pharmacy with home delivery and a free blood-pressure check at the counter."),
    L("city-care", "City Care Clinic", "health", "Satellite Town", "30 Satellite Town, Gujranwala (demo address)", "0332 5550148", 4.5, 211, 540, 1260, ["Sunday"], ["General physician", "By appointment"], ["General consultation", "Diabetes screening", "Vaccination", "Minor procedures"], false, null, "A family clinic for general consultations and screening. Closed on Sundays."),
    L("dental-art", "Dental Art Studio", "health", "Civil Lines", "11 Civil Lines, Gujranwala (demo address)", "0302 5550149", 4.8, 87, 600, 1200, ["Sunday"], ["Dentist", "By appointment"], ["Dental check-up", "Scaling & polish", "Fillings", "Braces consultation"], false, null, "Gentle dentistry in Civil Lines — check-ups, scaling and braces advice. Closed on Sundays."),
    L("torque-auto", "Torque Auto Workshop", "auto", "People's Colony", "88 GT Road, People's Colony, Gujranwala (demo address)", "0324 5550150", 4.7, 176, 540, 1140, ["Sunday"], ["Computer diagnostics", "AC service"], ["Engine diagnostics", "Brake service", "Car AC service", "Suspension work"], true, null, "A GT Road workshop with computer diagnostics and same-day brake work. Closed on Sundays."),
    L("quickfix-tyres", "QuickFix Tyres & Oil", "auto", "DHA Gujranwala", "5 DHA Main Boulevard, Gujranwala (demo address)", "0331 5550151", 4.3, 64, 510, 1230, [], ["Drive-in", "Wheel alignment"], ["Tyre change", "Engine oil change", "Wheel alignment", "Battery check"], false, null, "Drive-in tyres, oil and alignment on the DHA boulevard — in and out in under an hour."),
    L("autoglow", "AutoGlow Detailing", "auto", "Satellite Town", "16 Satellite Town, Gujranwala (demo address)", "0303 5550152", 4.6, 121, 600, 1260, [], ["Ceramic coating", "By appointment"], ["Full wash & wax", "Interior detailing", "Ceramic coating", "Headlight restoration"], false, null, "Detailing and ceramic coating for cars that have survived a Gujranwala summer."),
    L("fixit-home", "FixIt Plumbers & Electricians", "home", "Model Town", "Based in Model Town — serves all Gujranwala (demo)", "0325 5550153", 4.5, 233, 480, 1200, [], ["Same-day visits", "Emergency call-out"], ["Plumbing repairs", "Electrical wiring", "Water motor install", "Leak detection"], false, null, "Plumbers and electricians on same-day call-out across the city, based in Model Town."),
    L("coolair-ac", "CoolAir AC Services", "home", "Civil Lines", "Based in Civil Lines — serves all Gujranwala (demo)", "0335 5550154", 4.4, 157, 540, 1140, ["Sunday"], ["AC install", "Gas refill"], ["AC installation", "AC general service", "Gas refill", "AC repair"], false, null, "AC installation, service and gas refill before the heat arrives. Closed on Sundays."),
    L("paint-polish", "Paint & Polish Home Services", "home", "DHA Gujranwala", "Based in DHA Gujranwala — serves nearby areas (demo)", "0304 5550155", 4.7, 92, 540, 1080, ["Sunday"], ["Free estimate", "By appointment"], ["Interior painting", "Exterior painting", "Wood polish", "Waterproofing"], false, null, "Painters and polishers for DHA homes, with a free written estimate. Closed on Sundays."),
    L("khaddar-house", "Khaddar House", "retail", "Satellite Town", "27 Satellite Town Market, Gujranwala (demo address)", "0326 5550156", 4.8, 278, 600, 1320, [], ["Fabric by the metre", "Stitching"], ["Khaddar suits", "Lawn & cotton", "Stitching service", "Shawls"], true, null, "Fabric and ready-to-wear in Satellite Town market — khaddar season is its busiest."),
    L("mobile-zone", "Mobile Zone", "retail", "People's Colony", "40 People's Colony Bazaar, Gujranwala (demo address)", "0336 5550157", 4.3, 190, 630, 1290, [], ["Repairs", "Easyload & packages"], ["New & used phones", "Phone repairs", "Accessories", "Easyload & SIMs"], false, null, "Phones, repairs and accessories in People's Colony bazaar."),
    L("fresh-mart", "Fresh Mart Grocery", "retail", "Model Town", "2 Model Town, Gujranwala (demo address)", "0305 5550158", 4.6, 324, 420, 1380, [], ["Home delivery", "Fresh produce"], ["Fresh vegetables & fruit", "Dairy & bakery", "Household essentials", "Home delivery"], false, null, "A Model Town grocery for daily essentials and fresh produce, open from 7 in the morning.")
  ];

  function getListing(id) { for (var i = 0; i < LISTINGS.length; i++) if (LISTINGS[i].id === id) return LISTINGS[i]; return null; }
  function hashStr(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }

  /* Hours for one named day: {open, close} in minutes, or null when closed that day. */
  function hoursFor(listing, dayName) {
    if (listing.closedDays.indexOf(dayName) > -1) return null;
    if (dayName === "Sunday" && listing.sunHours) return { open: listing.sunHours[0], close: listing.sunHours[1] };
    return { open: listing.open, close: listing.close };
  }

  /* Open-now rule (stated in the UI): open when demo time is at or after opening and
     strictly before closing — exactly at closing time the business is CLOSED. */
  function isOpenAt(listing, dayName, minutes) {
    var h = hoursFor(listing, dayName);
    if (!h) return false;
    return minutes >= h.open && minutes < h.close;
  }
  function isOpenNow(listing) { return isOpenAt(listing, DEMO_DAY, DEMO_TIME_MIN); }

  function fmtTime(mins) {
    if (mins === 1440) return "12:00 AM (midnight)";
    var h = Math.floor(mins / 60), m = mins % 60, ap = h >= 12 ? "PM" : "AM", h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  function hoursLabel(listing, dayName) {
    var h = hoursFor(listing, dayName);
    return h ? fmtTime(h.open) + " – " + fmtTime(h.close) : "Closed";
  }

  function filterListings(f) {
    f = f || {};
    return LISTINGS.filter(function (b) {
      if (f.category && f.category !== "all" && b.category !== f.category) return false;
      if (f.area && f.area !== "all" && b.area !== f.area) return false;
      if (f.openNow && !isOpenNow(b)) return false;
      if (f.q) {
        var hay = (b.name + " " + catLabel(b.category) + " " + b.area + " " + b.tags.join(" ") + " " + b.services.join(" ")).toLowerCase();
        if (hay.indexOf(String(f.q).toLowerCase().trim()) === -1) return false;
      }
      return true;
    });
  }

  function sortListings(list, sort) {
    var out = list.slice();
    if (sort === "rating") out.sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
    else if (sort === "name") out.sort(function (a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
    else out.sort(function (a, b) { return (b.featured - a.featured) || (b.rating - a.rating); }); /* featured */
    return out;
  }

  function normalizePhone(p) { return String(p || "").replace(/[\s-]/g, ""); }
  function validPhone(p) { return /^03\d{9}$/.test(normalizePhone(p)); }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "").trim()); }

  /* Validation messages NAME the constraint (lesson 25). */
  function validateEnquiry(v) {
    var errs = {};
    if (!v.name || v.name.trim().length < 3) errs.name = "Enter your full name (at least 3 characters).";
    if (!validPhone(v.phone)) errs.phone = "Enter a Pakistani mobile number with 11 digits starting 03, for example 0321 1234567.";
    if (!v.message || v.message.trim().length < 10) errs.message = "Write a message of at least 10 characters so the business knows what you need.";
    if (!v.listingId || !getListing(v.listingId)) errs.listing = "Choose a business to enquire about.";
    return errs;
  }
  function validateClaim(v) {
    var errs = {};
    if (!v.listingId || !getListing(v.listingId)) errs.listing = "Choose the listing you are claiming.";
    if (!v.name || v.name.trim().length < 3) errs.name = "Enter the claimant's full name (at least 3 characters).";
    if (v.role !== "owner" && v.role !== "manager") errs.role = "Choose your role: owner or manager of the business.";
    if (!validPhone(v.phone)) errs.phone = "Enter a Pakistani mobile number with 11 digits starting 03, for example 0321 1234567.";
    if (!validEmail(v.email)) errs.email = "Enter a valid business email address, for example name@business.com.";
    if (!v.proof || v.proof.trim().length < 10) errs.proof = "Describe your proof of connection in at least 10 characters, for example a utility bill or trade licence in the business name.";
    return errs;
  }
  function validateSuggest(v) {
    var errs = {};
    if (!v.bizName || v.bizName.trim().length < 3) errs.bizName = "Enter the business name (at least 3 characters).";
    if (!v.category || !catLabel(v.category) || CATEGORIES.every(function (c) { return c.id !== v.category; })) errs.category = "Choose the category that fits the business.";
    if (!v.area || AREAS.indexOf(v.area) === -1) errs.area = "Choose the area of Gujranwala where the business is.";
    if (!validPhone(v.phone)) errs.phone = "Enter a Pakistani mobile number with 11 digits starting 03, for example 0321 1234567.";
    return errs;
  }

  /* Deterministic-style references (same inputs -> same ref). */
  function makeClaimRef(listingId, name) {
    return "CL-DEMO-" + (1000 + (hashStr("claim|" + listingId + "|" + String(name || "").trim().toLowerCase()) % 9000));
  }
  function makeSuggestRef(bizName, phone) {
    return "CL-DEMO-" + (1000 + (hashStr("new|" + String(bizName || "").trim().toLowerCase() + "|" + normalizePhone(phone)) % 9000));
  }
  function makeEnquiryRef(listingId, name) {
    return "EN-DEMO-" + (1000 + (hashStr("enq|" + listingId + "|" + String(name || "").trim().toLowerCase()) % 9000));
  }

  /* Claim state is ONE logic-owned record (lesson 38): both the detail-page badge
     predicate and the My Claims view read this same function over the same list. */
  function claimPendingFor(claims, listingId) {
    return (claims || []).some(function (c) { return c.type === "claim" && c.listingId === listingId && c.status === "Pending review (demo)"; });
  }

  function waLink(listing) {
    var text = "Hello " + listing.name + " (via the Gujranwala Gazette Directory DEMO), I found your listing and would like to ask about: ";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }
  function waText(listing) { return decodeURIComponent(waLink(listing).split("text=")[1]); }

  var api = {
    DEMO_DAY: DEMO_DAY, DEMO_DATE_LABEL: DEMO_DATE_LABEL, DEMO_TIME_MIN: DEMO_TIME_MIN, DEMO_TIME_LABEL: DEMO_TIME_LABEL,
    WA_NUMBER: WA_NUMBER, DAYS: DAYS, CATEGORIES: CATEGORIES, AREAS: AREAS, LISTINGS: LISTINGS,
    catLabel: catLabel, catImg: catImg, getListing: getListing, hashStr: hashStr,
    hoursFor: hoursFor, isOpenAt: isOpenAt, isOpenNow: isOpenNow, fmtTime: fmtTime, hoursLabel: hoursLabel,
    filterListings: filterListings, sortListings: sortListings,
    normalizePhone: normalizePhone, validPhone: validPhone, validEmail: validEmail,
    validateEnquiry: validateEnquiry, validateClaim: validateClaim, validateSuggest: validateSuggest,
    makeClaimRef: makeClaimRef, makeSuggestRef: makeSuggestRef, makeEnquiryRef: makeEnquiryRef,
    claimPendingFor: claimPendingFor, waLink: waLink, waText: waText
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DirLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
