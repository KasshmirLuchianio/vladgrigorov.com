/* ============================================================
   Vlad Grigorov — AI Filmmaker
   Smooth scroll + scroll-scrubbed hero + reveals (GSAP)
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const countEl = document.getElementById("preloaderCount");
  document.body.classList.add("is-loading");

  function runPreloader(done) {
    if (reduceMotion) { finish(); return; }
    let n = 0;
    const tick = setInterval(() => {
      n += Math.floor(Math.random() * 8) + 3;
      if (n >= 100) { n = 100; clearInterval(tick); setTimeout(finish, 250); }
      if (countEl) countEl.textContent = String(n).padStart(2, "0");
    }, 90);
    function finish() {
      preloader.style.transition = "opacity .7s ease, transform .9s cubic-bezier(.22,1,.36,1)";
      preloader.style.opacity = "0";
      preloader.style.transform = "translateY(-20px)";
      setTimeout(() => { preloader.style.display = "none"; document.body.classList.remove("is-loading"); done(); }, 700);
    }
  }

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  function initLenis() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Anchor links via Lenis ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.3 });
        else target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ---------- Hero: real video vs. portrait fallback ---------- */
  function initHero() {
    const media = document.getElementById("heroMedia");
    const video = document.getElementById("heroVideo");
    if (!video) return;

    // Detect whether the mp4 actually loads; otherwise keep the portrait.
    let hasVideo = false;
    video.addEventListener("loadeddata", () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        hasVideo = true;
        media.classList.add("has-video");
        setupScrub();
      }
    });
    video.addEventListener("error", () => { /* stay on portrait */ });

    // Ken Burns on the portrait fallback (only if no video)
    if (!reduceMotion && window.gsap) {
      gsap.to("#heroFallback", {
        scale: 1.18, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    // Scroll-scrub the video's currentTime across the hero height
    function setupScrub() {
      if (reduceMotion || !window.ScrollTrigger) { video.play().catch(() => {}); return; }
      video.pause();
      const st = ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          if (video.duration) video.currentTime = video.duration * self.progress;
        }
      });
      void st;
    }
  }

  /* ---------- Generic reveals ---------- */
  function initReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if (reduceMotion) {
      gsap.set("[data-reveal]", { autoAlpha: 1, y: 0 });
      return;
    }

    // Hero lines
    gsap.from(".hero [data-reveal]", {
      y: 60, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.1
    });

    // Section reveals
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.from(el, {
        y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // Projects
    gsap.utils.toArray("[data-project]").forEach((el) => {
      gsap.from(el, {
        y: 70, autoAlpha: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    // Craft rows
    gsap.utils.toArray("[data-craft]").forEach((el) => {
      gsap.from(el, {
        xPercent: -3, autoAlpha: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" }
      });
    });

    // Manifesto word-by-word
    const words = gsap.utils.toArray(".manifesto__text [data-word]");
    if (words.length) {
      gsap.to(words, {
        opacity: 1, ease: "none", stagger: 0.4,
        scrollTrigger: { trigger: ".manifesto", start: "top 70%", end: "bottom 65%", scrub: true }
      });
    }
  }

  /* ---------- Nav: hide-on-scroll ---------- */
  function initNav() {
    const nav = document.getElementById("nav");
    if (!nav || !window.ScrollTrigger) return;
    ScrollTrigger.create({
      start: "top -80", end: 99999,
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 200) nav.style.transform = "translateY(-120%)";
        else nav.style.transform = "translateY(0)";
      }
    });
    nav.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
  }

  /* ---------- Misc ---------- */
  function initMisc() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  window.addEventListener("load", () => {
    runPreloader(() => {
      initLenis();
      initAnchors();
      initHero();
      initReveals();
      initNav();
      initMisc();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
})();
