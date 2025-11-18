// app/components/GoogleAnalytics.js
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const GoogleAnalyticsComponent = () => {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Page view tracking के लिए
  useEffect(() => {
    if (GA_TRACKING_ID && typeof window.gtag !== "undefined") {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: pathname + searchParams.toString(),
      });
    }
  }, [pathname, searchParams, GA_TRACKING_ID]);

  if (!GA_TRACKING_ID) {
    console.warn("Google Analytics ID not found in environment variables");
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
          
          // Debug के लिए
          console.log('Google Analytics initialized with ID: ${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
};

const GoogleAnalytics = () => {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsComponent />
    </Suspense>
  );
};

export default GoogleAnalytics;
