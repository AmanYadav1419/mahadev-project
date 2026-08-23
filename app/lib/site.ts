/** Canonical site identity — used by metadata, JSON-LD, sitemap, robots. */

export const SITE_NAME = "Mahadev Radio";
export const SITE_NAME_HI = "महादेव रेडियो";

export const SITE_TITLE =
  "Mahadev Songs Playlist — Shiva Bhajans, Bhakti & Har Har Mahadev Radio";

export const SITE_DESCRIPTION =
  "Free Mahadev songs playlist to stream Shiva bhajans, Har Har Mahadev tracks, and bhakti radio from Kailash. No login — press play for a nonstop Mahadev song mix.";

export const SITE_KEYWORDS = [
  "mahadev songs",
  "mahadev song playlist",
  "mahadev playlist",
  "mahadev songs playlist",
  "shiva bhajan",
  "shiva songs",
  "shiv bhajan",
  "har har mahadev",
  "har har mahadev song",
  "bholenath songs",
  "mahadev bhakti songs",
  "lord shiva songs",
  "om namah shivaya song",
  "shiv tandav",
  "devotional shiva songs",
  "shiv bhajan playlist",
  "महादेव गाने",
  "महादेव सॉन्ग",
  "शिव भजन",
  "हर हर महादेव",
];

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
