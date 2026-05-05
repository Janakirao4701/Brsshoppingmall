"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import { createClient } from "@supabase/supabase-js";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroBannerSlide {
  id: string;
  title: string;
  subtitle: string | null;
  discount_text: string | null;
  cta_text: string;
  cta_link: string;
  image_url: string;
}

// Fallback slides when database is empty
const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    title: "Summer Collection 2026",
    subtitle: "Premium Readymade Garments",
    discount_text: "Up to 50% Off",
    cta_text: "Shop Now",
    cta_link: "/men",
    image_url: "",
    gradient: "from-[#DC2626] to-[#EA580C]",
  },
  {
    id: "fallback-2",
    title: "New Arrivals in Men's Wear",
    subtitle: "Stay Stylish, Stay Comfortable",
    discount_text: "Fresh Stock Just Arrived",
    cta_text: "Explore Collection",
    cta_link: "/men",
    image_url: "",
    gradient: "from-[#EA580C] to-[#DC2626]",
  },
  {
    id: "fallback-3",
    title: "All India Delivery",
    subtitle: "Pan-India Shipping Available",
    discount_text: "Order from anywhere in India",
    cta_text: "Start Shopping",
    cta_link: "/women",
    image_url: "",
    gradient: "from-[#991b1b] to-[#c2410c]",
  },
];

const GRADIENTS = [
  "from-[#DC2626] to-[#EA580C]",
  "from-[#EA580C] to-[#DC2626]",
  "from-[#991b1b] to-[#c2410c]",
];

export function HeroBanner() {
  const t = useTranslations("Hero");
  const [slides, setSlides] = React.useState<(HeroBannerSlide & { gradient: string })[]>(FALLBACK_SLIDES);

  React.useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient(supabaseUrl, supabaseKey);
    supabase
      .from("hero_banners")
      .select("id, title, subtitle, discount_text, cta_text, cta_link, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSlides(data.map((s, i) => ({ ...s, gradient: GRADIENTS[i % GRADIENTS.length] })));
        }
      });
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className={cn(
                "relative w-full h-[80vh] min-h-[500px] md:h-[600px] lg:h-[700px] flex items-end md:items-center justify-center md:justify-start text-center md:text-left px-6 pb-24 md:pb-0 md:px-16 lg:px-24 overflow-hidden bg-gradient-to-br",
                slide.gradient
              )}>
                {/* Background Image */}
                {slide.image_url && (
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                )}

                {/* Dark overlay for text readability - heavier at bottom on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 z-[1] md:bg-black/40" />

                {/* Visual decoration */}
                <div className="absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl z-[2]" />
                <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-brand-orange/20 blur-3xl z-[2] md:bg-black/10" />

                <div className="relative z-10 w-full max-w-2xl space-y-5 md:space-y-6">
                  {slide.subtitle && (
                    <p className="text-[11px] md:text-sm font-bold tracking-[0.2em] text-white/90 uppercase animate-in slide-in-from-bottom-4 duration-700">
                      {slide.subtitle}
                    </p>
                  )}
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-normal text-white leading-[1.1] drop-shadow-lg animate-in slide-in-from-bottom-6 duration-700 delay-100">
                    {slide.title}
                  </h2>
                  {slide.discount_text && (
                    <div className="inline-block py-2 px-6 bg-white/20 backdrop-blur-md rounded-full text-white font-heading text-lg md:text-2xl italic tracking-wide animate-in slide-in-from-bottom-8 duration-700 delay-200">
                      {slide.discount_text.replace(/upto/i, "Up to")}
                    </div>
                  )}
                  <div className="pt-6 animate-in slide-in-from-bottom-10 duration-700 delay-300">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white text-brand-red hover:bg-slate-50 px-12 py-7 rounded-full text-sm font-bold tracking-widest uppercase shadow-[0_8px_30px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95"
                    >
                      {slide.cta_text}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 size-12 bg-white/20 hover:bg-white/40 border-none text-white" />
          <CarouselNext className="right-8 size-12 bg-white/20 hover:bg-white/40 border-none text-white" />
        </div>
      </Carousel>
    </section>
  );
}
