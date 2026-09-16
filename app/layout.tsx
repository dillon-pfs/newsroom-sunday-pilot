import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://newsroom-sunday-pilot.vercel.app"),
  title: {
    default: "Poor Form Sports",
    template: "%s · Poor Form Sports",
  },
  description:
    "Poor Form Sports: NFL scores, Chip Absolute and the satirical desk, plus the labeled Melbourne, SNF and MNF DEMO archive.",
  openGraph: {
    title: "Poor Form Sports · DEMO / SATIRE",
    description: "A labeled NFL scoreboard pilot and satirical desk. DEMO games are never live scores.",
    siteName: "Poor Form Sports",
    images: [{ url: "/brand/wordmark-bar.png", alt: "Poor Form Sports · DEMO / SATIRE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poor Form Sports · DEMO / SATIRE",
    description: "A labeled NFL scoreboard pilot and satirical desk.",
    images: ["/brand/wordmark-bar.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
