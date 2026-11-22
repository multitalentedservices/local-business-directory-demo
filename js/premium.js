/* Premium layer — Gujranwala Gazette Directory, index page ONLY (per-page loading rule).
   Lenis smooth scroll (P2) + GSAP ScrollTrigger (P3), vendored under assets/vendor/.
   Discipline: every effect is applied FROM a visible default (gsap.from), so no-JS and
   reduced-motion visitors get the complete static page; Lenis is never constructed
   under prefers-reduced-motion. The page's ONE signature scroll scene is the editorial
   photo strip scrubbing sideways as the reader scrolls past it. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Static capture mode (?static=1 / data-static): stand down like reduced
     motion — headline whole, photo strip at rest in its band. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute("data-static");
  if (STATIC) document.documentElement.setAttribute("data-static", "");
  if (reduced || STATIC || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("premium-motion");

  /* P2 — Lenis synced to ScrollTrigger on the GSAP ticker (documented pattern). */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Hero composition: masked line-rise headline (800ms, 90ms line stagger — inside the
     plan's 600–1,000ms / 75–120ms craft values), then the search panel settles in. */
  gsap.from(".hero .line-inner", { yPercent: 110, duration: 0.8, ease: "power4.out", stagger: 0.09, delay: 0.05 });
  gsap.from(".hero .searchbox", { y: 26, autoAlpha: 0, duration: 0.7, ease: "power3.out", delay: 0.35 });

  /* P3 — THE signature scene: the picture-desk photo strip scrubs horizontally,
     once, tied to scroll (scrub), as its band crosses the viewport. */
  var inner = document.querySelector(".photo-strip-inner");
  var strip = document.querySelector("[data-photo-strip]");
  if (inner && strip) {
    var dist = function () { return Math.max(0, inner.scrollWidth - strip.clientWidth); };
    gsap.to(inner, {
      x: function () { return -dist(); },
      ease: "none",
      scrollTrigger: { trigger: strip, start: "top 95%", end: "bottom 30%", scrub: 0.6, invalidateOnRefresh: true }
    });
  }
})();
