/**
 * Creator social links registry.
 *
 * ── HOW TO ADD A LINK ────────────────────────────────────────────────
 *  1. Add one entry below — id, label, href, icon.
 *  2. icon must be one of the keys handled in CreatorCard's <Icon />;
 *     use "generic" (a plain link icon) for anything not yet mapped.
 *  The CreatorCard component renders the list automatically — no other
 *  file needs to change.
 * ─────────────────────────────────────────────────────────────────────
 */

export type SocialLink = {
    /** Unique key used as React key — keep it stable */
    id: string;
    label: string;
    href: string;
    icon: "instagram" | "twitter" | "portfolio" | "generic";
};

export const SOCIAL_LINKS: SocialLink[] = [
    {
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/aman_yadav1419/",
        icon: "instagram",
    },
    {
        id: "twitter",
        label: "Twitter / X",
        href: "https://x.com/Aman_Yadav1419",
        icon: "twitter",
    },
    {
        id: "portfolio",
        label: "Portfolio",
        href: "https://aman-yadav1419-portfolio.vercel.app/",
        icon: "portfolio",
    },
];
