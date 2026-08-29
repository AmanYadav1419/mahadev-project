"use client";

import React, { useState } from "react";
import { ClientApp } from "../ClientApp";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { DynamicHeader } from "./DynamicHeader";
import type { Track } from "../lib/types";

interface AppClientWrapperProps {
    playlists: Record<string, Track[]>;
}

export function AppClientWrapper({ playlists }: AppClientWrapperProps) {
    const [currentPlaylist, setCurrentPlaylist] = useState<string>("Mahadev Songs");

    const handlePlaylistChange = (playlistName: string) => {
        setCurrentPlaylist(playlistName);
    };

    const getPlaylistInfo = () => {
        if (currentPlaylist.includes("Ganpati")) {
            return {
                description: "Free Ganpati Bappa song playlist — Ganpati aartis, Sukharta Dukharta and bhakti radio. Audio plays through YouTube; rights remain with the original artists and labels."
            };
        }
        const trackCount = Object.values(playlists).reduce((n, t) => n + t.length, 0);
        return {
            description: `Free ${trackCount}-track Mahadev song playlist — Shiva bhajans, Har Har Mahadev, and bhakti radio. Audio plays through YouTube; rights remain with the original artists and labels.`
        };
    };

    const playlistInfo = getPlaylistInfo();

    return (
        <>
            <BackgroundSlideshow currentPlaylist={currentPlaylist} />
            
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

            <DynamicHeader 
                onPlaylistChange={handlePlaylistChange} 
                currentPlaylist={currentPlaylist} 
            />

            <div className="flex-1" />

            <div className="w-full max-w-[640px] min-w-0 pb-[max(1rem,env(safe-area-inset-bottom))] px-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] z-10 pointer-events-auto">
                <ClientApp playlists={playlists} externalPlaylistKey={currentPlaylist} />
                <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[11px] leading-relaxed text-white/35 px-2 sm:px-4">
                    {playlistInfo.description}
                </p>
            </div>
        </>
    );
}
