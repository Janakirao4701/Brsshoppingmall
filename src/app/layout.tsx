import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("h-full", "antialiased", inter.variable, outfit.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
