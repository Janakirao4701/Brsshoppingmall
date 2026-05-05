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
  mobile_image_url?: string | null;
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
    mobile_image_url: "",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    accentColor: "text-orange-400",
  },
  {
    id: "fallback-2",
    title: "New Arrivals in Men's Wear",
    subtitle: "Stay Stylish, Stay Comfortable",
    discount_text: "Fresh Stock Just Arrived",
    cta_text: "Explore Collection",
    cta_link: "/men",
    image_url: "",
    mobile_image_url: "",
    gradient: "from-[#2d1b69] via-[#1e1145] to-[#11071f]",
    accentColor: "text-violet-400",
  },
  {
    id: "fallback-3",
    title: "All India Delivery",
    subtitle: "Pan-India Shipping Available",
    discount_text: "Order from anywhere in India",
    cta_text: "Start Shopping",
    cta_link: "/women",
    image_url: "",
    mobile_image_url: "",
    gradient: "from-[#1a0000] via-[#3d0c0c] to-[#5c1a1a]",
    accentColor: "text-red-400",
  },
];

const SLIDE_THEMES = [
  { gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]", accentColor: "text-orange-400" },
  { gradient: "from-[#2d1b69] via-[#1e1145] to-[#11071f]", accentColor: "text-violet-400" },
  { gradient: "from-[#1a0000] via-[#3d0c0c] to-[#5c1a1a]", accentColor: "text-red-400" },
];

export function HeroBanner() {
  const t = useTranslations("Hero");
  const [slides, setSlides] = React.useState<(HeroBannerSlide & { gradient: string; accentColor: string })[]>(FALLBACK_SLIDES);

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
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          let mobileData: any[] | null = null;
          try {
            const res = await supabase
              .from("hero_banners")
              .select("id, mobile_image_url")
              .eq("is_active", true);
            mobileData = res.data;
          } catch {
            // Column might not exist yet
          }

          const enrichedData = data.map((s, i) => {
            const mobileImg = mobileData?.find(m => m.id === s.id)?.mobile_image_url;
            const theme = SLIDE_THEMES[i % SLIDE_THEMES.length];
            return {
              ...s,
              mobile_image_url: mobileImg,
              gradient: theme.gradient,
              accentColor: theme.accentColor,
            };
          });
          setSlides(enrichedData);
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
              {/* ─── DESKTOP: Side-by-side layout ─── */}
              <div className="hidden md:flex w-full h-[600px] lg:h-[700px]">
                {/* Left: Text Panel */}
                <div className={cn(
                  "w-[45%] lg:w-[42%] flex flex-col justify-center px-12 lg:px-20 bg-gradient-to-br relative overflow-hidden",
                  slide.gradient
                )}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] rounded-full translate-y-1/3 -translate-x-1/4" />

                  <div className="relative z-10 space-y-6">
                    {slide.subtitle && (
                      <p className={cn(
                        "text-xs font-bold tracking-[0.3em] uppercase animate-in slide-in-from-left-4 duration-700",
                        slide.accentColor
                      )}>
                        {slide.subtitle}
                      </p>
                    )}
                    <h2 className="text-5xl lg:text-6xl xl:text-7xl font-heading font-normal text-white leading-[1.05] animate-in slide-in-from-left-6 duration-700 delay-100">
                      {slide.title}
                    </h2>
                    {slide.discount_text && (
                      <div className="inline-flex items-center gap-2 py-2 px-5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] rounded-full animate-in slide-in-from-left-8 duration-700 delay-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em]">
                          {slide.discount_text.replace(/upto\s*to/i, "Up to").replace(/upto/i, "Up to")}
                        </span>
                      </div>
                    )}
                    <div className="pt-4 animate-in slide-in-from-left-10 duration-700 delay-300">
                      <Button 
                        size="lg" 
                        variant="secondary"
                        className="bg-white text-slate-900 hover:bg-white/90 px-10 py-6 rounded-full text-sm font-bold tracking-widest uppercase shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
                      >
                        {slide.cta_text}
                        <span className="ml-2">&rarr;</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right: Image Panel */}
                <div className="w-[55%] lg:w-[58%] relative overflow-hidden">
                  {slide.image_url ? (
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br opacity-60", slide.gradient)} />
                  )}
                  {/* Subtle left-edge blend */}
                  <div className={cn(
                    "absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent",
                    slide.gradient.includes("1a1a2e") ? "from-[#0f3460]" :
                    slide.gradient.includes("2d1b69") ? "from-[#11071f]" :
                    "from-[#5c1a1a]"
                  )} />
                </div>
              </div>

              {/* ─── MOBILE: Stacked layout ─── */}
              <div className="flex md:hidden flex-col w-full">
                {/* Top: Image Area */}
                <div className="relative w-full h-[45vh] min-h-[280px] overflow-hidden">
                  {slide.image_url ? (
                    <>
                      {slide.mobile_image_url ? (
                        <Image
                          src={slide.mobile_image_url}
                          alt={slide.title}
                          fill
                          className="object-cover object-top"
                          priority={index === 0}
                        />
                      ) : (
                        <Image
                          src={slide.image_url}
                          alt={slide.title}
                          fill
                          className="object-cover object-[70%_top]"
                          priority={index === 0}
                        />
                      )}
                    </>
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br opacity-60", slide.gradient)} />
                  )}
                  {/* Bottom fade into text area */}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t to-transparent",
                    slide.gradient.includes("1a1a2e") ? "from-[#1a1a2e]" :
                    slide.gradient.includes("2d1b69") ? "from-[#2d1b69]" :
                    "from-[#1a0000]"
                  )} />
                </div>

                {/* Bottom: Text Area */}
                <div className={cn(
                  "px-6 pt-4 pb-8 bg-gradient-to-br relative overflow-hidden",
                  slide.gradient
                )}>
                  {/* Decorative circle */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/[0.03] rounded-full" />

                  <div className="relative z-10 space-y-4">
                    {slide.subtitle && (
                      <p className={cn(
                        "text-[10px] font-bold tracking-[0.3em] uppercase",
                        slide.accentColor
                      )}>
                        {slide.subtitle}
                      </p>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-heading font-normal text-white leading-[1.1]">
                      {slide.title}
                    </h2>
                    {slide.discount_text && (
                      <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-white/[0.08] border border-white/[0.1] rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 text-[10px] font-semibold uppercase tracking-[0.2em]">
                          {slide.discount_text.replace(/upto\s*to/i, "Up to").replace(/upto/i, "Up to")}
                        </span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button 
                        size="default" 
                        variant="secondary"
                        className="bg-white text-slate-900 hover:bg-white/90 px-8 py-5 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl"
                      >
                        {slide.cta_text}
                        <span className="ml-2">&rarr;</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-[46%] lg:left-[43%] top-1/2 size-12 bg-black/20 hover:bg-black/40 border-none text-white backdrop-blur-sm" />
          <CarouselNext className="right-8 size-12 bg-black/20 hover:bg-black/40 border-none text-white backdrop-blur-sm" />
        </div>
      </Carousel>
    </section>
  );
}
