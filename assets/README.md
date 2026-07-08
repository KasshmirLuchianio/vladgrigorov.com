# Assets

Drop your media here — the site wires it up automatically.

| File | Used for | Notes |
|------|----------|-------|
| `vlad-portrait.jpg` | Hero background + About portrait + video poster | Your cinematic green portrait. ~2000px tall, `.jpg`. |
| `vlad-hero.mp4` | Scroll-scrubbed hero animation (optional) | The AI video made from your photo. H.264 `.mp4`, ~6–12s, muted. If missing, the site gracefully keeps the portrait with a Ken Burns zoom. |

## How the hero works
- If `vlad-hero.mp4` loads, its playback is **scrubbed by scroll** — the frame you see is tied to your scroll position through the hero (the "transform on scroll" effect).
- If only `vlad-portrait.jpg` exists, the portrait stays with a subtle parallax zoom.

Nothing else to configure — just add the files with these exact names.
