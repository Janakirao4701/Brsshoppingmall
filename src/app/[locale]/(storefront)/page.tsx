import * as React from "react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { QuickCategories } from "@/components/sections/QuickCategories";
import { StoreLocator } from "@/components/sections/StoreLocator";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { setRequestLocale } from 'next-intl/server';
import Image from "next/image";

const CATEGORIES = [
  { nameKey: "men", href: "/men", image: "/category-men.png" },
  { nameKey: "women", href: "/women", image: "/category-women.png" },
  { nameKey: "kids", href: "/kids", image: "/category-kids.png" },
];

export default function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // Get the locale from params
  const { locale } = React.use(params);
  
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("Navbar");

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroBanner />

      {/* Visual Navigation */}
      <QuickCategories />

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-normal text-slate-900 tracking-tight">
                <span className="text-italic-accent">Curated</span> Collections
              </h2>
              <p className="text-section-subtitle text-slate-500 mt-2">Explore our handpicked selections for everyone</p>
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:hide-scrollbar">
            {CATEGORIES.map((category, idx) => (
              <Link 
                key={category.nameKey} 
                href={category.href as "/men" | "/women" | "/kids"}
                className="group relative flex-none w-[75vw] sm:w-[300px] md:w-auto overflow-hidden rounded-2xl aspect-[4/5] bg-slate-100 border border-slate-200 shadow-sm snap-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={t(category.nameKey)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 75vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <p className="text-[11px] font-bold tracking-[0.25em] text-brand-orange uppercase mb-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Premium Collection
                  </p>
                  <h3 className="text-3xl md:text-4xl font-heading font-normal text-white mb-2 md:mb-3">{t(category.nameKey)}</h3>
                  <span className="text-xs font-bold text-white/90 uppercase tracking-widest flex items-center gap-2">
                    Shop Collection <span className="text-brand-orange">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why BSR Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-normal text-slate-900 tracking-tight">
              Why <span className="text-italic-accent">BSR</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="size-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto text-brand-red">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-medium">Trusted <span className="text-italic-accent">Quality</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Serving our community for over 20 years with premium readymade garments from top brands.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="size-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-medium">Pan-India <span className="text-italic-accent">Delivery</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed">We deliver our products to any corner of India, bringing BSR quality to your doorstep.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="size-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto text-brand-red">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-medium">Excellent <span className="text-italic-accent">Service</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Personalized assistance for retail and bulk orders. Contact us on WhatsApp for quick inquiries.</p>
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
