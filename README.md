# Divine Bhakti Radio

A free devotional songs playlist featuring bhajans, aartis, and bhakti radio. Stream Mahadev bhajans, Ganpati Bappa aartis, and more — no login required.

## Features

- 🎵 Multiple devotional playlists (Mahadev Songs, Ganpati Bappa Songs, and more)
- 🎨 Beautiful background slideshow with deity-specific imagery
- 📱 Fully responsive design for all devices
- ⚡ Optimized performance with Next.js 16
- 🔍 SEO-optimized with proper metadata and schema markup
- 🎧 Nonstop music playback with YouTube IFrame API

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Adding New Playlists

To add a new devotional playlist:

1. Open `playlist.md`
2. Add a new section with `## Your Playlist Name`
3. Add YouTube video URLs below the section header
4. Add corresponding background images to `app/constants/backgrounds.ts`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
