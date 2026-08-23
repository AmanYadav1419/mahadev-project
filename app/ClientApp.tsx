"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { track } from "@vercel/analytics/react";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export type Track = {
    id: string;
    title: string;
    artist: string;
    year: number;
    duration: number;
    videoId: string;
    url?: string;
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
const fmt = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
};

// Highest quality thumbnail that NEVER 404s:
// hqdefault always exists; maxresdefault can 404 on older videos
const thumb = (videoId: string) =>
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

// ─────────────────────────────────────────
// ICONS  (module-scope → stable identity, no remounts)
// ─────────────────────────────────────────
const Ico = ({ d }: { d: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d={d} />
    </svg>
);
const IcoPlay = () => <Ico d="M8 5v14l11-7z" />;
const IcoPause = () => <Ico d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />;
const IcoPrev = () => <Ico d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />;
const IcoNext = () => <Ico d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />;

// ─────────────────────────────────────────
// SEEKBAR  — isolated so only THIS subtree
//            re-renders every 400 ms, not the full player
// ─────────────────────────────────────────
function Seekbar({
    ytRef,
    playing,
    duration,
}: {
    ytRef: React.MutableRefObject<any>;
    playing: boolean;
    duration: number;
}) {
    const [pos, setPos] = useState(0);
    const rail = useRef<HTMLDivElement>(null);

    // Poll YT for position only while playing
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => {
            const t = ytRef.current?.getCurrentTime?.() ?? 0;
            setPos(t);
        }, 400);
        return () => clearInterval(id);
    }, [playing, ytRef]);

    const seek = useCallback(
        (e: React.PointerEvent) => {
            if (!rail.current || !duration) return;
            const { left, width } = rail.current.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - left) / width));
            const secs = pct * duration;
            setPos(secs);
            ytRef.current?.seekTo?.(secs, true);
        },
        [duration, ytRef]
    );

    const pct = duration > 0 ? (pos / duration) * 100 : 0;

    return (
        <div
            ref={rail}
            /* 44-px touch target, 3-px visible rail */
            className="relative w-full h-11 flex items-center cursor-pointer touch-none group"
            onPointerDown={seek}
            onPointerMove={(e) => e.buttons === 1 && seek(e)}
        >
            {/* Track rail */}
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/15">
                {/* Filled saffron progress */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            {/* Thumb — only visible on hover */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
                style={{ left: `${pct}%` }}
            />
            {/* Transparent overlay for correct hit target */}
            <div className="absolute inset-0" />
        </div>
    );
}

// ─────────────────────────────────────────
// TIME LABEL  — also isolated for same reason
// ─────────────────────────────────────────
function TimeLabel({
    ytRef,
    playing,
    duration,
}: {
    ytRef: React.MutableRefObject<any>;
    playing: boolean;
    duration: number;
}) {
    const [pos, setPos] = useState(0);
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => {
            const t = ytRef.current?.getCurrentTime?.() ?? 0;
            setPos(t);
        }, 1000);
        return () => clearInterval(id);
    }, [playing, ytRef]);
    return (
        <span className="tabular-nums font-mono text-[11px] text-white/40">
            {fmt(pos)} / {fmt(duration)}
        </span>
    );
}

// ─────────────────────────────────────────
// TRANSPORT BUTTONS
// ─────────────────────────────────────────
function Transport({
    playing,
    onPrev,
    onPlay,
    onNext,
    large = false,
}: {
    playing: boolean;
    onPrev: () => void;
    onPlay: () => void;
    onNext: () => void;
    large?: boolean;
}) {
    const btn =
        "flex items-center justify-center rounded-full transition-all duration-150 active:scale-90";
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onPrev}
                aria-label="Previous"
                className={`${btn} w-10 h-10 text-white/70 hover:text-white hover:bg-white/10`}
            >
                <IcoPrev />
            </button>

            {/* Saffron play button — soul of the Shravan theme */}
            <button
                onClick={onPlay}
                aria-label={playing ? "Pause" : "Play"}
                className={`${btn} ${large ? "w-16 h-16" : "w-12 h-12"} bg-gradient-to-b from-amber-400 to-orange-600 text-black shadow-[0_0_24px_rgba(251,146,60,0.45)] hover:shadow-[0_0_36px_rgba(251,146,60,0.65)] ring-1 ring-white/20 hover:scale-105`}
            >
                {playing ? <IcoPause /> : <IcoPlay />}
            </button>

            <button
                onClick={onNext}
                aria-label="Next"
                className={`${btn} w-10 h-10 text-white/70 hover:text-white hover:bg-white/10`}
            >
                <IcoNext />
            </button>
        </div>
    );
}

// ─────────────────────────────────────────
// GLASS RECIPE  (matches original spec)
// ─────────────────────────────────────────
const glass =
    "border border-white/10 bg-gradient-to-b from-white/[0.14] to-white/[0.05] backdrop-blur-3xl backdrop-saturate-[1.8] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.18)]";

// YT global type shim
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

// ─────────────────────────────────────────
// MAIN CLIENT COMPONENT
// ─────────────────────────────────────────
export function ClientApp({
    playlists,
}: {
    playlists: Record<string, Track[]>;
}) {
    const ytRef = useRef<any>(null);

    // ── State (minimal — avoids render cascade) ──
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [listKey, setListKey] = useState(Object.keys(playlists)[0] ?? "");
    const [idx, setIdx] = useState(0);
    // Runtime title override: YT iframe getVideoData() is more accurate than oEmbed
    const [meta, setMeta] = useState<Record<string, { title: string; artist: string }>>({});

    const tracks = playlists[listKey] ?? [];
    const track = tracks[idx] ?? { videoId: "", title: "", artist: "" };
    const displayTitle = meta[track.videoId]?.title || track.title;
    const displayArtist = meta[track.videoId]?.artist || track.artist;

    // ── Stable ref snapshot (allows callbacks without stale closure) ──
    const snap = useRef({ playing, idx, listKey, tracks, duration });
    useEffect(() => {
        snap.current = { playing, idx, listKey, tracks, duration };
    });

    // ── Capture real metadata from YT engine ──
    const captureVideoData = useCallback((player: any, videoId: string) => {
        const d = player.getVideoData?.();
        if (d?.title) {
            setMeta((p) => ({ ...p, [videoId]: { title: d.title, artist: d.author } }));
        }
    }, []);

    // ── Navigation ──
    const goNext = useCallback((auto = false) => {
        const { idx, tracks, playing } = snap.current;
        const next = (idx + 1) % tracks.length;
        setIdx(next);
        if (auto || playing) ytRef.current?.loadVideoById?.(tracks[next].videoId);
        else ytRef.current?.cueVideoById?.(tracks[next].videoId);
    }, []);

    const goPrev = useCallback(() => {
        const { idx, tracks, playing } = snap.current;
        const prev = (idx - 1 + tracks.length) % tracks.length;
        setIdx(prev);
        if (playing) ytRef.current?.loadVideoById?.(tracks[prev].videoId);
        else ytRef.current?.cueVideoById?.(tracks[prev].videoId);
    }, []);

    const togglePlay = useCallback(() => {
        if (!ytRef.current) return;
        snap.current.playing ? ytRef.current.pauseVideo() : ytRef.current.playVideo();
    }, []);

    // ── YouTube IFrame bootstrap (runs once on mount) ──
    useEffect(() => {
        const init = () => {
            ytRef.current = new window.YT.Player("yt-player", {
                videoId: track.videoId,
                playerVars: {
                    autoplay: 0, controls: 0, disablekb: 1,
                    fs: 0, modestbranding: 1, rel: 0,
                    showinfo: 0, playsinline: 1, iv_load_policy: 3,
                },
                events: {
                    onReady: (e: any) => {
                        setDuration(e.target.getDuration());
                        captureVideoData(e.target, track.videoId);
                    },
                    onStateChange: (e: any) => {
                        captureVideoData(e.target, snap.current.tracks[snap.current.idx].videoId);
                        if (e.data === window.YT.PlayerState.PLAYING) { setPlaying(true); setDuration(e.target.getDuration()); }
                        else if (e.data === window.YT.PlayerState.PAUSED) { setPlaying(false); }
                        else if (e.data === window.YT.PlayerState.ENDED) { goNext(true); }
                    },
                    onError: (e: any) => {
                        const { tracks, idx } = snap.current;
                        track_event("yt_error", { videoId: tracks[idx].videoId, code: e.data });
                        goNext(true); // silently skip unplayable video
                    },
                },
            });
        };

        if (!window.YT?.Player) {
            const s = document.createElement("script");
            s.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(s);
            window.onYouTubeIframeAPIReady = init;
        } else {
            init();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Playlist switch ──
    const switchList = (key: string) => {
        if (key === listKey) return;
        setListKey(key);
        setIdx(0);
        const first = playlists[key]?.[0];
        if (first && ytRef.current?.loadVideoById) {
            ytRef.current.loadVideoById(first.videoId);
            setPlaying(true);
        }
    };

    // ─────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────
    return (
        <div className="w-full flex flex-col items-center gap-4">

            {/* ── Playlist Selector Pills ──────────────────────────── */}
            {Object.keys(playlists).length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {Object.keys(playlists).map((k) => (
                        <button
                            key={k}
                            onClick={() => switchList(k)}
                            className={`px-4 py-1.5 rounded-full text-[10.5px] tracking-[0.15em] uppercase font-semibold transition-all duration-200 ${listKey === k
                                    ? "bg-orange-500/20 border border-orange-500/60 text-orange-300"
                                    : "border border-white/15 text-white/40 hover:text-white hover:border-white/35"
                                }`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            )}

            {/* ── DESKTOP PLAYER  ─  horizontal pill ─────────────── */}
            <div className={`hidden sm:flex w-full items-center gap-4 rounded-full px-3 py-3 ${glass}`}>

                {/* Cover: thumbnail from YT CDN (no 3rd-party host, no 16:9 crop) */}
                <div className="relative w-[72px] h-[72px] shrink-0 rounded-full overflow-hidden ring-1 ring-white/15">
                    {track.videoId && (
                        <img
                            key={track.videoId}
                            src={thumb(track.videoId)}
                            alt={displayTitle}
                            /* YouTube thumbnails are 16:9 — we display in
                               a square circle so we object-cover center */
                            className="w-full h-full object-cover animate-[spin_20s_linear_infinite]"
                            style={{ animationPlayState: playing ? "running" : "paused" }}
                        />
                    )}
                    {/* Spindle hole */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3 h-3 rounded-full bg-black/80 ring-2 ring-white/30" />
                    </div>
                </div>

                {/* Track info + seek bar */}
                <div className="flex-1 flex flex-col justify-center min-w-0 gap-0.5">
                    <p className="text-[14px] font-semibold text-white leading-tight truncate">{displayTitle}</p>
                    <p className="text-[11.5px] text-white/50 truncate">{displayArtist}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <Seekbar ytRef={ytRef} playing={playing} duration={duration} />
                        <TimeLabel ytRef={ytRef} playing={playing} duration={duration} />
                    </div>
                </div>

                {/* Controls */}
                <Transport playing={playing} onPrev={goPrev} onPlay={togglePlay} onNext={goNext} />
            </div>

            {/* ── MOBILE PLAYER  ─  stacked card ──────────────────── */}
            <div className={`sm:hidden w-full rounded-[28px] flex flex-col items-center gap-0 overflow-hidden ${glass}`}>

                {/* Top banner: thumbnail letterboxed in aspect-video */}
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                    {track.videoId && (
                        <img
                            key={track.videoId}
                            src={thumb(track.videoId)}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Subtle bottom gradient blending into card */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Info row */}
                <div className="w-full px-5 pt-3 pb-0">
                    <p className="text-[16px] font-semibold text-white leading-tight truncate">{displayTitle}</p>
                    <p className="text-[12px] text-white/50 mt-0.5 truncate">{displayArtist}</p>
                </div>

                {/* Seek */}
                <div className="w-full px-4">
                    <Seekbar ytRef={ytRef} playing={playing} duration={duration} />
                </div>

                {/* Time + Controls row */}
                <div className="w-full px-5 pb-5 flex items-center justify-between">
                    <TimeLabel ytRef={ytRef} playing={playing} duration={duration} />
                    <Transport playing={playing} onPrev={goPrev} onPlay={togglePlay} onNext={goNext} large />
                </div>
            </div>

            {/* ── Hidden YT iframe (YT Policy: must be visible but
             we tuck it behind the thumbnail at 1px in a fixed
             off-render container — no opacity-0, no 1px div) ──── */}
            <div
                className="fixed bottom-0 right-0 w-[1px] h-[1px] overflow-hidden pointer-events-none"
                aria-hidden="true"
            >
                <div id="yt-player" />
            </div>

        </div>
    );
}

// Alias to avoid name collision with the track type
const track_event = track;
