# Assets

The hero, interlude and about images are AI-generated (Higgsfield) and are
loaded from their CDN by URL in `index.html`. This folder is for **self-hosting**
them if you'd rather not depend on the CDN.

## To self-host
Download each image, save it here, and swap the URL in `index.html`:

| Element in `index.html` | Suggested filename |
|---|---|
| `#heroImg` (hero background) | `hero.jpg` |
| `.interlude__img` (full-bleed still) | `interlude.jpg` |
| `#aboutPortrait` (About portrait) | `portrait.jpg` |

Also update the `og:image` meta tag at the top of `index.html`.

## Selected Work
The four project cards use styled gradient placeholders. When you have real
film-still frames, drop them in and set them as the background of each
`.project__media`.
