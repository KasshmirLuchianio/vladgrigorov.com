# vladgrigorov.com

Personal portfolio for **Vlad Grigorov — AI Filmmaker & Director**.

A one-page, cinematic site with a dark neon-green identity (pulled from Vlad's
signature portrait), smooth scrolling, a scroll-scrubbed hero video, and
GSAP-driven reveals. Inspired by the minimalist, typography-led aesthetic of
sites like breedlove.xyz — original design and code.

## Stack
- Plain **HTML / CSS / JS** — no build step, host anywhere (GitHub Pages, Vercel, Netlify).
- [GSAP](https://gsap.com/) + ScrollTrigger for animation.
- [Lenis](https://github.com/studio-freight/lenis) for smooth scroll.
- Google Fonts: Anton (display), Space Grotesk (headings), Inter (body).

## Run locally
Any static server works:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Add your media
See [`assets/README.md`](assets/README.md). In short:
- `assets/vlad-portrait.jpg` — your portrait (required).
- `assets/vlad-hero.mp4` — the AI video for the scroll effect (optional).

## Structure
```
index.html      Markup + all sections
css/style.css   Design system + layout + responsive
js/main.js      Preloader, Lenis, hero scrubbing, reveals
assets/         Your images + video
```

## Sections
Hero · Manifesto · Selected Work · The Craft · About · Contact

Content is placeholder-ready — swap project names, bio, and social links in
`index.html`.
