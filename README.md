# Divine Bhakti Radio

<div align="center">

A free devotional songs playlist featuring bhajans, aartis, and bhakti radio. Stream Mahadev bhajans, Ganpati Bappa aartis, and more — no login required.

[Live Demo](https://divine-bhakti-radio.vercel.app) • [Report Issue](https://github.com/AmanYadav1419/mahadev-project/issues) • [Request Feature](https://github.com/AmanYadav1419/mahadev-project/issues)

</div>

## ✨ Features

- 🎵 **Multiple Devotional Playlists** - Switch between Mahadev Songs, Ganpati Bappa Songs, and more
- 🎨 **Dynamic Background Slideshow** - Beautiful deity-specific imagery with smooth Ken Burns effect transitions
- 🎧 **Nonstop Music Playback** - Seamless streaming via YouTube IFrame API
- 📱 **Fully Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ⚡ **High Performance** - Built with Next.js 16 for optimal speed and SEO
- 🔍 **SEO Optimized** - Proper metadata, OpenGraph tags, and JSON-LD schema markup
- 🎛️ **Intuitive Controls** - Play/pause, next/previous, seek bar, and queue management
- ⌨️ **Keyboard Shortcuts** - Space to play/pause, arrow keys to seek, N/P for next/previous
- 🌙 **Dark Theme** - Beautiful dark UI with saffron accents inspired by traditional Indian aesthetics
- 🎭 **Deity Switcher** - Easy switching between different deity playlists with dropdown menu

## 🎶 Available Playlists

### Mahadev Songs

- Shiva bhajans and Har Har Mahadev tracks
- Devotional music from Kailash
- Bholenath bhakti songs

### Ganpati Bappa Songs

- Ganpati aartis and bhajans
- Lord Ganesha devotional tracks
- Ganesh Chaturthi special songs

### More Coming Soon

- Additional deity playlists will be added in the future

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **Audio**: [YouTube IFrame API](https://developers.google.com/youtube/iframe_api) - Music streaming
- **Deployment**: [Vercel](https://vercel.com/) - Cloud platform for Next.js

## 📁 Project Structure

```
mahadev-project/
├── app/
│   ├── components/
│   │   ├── AppClientWrapper.tsx    # Main wrapper component
│   │   ├── BackgroundSlideshow.tsx # Background image slideshow
│   │   ├── Clock.tsx              # Digital clock display
│   │   ├── CreatorCard.tsx        # Creator information card
│   │   ├── DeitySwitcher.tsx      # Playlist switcher dropdown
│   │   ├── DynamicHeader.tsx      # Header with clock and switcher
│   │   └── JsonLd.tsx             # SEO structured data
│   ├── constants/
│   │   └── backgrounds.ts         # Background image configurations
│   ├── lib/
│   │   ├── site.ts                # Site metadata and SEO
│   │   └── types.ts               # TypeScript type definitions
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page with playlist parsing
│   ├── opengraph-image.tsx        # Social sharing image
│   ├── robots.ts                  # SEO robots configuration
│   └── sitemap.ts                 # SEO sitemap
├── public/                        # Static assets (images, etc.)
├── playlist.md                    # Playlist definitions
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AmanYadav1419/mahadev-project.git
cd mahadev-project
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Adding New Playlists

To add a new devotional playlist to the application:

### Step 1: Add Playlist to `playlist.md`

```markdown
## Your Deity Name Songs

https://youtu.be/VIDEO_ID_1
https://youtu.be/VIDEO_ID_2
https://youtu.be/VIDEO_ID_3
```

### Step 2: Add Background Images to `app/constants/backgrounds.ts`

```typescript
{
    id: "deity-1",
    type: "image",
    src: "/your-image-1.jpg",
    // portrait: "/your-image-1-portrait.jpg", // Optional mobile version
    duration: 12,
    playlist: "Your Deity Name Songs",
},
```

### Step 3: Add Images to `public/` Folder

Place your background images in the `public/` directory with the filenames specified in `backgrounds.ts`.

## ⌨️ Keyboard Shortcuts

| Key    | Action                  |
| ------ | ----------------------- |
| Space  | Play/Pause              |
| →      | Seek forward 5 seconds  |
| ←      | Seek backward 5 seconds |
| N      | Next track              |
| P      | Previous track          |
| Q      | Toggle queue panel      |
| Escape | Close queue panel       |

## 🎨 Customization

### Changing Colors

Edit the color values in `app/globals.css` or use Tailwind utility classes in components.

### Adding Background Images

1. Place images in the `public/` folder
2. Add entries to `app/constants/backgrounds.ts`
3. Specify the playlist association with the `playlist` field

### Modifying Metadata

Update site metadata in `app/lib/site.ts`:

- `SITE_NAME` - Application name
- `SITE_TITLE` - Page title
- `SITE_DESCRIPTION` - SEO description
- `SITE_KEYWORDS` - SEO keywords array

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure settings
4. Click Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📊 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: Optimized with automatic code splitting

## 🔒 Privacy

- No user tracking or analytics beyond Vercel's default monitoring
- No login or authentication required
- All music streamed directly from YouTube
- No personal data collection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube IFrame API for music streaming
- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- All the artists and creators of the devotional music featured in this application

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on [GitHub Issues](https://github.com/AmanYadav1419/mahadev-project/issues)
- Check existing issues for solutions
- Refer to the [Next.js Documentation](https://nextjs.org/docs)

---

<div align="center">

Made with ❤️ for devotees worldwide

**हर हर महादेव | गणपती बाप्पा मोरया, मंगलमूर्ती मोरया!**

</div>
