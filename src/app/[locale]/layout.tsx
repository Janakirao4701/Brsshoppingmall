import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
