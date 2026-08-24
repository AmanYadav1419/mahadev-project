"use client";

import { useEffect, useState } from "react";
import { SOCIAL_LINKS, type SocialLink } from "@/app/constants/social";

// Same glass recipe as the player card — one visual language across the app.
const glass =
    "border border-white/10 bg-gradient-to-b from-white/[0.14] to-white/[0.05] backdrop-blur-3xl backdrop-saturate-[1.8] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.18)]";

function Icon({ icon }: { icon: SocialLink["icon"] }) {
    switch (icon) {
        case "instagram":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
            );
        case "twitter":
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M18.9 3H22l-7.5 8.6L23 21h-6.6l-5.2-6.4L5.1 21H2l8-9.2L1.4 3H8.2l4.7 5.9L18.9 3zM17.7 19.1h1.8L7.4 4.8H5.5l12.2 14.3z" />
                </svg>
            );
        case "portfolio":
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                    <path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1" />
                </svg>
            );
    }
}

export function CreatorCard() {
    const [open, setOpen] = useState(false);

    // Esc closes, matches the playlist panel's keyboard behavior.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (SOCIAL_LINKS.length === 0) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label="Creator links"
                /* Icon-only on mobile — the center header title claims most
                   of the width there, so a labeled pill would collide with
                   it. From sm: up there's room for the full "Creator" pill. */
                className={`group relative flex items-center justify-center w-9 h-9 p-0 sm:w-auto sm:h-auto sm:justify-start sm:gap-2 sm:pl-1.5 sm:pr-3 sm:py-1.5 rounded-full pointer-events-auto cursor-pointer transition-all duration-200 active:scale-95 ${glass}`}
            >
                <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-b from-amber-400 to-orange-600 text-black ring-1 ring-white/20 shadow-[0_0_16px_rgba(251,146,60,0.5)] shrink-0 overflow-visible">
                    <span className="absolute inset-0 rounded-full bg-orange-400/50 animate-ping [animation-duration:2.4s]" />
                    <svg viewBox="0 0 24 24" fill="currentColor" className="relative w-3.5 h-3.5">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z" />
                    </svg>
                </span>
                <span className="hidden sm:inline text-[10px] tracking-[0.18em] uppercase font-semibold text-white/75 group-hover:text-white transition-colors">
                    Creator
                </span>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:justify-end p-0 sm:p-6 sm:pt-20 pointer-events-auto">
                    <button
                        type="button"
                        aria-label="Close creator card"
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-[fade-in_.2s_ease-out] cursor-pointer"
                        onClick={() => setOpen(false)}
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="creator-heading"
                        className={`relative z-10 w-full sm:w-[320px] max-w-full rounded-t-[28px] sm:rounded-[24px] px-5 pt-3 sm:pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-5 motion-safe:animate-[sheet-in_.32s_cubic-bezier(0.22,1,0.36,1)] ${glass}`}
                    >
                        {/* Grab handle — mobile bottom-sheet affordance */}
                        <div className="sm:hidden flex justify-center pb-3">
                            <span className="w-9 h-1 rounded-full bg-white/25" />
                        </div>

                        <div className="flex items-start justify-between mb-4 gap-3">
                            <div className="min-w-0">
                                <p className="text-[10px] tracking-[0.22em] uppercase text-orange-300/80">Made by</p>
                                <h2 id="creator-heading" className="text-lg font-semibold text-white truncate">
                                    Aman Yadav
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close creator card"
                                className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {SOCIAL_LINKS.map((link, i) => (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-orange-400/40 transition-all duration-200 cursor-pointer motion-safe:hover:translate-x-1 motion-safe:animate-[row-in_.4s_cubic-bezier(0.22,1,0.36,1)_both]"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-gradient-to-b from-amber-400/20 to-orange-600/20 text-orange-300 ring-1 ring-white/10 group-hover:from-amber-400 group-hover:to-orange-600 group-hover:text-black transition-all duration-200">
                                        <Icon icon={link.icon} />
                                    </span>
                                    <span className="flex-1 min-w-0 text-[13.5px] font-medium text-white/90 truncate">
                                        {link.label}
                                    </span>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="w-4 h-4 shrink-0 text-white/30 group-hover:text-orange-300 transition-all duration-200 motion-safe:group-hover:translate-x-0.5"
                                    >
                                        <path d="M7 17L17 7M7 7h10v10" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
