"use client";

import React, { useState, useEffect } from "react";
import { ClientApp } from "../ClientApp";
import { BackgroundSlideshow } from "./BackgroundSlideshow";
import { DynamicHeader } from "./DynamicHeader";
import type { Track } from "../lib/types";

interface AppClientWrapperProps {
    playlists: Record<string, Track[]>;
}

export function AppClientWrapper({ playlists }: AppClientWrapperProps) {
    // State to track the currently selected playlist (Mahadev or Ganpati Bappa)
    const [currentPlaylist, setCurrentPlaylist] = useState<string>("Mahadev Songs");

    /**
     * Handle playlist change when user selects a different deity
     * This updates the state which triggers a re-render of ClientApp with the new playlist
     */
    const handlePlaylistChange = (playlistName: string) => {
        console.log('AppClientWrapper - handlePlaylistChange called with:', playlistName);
        setCurrentPlaylist(playlistName);
    };

    /**
     * Handle playlist changes from within ClientApp (e.g., via queue panel)
     * This syncs the wrapper state with the player's internal playlist state
     */
    const handleInternalPlaylistChange = (playlistName: string) => {
        console.log('AppClientWrapper - internal playlist change to:', playlistName);
        setCurrentPlaylist(playlistName);
    };

    // Debug: log when currentPlaylist changes
    useEffect(() => {
        console.log('AppClientWrapper - currentPlaylist changed to:', currentPlaylist);
    }, [currentPlaylist]);

    /**
     * Get dynamic description text based on current playlist
     * Shows different text for Mahadev vs Ganpati Bappa sections
     */
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
            {/* 
                Background slideshow with playlist-specific filtering
                Using key prop to force re-mount when playlist changes
                This ensures the slideshow resets and loads the correct backgrounds
            */}
            <BackgroundSlideshow 
                key={currentPlaylist} 
                currentPlaylist={currentPlaylist} 
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="fixed inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/25 to-black/50 pointer-events-none" />

            {/* Noise texture overlay for visual depth */}
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

            {/* Dynamic header with deity switcher and clock */}
            <DynamicHeader 
                onPlaylistChange={handlePlaylistChange} 
                currentPlaylist={currentPlaylist} 
            />

            {/* Spacer to push player to bottom */}
            <div className="flex-1" />

            {/* Audio player section with responsive padding */}
            <div className="w-full max-w-[640px] min-w-0 pb-[max(1rem,env(safe-area-inset-bottom))] px-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] z-10 pointer-events-auto">
                {/* 
                    Using key prop to force re-mount when playlist changes.
                    This ensures the player state resets and loads the correct playlist.
                    Also passing onPlaylistChange callback to sync internal playlist changes.
                */}
                <ClientApp 
                    key={currentPlaylist} 
                    playlists={playlists} 
                    externalPlaylistKey={currentPlaylist}
                    onPlaylistChange={handleInternalPlaylistChange}
                />
                <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[11px] leading-relaxed text-white/35 px-2 sm:px-4">
                    {playlistInfo.description}
                </p>
            </div>
        </>
    );
}
