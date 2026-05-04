import * as React from "react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { StoreLocator } from "@/components/sections/StoreLocator";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from 'next-intl/server';

const CATEGORIES = [
  { nameKey: "men", href: "/men", descriptionKey: "menDesc" },
  { nameKey: "women", href: "/women", descriptionKey: "womenDesc" },
  { nameKey: "kids", href: "/kids", descriptionKey: "kidsDesc" },
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

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold">Featured Categories</h2>
              <p className="text-muted-foreground">Explore our curated collections for everyone</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((category) => (
              <Link 
                key={category.nameKey} 
                href={category.href as "/men" | "/women" | "/kids"}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-slate-100 border border-slate-200"
              >
                {/* Background (Gradient placeholder) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-brand-red/10 group-hover:bg-brand-red/0 transition-colors duration-500" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl font-heading font-bold text-white mb-1">{t(category.nameKey)}</h3>
                  <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Quality collection for {t(category.nameKey)}
                  </p>
                  <div className="inline-flex items-center text-white text-sm font-bold uppercase tracking-wider">
                    Shop {t(category.nameKey)} <ChevronRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why BSR Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="size-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto text-brand-red">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Trusted Quality</h3>
              <p className="text-muted-foreground text-sm">Serving our community for over 20 years with premium readymade garments from top brands.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="size-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Pan-India Delivery</h3>
              <p className="text-muted-foreground text-sm">We deliver our products to any corner of India, bringing BSR quality to your doorstep.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="size-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto text-brand-red">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Excellent Service</h3>
              <p className="text-muted-foreground text-sm">Personalized assistance for retail and bulk orders. Contact us on WhatsApp for quick inquiries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locator Section */}
      <StoreLocator />
    </div>
  );
}
