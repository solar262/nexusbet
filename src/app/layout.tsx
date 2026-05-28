import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://marketvibe1.com";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "MarketVibe AI";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — AI Lead Finder for Freelancers and Agencies`,
    template: `%s | ${siteName}`,
  },
  description:
    "Find local business leads, score buying signals, and generate outreach emails for web design, SEO, chatbot, and AI automation services.",
  keywords: [
    "AI lead finder",
    "local business leads",
    "agency lead generation",
    "freelancer leads",
    "SEO leads",
    "web design leads",
    "AI automation leads",
    "cold email leads",
    "MarketVibe AI",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${siteName} — Find Businesses Ready to Buy Your Service`,
    description:
      "Search a niche and city to uncover local businesses with visible problems, then generate outreach that sounds human.",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — AI Lead Finder`,
    description: "Find local businesses that need websites, SEO, chatbots, and automation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
