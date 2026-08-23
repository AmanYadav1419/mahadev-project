"use client";
import { useEffect, useState } from "react";

export function Clock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const tick = () => {
            const formatted = new Intl.DateTimeFormat("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).format(new Date());
            setTime(formatted);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return <span className="opacity-0">00:00 AM</span>;

    const parts = time.split(":");
    if (parts.length < 2) return <span>{time}</span>;

    const hour = parts[0];
    const rest = parts.slice(1).join(":");

    return (
        <span className="tabular-nums tracking-widest text-sm font-medium">
            {hour}
            <span className="animate-blink opacity-100 transition-opacity duration-100">:</span>
            {rest}
        </span>
    );
}
