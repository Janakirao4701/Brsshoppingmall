"use client";

import * as React from "react";
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

const SLIDES = [
  {
    title: "Summer Collection 2026",
    subtitle: "Premium Readymade Garments",
    discount: "Up to 50% Off",
    cta: "Shop Now",
    gradient: "from-[#DC2626] to-[#EA580C]",
  },
  {
    title: "New Arrivals in Men's Wear",
    subtitle: "Stay Stylish, Stay Comfortable",
    discount: "Fresh Stock Just Arrived",
    cta: "Explore Collection",
    gradient: "from-[#EA580C] to-[#DC2626]",
  },
  {
    title: "All India Home Delivery",
    subtitle: "Pan-India Shipping Available",
    discount: "Order from anywhere in India",
    cta: "Start Shopping",
    gradient: "from-[#991b1b] to-[#c2410c]",
  },
  {
    title: "Bulk & School Orders",
    subtitle: "Festival & Institution Specials",
    discount: "Special Discounts on Bulk Orders",
    cta: "Inquire Now",
    gradient: "from-[#c2410c] to-[#991b1b]",
  },
];

export function HeroBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {SLIDES.map((slide, index) => (
            <CarouselItem key={index}>
              <div className={cn(
                "relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-br",
                slide.gradient
              )}>
                {/* Visual decoration */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-black/10 blur-3xl" />

                <div className="relative z-10 max-w-3xl space-y-4 md:space-y-6">
                  <p className="text-sm md:text-base font-medium text-white/90 tracking-widest uppercase">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
                    {slide.title}
                  </h2>
                  <div className="inline-block py-1 px-4 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold text-lg md:text-xl">
                    {slide.discount}
                  </div>
                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white text-brand-red hover:bg-slate-100 px-8 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105"
                    >
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation arrows (hidden on small screens) */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 size-12 bg-white/20 hover:bg-white/40 border-none text-white" />
          <CarouselNext className="right-8 size-12 bg-white/20 hover:bg-white/40 border-none text-white" />
        </div>
      </Carousel>
    </section>
  );
}
