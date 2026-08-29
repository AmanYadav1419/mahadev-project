# Mahadev Radio Application - Technical Documentation

## Project Overview
A Next.js 16.3.1 application that provides a devotional music streaming experience featuring Mahadev (Lord Shiva) songs. The app uses YouTube IFrame API for audio playback with a custom glass-morphism UI design.

## Technology Stack
- **Framework**: Next.js 16.3.1 (App Router)
- **UI Library**: React 19.2.8, React DOM 19.2.8
- **Styling**: TailwindCSS v4
- **TypeScript**: v5
- **Analytics**: Vercel Analytics, Vercel Speed Insights

## Project Structure
```
app/
├── ClientApp.tsx          # Main audio player component (client-side)
├── components/
│   ├── BackgroundSlideshow.tsx  # Background image slideshow with Ken Burns effect
│   ├── Clock.tsx                 # Digital clock component
│   ├── CreatorCard.tsx           # Creator profile card
│   ├── JsonLd.tsx                # SEO structured data
│   └── PlaylistPanel.tsx         # Playlist queue panel
├── constants/
│   ├── backgrounds.ts            # Background media configuration
│   └── social.ts                 # Social media links
├── lib/
│   └── types.ts                  # TypeScript type definitions
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
└── page.tsx                      # Main page (server component)
playlist.md                       # Song playlist configuration
public/                           # Static assets (images)
```

## Core Components & Functionality

### 1. Main Page (app/page.tsx)
**Type**: Server Component
**Purpose**: Entry point that parses playlists and renders the UI

**Key Functions**:
- `getPlaylists()`: Parses `playlist.md` to extract YouTube URLs and fetch metadata via YouTube oEmbed API
- Returns structured playlists object with track metadata
- Renders BackgroundSlideshow, header with Clock, and ClientApp

**Data Flow**:
1. Reads playlist.md file
2. Parses YouTube URLs to extract video IDs
3. Fetches metadata from YouTube oEmbed API
4. Passes playlists to ClientApp component

### 2. ClientApp (app/ClientApp.tsx)
**Type**: Client Component
**Purpose**: Main audio player with YouTube IFrame integration

**State Management**:
- `playing`: Playback state
- `duration`: Current track duration
- `listKey`: Current playlist key
- `idx`: Current track index
- `meta`: Runtime metadata from YouTube API
- `queueOpen`: Playlist panel visibility
- `queueFocus`: Keyboard navigation focus

**Key Features**:
- YouTube IFrame API integration for audio playback
- Custom seekbar with time display
- Previous/Next track navigation
- Playlist queue panel with keyboard navigation
- Media Session API for lock-screen controls
- Keyboard shortcuts (Space=play/pause, N/P=next/prev, Q=queue, arrows=seek)
- Vinyl art animation (spinning when playing)

**Components**:
- `VinylArt`: Animated thumbnail with spinning effect
- `Seekbar`: Interactive progress bar
- `TimeLabel`: Current time/duration display
- `Transport`: Play/pause/next/prev buttons

### 3. BackgroundSlideshow (app/components/BackgroundSlideshow.tsx)
**Type**: Client Component
**Purpose**: Cinematic background slideshow with Ken Burns effect

**Features**:
- Dual-slot crossfade animation (2-second fade)
- Ken Burns zoom/pan effects (3 variants)
- Responsive portrait/landscape image switching
- Video support (muted, auto-play)
- Reduced motion support
- Visibility API integration (pauses when tab hidden)

**Configuration**: Uses BACKGROUNDS array from constants/backgrounds.ts

### 4. Playlist System (playlist.md)
**Format**: Markdown with section headers (##)
**Structure**:
```markdown
## Playlist Name
https://youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
```

**Parsing Logic** (in page.tsx):
- Lines starting with "##" define playlist sections
- Lines starting with "http" are YouTube URLs
- Video IDs extracted from URLs (11-character YouTube IDs)
- Metadata fetched via YouTube oEmbed API

### 5. Type Definitions (app/lib/types.ts)
**Track Type**:
```typescript
interface Track {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  year: number;
  duration: number;
  url?: string;
}
```

## UI/UX Design

### Visual Style
- **Theme**: Dark, devotional, saffron/orange accents
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Typography**: Sans-serif with tracking for uppercase text
- **Animations**: Smooth transitions, spinning vinyl art, crossfade backgrounds

### Responsive Design
- **Mobile**: Compact player dock, portrait backgrounds
- **Desktop**: Horizontal pill player, landscape backgrounds
- **Safe Areas**: Supports iOS safe-area-inset

### Color Scheme
- Primary: Orange/Amber gradients (saffron theme)
- Background: Black with gradient overlays
- Text: White with varying opacity levels

## Audio Playback Architecture

### YouTube IFrame API Integration
1. Loads YouTube IFrame API script dynamically
2. Creates hidden YT Player (1x1px off-screen)
3. Uses `loadVideoById()` and `cueVideoById()` for playback control
4. Listens to state changes (PLAYING, PAUSED, ENDED)
5. Auto-advances to next track on END

### Media Session API
- Registers play/pause/next/prev handlers
- Updates metadata (title, artist, artwork)
- Enables lock-screen controls on mobile
- Prevents background tab suspension

## Performance Optimizations

1. **Image Loading**: Next.js Image component with lazy loading
2. **Background Slideshow**: Dual-slot preloading to prevent flicker
3. **State Management**: Ref-based snapshots to avoid closure staleness
4. **Keyboard Handling**: Efficient event delegation
5. **Metadata Fetching**: Server-side with revalidation (3600s)

## Keyboard Shortcuts
- `Space`: Play/Pause
- `N`: Next track
- `P`: Previous track
- `Q`: Toggle playlist queue
- `Arrow Left/Right`: Seek -5s/+5s
- `Arrow Up/Down`: Navigate queue (when open)
- `Enter`: Select track (when queue open)
- `Escape`: Close queue

## Current Playlist Structure
- **Mahadev Songs**: 26 tracks of Shiva bhajans and devotional songs
- **Ganpati Bappa Songs**: 8 tracks of Ganpati aartis (newly added)

## Important Implementation Notes

### ClientApp State Initialization
- `listKey` is initialized to the first playlist key
- YouTube Player is created once on mount
- State updates use ref snapshots to avoid stale closures

### Background Slideshow Timing
- Default slide duration: 12 seconds
- Crossfade duration: 2 seconds (0 with reduced motion)
- Pauses when document is hidden

### Playlist Panel
- Opens with keyboard shortcut Q or button click
- Supports full keyboard navigation
- Shows current track with highlight
- Auto-focuses on current track when opened

## Error Handling
- YouTube errors automatically skip to next track
- oEmbed fetch failures fall back to "Connecting..." placeholder
- Missing playlists fall back to default lofi track
- Image load errors skip to next background

## SEO Features
- JsonLd structured data for playlists
- OpenGraph image generation
- Robots.txt and sitemap generation
- Semantic HTML structure

## Build & Deployment
- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Start**: `npm run start`
- **Lint**: `npm run lint`

## Browser Compatibility
- Modern browsers with ES6+ support
- YouTube IFrame API required
- Media Session API (mobile Chrome/Android)
- CSS backdrop-filter (glass morphism)
