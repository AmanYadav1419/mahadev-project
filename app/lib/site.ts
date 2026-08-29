/** Canonical site identity — used by metadata, JSON-LD, sitemap, robots. */

export const SITE_NAME = "Divine Bhakti Radio";
export const SITE_NAME_HI = "दिव्य भक्ति रेडियो";

export const SITE_TITLE =
  "Divine Devotional Songs Playlist — Bhajans, Aartis & Bhakti Radio";

export const SITE_DESCRIPTION =
  "Free devotional songs playlist to stream bhajans, aartis, and bhakti radio. No login — press play for a nonstop divine music mix featuring Mahadev, Ganpati Bappa, and more deities.";

export const SITE_KEYWORDS = [
  "devotional songs",
  "bhajan songs",
  "bhakti songs",
  "aarti songs",
  "devotional music",
  "bhajan playlist",
  "mahadev playlist",
  "mahadev songs playlist",
  "mahadev songs",
  "mahadev song playlist",
  "shiva bhajan",
  "shiva songs",
  "shiv bhajan",
  "har har mahadev",
  "ganpati songs",
  "ganpati bappa songs",
  "ganpati bhajan",
  "ganpati aarti",
  "lord ganesha songs",
  "ganesh bhajan",
  "bholenath songs",
  "mahadev bhakti songs",
  "lord shiva songs",
  "om namah shivaya song",
  "shiv tandav",
  "devotional shiva songs",
  "shiv bhajan playlist",
  "भजन",
  "भक्ति गीत",
  "आरती",
  "महादेव गाने",
  "गणपति गाने",
  "गणेश भजन",
  "दिव्य भक्ति",
];

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
