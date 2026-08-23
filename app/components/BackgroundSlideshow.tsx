"use client";

import { useEffect, useRef, useState } from "react";
import { BACKGROUNDS, DEFAULT_SLIDE_DURATION, BgMedia } from "@/app/constants/backgrounds";

/**
 * BackgroundSlideshow
 *
 * Renders a fullscreen, auto-playing slideshow from the BACKGROUNDS constant.
 * Supports both <img> and <video> entries with smooth cross-fade transitions.
 *
 * Architecture notes (performance):
 *  • Two "slots" (A / B) are swapped alternately so we always cross-fade
 *    between the outgoing and incoming slide — no flicker, no black flash.
 *  • Videos mute-autoplay inline; for images we use a JS timer.
 *  • `will-change: opacity` is the only repaint layer we dirty.
 *  • The component re-renders only when the active index changes (~every N secs).
 */
export function BackgroundSlideshow() {
    // Which entry is currently "foreground"
    const [activeIdx, setActiveIdx] = useState(0);
    // CSS transition key: true = slot-A is foreground, false = slot-B
    const [slotA, setSlotA] = useState(true);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // src helpers — choose portrait version on narrow screens at runtime
    const portraitMq =
        typeof window !== "undefined"
            ? window.matchMedia("(orientation: portrait)").matches
            : false;

    const getSrc = (item: BgMedia) =>
        portraitMq && item.portrait ? item.portrait : item.src;

    const advance = () => {
        setActiveIdx((prev) => (prev + 1) % BACKGROUNDS.length);
        setSlotA((prev) => !prev); // toggle which slot is "front"
    };

    /** Schedule advancement for image slides */
    const scheduleImage = (item: BgMedia) => {
        const delay = (item.duration ?? DEFAULT_SLIDE_DURATION) * 1000;
        timerRef.current = setTimeout(advance, delay);
    };

    /** For video slides, advance when the video ends (or after duration) */
    const handleVideoEnd = () => advance();

    useEffect(() => {
        // Clear any pending timer when slide changes
        if (timerRef.current) clearTimeout(timerRef.current);

        const item = BACKGROUNDS[activeIdx];

        if (item.type === "image") {
            scheduleImage(item);
        }
        // For video: onEnded fires advance; no timer needed normally.
        // If the video is a live stream or very long, rely on item.duration as fallback.
        if (item.type === "video" && item.duration) {
            timerRef.current = setTimeout(advance, item.duration * 1000);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIdx]);

    // Pre-compute "current" and "next" slides for smooth cross-fade
    const curr = BACKGROUNDS[activeIdx];
    const currSrc = getSrc(curr);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {BACKGROUNDS.map((item, i) => {
                const isCurrent = i === activeIdx;
                const src = getSrc(item);

                return (
                    <div
                        key={item.id}
                        className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out will-change-[opacity]"
                        style={{ opacity: isCurrent ? 1 : 0 }}
                    >
                        {item.type === "image" ? (
                            <img
                                src={src}
                                alt=""
                                /* Eager-load the first slide, lazy-load the rest */
                                loading={i === 0 ? "eager" : "lazy"}
                                decoding="async"
                                className="w-full h-full object-cover animate-sway"
                            />
                        ) : (
                            <video
                                src={src}
                                autoPlay
                                muted
                                playsInline
                                loop={!item.duration} /* loop only if no fixed duration */
                                onEnded={handleVideoEnd}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
