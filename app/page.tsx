import { Clock } from "./components/Clock";
import { ClientApp, Track } from "./ClientApp";
import fs from "fs/promises";
import path from "path";
import Image from "next/image";

/**
 * Highly optimized, robust SSG parser of playlist URLs mapping to Track primitives.
 */
async function getPlaylists(): Promise<Record<string, Track[]>> {
  const filePath = path.join(process.cwd(), "playlist.md");
  let content = "";
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch (e) {
    return { "Mahadev": [] };
  }

  const playlists: Record<string, Track[]> = {};
  let currentPlaylist = "Mahadev";
  playlists[currentPlaylist] = [];

  const lines = content.replace(/\r/g, '').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('##')) {
      currentPlaylist = trimmed.replace('##', '').trim();
      if (!playlists[currentPlaylist]) playlists[currentPlaylist] = [];
    } else if (trimmed.startsWith('http')) {
      let rawId = "";
      try {
        const urlObj = new URL(trimmed);
        if (urlObj.hostname.includes('youtube.com')) {
          rawId = urlObj.searchParams.get('v') || "";
        } else if (urlObj.hostname.includes('youtu.be')) {
          rawId = urlObj.pathname.slice(1);
        }
      } catch (e) { }

      // Securely strip any strange appended characters (YouTube IDs are strictly 11 standard characters)
      const videoId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

      if (videoId) {
        playlists[currentPlaylist].push({
          id: videoId,
          videoId,
          title: "Connecting...",
          artist: "Mahadev Radio",
          year: new Date().getFullYear(),
          duration: 0,
          url: trimmed
        } as Track);
      }
    }
  }

  // Next.js dynamic parallel fetches to YouTube oEmbed for pre-hydrated track data.
  // Note: Vercel or local builds often fail this due to CORS/ratelimits, hence frontend healing exists.
  await Promise.all(
    Object.keys(playlists).map(async (playlistKey) => {
      await Promise.all(
        playlists[playlistKey].map(async (track, index) => {
          try {
            const standardUrl = `https://www.youtube.com/watch?v=${track.videoId}`;
            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`, {
              // Standard Next15 ISR cache headers
              next: { revalidate: 3600 }
            });
            if (res.ok) {
              const data = await res.json();
              track.title = data.title;
              track.artist = data.author_name;
            }
          } catch (err) {
            // Silently fail during build, UI falls back to YouTube player injection.
          }
        })
      );
    })
  );

  // GC empty playlists
  Object.keys(playlists).forEach(k => {
    if (playlists[k].length === 0) delete playlists[k];
  });

  if (Object.keys(playlists).length === 0) {
    playlists["Default"] = [{ id: '1', videoId: 'jfKfPfyJRdk', title: 'lofi hip hop radio', artist: 'Lofi Girl', duration: 0, year: 2022 } as Track];
  }

  return playlists;
}


export default async function Home() {
  const playlists = await getPlaylists();

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden z-0 bg-black">

      {/* High Performance LCP Visuals */}
      <Image src="/mahadev-landscape.png" alt="Background" fill className="object-cover fixed inset-0 z-0 hidden sm:block pointer-events-none animate-sway opacity-90" priority />
      <Image src="/vertical.png" alt="Background" fill className="object-cover fixed inset-0 z-0 sm:hidden pointer-events-none animate-sway opacity-90" priority />

      {/* Immersive cinematic dimming gradient wrapper */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-t from-black/95 via-black/40 to-black/80 pointer-events-none" />

      {/* Hardware-accelerated Lofi Grain over the cinematic gradient */}
      <div className="fixed inset-0 z-[2] mix-blend-overlay opacity-30 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Ultra minimal ambient header tier */}
      <div className="fixed top-0 left-0 w-full pt-[max(1.5rem,env(safe-area-inset-top))] px-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] flex items-center justify-between pointer-events-none z-10">
        <div className="flex-1 pointer-events-auto pl-2">
          <Clock />
        </div>
        <div className="flex-1 text-center font-medium text-white/40 text-[10px] tracking-[0.3em] uppercase drop-shadow-md">
          • Live From Himalayas
        </div>
        <div className="flex-1 text-right flex items-center justify-end gap-5 pointer-events-auto pr-2 text-[10px] font-medium tracking-widest text-white/50">
          <a href="#" className="hover:text-orange-400 transition-colors">TWITTER</a>
          <a href="#" className="hover:text-orange-400 transition-colors">GITHUB</a>
        </div>
      </div>

      <div className="flex-1" />

      {/* Ambient sleek player anchored deeply */}
      <div className="w-full max-w-[640px] pb-[max(2rem,env(safe-area-inset-bottom))] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] z-10 pointer-events-auto">
        <ClientApp playlists={playlists} />
      </div>
    </main>
  );
}
