/* Browse page — filter state lives in THREE surfaces kept in sync (lesson 28):
   the controls, the rendered results/count, and the URL query string. */
(function () {
  "use strict";
  var L = window.DirLogic;
  var qEl = document.querySelector("[data-q]"), catEl = document.querySelector("[data-category]"),
      areaEl = document.querySelector("[data-area]"), openEl = document.querySelector("[data-open]"),
      sortEl = document.querySelector("[data-sort]"), countEl = document.querySelector("[data-count]"),
      resultsEl = document.querySelector("[data-results]"), emptyEl = document.querySelector("[data-empty]"),
      emptyText = document.querySelector("[data-empty-text]");

  catEl.innerHTML = '<option value="all">All categories</option>' + L.CATEGORIES.map(function (c) {
    return '<option value="' + c.id + '">' + c.label + "</option>";
  }).join("");
  areaEl.innerHTML = '<option value="all">All areas</option>' + L.AREAS.map(function (a) {
    return '<option value="' + a + '">' + a + "</option>";
  }).join("");

  function stateFromControls() {
    return { q: qEl.value.trim(), category: catEl.value, area: areaEl.value, openNow: openEl.checked, sort: sortEl.value };
  }
  function stateFromURL() {
    var p = new URLSearchParams(location.search);
    return { q: p.get("q") || "", category: p.get("category") || "all", area: p.get("area") || "all",
             openNow: p.get("open") === "1", sort: p.get("sort") || "featured" };
  }
  function applyToControls(s) {
    qEl.value = s.q; catEl.value = s.category; areaEl.value = s.area; openEl.checked = s.openNow; sortEl.value = s.sort;
  }
  function applyToURL(s) {
    var p = new URLSearchParams();
    if (s.q) p.set("q", s.q);
    if (s.category !== "all") p.set("category", s.category);
    if (s.area !== "all") p.set("area", s.area);
    if (s.openNow) p.set("open", "1");
    if (s.sort !== "featured") p.set("sort", s.sort);
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }
  function describe(s) {
    var parts = [];
    if (s.q) parts.push('search = "' + s.q + '"');
    if (s.category !== "all") parts.push("category = " + L.catLabel(s.category));
    if (s.area !== "all") parts.push("area = " + s.area);
    if (s.openNow) parts.push("open now only (demo clock " + L.DEMO_TIME_LABEL + ")");
    return parts.length ? parts.join(", ") : "no filters";
  }
  /* Animated result count (premium layer): the display numeral tweens to the new
     count with a vanilla rAF tween — Alpine.js was measured OUT of this page's P8
     budget (see premium fragment), so the count is animated with existing JS only.
     The aria-live count line itself is set instantly, never tweened. */
  var countNumEl = document.querySelector("[data-count-num]");
  var shownCount = L.LISTINGS.length, countTween = null;
  function animateCount(to) {
    if (!countNumEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { countNumEl.textContent = to; shownCount = to; return; }
    if (countTween) cancelAnimationFrame(countTween);
    var from = shownCount, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / 320);
      var eased = 1 - Math.pow(1 - p, 3);
      countNumEl.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) countTween = requestAnimationFrame(step); else { shownCount = to; countTween = null; }
    }
    countTween = requestAnimationFrame(step);
  }
  function render() {
    var s = stateFromControls();
    applyToURL(s);
    var list = L.sortListings(L.filterListings(s), s.sort);
    countEl.textContent = "Showing " + list.length + " of " + L.LISTINGS.length + " listings";
    animateCount(list.length);
    resultsEl.innerHTML = list.map(function (b) { return DIR.cardHTML(b); }).join("");
    if (list.length === 0) {
      emptyText.textContent = "Nothing in the directory matches " + describe(s) + ". Try removing one filter, or reset everything below.";
      emptyEl.hidden = false;
    } else { emptyEl.hidden = true; }
  }
  [qEl, catEl, areaEl, openEl, sortEl].forEach(function (el) {
    el.addEventListener("input", render); el.addEventListener("change", render);
  });
  document.querySelector("[data-reset]").addEventListener("click", function () {
    applyToControls({ q: "", category: "all", area: "all", openNow: false, sort: "featured" });
    render();
  });
  applyToControls(stateFromURL());
  render();
})();
