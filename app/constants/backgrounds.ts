/**
 * Background media registry.
 *
 * ── HOW TO ADD MEDIA ─────────────────────────────────────────────────
 *  1. Drop your file into /public  (e.g. /public/my-image.jpg)
 *  2. Add one entry to BACKGROUNDS below.
 *     • type: "image" | "video"
 *     • src:  path relative to /public   (e.g. "/my-image.jpg")
 *     • duration: seconds to show before moving to the next slide
 *     • portrait (optional): a separate src shown on portrait/mobile screens
 *
 *  The slideshow component handles everything else automatically.
 * ─────────────────────────────────────────────────────────────────────
 */

export type BgMedia = {
    /** Unique key used as React key — keep it stable */
    id: string;
    type: "image" | "video";
    /** Path relative to /public, used on landscape/desktop */
    src: string;
    /** Optional separate src shown in portrait orientation (mobile) */
    portrait?: string;
    /** Seconds this slide is visible before auto-advancing */
    duration?: number;
};

/** Master list — edit freely */
export const BACKGROUNDS: BgMedia[] = [
    {
        id: "mahadev-landscape",
        type: "image",
        src: "/mahadev-landscape.png",
        portrait: "/vertical.png",
        duration: 8,
    },
    {
        id: "kailash",
        type: "image",
        src: "/landscape.png",
        portrait: "/landscape.png",
        duration: 8,
    },
    // ── Add more images ──────────────────────────────────────────────
    // { id: "shiva-temple", type: "image", src: "/shiva-temple.jpg", duration: 8 },
    //
    // ── Add videos ──────────────────────────────────────────────────
    // Videos must be muted to auto-play in browsers.
    // Leave `duration` unset (or 0) to let the video play to its end.
    // { id: "himalaya-drone", type: "video", src: "/himalaya.mp4", duration: 20 },
];

/** Fallback duration (seconds) if `duration` is not set on an image entry */
export const DEFAULT_SLIDE_DURATION = 8;
