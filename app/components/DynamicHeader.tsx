"use client";

import React, { useState } from "react";
import { Clock } from "./Clock";
import { DeitySwitcher } from "./DeitySwitcher";
import { CreatorCard } from "./CreatorCard";

interface DynamicHeaderProps {
    onPlaylistChange: (playlistName: string) => void;
    currentPlaylist: string;
}

export function DynamicHeader({ onPlaylistChange, currentPlaylist }: DynamicHeaderProps) {
    const getHeaderText = () => {
        if (currentPlaylist.includes("Ganpati")) {
            return {
                location: "Live from Mumbai",
                title: "गणपति बप्पा Songs Playlist"
            };
        }
        return {
            location: "Live from Kailash",
            title: "महादेव Songs Playlist"
        };
    };

    const headerText = getHeaderText();

    return (
        <header className="fixed top-0 left-0 w-full max-w-full pt-[max(0.85rem,env(safe-area-inset-top))] px-[max(0.85rem,env(safe-area-inset-left))] pr-[max(0.85rem,env(safe-area-inset-right))] sm:pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] flex items-center justify-between pointer-events-none z-30">
            <div className="pointer-events-auto pl-1 sm:pl-2 shrink-0 flex items-center gap-3">
                <Clock />
                <DeitySwitcher 
                    onPlaylistChange={onPlaylistChange} 
                    currentPlaylist={currentPlaylist} 
                />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[max(0.85rem,env(safe-area-inset-top))] sm:top-[max(1.5rem,env(safe-area-inset-top))] w-[min(58vw,16rem)] sm:w-auto text-center pointer-events-none">
                <p className="font-medium text-white/40 text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.3em] uppercase drop-shadow-md">
                    {headerText.location}
                </p>
                <h1 className="text-[11px] sm:text-sm font-semibold text-white/85 tracking-wide drop-shadow-md leading-tight">
                    {headerText.title}
                </h1>
            </div>
            <div className="flex items-center justify-end shrink-0 pointer-events-auto">
                <CreatorCard />
            </div>
        </header>
    );
}
