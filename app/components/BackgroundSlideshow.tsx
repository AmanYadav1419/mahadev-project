"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    BACKGROUNDS,
    DEFAULT_SLIDE_DURATION,
    type BgMedia,
} from "@/app/constants/backgrounds";

const FADE_MS = 2000;
const KEN = ["kenburns-a", "kenburns-b", "kenburns-c"] as const;

function useMq(query: string) {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(query);
        const apply = () => setOn(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, [query]);
    return on;
}

function srcFor(item: BgMedia, narrow: boolean) {
    return narrow && item.portrait ? item.portrait : item.src;
}

function SlideMedia({
    item,
    src,
    active,
    kenClass,
    reduced,
    preload,
    onReady,
    onFail,
}: {
    item: BgMedia;
    src: string;
    active: boolean;
    kenClass: string;
    reduced: boolean;
    preload?: boolean;
    onReady: () => void;
    onFail: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const done = useRef(false);

    const ready = useCallback(() => {
        if (done.current) return;
        done.current = true;
        onReady();
    }, [onReady]);

    const fail = useCallback(() => {
        if (done.current) return;
        done.current = true;
        onFail();
    }, [onFail]);

    useEffect(() => {
        done.current = false;
    }, [src]);

    useEffect(() => {
        const el = videoRef.current;
        if (!el || item.type !== "video") return;
        if (active) void el.play().catch(() => {});
        else el.pause();
    }, [active, item.type]);

    if (item.type === "video") {
        return (
            <video
                ref={videoRef}
                src={src}
                muted
                playsInline
                preload={active ? "auto" : "metadata"}
                loop={!item.duration}
                onCanPlay={ready}
                onError={fail}
                className="absolute inset-0 h-full w-full object-cover gpu-layer"
            />
        );
    }

    const png = src.toLowerCase().endsWith(".png");
    const ken = !reduced ? kenClass : "";

    // General-purpose fit: any image, any aspect ratio, any screen —
    // never cropped, always centered. A blurred cover copy fills the
    // frame edge-to-edge (no black bars); the real image sits on top
    // at object-contain so the full frame is always visible & centered.
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-[-8%] scale-110">
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100vw"
                    quality={40}
                    unoptimized={png}
                    aria-hidden="true"
                    className="object-cover blur-2xl opacity-60"
                />
            </div>
            <div className={`absolute inset-[-8%] ${ken}`}>
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100vw"
                    quality={70}
                    unoptimized={png}
                    preload={preload}
                    decoding="async"
                    onLoad={ready}
                    onError={fail}
                    className="object-contain object-center"
                    {...(preload ? {} : { loading: "eager" as const })}
                />
            </div>
        </div>
    );
}

export function BackgroundSlideshow() {
    const narrow = useMq("(max-width: 639px)");
    const reduced = useMq("(prefers-reduced-motion: reduce)");
    const n = BACKGROUNDS.length;

    const [slotA, setSlotA] = useState(0);
    const [slotB, setSlotB] = useState(n > 1 ? 1 : 0);
    const [front, setFront] = useState<"a" | "b">("a");
    const [fading, setFading] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [readyA, setReadyA] = useState(false);
    const [readyB, setReadyB] = useState(false);

    const fadingRef = useRef(false);
    const frontRef = useRef(front);
    const aRef = useRef(slotA);
    const bRef = useRef(slotB);
    const readyARef = useRef(false);
    const readyBRef = useRef(false);
    const dwell = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fadeT = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fadingRef.current = fading;
        frontRef.current = front;
        aRef.current = slotA;
        bRef.current = slotB;
        readyARef.current = readyA;
        readyBRef.current = readyB;
    }, [fading, front, slotA, slotB, readyA, readyB]);

    const fadeMs = reduced ? 0 : FADE_MS;
    const frontIdx = front === "a" ? slotA : slotB;
    const backReady = front === "a" ? readyB : readyA;

    const beginFade = useCallback(() => {
        if (n < 2 || fadingRef.current || document.hidden) return;
        const incomingReady = frontRef.current === "a" ? readyBRef.current : readyARef.current;
        if (!incomingReady) return;
        fadingRef.current = true;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setFading(true));
        });
    }, [n]);

    const skipBrokenBack = useCallback(() => {
        const f = frontRef.current;
        const backIdx = f === "a" ? bRef.current : aRef.current;
        const next = (backIdx + 1) % n;
        if (next === (f === "a" ? aRef.current : bRef.current)) return;
        if (f === "a") {
            setSlotB(next);
            setReadyB(false);
            readyBRef.current = false;
        } else {
            setSlotA(next);
            setReadyA(false);
            readyARef.current = false;
        }
    }, [n]);

    useEffect(() => {
        const onVis = () => setHidden(document.hidden);
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    useEffect(() => {
        if (dwell.current) clearTimeout(dwell.current);
        if (n < 2 || fading || hidden) return;
        const item = BACKGROUNDS[frontIdx];
        if (!item || (item.type === "video" && !item.duration)) return;
        const delay = (item.duration ?? DEFAULT_SLIDE_DURATION) * 1000;
        dwell.current = setTimeout(() => {
            if (frontRef.current === "a" ? readyBRef.current : readyARef.current) beginFade();
            else skipBrokenBack();
        }, delay);
        return () => {
            if (dwell.current) clearTimeout(dwell.current);
        };
    }, [frontIdx, fading, hidden, n, beginFade, skipBrokenBack, backReady]);

    useEffect(() => {
        if (!fading) return;
        if (fadeT.current) clearTimeout(fadeT.current);
        fadeT.current = setTimeout(() => {
            const nextFront = frontRef.current === "a" ? "b" : "a";
            const vis = nextFront === "a" ? aRef.current : bRef.current;
            const upcoming = (vis + 1) % n;
            setFront(nextFront);
            if (nextFront === "a") {
                setSlotB(upcoming);
                setReadyB(false);
            } else {
                setSlotA(upcoming);
                setReadyA(false);
            }
            setFading(false);
            fadingRef.current = false;
        }, fadeMs);
        return () => {
            if (fadeT.current) clearTimeout(fadeT.current);
        };
    }, [fading, fadeMs, n]);

    useEffect(
        () => () => {
            if (dwell.current) clearTimeout(dwell.current);
            if (fadeT.current) clearTimeout(fadeT.current);
        },
        []
    );

    if (n === 0) return null;

    const layers: { slot: "a" | "b"; idx: number }[] = [{ slot: "a", idx: slotA }];
    if (n > 1) layers.push({ slot: "b", idx: slotB });

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slider bg-black" aria-hidden>
            {layers.map(({ slot, idx }) => {
                const item = BACKGROUNDS[idx];
                const isFront = slot === front;
                const ready = slot === "a" ? readyA : readyB;
                const opacity = !ready ? 0 : fading ? (isFront ? 0 : 1) : isFront ? 1 : 0;
                const z = fading ? (isFront ? 1 : 2) : isFront ? 2 : 1;
                return (
                    <div
                        key={slot}
                        className="absolute inset-0 gpu-layer"
                        style={{
                            opacity,
                            zIndex: z,
                            transition: fadeMs ? `opacity ${fadeMs}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
                        }}
                    >
                        <SlideMedia
                            item={item}
                            src={srcFor(item, narrow)}
                            active={isFront || fading}
                            kenClass={KEN[idx % KEN.length]}
                            reduced={reduced}
                            preload={idx === 0 && isFront}
                            onReady={() => (slot === "a" ? setReadyA(true) : setReadyB(true))}
                            onFail={() => {
                                const next = (idx + 1) % n;
                                if (slot === "a") {
                                    setSlotA(next);
                                    setReadyA(false);
                                } else {
                                    setSlotB(next);
                                    setReadyB(false);
                                }
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
