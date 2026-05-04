import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { WhatsAppFloat } from "@/components/sections/WhatsAppFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BSR Shopping Mall - Readymade Garments | Sompeta & Palasa",
  description:
    "BSR Shopping Mall offers the best readymade garments for Men, Women & Kids. Shop branded clothing with All India Home Delivery. Visit our stores in Sompeta & Palasa, Andhra Pradesh.",
  keywords: [
    "BSR Shopping Mall",
    "readymade garments",
    "Sompeta",
    "Palasa",
    "clothing store",
    "Andhra Pradesh",
    "men's wear",
    "women's wear",
    "kids' wear",
    "bulk orders",
  ],
  openGraph: {
    title: "BSR Shopping Mall - Readymade Garments | Sompeta & Palasa",
    description:
      "Shop branded readymade garments with All India Home Delivery. Men, Women & Kids collections available.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileTabBar />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
