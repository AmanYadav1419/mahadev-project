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
                alternateName: [SITE_NAME_HI, "Mahadev Songs Playlist", "Shiva Bhajan Radio"],
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
                alternateName: ["Mahadev songs", "Shiva bhajan playlist", "महादेव गाने"],
                description: SITE_DESCRIPTION,
                url,
                genre: ["Bhakti", "Bhajan", "Devotional", "Shiva"],
                numTracks: tracks.length,
                track: tracks.slice(0, 20).map((t, i) => ({
                    "@type": "MusicRecording",
                    position: i + 1,
                    name: t.title && t.title !== "Connecting..." ? t.title : `Mahadev song ${i + 1}`,
                    url: t.url || `https://www.youtube.com/watch?v=${t.videoId}`,
                })),
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "Where can I listen to a Mahadev songs playlist online?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: `Stream a free Mahadev songs playlist at ${url}. Press play for Shiva bhajans and Har Har Mahadev tracks — no login.`,
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is there a free Har Har Mahadev and Shiva bhajan playlist?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: `Yes. ${SITE_NAME} is a free Mahadev song playlist and Shiva bhajan radio — Har Har Mahadev, Bholenath bhakti, and Kailash-themed tracks in one mix, streamed via YouTube.`,
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
