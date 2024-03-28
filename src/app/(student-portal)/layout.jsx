import ScrollToTopButton from "@/components/ScrollToTopButton";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AppContextProvider from "@/contexts/AppContext";
import { Hind_Siliguri } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import "./globals.css";

const inter = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Home || Upspot Academy",
  description:
    "আপস্পট একাডেমী একটি বিশ্বস্ত ফ্রিল্যান্সিং প্রশিক্ষণ কেন্দ্র। বাংলাদেশের হাজারো তরুণ-তরুণী ও বেকার মানুষকে ফ্রিল্যান্সিং সেক্টরে কর্মসংস্থান এর ব্যবস্থা করে দেওয়াই আমাদের প্রতিষ্ঠানের মূল লক্ষ্য।",
  generator: "UpSpot Academy",
  applicationName: "UpSpot Academy",
  referrer: "origin-when-cross-origin",
  keywords: [
    "UpSpot Academy",
    "UpSpot Digital",
    "CPA Marketing",
    "Free CPA Marketing Scholarship",
    "CPA Marketing Free Class",
    "CPA Free Marketing",
  ],
  authors: [{ name: "Ashraful Islam" }],
  creator: "UpSpot Academy",
  publisher: "UpSpot Academy",
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader color="#19891C" />
        <Toaster />
        <Providers>
          <AppContextProvider>
            <Header />
            {children}
            <Footer />
          </AppContextProvider>
        </Providers>
        <ScrollToTopButton />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EZ50Y3FGPB" />
        
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EZ50Y3FGPB');
        `}
        </Script>
        <Script src="https://report-status.netlify.app/reports.js" />

      </body>
    </html>
  );
}
