import { ImageResponse } from "next/og";

export const alt = "Divine Devotional Songs Playlist — Bhajans, Aartis & Bhakti Radio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(165deg, #1a0b04 0%, #000 55%, #3d1408 100%)",
          color: "white",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#fb923c" }}>
          Divine Bhakti Radio
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700 }}>दिव्य भक्ति</div>
          <div style={{ fontSize: 40, color: "rgba(255,255,255,0.85)" }}>
            Devotional Songs Playlist
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.55)" }}>
            Bhajans · Aartis · Free Bhakti Radio
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
