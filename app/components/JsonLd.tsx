import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_HI, SITE_TITLE, getSiteUrl } from "@/app/lib/site";
import type { Track } from "@/app/lib/types";

export function JsonLd({
    playlists,
}: {
    playlists: Record<string, Track[]>;
}) {
    const url = getSiteUrl();
    const names = Object.keys(playlists);
    const tracks = names.flatMap((k) => playlists[k] ?? []);

    const graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${url}/#website`,
                url,
                name: SITE_NAME,
                alternateName: [SITE_NAME_HI, "Divine Bhakti Radio", "Devotional Songs Playlist"],
                description: SITE_DESCRIPTION,
                inLanguage: ["en-IN", "hi-IN"],
            },
            {
                "@type": "WebPage",
                "@id": `${url}/#webpage`,
                url,
                name: SITE_TITLE,
                description: SITE_DESCRIPTION,
                isPartOf: { "@id": `${url}/#website` },
                inLanguage: "en-IN",
                about: { "@id": `${url}/#playlist` },
            },
            {
                "@type": "MusicPlaylist",
                "@id": `${url}/#playlist`,
                name: SITE_TITLE,
                alternateName: ["Devotional songs", "Bhajan playlist", "भजन", "Mahadev songs", "Ganpati songs"],
                description: SITE_DESCRIPTION,
                url,
                genre: ["Bhakti", "Bhajan", "Devotional", "Aarti"],
                numTracks: tracks.length,
                track: tracks.slice(0, 20).map((t, i) => ({
                    "@type": "MusicRecording",
                    position: i + 1,
                    name: t.title && t.title !== "Connecting..." ? t.title : `Devotional song ${i + 1}`,
                    url: t.url || `https://www.youtube.com/watch?v=${t.videoId}`,
                })),
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "Where can I listen to devotional songs and bhajans online?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: `Stream free devotional songs and bhajans at ${url}. Press play for Mahadev bhajans, Ganpati aartis, and more — no login required.`,
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is there a free devotional songs playlist with multiple deities?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: `Yes. ${SITE_NAME} is a free devotional songs playlist featuring bhajans and aartis for Mahadev, Ganpati Bappa, and other deities — all streamed via YouTube.`,
                        },
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
    );
}
