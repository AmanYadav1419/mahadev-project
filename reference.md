Build me a single-page nostalgia music site in Next.js.

## Stack
- Next.js, App Router, TypeScript, `app/` at the project root (no `src/`)
- Tailwind CSS v4 using `@theme` tokens in `app/globals.css` (no tailwind.config)
- Dependencies: next, react, react-dom, @vercel/analytics, @vercel/speed-insights
- No CSS-in-JS, no component library, no state manager

## Assets I will provide
- `landscape.png`  (landscape)
- `vertical.png`  (portrait — separately composed, not a crop)

## Page layout — app/page.tsx (server component)
`<main>` is `relative flex min-h-dvh flex-1 flex-col items-center justify-between
overflow-hidden`, containing:
1. Fixed background div, `-z-20`, class `hero-bg`, `bg-cover bg-center`. In CSS, set the
   background to `scene-wide.png`, and swap to `scene-tall.png` inside
   `@media (orientation: portrait)`. Overlay a `bg-gradient-to-b from-black/35 via-transparent to-black/80`.
2. Fixed grain overlay, `-z-10`: an inline SVG `feTurbulence` data-URI, `mix-blend-mode: overlay`, `opacity: 0.3`.
3. Fixed top row: clock top-left, listener count top-centre, social links top-right.
4. The player, bottom-anchored, `max-w-xl`.
All four fixed corners must use `max(1rem, env(safe-area-inset-*))` and the viewport
export must set `viewportFit: "cover"`.

## The player — this is the centrepiece
A floating glass pill on desktop, a stacked card on mobile. Two separate blocks
(`hidden sm:flex` / `sm:hidden`), not one reflowing layout.

Glass recipe (a flat white/10 fill reads as a grey slab, not glass):
  border border-white/10
  bg-gradient-to-b from-white/[0.15] to-white/[0.055]
  backdrop-blur-3xl backdrop-saturate-[1.7]
  shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)

DESKTOP — one horizontal pill, `rounded-full p-3 pr-5`, left to right:
- A spinning vinyl: the cover art in a circle, 80px, `animation: spin 8s linear
  infinite`, with `animationPlayState` set to `running`/`paused` from playback
  state. Absolutely centre a 12px `bg-black/70 ring-2 ring-white/40` circle on top
  as the spindle hole.
- Title (15px semibold) and artist (12.5px white/70), both `truncate`.
- A seek bar under them: 24px invisible hit area, 3px visible rail `bg-white/15
  fill in the accent colour with a soft glow, knob visible on hover only.
- Elapsed / duration in 10.5px tabular-nums.
- Transport on the right: prev, play/pause, next.

MOBILE — a `rounded-[26px]` card:
  row 1: 64px vinyl + title/artist
  row 2: full-width seek bar
  row 3: elapsed/duration on the left, transport centred, 44px minimum targets
Play button is a 52px circle, `bg-gradient-to-b` in the accent colour with
`ring-1 ring-white/25` and a coloured drop shadow.

## How the music plays
There are no audio files. Load the YouTube IFrame Player API and drive it.

- IMPORTANT — only include songs I have the right to use, or that stream from
  the rights holder's own YouTube upload with embedding enabled. Do not
  suggest, search for or add copyrighted tracks on my behalf. If I ask you to
  add something you believe is copyrighted, warn me before you add it.
  
- Each track is `{ id, title, artist, film, year, duration, videoId }`.
  Adding a song must be a one-line change.
- Group tracks into 2–3 playlists. Same engine, different arrays; switching
  playlist restarts at track 1.
- **Render the player visibly** — put the iframe in the artwork slot rather than a
  static thumbnail. Do NOT hide it in a 1px/opacity-0 container: that breaks
  YouTube's Developer Policies (no background players, no separating audio from
  video) and it traps listeners on unskippable ads, because the Skip button is
  inside the player they cannot see.
- `onStateChange`: PLAYING/PAUSED drive the UI, ENDED advances the track.
- `onError`: videos get deleted or have embedding switched off AFTER you ship.
  Skip to the next track automatically and fire an analytics event with the cod
  and videoId.


## Clock
`Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric",
minute: "2-digit", hour12: true })`, ticking every second, with the colon blink
via `@keyframes blink { 50% { opacity: 0 } }`.

## Gotchas — please get these right the first time
- Define sub-components at MODULE scope, never inside the parent component.
  Declared inside, they get a new function identity each render, React remounts
  the subtree, and the vinyl's CSS animation restarts from 0deg on every progre
  tick (~2.5×/second).
- Do NOT download or re-host YouTube thumbnails onto my domain. The visible
  player displays the artwork itself, and copying label images is a separate
  infringement from the music. If I ever ask for cached covers anyway, keep
  the source 16:9 and display it in `aspect-video` — square-cropping a 16:9
  thumbnail throws away the sides and then crops it again.
- Cover art: keep the source 16:9 and display it in `aspect-video`. Square-cropping
  a 16:9 thumbnail throws away the sides and then crops it again.
- `next/image` inside a flex column gets stretched by `align-items: stretch` — add
  `self-start` or an explicit width.
- Use `onPointerDown` for seeking, not `onClick`, and add `touch-none` so dragging
  doesn't scroll the page.
- Never gate the play button behind a `canplay` event — iOS Safari won't fire it
  before a user gesture and the button stays dead forever.
