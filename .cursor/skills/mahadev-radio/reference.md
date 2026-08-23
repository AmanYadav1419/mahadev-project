# Mahadev Radio — reference

## Positioning vs similar live apps

These are **format** references (ambient radio + playlist), not content to copy:

| Site | What they do well | Take for this app |
|------|-------------------|-------------------|
| [busdriver.wtf](https://busdriver.wtf/) | Query-rich title, Hindi H1, MusicPlaylist JSON-LD, keyboard (Space, N/P, Q queue, ←→ seek), OG 1200×630 | Keyboard + in-page queue + bilingual SEO — **Mahadev** keywords only |
| [deluxesaloon.space](https://www.deluxesaloon.space/) | Long unique copy, IST, FAQ-ish story, RadioStation schema, hi-IN + en-IN | Visible story copy + `inLanguage` |
| [corporate-majdoor-seven.vercel.app](https://corporate-majdoor-seven.vercel.app/) | Full-bleed rotating visuals, FAQPage schema, share chrome | Slideshow/video backgrounds (already in `BACKGROUNDS`) |
| [truckdrivermusic.in](https://www.truckdrivermusic.in/) | `max-snippet` / `max-image-preview`, canonical, niche keywords | robots + googleBot preview hints |
| truckpemusic.online | Often behind a bot check — weak crawl | Prefer stable hosting + `robots.txt` + sitemap |

Do not rank for “bus driver playlist” or “truck wala music”.

## `playlist.md` format

```md
## Mahadev Songs
https://youtu.be/xxxxxxxxxxx
https://www.youtube.com/watch?v=xxxxxxxxxxx
```

IDs are 11 `[A-Za-z0-9_-]` chars. Extra `?si=` on youtu.be is stripped via `pathname`.

## Adding video backgrounds

```ts
{ id: "aarti-drone", type: "video", src: "/aarti.mp4", portrait: "/aarti-portrait.mp4", duration: 18 }
```

Mute is required for autoplay. Keep files small; poster-less video is expensive on mobile.

## Known limits

- YT iframe is still in a 1×1 corner node (legacy). YouTube policy prefers a visible player; changing that is a product decision, not a silent tweak.
- Large PNGs in `/public` (`mahadev-landscape.png`, `landscape.png`) hurt LCP; prefer JPEG/WebP in `BACKGROUNDS` when adding art.
- oEmbed can fail at build; client `getVideoData` heals titles.
