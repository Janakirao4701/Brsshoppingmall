"use client";

import * as React from "react";
import { Truck, Phone, Clock } from "lucide-react";
import gsap from "gsap";

const OFFERS = [
  { icon: Truck, text: "FREE DELIVERY ON ORDERS ABOVE ₹999", color: "text-white" },
  { icon: Phone, text: "ORDER ON WHATSAPP: +91 78293 33444", color: "text-white" },
  { icon: Clock, text: "OPEN DAILY: 9:00 AM – 9:00 PM", color: "text-white" },
];

export function OfferTicker() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    
    // Duplicate content for seamless loop
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });

    const scrollWidth = scrollerRef.current.scrollWidth;
    
    gsap.to(scrollerRef.current, {
      x: `-50%`,
      duration: 25,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-slate-900 text-white overflow-hidden whitespace-nowrap py-2 border-b border-white/5"
    >
      <div 
        ref={scrollerRef}
        className="flex items-center space-x-12 w-max"
      >
        {OFFERS.map((offer, idx) => (
          <div 
            key={idx} 
            className="flex items-center space-x-3 text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase px-4"
          >
            <offer.icon className="size-3.5 text-brand-orange" />
            <span>{offer.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
