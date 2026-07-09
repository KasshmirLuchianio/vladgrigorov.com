/* ============================================================
   Vlad Grigorov — AI Filmmaker
   Lenis smooth scroll bridged to GSAP ScrollTrigger.
   Graceful if the CDN libs fail: the site stays readable.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  document.documentElement.style.scrollBehavior = "auto";

  /* ---------- Preloader (counts up, then reveals) ---------- */
  function runPreloader(done) {
    var el = document.getElementById("preloader");
    var count = document.getElementById("preloaderCount");
    document.body.classList.add("is-loading");
    if (!el || !count) { document.body.classList.remove("is-loading"); done(); return; }

    var n = 0;
    var tick = setInterval(function () {
      n += Math.floor(Math.random() * 11) + 4;
      if (n >= 100) { n = 100; clearInterval(tick); }
      count.textContent = n < 10 ? "0" + n : String(n);
      if (n === 100) {
        setTimeout(function () {
          el.style.transition = "opacity .6s ease, transform .8s cubic-bezier(.22,1,.36,1)";
          el.style.opacity = "0";
          el.style.transform = "translateY(-2%)";
          setTimeout(function () {
            el.style.display = "none";
            document.body.classList.remove("is-loading");
            done();
          }, 650);
        }, 250);
      }
    }, 90);
  }

  /* ---------- Lenis smooth scroll bridged to GSAP ---------- */
  function initSmoothScroll() {
    if (reduce || !hasLenis) return null;
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
    return lenis;
  }

  /* ---------- Anchor links through Lenis ---------- */
  function wireAnchors(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.2 });
        else target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ---------- Video lightbox (YouTube) ---------- */
  function initVideoLightbox(lenis) {
    var modal = document.getElementById("videoModal");
    var frame = document.getElementById("videoFrame");
    var closeBtn = document.getElementById("videoClose");
    if (!modal || !frame) return;

    function open(id, isShort) {
      frame.src = "https://www.youtube-nocookie.com/embed/" + id +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      modal.classList.toggle("is-short", !!isShort);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis && lenis.stop) lenis.stop();
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      frame.src = "";
      document.body.style.overflow = "";
      if (lenis && lenis.start) lenis.start();
    }

    document.querySelectorAll("[data-yt]").forEach(function (el) {
      function go(e) { e.preventDefault(); open(el.getAttribute("data-yt"), el.hasAttribute("data-short")); }
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(e); }
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.classList.contains("vm__backdrop")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ---------- Animations ---------- */
  function initAnimations() {
    if (reduce || !hasGSAP || !window.ScrollTrigger) return;
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    /* Hero title lines build ON MOUNT (screenshot-safe) */
    gsap.from(".hero [data-reveal]", {
      yPercent: 115, opacity: 0, duration: 1.1, ease: "power4.out",
      stagger: 0.09, delay: 0.15
    });

    /* Hero image parallax + scale as you scroll past it */
    gsap.to("#heroImg", {
      yPercent: 16, scale: 1.16, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* Interlude still: slow parallax drift (transform only) */
    gsap.to(".interlude__img", {
      yPercent: -12, ease: "none",
      scrollTrigger: { trigger: ".interlude", start: "top bottom", end: "bottom top", scrub: true }
    });

    /* Manifesto: words light up across the scroll */
    var words = gsap.utils.toArray(".manifesto__text [data-word]");
    if (words.length) {
      gsap.to(words, {
        opacity: 1, ease: "none", stagger: 0.5,
        scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 60%", scrub: true }
      });
    }

    /* Generic reveals (transform only — never opacity-to-zero gated) */
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) return;
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    /* Project cards rise in, staggered per grid */
    gsap.utils.toArray(".work__grid").forEach(function (grid) {
      gsap.from(grid.querySelectorAll("[data-project]"), {
        y: 60, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: grid, start: "top 82%" }
      });
    });

    /* Craft rows slide in */
    gsap.from("[data-craft]", {
      x: -30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: ".craft__list", start: "top 80%" }
    });

    /* Nav appears after hero */
    gsap.from("#nav", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.4 });
  }

  /* ---------- Boot ---------- */
  if (document.getElementById("year")) {
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function boot() {
    var lenis = initSmoothScroll();
    wireAnchors(lenis);
    initVideoLightbox(lenis);
    initAnimations();
    if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  window.addEventListener("load", function () { runPreloader(boot); });
})();
