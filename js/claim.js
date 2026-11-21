/* Claim + suggest forms — validation names the constraint (lesson 25), errors clear
   live (lesson 7), submissions write the ONE claims record read by every surface. */
(function () {
  "use strict";
  var L = window.DirLogic;
  var form = document.querySelector("[data-claim]");
  var listingEl = form.querySelector("[data-listing]"), nameEl = form.querySelector("[data-cname]"),
      roleEl = form.querySelector("[data-role]"), phoneEl = form.querySelector("[data-cphone]"),
      emailEl = form.querySelector("[data-cemail]"), proofEl = form.querySelector("[data-proof]");
  listingEl.innerHTML = '<option value="">Choose the listing…</option>' + L.LISTINGS.map(function (b) {
    return '<option value="' + b.id + '">' + DIR.esc(b.name) + " — " + DIR.esc(b.area) + "</option>";
  }).join("");
  var pre = new URLSearchParams(location.search).get("listing");
  if (pre && L.getListing(pre)) listingEl.value = pre;

  function values() { return { listingId: listingEl.value, name: nameEl.value, role: roleEl.value, phone: phoneEl.value, email: emailEl.value, proof: proofEl.value }; }
  function showErrors(errs) {
    form.querySelectorAll("[data-error-for]").forEach(function (el) { el.textContent = errs[el.getAttribute("data-error-for")] || ""; });
  }
  [listingEl, nameEl, roleEl, phoneEl, emailEl, proofEl].forEach(function (el) {
    el.addEventListener("input", function () { showErrors(L.validateClaim(values())); });
    el.addEventListener("change", function () { showErrors(L.validateClaim(values())); });
  });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = values(), errs = L.validateClaim(v);
    showErrors(errs);
    if (Object.keys(errs).length) return;
    var b = L.getListing(v.listingId);
    var ref = L.makeClaimRef(v.listingId, v.name);
    var claims = DIR.claims();
    claims.push({ ref: ref, type: "claim", listingId: v.listingId, listingName: b.name, name: v.name.trim(),
                  role: v.role, phone: L.normalizePhone(v.phone), email: v.email.trim(),
                  status: "Pending review (demo)", at: L.DEMO_DATE_LABEL });
    DIR.saveClaims(claims);
    document.querySelector("[data-claim-ref]").textContent = ref;
    document.querySelector("[data-claim-confirmation]").textContent =
      "Thank you, " + v.name.trim() + ". Your claim for " + b.name + " is recorded as Pending review (demo). " +
      "Open the listing page and you will see its Claim pending (demo) badge; the claim is also listed under My Claims.";
    document.querySelector("[data-claim-listing-link]").href = "listing.html?id=" + b.id;
    document.querySelector("[data-claim-confirmation-box]").hidden = false;
    form.reset();
    listingEl.value = "";
  });

  /* Suggest-a-listing — lands in My Claims only; never enters the public catalogue. */
  var sform = document.querySelector("[data-suggest]");
  var sName = sform.querySelector("[data-sname]"), sCat = sform.querySelector("[data-scat]"),
      sArea = sform.querySelector("[data-sarea]"), sPhone = sform.querySelector("[data-sphone]");
  sCat.innerHTML = '<option value="">Choose a category…</option>' + L.CATEGORIES.map(function (c) {
    return '<option value="' + c.id + '">' + c.label + "</option>";
  }).join("");
  sArea.innerHTML = '<option value="">Choose an area…</option>' + L.AREAS.map(function (a) {
    return '<option value="' + a + '">' + a + "</option>";
  }).join("");
  function sValues() { return { bizName: sName.value, category: sCat.value, area: sArea.value, phone: sPhone.value }; }
  function showSErrors(errs) {
    sform.querySelectorAll("[data-serror-for]").forEach(function (el) { el.textContent = errs[el.getAttribute("data-serror-for")] || ""; });
  }
  [sName, sCat, sArea, sPhone].forEach(function (el) {
    el.addEventListener("input", function () { showSErrors(L.validateSuggest(sValues())); });
    el.addEventListener("change", function () { showSErrors(L.validateSuggest(sValues())); });
  });
  sform.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = sValues(), errs = L.validateSuggest(v);
    showSErrors(errs);
    if (Object.keys(errs).length) return;
    var ref = L.makeSuggestRef(v.bizName, v.phone);
    var claims = DIR.claims();
    claims.push({ ref: ref, type: "new", listingId: "", listingName: v.bizName.trim(), name: v.bizName.trim(),
                  category: v.category, area: v.area, phone: L.normalizePhone(v.phone),
                  status: "New listing — pending (demo)", at: L.DEMO_DATE_LABEL });
    DIR.saveClaims(claims);
    document.querySelector("[data-suggest-ref]").textContent = ref;
    document.querySelector("[data-suggest-confirmation]").textContent =
      v.bizName.trim() + " was recorded as New listing — pending (demo) under My Claims. It has not been published: " +
      "unreviewed businesses never appear in the public directory from a form.";
    document.querySelector("[data-suggest-confirmation-box]").hidden = false;
    sform.reset();
  });
})();
