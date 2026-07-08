# vladgrigorov.com

Personal portfolio for **Vlad Grigorov — AI Filmmaker & Director**.

A one-page, cinematic site. Concept: **"the screening room"** — deep black,
projector-beam amber, teal shadow (a palette matched to Vlad's AI-generated
on-set photography). Smooth scrolling, a scroll-driven hero with parallax, and
GSAP-driven reveals.

## Stack
- Plain **HTML / CSS / JS** — no build step, host anywhere (GitHub Pages, Vercel, Netlify, Cloudflare Pages).
- [GSAP](https://gsap.com/) + ScrollTrigger for animation.
- [Lenis](https://github.com/studio-freight/lenis) for smooth scroll.
- Google Fonts: Anton (display), Space Grotesk (headings), Inter (body).

## Run locally
Any static server works:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Images
The hero, interlude and about portrait are AI-generated (Higgsfield) and are
currently loaded from their CDN by URL. To self-host them, download the files
into `assets/` and swap the URLs in `index.html` (`#heroImg`, `.interlude__img`,
`#aboutPortrait`) and the `og:image` meta tag.

## Structure
```
index.html      Markup + all sections + copy
css/style.css   Design system (palette tokens at top) + layout + responsive
js/main.js      Preloader, Lenis, hero parallax, reveals
assets/         Optional self-hosted media
```

## Sections
Hero · Manifesto · Selected Work · The Craft · About · Contact

## Customise
- **Social links** — replace the `#` hrefs in the Contact section.
- **Selected Work** — the four cards use styled gradient placeholders; drop in
  real film-still images when ready.
- **Copy / stats** — all inline in `index.html`.
