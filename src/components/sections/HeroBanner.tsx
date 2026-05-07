"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroBannerSlide {
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
const FALLBACK_SLIDES: (HeroBannerSlide & { gradient: string })[] = [
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

interface HeroBannerProps {
  /** Server-fetched slides. Falls back to hardcoded slides if empty/undefined. */
  initialSlides?: HeroBannerSlide[];
}

export function HeroBanner({ initialSlides }: HeroBannerProps) {
  const slides = React.useMemo(() => {
    if (initialSlides && initialSlides.length > 0) {
      return initialSlides.map((s, i) => ({
        ...s,
        gradient: GRADIENTS[i % GRADIENTS.length],
      }));
    }
    return FALLBACK_SLIDES;
  }, [initialSlides]);

  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="w-full bg-slate-50">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className={cn(
                // Mobile: 65svh prevents address-bar jump CLS. 
                // Desktop: 85vh to 100vh cinematic scale.
                "relative w-full h-[65svh] md:h-[85vh] md:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br",
                slide.gradient
              )}>
                {/* Background Imagery */}
                {slide.image_url && (
                  <>
                    {/* Desktop Image (Hidden on mobile) */}
                    <Image
                      src={slide.image_url}
                      alt={slide.title || "Banner"}
                      fill
                      style={{ objectPosition: slide.object_position || "center" }}
                      className="object-cover hidden md:block"
                      priority={index === 0}
                      sizes="100vw"
                      quality={90}
                    />
                    
                    {/* Mobile Image (Hidden on desktop) */}
                    {/* If no mobile image exists, we reuse desktop image but force 'center top' to avoid chopping off heads */}
                    <Image
                      src={slide.mobile_image_url || slide.image_url}
                      alt={slide.title || "Banner"}
                      fill
                      style={{ 
                        objectPosition: slide.mobile_image_url 
                          ? (slide.object_position || "center") 
                          : "center top" 
                      }}
                      className="object-cover block md:hidden"
                      priority={index === 0}
                      sizes="100vw"
                      quality={85}
                    />
                  </>
                )}

                {/* Subtle gradient to ensure text readability without muddying the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1] md:bg-gradient-to-r md:from-black/60 md:via-transparent md:to-transparent" />

                {/* ─── Minimalist Text Overlay ─── */}
                {slide.show_text !== false && (
                  <div className={cn(
                    "absolute bottom-0 right-0 left-0 md:top-0 md:bottom-0 z-10 animate-in fade-in duration-1000 flex flex-col justify-end md:justify-center p-5 pb-12 sm:p-8 md:p-12 lg:p-24",
                    (slide.text_position || "left") === "left" && "md:items-start text-center md:text-left",
                    (slide.text_position || "left") === "center" && "md:items-center text-center",
                    (slide.text_position || "left") === "right" && "md:items-end text-center md:text-right"
                  )}>
                    <div className="max-w-full md:max-w-2xl will-change-transform will-change-opacity space-y-4 md:space-y-6">
                      
                      {/* Subtitle / Discount tag */}
                      {(slide.subtitle || slide.discount_text) && (
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 justify-center md:justify-start">
                          {slide.discount_text && (
                            <span className="inline-block border border-white/30 text-white text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1">
                              {slide.discount_text.replace(/upto\s*to/i, "Up to").replace(/upto/i, "Up to")}
                            </span>
                          )}
                          {slide.subtitle && (
                            <span className="text-[10px] md:text-[11px] font-medium tracking-[0.25em] text-white/90 uppercase">
                              {slide.subtitle}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-white tracking-tight drop-shadow-sm px-2 md:px-0">
                        {slide.title}
                      </h2>

                      {/* CTA Button */}
                      <div className="pt-2 md:pt-4 pb-2">
                        <Button 
                          asChild
                          variant="outline"
                          className="bg-white/10 hover:bg-white text-white hover:text-black border-white px-8 py-5 md:px-12 md:py-6 rounded-none text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ease-out"
                        >
                          <Link href={slide.cta_link as any}>
                            {slide.cta_text}
                          </Link>
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
          <CarouselPrevious className="left-8 size-12 bg-white/15 hover:bg-white/30 border-none text-white backdrop-blur-sm transition-colors" />
          <CarouselNext className="right-8 size-12 bg-white/15 hover:bg-white/30 border-none text-white backdrop-blur-sm transition-colors" />
        </div>
      </Carousel>
    </section>
  );
}
