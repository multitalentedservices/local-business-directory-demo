/* My Claims & Enquiries — reads the SAME local records the listing and claim pages
   write (lessons 30/38 cross-surface proof surface). */
(function () {
  "use strict";
  var L = window.DirLogic;
  var claims = DIR.claims(), enquiries = DIR.enquiries();
  var cWrap = document.querySelector("[data-claims]");
  if (!claims.length) { document.querySelector("[data-claims-empty]").hidden = false; }
  cWrap.innerHTML = claims.map(function (c) {
    var title = c.type === "new"
      ? DIR.esc(c.listingName) + ' <span class="badge pending">New listing — pending (demo)</span>'
      : '<a href="listing.html?id=' + c.listingId + '">' + DIR.esc(c.listingName) + '</a> <span class="badge pending">' + DIR.esc(c.status) + "</span>";
    var detail = c.type === "new"
      ? DIR.esc(L.catLabel(c.category)) + " · " + DIR.esc(c.area) + " · " + DIR.esc(c.phone)
      : "Claimed by " + DIR.esc(c.name) + " (" + DIR.esc(c.role) + ") · " + DIR.esc(c.email) + " · " + DIR.esc(c.phone);
    return '<article class="record"><h3>' + title + '</h3><p style="margin:0">Reference <strong>' + DIR.esc(c.ref) + "</strong> · " + detail + " · Recorded " + DIR.esc(c.at) + " (demo).</p></article>";
  }).join("");

  var eWrap = document.querySelector("[data-enquiries]");
  if (!enquiries.length) { document.querySelector("[data-enquiries-empty]").hidden = false; }
  eWrap.innerHTML = enquiries.map(function (e) {
    return '<article class="record"><h3><a href="listing.html?id=' + e.listingId + '">' + DIR.esc(e.listingName) + '</a> <span class="badge open">' + DIR.esc(e.status) + '</span></h3>' +
      '<p style="margin:0 0 6px">Reference <strong>' + DIR.esc(e.ref) + "</strong> · From " + DIR.esc(e.name) + " · " + DIR.esc(e.at) + " (demo).</p>" +
      '<p style="margin:0">“' + DIR.esc(e.message) + "”</p></article>";
  }).join("");

  document.querySelector("[data-log-summary]").textContent =
    "On this device: " + claims.length + " claim record(s), " + enquiries.length + " enquiry record(s), " +
    DIR.waLog().length + " WhatsApp click(s) recorded in the demo log.";
})();
