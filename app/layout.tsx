import type { Metadata } from "next";
import { Baskervville, Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import SiteHeader from "@/components/layout/SiteHeader";
import { LocationProvider } from "@/contexts/location.context";

const baskervville = Baskervville({
  variable: "--font-baskervville",
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

export const metadata: Metadata = {
  title: "Lettuce-Entertain-You-Coding-Challenge",
  description:
    "A coding challenge requested during my interview process with Lettuce Entertain You Enterprises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${baskervville.variable} ${outfit.variable} antialiased min-h-screen flex flex-col bg-white text-text-black`}
      >
        <LocationProvider>
          <SiteHeader />
          <main className="flex-grow">{children}</main>
        </LocationProvider>
        <Footer />
      </body>
    </html>
  );
}
