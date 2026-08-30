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
    var lastTrigger = null;
    if (!modal || !frame) return;

    function open(id, isShort, label, trigger) {
      lastTrigger = trigger || null;
      frame.src = "https://www.youtube-nocookie.com/embed/" + id +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      frame.title = label || "Video player";
      modal.classList.toggle("is-short", !!isShort);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis && lenis.stop) lenis.stop();
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      frame.src = "";
      frame.title = "Video player";
      document.body.style.overflow = "";
      if (lenis && lenis.start) lenis.start();
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    }

    document.querySelectorAll("[data-yt]").forEach(function (el) {
      function go(e) {
        e.preventDefault();
        open(el.getAttribute("data-yt"), el.hasAttribute("data-short"), el.getAttribute("aria-label"), el);
      }
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

    /* Hero cinema: a held frame with a slow drift, three narrative beats, and
       a fade to black. Deliberately NOT a fake camera move — scaling a still
       has no parallax and no perspective, so pretending to fly into the
       monitor always read as unfinished. A steady Ken Burns drift is honest
       about being a photograph and lands as an intentional held shot. The
       filmed push-in comes back when the hero is a real clip again. */
    (function heroCinema() {
      var pin = document.getElementById("heroPin");
      if (!pin) return;

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#heroPin", start: "top top", end: "+=540%",
          pin: "#heroPin", scrub: 1, anticipatePin: 1
        }
      });
      tl.to("#heroContent", { opacity: 0, yPercent: -8, ease: "power1.in", duration: 0.10 }, 0)
        .to("#heroScroll", { opacity: 0, duration: 0.06 }, 0)
        /* steady, unaccelerated drift — a held shot breathing, not a zoom */
        .to("#heroMedia", { scale: 1.22, ease: "none", duration: 1 }, 0);

      /* Narrative beats play like title cards over the held frame. Each line
         rises out of its own mask on a stagger, holds long enough to be read,
         then leaves the same way it arrived.

         Transform and opacity only, in BOTH directions. The previous version
         animated `filter: blur()` on the way in and on the way out — blur is
         not GPU-composited, so every scroll frame forced a full repaint (the
         stutter), and because it eased slowly the type spent most of its
         entrance *and* its exit genuinely out of focus (the washed-out look).
         The beat container now holds a flat opacity while it is on screen;
         only the masked lines move. */
      var BEAT_IN = [0.11, 0.37, 0.63];
      gsap.utils.toArray("[data-beat]").forEach(function (beat, i) {
        var IN = BEAT_IN[i];
        var OUT = IN + 0.155;
        var lines = beat.querySelectorAll("[data-mask]");

        /* The container fade only carries the scrim behind the type — it is
           finished before the first line starts moving and doesn't begin
           again until the last line has left, so no glyph is ever animated
           at partial opacity. */
        tl.fromTo(beat, { opacity: 0 },
                  { opacity: 1, ease: "none", duration: 0.03 }, IN - 0.03)
          .fromTo(lines,
                  { yPercent: 130 },
                  { yPercent: 0, ease: "power3.out", duration: 0.06, stagger: 0.015 }, IN)
          /* Exit mirrors the entrance: same distance, same stagger, eased in
             rather than snapped, so the line leaves the frame instead of
             blinking off it. */
          .to(lines, { yPercent: -130, ease: "power2.in", duration: 0.055, stagger: 0.015 }, OUT)
          .to(beat, { opacity: 0, ease: "none", duration: 0.03 }, OUT + 0.085);
      });

      /* Chapter rail: fades in with the first beat, each segment filling as
         its beat plays, so the sequence reads as three deliberate chapters. */
      tl.to("#heroRail", { opacity: 1, ease: "power2.out", duration: 0.04 }, BEAT_IN[0]);
      gsap.utils.toArray("#heroRail i").forEach(function (fill, i) {
        tl.to(fill, { scaleY: 1, ease: "none", duration: 0.2 }, BEAT_IN[i]);
      });
      tl.to("#heroRail", { opacity: 0, ease: "power2.in", duration: 0.04 }, 0.84);

      /* Slow dissolve to black, then the closing card — a sequence ending on
         a title card, rather than a zoom that had to stop somewhere. */
      tl.to("#heroEndcard", { opacity: 1, ease: "power1.inOut", duration: 0.14 }, 0.85)
        .from(".hero__endcard-inner", { opacity: 0, y: 30, ease: "power3.out", duration: 0.07 }, 0.93);
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
  /* ---------- Keep ambient clips inline and untouchable ---------- */
  /* The interlude clip is scenery, not a player. Opening the site from a
     TikTok or Instagram link puts the visitor in an in-app webview, and there
     - as on iOS Safari - a <video> that starts playing can be handed straight
     to the system player full screen. That drops the visitor out of the page
     into a fullscreen video with no obvious way back, which is exactly what
     was happening.

     Attributes alone do not settle it. After a dynamic load() some engines
     only honour the IDL properties, so both get set, before any play() call.
     And when a player opens anyway, webkitbeginfullscreen fires - that is the
     one moment we can push back, so we do. */
  function lockVideoInline(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    if ("disableRemotePlayback" in video) video.disableRemotePlayback = true;

    function bounce() {
      if (video.webkitExitFullscreen) {
        video.webkitExitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(function () {});
      }
    }

    /* iOS fires this the instant the native player takes over. */
    video.addEventListener("webkitbeginfullscreen", bounce);
    ["fullscreenchange", "webkitfullscreenchange"].forEach(function (evt) {
      document.addEventListener(evt, function () {
        var active = document.fullscreenElement || document.webkitFullscreenElement;
        if (active === video) bounce();
      });
    });
  }

  function initInlineVideoLock() {
    document.querySelectorAll("video[data-ambient]").forEach(lockVideoInline);
  }

  /* ---------- Defer off-screen video downloads ---------- */
  /* The interlude clip sits a full viewport below the fold but is served from
     the same origin as the hero image, so preloading it competes with the LCP
     image for the same connection. Its <source> ships as data-src and only
     becomes a real src as the section approaches the viewport, and the poster
     frame - another full-size file on that same origin - waits with it. The
     section is decorative and sits on a near-black background, so the worst
     case while it arrives is the background colour it already has. */
  function initDeferredVideoSources() {
    var sources = document.querySelectorAll("video source[data-src]");
    if (!sources.length) return;

    function attach(video) {
      lockVideoInline(video);
      var poster = video.getAttribute("data-poster");
      if (poster) { video.poster = poster; video.removeAttribute("data-poster"); }
      video.querySelectorAll("source[data-src]").forEach(function (s) {
        s.src = s.getAttribute("data-src");
        s.removeAttribute("data-src");
      });
      video.load();
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }

    var videos = [];
    sources.forEach(function (s) {
      if (videos.indexOf(s.parentNode) === -1) videos.push(s.parentNode);
    });

    if (!("IntersectionObserver" in window)) { videos.forEach(attach); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        attach(entry.target);
      });
    }, { rootMargin: "200px 0px" });
    videos.forEach(function (v) { io.observe(v); });
  }

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
    initInlineVideoLock();
    initDeferredVideoSources();
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
