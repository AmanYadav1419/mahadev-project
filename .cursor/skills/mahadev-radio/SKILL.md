---
name: mahadev-radio
description: >-
  Project map and working rules for the Mahadev Radio Next.js app — folder
  structure, playlist/background flow, keyboard player, SEO, and performance.
  Use when changing this repo, adding songs or backgrounds, editing the player,
  or working on Mahadev / Shiva bhakti radio features.
---

# Mahadev Radio

Single-page bhakti radio: YouTube-backed **Mahadev / Shiva** songs over a cinematic Himalayan slideshow. Not a generic 90s highway mix — copy, SEO, and visuals stay on Mahadev’s aura, kindness, and story.

## Stack

- Next.js App Router (see `node_modules/next/dist/docs/`), React 19, Tailwind v4 (`@theme` in `app/globals.css`)
- No UI kit, no global store, no CSS-in-JS
- Audio is **only** the YouTube IFrame API — never re-host tracks or thumbnails

## Folder map

```
playlist.md                 # source of truth for YouTube URLs
app/
  layout.tsx                # metadata, lang en-IN, Analytics
  page.tsx                  # server: parse playlist, oEmbed, shell
  ClientApp.tsx             # player, keyboard, queue
  opengraph-image.tsx       # 1200×630 OG image
  sitemap.ts / robots.ts
  lib/site.ts               # title, description, keywords, getSiteUrl()
  lib/types.ts              # Track
  constants/backgrounds.ts  # BACKGROUNDS slideshow registry
  components/
    BackgroundSlideshow.tsx
    PlaylistPanel.tsx
    JsonLd.tsx
    Clock.tsx               # IST, Asia/Kolkata
public/                     # images/videos referenced by BACKGROUNDS
```

## How playback works

1. `page.tsx` reads `playlist.md`: `## Name` starts a list; lines starting `http` become tracks (`youtu.be` or `youtube.com/watch?v=`).
2. Server hydrates titles via YouTube oEmbed (`revalidate: 3600`). Failures stay `"Connecting..."` until the iframe `getVideoData()`.
3. `ClientApp` boots YT Player on `#yt-player`, cues the first `videoId`.
4. `ENDED` / `onError` → next track. Playlist pills call `switchList` (restart at index 0).

**Add a song:** one URL under the right `##` heading in `playlist.md`. Do not invent copyrighted IDs.

## Backgrounds

Register in `app/constants/backgrounds.ts`, files in `/public`. Two **stable slots** (A/B): the next slide sits at opacity 0 for the full dwell so it is decoded before a 1.6s cubic-bezier fade. Images Ken Burns (`kenburns-a/b/c` in `globals.css`, 22s, GPU `translate3d`). Incoming fade waits for `onLoad` (2.8s grace). Videos: muted, `playsInline`; `duration` unset → loop.

Mobile (`max-width: 639px`) uses `portrait` src **only when that slide sets it** — do not reuse one portrait on every slide or the carousel will look static. `prefers-reduced-motion` disables Ken Burns and shortens fade. Tab hidden → dwell timer pauses.

## Keyboard (Bus Driver–style)

Ignore when focus is in inputs or when Space would activate a button.

| Key | Action |
|-----|--------|
| Space | Play / pause |
| N / P | Next / previous |
| ← / → | Seek ±5s |
| Q | Toggle playlist queue |
| ↑ / ↓ | When queue is open: move highlight |
| Enter | When queue is open: play highlighted track |
| Esc | Close queue |

Playlist UI: list button on the player + `PlaylistPanel` overlay. Click a row to `loadVideoById`.

## SEO rules

Keep targeting **mahadev songs, mahadev playlist, shiva bhajan, har har mahadev, महादेव गाने** — not truck/bus/90s Bollywood keywords from reference sites.

- Titles/descriptions live in `app/lib/site.ts` (single source).
- Visible `<h1>`, crawlable playlist blurb, JSON-LD (`WebSite`, `WebPage`, `MusicPlaylist`, `FAQPage`).
- `metadataBase` from `NEXT_PUBLIC_SITE_URL` or `VERCEL_PROJECT_PRODUCTION_URL`.
- Do not `display:none` keyword blocks (cloaking).

Set `NEXT_PUBLIC_SITE_URL=https://your-domain` in production.

## Performance & UI constraints

- Module-scope subcomponents only (never declare player UI inside `ClientApp` — vinyl/seek remount bug).
- Do not decode every background at once; do not `priority` every `Image`.
- Safe-area insets on header/player. Desktop = glass pill; mobile = stacked card (`hidden sm:flex` / `sm:hidden`).
- Glass recipe: `border-white/10`, gradient white fill, `backdrop-blur-3xl`, inset highlight.
- Accent: saffron `#fb923c` / orange play button.
- Respect existing player behaviour; verify play/pause, skip, seek, playlist switch, queue, slideshow, and mobile layout after changes.

## Extra detail

See [reference.md](reference.md) for competitor notes and extension recipes.
