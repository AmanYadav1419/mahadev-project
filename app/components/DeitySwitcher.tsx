"use client";

import React, { useState } from "react";

interface DeitySwitcherProps {
    onPlaylistChange: (playlistName: string) => void;
    currentPlaylist: string;
}

export function DeitySwitcher({ onPlaylistChange, currentPlaylist }: DeitySwitcherProps) {
    // State to control dropdown visibility
    const [isOpen, setIsOpen] = useState(false);

    // Available deity options with their display names and icons
    const options = [
        { name: "Mahadev Songs", label: "Mahadev", icon: "🔱" },
        { name: "Ganpati Bappa Songs", label: "Ganpati Bappa", icon: "🙏" },
    ];

    // Find the currently selected option for display
    const currentOption = options.find(opt => opt.name === currentPlaylist) || options[0];

    return (
        <div className="relative">
            {/* 
                Trigger button - shows current deity with icon and dropdown arrow
                Responsive: hides label on mobile, shows on desktop
            */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm text-white"
                aria-label="Switch deity"
            >
                <span className="text-sm">{currentOption.icon}</span>
                <span className="text-xs font-medium hidden sm:block">{currentOption.label}</span>
                {/* Dropdown arrow - rotates when open */}
                <svg 
                    className={`w-3 h-3 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu - shows when isOpen is true */}
            {isOpen && (
                <>
                    {/* Click overlay to close dropdown when clicking outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Dropdown content with glass morphism effect */}
                    <div className="absolute top-full mt-2 left-0 z-50 bg-black/90 border border-white/20 rounded-xl p-1 min-w-[160px] backdrop-blur-xl shadow-2xl">
                        {options.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => {
                                    // Notify parent of playlist change and close dropdown
                                    onPlaylistChange(option.name);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    currentPlaylist === option.name
                                        ? "bg-orange-500/20 text-orange-300" // Active state styling
                                        : "text-white/70 hover:bg-white/10 hover:text-white" // Inactive state styling
                                }`}
                            >
                                <span className="text-sm">{option.icon}</span>
                                <span className="text-xs font-medium">{option.label}</span>
                                {/* Checkmark indicator for currently selected option */}
                                {currentPlaylist === option.name && (
                                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
