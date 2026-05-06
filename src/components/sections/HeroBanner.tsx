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
  text_position?: "left" | "center" | "right";
  object_position?: string;
  show_text?: boolean;
}

// Fallback slides when database is empty
const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    title: "Timeless Ethnic Collections",
    subtitle: "Exquisite Handcrafted Sarees & Kurtas",
    discount_text: "New Seasonal Drop",
    cta_text: "Shop Ethnic",
    cta_link: "/women",
    image_url: "/hero-ethnic.png",
    mobile_image_url: "/hero-ethnic.png",
    text_position: "left" as const,
    object_position: "center",
    show_text: true,
    gradient: "from-[#1a1a1a] to-transparent",
  },
  {
    id: "fallback-2",
    title: "Contemporary Western Trends",
    subtitle: "Modern Style for the Urban Soul",
    discount_text: "Premium Collection 2026",
    cta_text: "Explore Trends",
    cta_link: "/men",
    image_url: "/hero-western.png",
    mobile_image_url: "/hero-western.png",
    text_position: "center" as const,
    object_position: "center",
    show_text: true,
    gradient: "from-[#111827] to-transparent",
  },
  {
    id: "fallback-3",
    title: "The BSR Boutique Experience",
    subtitle: "Luxury Fashion, Personalized for You",
    discount_text: "Pan-India Delivery",
    cta_text: "Start Shopping",
    cta_link: "/shop",
    image_url: "/hero-boutique.png",
    mobile_image_url: "/hero-boutique.png",
    text_position: "right" as const,
    object_position: "center",
    show_text: true,
    gradient: "from-[#0f172a] to-transparent",
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
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const enrichedData = data.map((s, i) => ({
            ...s,
            gradient: GRADIENTS[i % GRADIENTS.length],
          }));
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
              <div className={cn(
                "relative w-full h-[85vh] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br",
                slide.gradient
              )}>
                {/* Full-bleed Background Image */}
                {slide.image_url && (
                  <>
                    {/* Desktop Image */}
                    <Image
                      src={slide.image_url}
                      alt={slide.title || "Banner"}
                      fill
                      style={{ objectPosition: slide.object_position || "center" }}
                      className={cn(
                        "object-cover",
                        slide.mobile_image_url ? "hidden md:block" : "block"
                      )}
                      priority={index === 0}
                      sizes="100vw"
                    />
                    {/* Mobile Image (if provided) */}
                    {slide.mobile_image_url && (
                      <Image
                        src={slide.mobile_image_url}
                        alt={slide.title || "Banner"}
                        fill
                        style={{ objectPosition: slide.object_position || "center" }}
                        className="object-cover md:hidden"
                        priority={index === 0}
                        sizes="100vw"
                      />
                    )}
                  </>
                )}

                {/* Subtle bottom gradient only — keeps the image clean */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-[1]" />

                {/* ─── Glassmorphism Text Card — position controlled by admin ─── */}
                {slide.show_text !== false && (
                  <div className={cn(
                    "absolute bottom-12 right-4 left-4 md:bottom-10 z-10 animate-in slide-in-from-bottom-6 duration-700",
                    (slide.text_position || "left") === "left" && "md:left-10 md:right-auto",
                    (slide.text_position || "left") === "center" && "md:left-1/2 md:right-auto md:-translate-x-1/2",
                    (slide.text_position || "left") === "right" && "md:right-10 md:left-auto"
                  )}>
                    <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-lg shadow-2xl shadow-black/20">
                      {/* Subtitle tag */}
                      {slide.subtitle && (
                        <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-brand-orange uppercase mb-2 md:mb-3">
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-heading font-normal text-white leading-[1.1] mb-3 md:mb-4 drop-shadow-sm">
                        {slide.title}
                      </h2>

                      {/* Discount badge */}
                      {slide.discount_text && (
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-white/[0.1] border border-white/[0.12] rounded-full mb-4 md:mb-5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-white/90 text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em]">
                            {slide.discount_text.replace(/upto\s*to/i, "Up to").replace(/upto/i, "Up to")}
                          </span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <div>
                        <Button 
                          size="sm"
                          className="md:size-default bg-white text-slate-900 hover:bg-white/90 px-6 md:px-10 py-4 md:py-6 rounded-full text-[10px] md:text-sm font-bold tracking-widest uppercase shadow-lg transition-all hover:scale-105 active:scale-95"
                        >
                          {slide.cta_text}
                          <span className="ml-2">&rarr;</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 size-12 bg-white/15 hover:bg-white/30 border-none text-white backdrop-blur-sm" />
          <CarouselNext className="right-8 size-12 bg-white/15 hover:bg-white/30 border-none text-white backdrop-blur-sm" />
        </div>
      </Carousel>
    </section>
  );
}
