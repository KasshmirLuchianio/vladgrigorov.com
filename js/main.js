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

    /* Hero cinema: pin the frame, dive into the camera's monitor, reveal the
       end card. The still image is the source now — scroll drives a pure GPU
       transform (scale about the monitor's position, set as transform-origin
       in CSS), so the motion is frame-perfect at any scroll speed. The black
       card rises as the dive goes deep, which is also what hides the pixel
       softness at the far end of the zoom. */
    (function heroCinema() {
      var pin = document.getElementById("heroPin");
      var media = document.getElementById("heroMedia");
      if (!pin || !media) return;

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#heroPin", start: "top top", end: "+=320%",
          pin: "#heroPin", scrub: 1, anticipatePin: 1
        }
      });
      tl.to("#heroContent", { opacity: 0, yPercent: -8, ease: "power1.in", duration: 0.16 }, 0)
        .to("#heroScroll", { opacity: 0, duration: 0.08 }, 0)
        /* hard-accelerating dive — reads as flying in, not a flat linear zoom */
        .to("#heroMedia", { scale: 9, ease: "power3.in", duration: 1 }, 0)
        /* a touch of blur at the deep end sells the speed and hides softness */
        .fromTo("#heroImg", { filter: "blur(0px)" },
                { filter: "blur(6px)", ease: "power3.in", duration: 0.45 }, 0.55)
        .to("#heroEndcard", { opacity: 1, ease: "power1.inOut", duration: 0.26 }, 0.62)
        .from(".hero__endcard-inner", { opacity: 0, y: 28, ease: "power2.out", duration: 0.16 }, 0.8);

      /* ---- Zoom-target calibrator ----------------------------------------
         Open the site with ?tune=1 and click directly on the camera's monitor.
         The dive re-targets live and the exact percentages are shown, so the
         focal point can be set by eye instead of guessed. Invisible to normal
         visitors — nothing below runs without the flag. */
      if (!/[?&]tune=1\b/.test(window.location.search)) return;

      var hud = document.createElement("div");
      hud.style.cssText = "position:fixed;left:50%;top:16px;transform:translateX(-50%);" +
        "z-index:9999;background:#000;color:#E8A24C;font:600 14px/1.5 monospace;" +
        "padding:10px 16px;border:1px solid #E8A24C;border-radius:6px;text-align:center;" +
        "pointer-events:none;white-space:pre";
      hud.textContent = "TUNE MODE\nclick the camera monitor";
      document.body.appendChild(hud);

      var dot = document.createElement("div");
      dot.style.cssText = "position:absolute;width:18px;height:18px;margin:-9px 0 0 -9px;" +
        "border:2px solid #E8A24C;border-radius:50%;z-index:9998;pointer-events:none;display:none";
      media.appendChild(dot);

      pin.addEventListener("click", function (e) {
        var r = media.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        media.style.setProperty("--hero-zoom-x", x.toFixed(1) + "%");
        media.style.setProperty("--hero-zoom-y", y.toFixed(1) + "%");
        dot.style.display = "block";
        dot.style.left = x + "%";
        dot.style.top = y + "%";
        hud.textContent = "--hero-zoom-x: " + x.toFixed(1) + "%\n--hero-zoom-y: " + y.toFixed(1) + "%";
      });
    })();

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

  /* ---------- Force autoplay on iOS Safari (never leave a video paused —
     a paused <video> is what triggers WebKit's big native play button) ---------- */
  function initAutoplayVideos() {
    var vids = document.querySelectorAll("video[autoplay]");
    if (!vids.length) return;

    function tryPlayAll() {
      vids.forEach(function (v) {
        if (v.paused) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        }
      });
    }
    tryPlayAll();
    vids.forEach(function (v) {
      v.addEventListener("loadeddata", tryPlayAll);
      v.addEventListener("canplay", tryPlayAll);
      v.addEventListener("pause", function () {
        setTimeout(function () { if (v.paused) tryPlayAll(); }, 50);
      });
    });
    /* iOS can block autoplay entirely (Settings > Safari > Auto-Play: Off) —
       the first touch/scroll/click anywhere is a user gesture that unlocks it. */
    ["touchstart", "scroll", "click"].forEach(function (evt) {
      document.addEventListener(evt, tryPlayAll, { once: true, passive: true });
    });
  }

  /* ---------- Boot ---------- */
  if (document.getElementById("year")) {
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function boot() {
    var lenis = initSmoothScroll();
    wireAnchors(lenis);
    initVideoLightbox(lenis);
    initAutoplayVideos();
    initAnimations();
    if (hasGSAP && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
      /* Booting on DOMContentLoaded (see below) means web fonts may still be
         swapping in when ScrollTrigger first measures the page. A late font
         swap reflows text height and desyncs every pinned/scrubbed position
         computed before it. Re-measure, without blocking anything, once
         fonts actually settle (and once more after full load as a safety
         net for images/video posters affecting layout). */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
      }
      window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
    }
  }

  /* Boot on DOM-ready, not window "load" — "load" waits for every byte of
     every video/image to finish downloading, which can stall the whole site
     behind one large or slow-to-serve file. Videos stream in progressively
     (poster shows immediately) so there is nothing to gain by waiting. */
  function start() { runPreloader(boot); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
