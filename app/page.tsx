import { Clock } from "./components/Clock";
import { ClientApp } from "./ClientApp";
import type { Track } from "./lib/types";
import { BackgroundSlideshow } from "./components/BackgroundSlideshow";
import { CreatorCard } from "./components/CreatorCard";
import { JsonLd } from "./components/JsonLd";
import fs from "fs/promises";
import path from "path";

/**
 * SSG parser of playlist URLs mapping to Track primitives.
 */
async function getPlaylists(): Promise<Record<string, Track[]>> {
  const filePath = path.join(process.cwd(), "playlist.md");
  let content = "";
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    return { Mahadev: [] };
  }

  const playlists: Record<string, Track[]> = {};
  let currentPlaylist = "Mahadev";
  playlists[currentPlaylist] = [];

  const lines = content.replace(/\r/g, "").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("##")) {
      currentPlaylist = trimmed.replace("##", "").trim();
      if (!playlists[currentPlaylist]) playlists[currentPlaylist] = [];
    } else if (trimmed.startsWith("http")) {
      let rawId = "";
      try {
        const urlObj = new URL(trimmed);
        if (urlObj.hostname.includes("youtube.com")) {
          rawId = urlObj.searchParams.get("v") || "";
        } else if (urlObj.hostname.includes("youtu.be")) {
          rawId = urlObj.pathname.slice(1);
        }
      } catch {}

      const videoId = rawId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 11);

      if (videoId.length === 11) {
        playlists[currentPlaylist].push({
          id: videoId,
          videoId,
          title: "Connecting...",
          artist: "Mahadev Radio",
          year: new Date().getFullYear(),
          duration: 0,
          url: trimmed,
        } as Track);
      }
    }
  }

  await Promise.all(
    Object.keys(playlists).map(async (playlistKey) => {
      await Promise.all(
        playlists[playlistKey].map(async (track) => {
          try {
            const standardUrl = `https://www.youtube.com/watch?v=${track.videoId}`;
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`,
              {
                next: { revalidate: 3600 },
              },
            );
            if (res.ok) {
              const data = await res.json();
              track.title = data.title;
              track.artist = data.author_name;
            }
          } catch {
            // UI falls back to YouTube player metadata.
          }
        }),
      );
    }),
  );

  Object.keys(playlists).forEach((k) => {
    if (playlists[k].length === 0) delete playlists[k];
  });

  if (Object.keys(playlists).length === 0) {
    playlists["Default"] = [
      {
        id: "1",
        videoId: "jfKfPfyJRdk",
        title: "lofi hip hop radio",
        artist: "Lofi Girl",
        duration: 0,
        year: 2022,
      } as Track,
    ];
  }

  return playlists;
}

export default async function Home() {
  const playlists = await getPlaylists();
  const trackCount = Object.values(playlists).reduce((n, t) => n + t.length, 0);

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-x-hidden overflow-y-hidden z-0 bg-black">
      <JsonLd playlists={playlists} />

      <BackgroundSlideshow />

      <div className="fixed inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/25 to-black/50 pointer-events-none" />

      <div className="fixed inset-0 z-[2] mix-blend-overlay opacity-30 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <header className="fixed top-0 left-0 w-full max-w-[100%] pt-[max(0.85rem,env(safe-area-inset-top))] px-[max(0.85rem,env(safe-area-inset-left))] pr-[max(0.85rem,env(safe-area-inset-right))] sm:pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] flex items-center justify-between pointer-events-none z-30">
        <div className="pointer-events-auto pl-1 sm:pl-2 shrink-0">
          <Clock />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-[max(0.85rem,env(safe-area-inset-top))] sm:top-[max(1.5rem,env(safe-area-inset-top))] w-[min(58vw,16rem)] sm:w-auto text-center pointer-events-none">
          <p className="font-medium text-white/40 text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.3em] uppercase drop-shadow-md">
            Live from Kailash
          </p>
          <h1 className="text-[11px] sm:text-sm font-semibold text-white/85 tracking-wide drop-shadow-md leading-tight">
            महादेव Songs Playlist
          </h1>
        </div>
        <div className="flex items-center justify-end shrink-0 pointer-events-auto">
          <CreatorCard />
        </div>
      </header>

      <div className="flex-1" />

      <div className="w-full max-w-[640px] min-w-0 pb-[max(1rem,env(safe-area-inset-bottom))] px-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] z-10 pointer-events-auto">
        <ClientApp playlists={playlists} />
        <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[11px] leading-relaxed text-white/35 px-2 sm:px-4">
          Free {trackCount}-track Mahadev song playlist — Shiva bhajans, Har Har
          Mahadev, and bhakti radio. Audio plays through YouTube; rights remain
          with the original artists and labels.
        </p>
        {/* SEO copy parked — restore when the player layout needs it
        <section className="mt-4 mb-2 px-4 max-w-xl mx-auto text-white/40 text-[11px] leading-relaxed space-y-2">
          <h2 className="text-center text-[10px] tracking-[0.2em] uppercase text-orange-300/70">
            Mahadev songs &amp; Shiva bhajans
          </h2>
          <p>
            A nonstop Mahadev playlist for darshan at home — Shiva bhajans, Har Har Mahadev tracks,
            and the kindness of Bholenath. Press play; the mix stays on Mahadev’s story, not a generic 90s radio.
          </p>
          <details className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <summary className="cursor-pointer text-white/55">Where can I listen to a Mahadev songs playlist?</summary>
            <p className="mt-2 text-white/35">
              Here — no login. Open the queue (Q) to jump any track. Audio streams through YouTube.
            </p>
          </details>
          <details className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <summary className="cursor-pointer text-white/55">What Mahadev songs are on this radio?</summary>
            <p className="mt-2 text-white/35">
              Shiva bhakti and film bhajans that carry Mahadev’s aura. Use N / P to skip, arrows to seek.
            </p>
          </details>
        </section>
        */}
      </div>
    </main>
  );
}
