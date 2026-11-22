/* Gujranwala Gazette Directory — shared DOM helpers (cards, storage, WhatsApp firing log).
   All records live only in the visitor's own localStorage — demo only, nothing is sent anywhere. */
(function () {
  "use strict";
  var L = window.DirLogic;
  function read(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; } }
  function write(key, v) { localStorage.setItem(key, JSON.stringify(v)); }
  window.DIR = {
    claims: function () { return read("ld_claims"); },
    saveClaims: function (c) { write("ld_claims", c); },
    enquiries: function () { return read("ld_enquiries"); },
    saveEnquiries: function (e) { write("ld_enquiries", e); },
    waLog: function () { return read("ld_wa_log"); },
    fireWhatsApp: function (listing) {
      var log = DIR.waLog();
      log.push({ listing: listing.id, listingName: listing.name, at: L.DEMO_DATE_LABEL + " " + L.DEMO_TIME_LABEL, channel: "whatsapp-demo" });
      write("ld_wa_log", log);
      window.open(L.waLink(listing), "_blank", "noopener");
    },
    esc: function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); },
    openBadge: function (b) {
      return L.isOpenNow(b)
        ? '<span class="badge open">Open now</span>'
        : '<span class="badge closed">Closed now</span>';
    },
    cardHTML: function (b) {
      return '<article class="card">' +
        '<img src="' + b.img + '" alt="Photo representing ' + DIR.esc(L.catLabel(b.category)) + ' in Gujranwala — demo photograph" loading="lazy">' +
        '<div class="card-body">' +
        '<div class="meta"><span class="tag">' + DIR.esc(L.catLabel(b.category)) + '</span><span class="tag">' + DIR.esc(b.area) + '</span>' +
        (b.featured ? '<span class="badge feat">Featured</span>' : '') + '</div>' +
        '<h3><a href="listing.html?id=' + b.id + '">' + DIR.esc(b.name) + '</a></h3>' +
        '<div class="rating-row"><span class="rating-big" aria-hidden="true">' + b.rating.toFixed(1) + '</span>' +
        '<span class="rating-side"><span class="stars" aria-label="Rated ' + b.rating + ' out of 5 (demo data)">★ out of 5</span><br>' + b.reviews + ' demo reviews</span>' + DIR.openBadge(b) + '</div>' +
        '<div class="mini-review"><span class="mr-label">Gazette listing note</span><p>' + DIR.esc(b.blurb) + '</p></div>' +
        '<div class="meta"><span>Today: ' + DIR.esc(L.hoursLabel(b, L.DEMO_DAY)) + '</span></div>' +
        '<div class="card-foot"><a class="btn small" href="listing.html?id=' + b.id + '">View listing</a>' +
        '<a class="btn small ghost" href="claim.html?listing=' + b.id + '">Claim this listing</a></div>' +
        '</div></article>';
    }
  };
  document.querySelectorAll("[data-clock]").forEach(function (el) {
    el.textContent = L.DEMO_DATE_LABEL + ", " + L.DEMO_TIME_LABEL;
  });
  document.querySelectorAll("[data-nav-mine]").forEach(function (el) {
    var n = DIR.claims().length + DIR.enquiries().length;
    el.textContent = "My Claims & Enquiries" + (n ? " (" + n + ")" : "");
  });
  // Mobile menu (round-2 fix LD-1): toggle the collapsed nav at <=768px.
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { mainNav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.setAttribute("aria-label", "Open menu"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("open")) { mainNav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.setAttribute("aria-label", "Open menu"); navToggle.focus(); }
    });
  }
})();
