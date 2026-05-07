import * as React from "react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { QuickCategories } from "@/components/sections/QuickCategories";
import { StoreLocator } from "@/components/sections/StoreLocator";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { getHeroBanners } from "@/lib/storefront-data";

const CATEGORIES = [
  { nameKey: "men", href: "/men", image: "/category-men.png" },
  { nameKey: "women", href: "/women", image: "/category-women.png" },
  { nameKey: "kids", href: "/kids", image: "/category-kids.png" },
];

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // Fetch hero banners on the server — no client-side fetch needed
  const heroBanners = await getHeroBanners();

  return <HomeContent locale={locale} heroBanners={heroBanners} />;
}

function HomeContent({ locale, heroBanners }: { locale: string; heroBanners: any[] }) {
  const t = useTranslations("Navbar");

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section — data pre-fetched on server */}
      <HeroBanner initialSlides={heroBanners} />

      {/* Visual Navigation */}
      <QuickCategories />

      {/* Featured Categories */}
      <section className="py-20 md:py-32 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-slate-900 tracking-tight mb-4">
              <span className="text-italic-accent">Curated</span> Collections
            </h2>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Explore our handpicked selections</p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:hide-scrollbar">
            {CATEGORIES.map((category, idx) => (
              <Link 
                key={category.nameKey} 
                href={category.href as "/men" | "/women" | "/kids"}
                className="group relative flex-none w-[80vw] sm:w-[320px] md:w-auto overflow-hidden bg-slate-100 aspect-[3/4] snap-center transition-all duration-700"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={t(category.nameKey)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 80vw, 33vw"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 z-20">
                  <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-center">
                    <h3 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4 drop-shadow-sm">{t(category.nameKey)}</h3>
                    <span className="inline-block border border-white/50 text-white text-[11px] uppercase tracking-[0.2em] font-medium px-6 py-2 hover:bg-white hover:text-black transition-colors duration-300">
                      Discover
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why BSR Section */}
      <section className="py-20 md:py-32 px-4 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-slate-900 tracking-tight mb-4">
              Why <span className="text-italic-accent">BSR</span>
            </h2>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">The BSR Boutique Experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-16 rounded-full border border-slate-200 flex items-center justify-center text-slate-900">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-slate-900 mb-3">Trusted <span className="text-italic-accent">Quality</span></h3>
                <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs mx-auto">Serving our community for over 20 years with premium readymade garments from top brands.</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-16 rounded-full border border-slate-200 flex items-center justify-center text-slate-900">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-slate-900 mb-3">Pan-India <span className="text-italic-accent">Delivery</span></h3>
                <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs mx-auto">We deliver our products to any corner of India, bringing BSR quality to your doorstep.</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-16 rounded-full border border-slate-200 flex items-center justify-center text-slate-900">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-slate-900 mb-3">Excellent <span className="text-italic-accent">Service</span></h3>
                <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs mx-auto">Personalized assistance for retail and bulk orders. Contact us on WhatsApp for inquiries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locator Section */}
      <StoreLocator />

      {/* Structured Data for Local Business (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            "name": "BSR Shopping Mall",
            "image": "https://brsshoppingmall.vercel.app/bsr-logo.png",
            "description": "Premium readymade garments for Men, Women, and Kids with All India Delivery.",
            "address": [
              {
                "@type": "PostalAddress",
                "streetAddress": "Main Road",
                "addressLocality": "Sompeta",
                "addressRegion": "Andhra Pradesh",
                "addressCountry": "IN"
              },
              {
                "@type": "PostalAddress",
                "streetAddress": "K T Road",
                "addressLocality": "Palasa",
                "addressRegion": "Andhra Pradesh",
                "addressCountry": "IN"
              }
            ],
            "priceRange": "$$",
            "telephone": "+917829333444",
            "url": "https://brsshoppingmall.vercel.app"
          })
        }}
      />
    </div>
  );
}
