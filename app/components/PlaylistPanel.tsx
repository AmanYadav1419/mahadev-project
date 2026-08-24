"use client";

import { useEffect, useRef } from "react";
import type { Track } from "@/app/lib/types";

const thumb = (videoId: string) =>
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export function PlaylistPanel({
    open,
    tracks,
    currentIdx,
    focusIdx,
    onClose,
    onSelect,
    listName,
}: {
    open: boolean;
    tracks: Track[];
    currentIdx: number;
    focusIdx: number;
    onClose: () => void;
    onSelect: (index: number) => void;
    listName: string;
}) {
    const activeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [open, focusIdx]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6">
            <button
                type="button"
                aria-label="Close playlist"
                className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="playlist-heading"
                className="relative z-10 w-full sm:max-w-md max-h-[min(78dvh,640px)] flex flex-col rounded-t-[28px] sm:rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.14] to-black/80 backdrop-blur-3xl shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85)]"
            >
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10">
                    <div>
                        <p className="text-[10px] tracking-[0.22em] uppercase text-orange-300/80">Queue</p>
                        <h2 id="playlist-heading" className="text-sm font-semibold text-white">
                            {listName} · {tracks.length} tracks
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <ul className="overflow-y-auto overscroll-contain px-2 py-2" role="listbox">
                    {tracks.map((t, i) => {
                        const active = i === currentIdx;
                        const focused = i === focusIdx;
                        const title = t.title || `Track ${i + 1}`;
                        return (
                            <li key={`${t.videoId}-${i}`} role="option" aria-selected={active}>
                                <button
                                    ref={focused ? activeRef : undefined}
                                    type="button"
                                    onClick={() => onSelect(i)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-2xl text-left transition-colors ${active
                                        ? "bg-orange-500/20 ring-1 ring-orange-400/40"
                                        : focused
                                            ? "bg-white/10 ring-1 ring-white/20"
                                            : "hover:bg-white/10"
                                        }`}
                                >
                                    <span className="relative w-14 h-8 shrink-0 overflow-hidden rounded-md bg-black/40">
                                        {t.videoId && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={thumb(t.videoId)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className={`block truncate text-[13px] ${active ? "text-orange-200" : "text-white"}`}>
                                            {title}
                                        </span>
                                        <span className="block truncate text-[11px] text-white/45">
                                            {t.artist || "Mahadev Radio"}
                                        </span>
                                    </span>
                                    <span className="tabular-nums text-[11px] text-white/35 w-6 text-right">
                                        {i + 1}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <p className="hidden sm:block px-5 py-3 text-[10px] tracking-wide text-white/40 border-t border-white/10">
                    Q playlist · ↑↓ pick · Enter play · N/P skip · ← → seek · Esc close
                </p>
            </div>
        </div>
    );
}
