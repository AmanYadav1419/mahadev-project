"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    BACKGROUNDS,
    DEFAULT_SLIDE_DURATION,
    BgMedia,
} from "@/app/constants/backgrounds";

const FADE_MS = 1600;
const LOAD_GRACE_MS = 2800;
const KEN_VARIANTS = ["kenburns-a", "kenburns-b", "kenburns-c"] as const;

function useNarrowScreen() {
    const [narrow, setNarrow] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        const apply = () => setNarrow(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    return narrow;
}

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => setReduced(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    return reduced;
}

function srcFor(item: BgMedia, narrow: boolean) {
    return narrow && item.portrait ? item.portrait : item.src;
}

function SlideMedia({
    item,
    src,
    active,
    reducedMotion,
    kenClass,
    preload,
    onReady,
}: {
    item: BgMedia;
    src: string;
    active: boolean;
    reducedMotion: boolean;
    kenClass: string;
    preload?: boolean;
    onReady?: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const readyOnce = useRef(false);

    const markReady = useCallback(() => {
        if (readyOnce.current) return;
        readyOnce.current = true;
        onReady?.();
    }, [onReady]);

    useEffect(() => {
        readyOnce.current = false;
    }, [src]);

    useEffect(() => {
        const el = videoRef.current;
        if (!el || item.type !== "video") return;
        if (active) {
            if (el.paused) void el.play().catch(() => {});
        } else {
            el.pause();
        }
    }, [active, item.type]);

    const ken = !reducedMotion && item.type === "image" ? kenClass : "";

    if (item.type === "video") {
        return (
            <video
                ref={videoRef}
                src={src}
                muted
                playsInline
                preload={active ? "auto" : "metadata"}
                loop={!item.duration}
                onCanPlay={markReady}
                onLoadedData={markReady}
                className="absolute inset-0 h-full w-full object-cover gpu-layer"
            />
        );
    }

    return (
        <div className={`absolute inset-[-8%] ${ken}`}>
            <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                quality={70}
                preload={preload}
                decoding="async"
                onLoad={markReady}
                className="object-cover"
                {...(preload ? {} : { loading: "eager" as const })}
            />
        </div>
    );
}

/**
 * Two stable GPU slots, Corporate Majdoor–style Ken Burns + opacity fade.
 * The incoming slide is mounted (opacity 0) for the full dwell so it is
 * decoded before the crossfade. Ken Burns never restarts on the visible slide.
 */
export function BackgroundSlideshow() {
    const narrow = useNarrowScreen();
    const reducedMotion = useReducedMotion();
    const n = BACKGROUNDS.length;

    const [slotA, setSlotA] = useState(0);
    const [slotB, setSlotB] = useState(n > 1 ? 1 : 0);
    const [front, setFront] = useState<"a" | "b">("a");
    const [fading, setFading] = useState(false);
    const [pageHidden, setPageHidden] = useState(false);

    const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fadingRef = useRef(false);
    const backReadyRef = useRef(false);
    const frontRef = useRef(front);
    const slotARef = useRef(slotA);
    const slotBRef = useRef(slotB);

    useEffect(() => {
        fadingRef.current = fading;
        frontRef.current = front;
        slotARef.current = slotA;
        slotBRef.current = slotB;
    }, [fading, front, slotA, slotB]);

    const fadeMs = reducedMotion ? 0 : FADE_MS;
    const frontIdx = front === "a" ? slotA : slotB;

    const beginFade = useCallback(() => {
        if (n < 2 || fadingRef.current || document.hidden) return;
        fadingRef.current = true;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setFading(true));
        });
    }, [n]);

    const tryAdvance = useCallback(() => {
        if (n < 2 || fadingRef.current || document.hidden) return;
        if (backReadyRef.current || reducedMotion) {
            beginFade();
            return;
        }
        if (graceTimer.current) clearTimeout(graceTimer.current);
        graceTimer.current = setTimeout(beginFade, LOAD_GRACE_MS);
    }, [n, beginFade, reducedMotion]);

    useEffect(() => {
        const onVis = () => setPageHidden(document.hidden);
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    useEffect(() => {
        if (dwellTimer.current) clearTimeout(dwellTimer.current);
        if (graceTimer.current) clearTimeout(graceTimer.current);
        if (n < 2 || fading || pageHidden) return;

        const item = BACKGROUNDS[frontIdx];
        if (!item) return;
        if (item.type === "video" && !item.duration) return;

        const delay = (item.duration ?? DEFAULT_SLIDE_DURATION) * 1000;
        dwellTimer.current = setTimeout(tryAdvance, delay);
        return () => {
            if (dwellTimer.current) clearTimeout(dwellTimer.current);
        };
    }, [frontIdx, fading, pageHidden, n, tryAdvance]);

    useEffect(() => {
        if (!fading) return;
        if (fadeTimer.current) clearTimeout(fadeTimer.current);
        fadeTimer.current = setTimeout(() => {
            const nextFront = frontRef.current === "a" ? "b" : "a";
            const visibleIdx = nextFront === "a" ? slotARef.current : slotBRef.current;
            const upcoming = (visibleIdx + 1) % n;
            setFront(nextFront);
            if (nextFront === "a") setSlotB(upcoming);
            else setSlotA(upcoming);
            setFading(false);
            fadingRef.current = false;
            backReadyRef.current = false;
        }, fadeMs);
        return () => {
            if (fadeTimer.current) clearTimeout(fadeTimer.current);
        };
    }, [fading, fadeMs, n]);

    useEffect(
        () => () => {
            if (dwellTimer.current) clearTimeout(dwellTimer.current);
            if (fadeTimer.current) clearTimeout(fadeTimer.current);
            if (graceTimer.current) clearTimeout(graceTimer.current);
        },
        []
    );

    const onBackReady = useCallback(() => {
        backReadyRef.current = true;
    }, []);

    if (n === 0) return null;

    const layers: { slot: "a" | "b"; idx: number }[] = [{ slot: "a", idx: slotA }];
    if (n > 1) layers.push({ slot: "b", idx: slotB });

    return (
        <div
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slider"
            aria-hidden="true"
        >
            {layers.map(({ slot, idx }) => {
                const item = BACKGROUNDS[idx];
                const isFront = slot === front;
                const opacity = fading ? (isFront ? 0 : 1) : isFront ? 1 : 0;
                const z = fading ? (isFront ? 1 : 2) : isFront ? 2 : 1;
                return (
                    <div
                        key={slot}
                        className="absolute inset-0 gpu-layer"
                        style={{
                            opacity,
                            zIndex: z,
                            transition: fadeMs
                                ? `opacity ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1)`
                                : "none",
                        }}
                    >
                        <SlideMedia
                            item={item}
                            src={srcFor(item, narrow)}
                            active={isFront || fading}
                            reducedMotion={reducedMotion}
                            kenClass={KEN_VARIANTS[idx % KEN_VARIANTS.length]}
                            preload={idx === 0 && isFront}
                            onReady={isFront ? undefined : onBackReady}
                        />
                    </div>
                );
            })}
        </div>
    );
}
