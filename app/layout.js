import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";
const Navbar = dynamic(() => import("@/components/Navbar"));
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "सांगोपांग - समाचार और जानकारी",
  description: "प्रौद्योगिकी और लोकरुचि की जानकारी हिंदी में",
  keywords:
    "समाचार, हिंदी समाचार, जयपुर, नगर-डगर, दुनिया-जहान, फोटो फीचर, खेल संसार",
  authors: [{ name: "सांगोपांग" }],
  creator: "सांगोपांग",
  publisher: "सांगोपांग",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.sangopang.com",
    siteName: "सांगोपांग-सार समाचार",
    title: "समाचार और सामान्य ज्ञान हिंदी भाषा में",
    description: "प्रौद्योगिकी और लोकरुचि की जानकारी हिंदी में",
  },
  twitter: {
    card: "summary_large_image",
    title: "सांगोपांग - समाचार और जानकारी",
    description: "प्रौद्योगिकी और लोकरुचि की जानकारी हिंदी में",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="hi">
      <head>
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_SITE_URL || "https://www.sangopang.com"}
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
