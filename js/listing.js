/* Listing detail — renders one listing from ?id=, proves claim state cross-surface
   (the pending badge reads the SAME logic-owned claim record as My Claims, lesson 38),
   and records enquiries + WhatsApp firings locally. */
(function () {
  "use strict";
  var L = window.DirLogic;
  var id = new URLSearchParams(location.search).get("id");
  var b = id ? L.getListing(id) : null;
  if (!b) {
    document.querySelector("[data-notfound]").hidden = false;
    document.querySelector("[data-found]").hidden = true;
    return;
  }
  document.title = b.name + " — Gujranwala Gazette Directory (Demo)";
  document.querySelector("[data-meta]").innerHTML =
    '<span class="tag">' + DIR.esc(L.catLabel(b.category)) + '</span><span class="tag">' + DIR.esc(b.area) + "</span>" +
    (b.featured ? '<span class="badge feat">Featured</span>' : "");
  document.querySelector("[data-name]").textContent = b.name;
  var stars = document.querySelector("[data-stars]");
  stars.textContent = "★ " + b.rating.toFixed(1);
  stars.setAttribute("aria-label", "Rated " + b.rating + " out of 5 (demo data)");
  document.querySelector("[data-reviews]").textContent = b.reviews + " demo reviews (fictional)";
  document.querySelector("[data-openbadge]").innerHTML = DIR.openBadge(b);
  document.querySelector("[data-blurb]").textContent = b.blurb;
  document.querySelector("[data-address]").textContent = b.address;
  document.querySelector("[data-phone]").textContent = b.phone;
  document.querySelector("[data-phone-link]").href = "tel:+92" + L.normalizePhone(b.phone).slice(1);
  var img = document.querySelector("[data-img]");
  img.src = b.img;
  img.alt = "Photo representing " + L.catLabel(b.category) + " in Gujranwala — demo photograph for " + b.name;
  document.querySelector("[data-claim-link]").href = "claim.html?listing=" + b.id;
  document.querySelector("[data-map-name]").textContent = b.name;
  document.querySelector("[data-map-area]").textContent = b.area + ", Gujranwala (demo location)";

  /* Cross-surface claim badge: predicate from logic.js over the shared claims record. */
  function renderClaimBadge() {
    var pending = L.claimPendingFor(DIR.claims(), b.id);
    document.querySelector("[data-claim-badge]").innerHTML =
      pending ? '<span class="badge pending">Claim pending (demo)</span>' : "";
  }
  renderClaimBadge();

  document.querySelector("[data-services]").innerHTML = b.services.map(function (s) { return "<li>" + DIR.esc(s) + "</li>"; }).join("");
  document.querySelector("[data-tags]").innerHTML = b.tags.map(function (t) { return '<span class="tag">' + DIR.esc(t) + "</span>"; }).join("");
  document.querySelector("[data-hours]").innerHTML =
    "<tr><th>Day</th><th>Hours</th></tr>" + L.DAYS.map(function (d) {
      return '<tr' + (d === L.DEMO_DAY ? ' class="today"' : "") + "><td>" + d + (d === L.DEMO_DAY ? " (today, demo)" : "") + "</td><td>" + L.hoursLabel(b, d) + "</td></tr>";
    }).join("");

  document.querySelector("[data-wa]").addEventListener("click", function () { DIR.fireWhatsApp(b); });

  /* Enquiry form — named-constraint errors (lesson 25), live clearing (lesson 7). */
  var form = document.querySelector("[data-enquiry]");
  var nameIn = form.querySelector("[data-name-input]"), phoneIn = form.querySelector("[data-phone-input]"), msgIn = form.querySelector("[data-message-input]");
  function values() { return { name: nameIn.value, phone: phoneIn.value, message: msgIn.value, listingId: b.id }; }
  function showErrors(errs) {
    form.querySelectorAll("[data-error-for]").forEach(function (el) {
      el.textContent = errs[el.getAttribute("data-error-for")] || "";
    });
  }
  [nameIn, phoneIn, msgIn].forEach(function (el) {
    el.addEventListener("input", function () { showErrors(L.validateEnquiry(values())); });
  });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = values(), errs = L.validateEnquiry(v);
    showErrors(errs);
    if (Object.keys(errs).length) return;
    var ref = L.makeEnquiryRef(b.id, v.name);
    var list = DIR.enquiries();
    list.push({ ref: ref, listingId: b.id, listingName: b.name, name: v.name.trim(), phone: L.normalizePhone(v.phone),
                message: v.message.trim(), status: "Sent (demo)", at: L.DEMO_DATE_LABEL });
    DIR.saveEnquiries(list);
    var box = document.querySelector("[data-confirmation-box]");
    document.querySelector("[data-confirmation]").textContent =
      "Thank you, " + v.name.trim() + ". Your enquiry to " + b.name + " was recorded with reference " + ref +
      " and is listed under My Claims & Enquiries. This is a demo — no message was sent to any real business.";
    box.hidden = false;
    box.setAttribute("data-confirmation-box", "");
    form.reset();
  });
})();
