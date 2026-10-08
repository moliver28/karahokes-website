import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: "Online Therapy in Washington State | Dr. Kara Hokes, PhD",
    template: "%s · Kara Hokes, PhD",
  },
  description:
    "Online trauma therapy with Kara Hokes, PhD, a clinical psychologist licensed in Washington State and PSYPACT certified. CPT, DBT, ACT, PE, and CBT by secure video for veterans, survivors of sexual and domestic violence, and under-represented communities. Free 15-minute consultation; most major insurance accepted; $150 self-pay.",
  keywords: [
    "online therapy Washington State",
    "telehealth psychologist Tacoma",
    "online trauma therapy",
    "veteran therapy online",
    "PTSD treatment telehealth",
    "online CPT for PTSD",
    "domestic violence therapy",
    "sexual abuse recovery",
    "emotion dysregulation",
    "Dialectical Behavior Therapy",
    "Cognitive Processing Therapy",
    "Acceptance and Commitment Therapy",
    "Prolonged Exposure Therapy",
    "culturally responsive therapy",
    "PSYPACT psychologist",
    "online psychologist Tacoma",
    "Kara Hokes",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  // Favicon comes from the file convention: src/app/icon.svg (brand leaf mark).
  openGraph: {
    title: "Online Therapy in Washington State | Kara Hokes, PhD",
    description:
      "Trauma, emotion regulation, and anxiety treatment by secure video. Veterans, survivors of violence, and under-represented communities: care that fits.",
    url: SITE.siteUrl,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1344,
        height: 768,
        alt: "A sunlit forest path through tall evergreens, soft light coming through the canopy.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Therapy in Washington State | Kara Hokes, PhD",
    description:
      "Trauma and emotion-regulation therapy by secure video across Washington State and PSYPACT states. Veterans, survivors, and under-represented communities.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    // Single page, one URL: the canonical keeps ?query copies and stray
    // www variants from splitting search signals.
    canonical: "/",
  },
};

// Mobile browser chrome matches the warm cream background instead of
// defaulting to white or the theme color of whatever the OS picked.
export const viewport: Viewport = {
  themeColor: "#fdf8f0",
};

// The hero image is a CSS background (not a Next <Image>), so the browser
// discovers it late and the largest contentful paint suffers for it. A
// preload hint in the head closes that gap on the single most-viewed pixel
// of the page.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero-landscape.png"
          fetchPriority="high"
        />
        {/* A page full of phone numbers otherwise gets iOS's auto-detected
            blue tel: links, which clash with the palette and underline
            nothing. Callers can still tap the labeled call buttons. */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
