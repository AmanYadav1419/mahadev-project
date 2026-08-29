import { AppClientWrapper } from "./components/AppClientWrapper";
import { JsonLd } from "./components/JsonLd";
import type { Track } from "./lib/types";
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

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-x-hidden overflow-y-hidden z-0 bg-black">
      <JsonLd playlists={playlists} />
      <AppClientWrapper playlists={playlists} />
    </main>
  );
}
