"use client";

import * as React from "react";
import { Truck, Phone, Clock, Sparkles } from "lucide-react";
import gsap from "gsap";
import { supabase } from "@/lib/supabase";

export function OfferTicker() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [announcements, setAnnouncements] = React.useState<string[]>([]);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("settings")
      .select("announcements, announcement_active, announcement_text")
      .eq("id", "00000000-0000-0000-0000-000000000000")
      .single();

    if (data && data.announcement_active) {
      const anns = Array.isArray(data.announcements) && data.announcements.length > 0
        ? data.announcements
        : (data.announcement_text ? [data.announcement_text] : []);
      
      // Default fallback info if DB is empty but active
      const finalAnns = anns.length > 0 ? anns : [
        "FREE DELIVERY ON ORDERS ABOVE ₹999",
        "ORDER ON WHATSAPP: +91 78293 33444",
        "OPEN DAILY: 9:00 AM – 9:00 PM"
      ];
      
      setAnnouncements(finalAnns);
      setActive(true);
    }
  };

  React.useEffect(() => {
    if (!scrollerRef.current || announcements.length === 0) return;

    // Clear any existing duplicated nodes first
    const originalChildren = Array.from(scrollerRef.current.children);
    
    // Duplicate content for seamless loop
    originalChildren.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });

    const scrollWidth = scrollerRef.current.scrollWidth;
    
    const anim = gsap.to(scrollerRef.current, {
      x: `-50%`,
      duration: announcements.length * 8, // Adjust speed based on length
      ease: "none",
      repeat: -1,
    });

    return () => {
      anim.kill();
    };
  }, [announcements]);

  if (!active || announcements.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="bg-slate-900 text-white overflow-hidden whitespace-nowrap py-2 border-b border-white/5"
    >
      <div 
        ref={scrollerRef}
        className="flex items-center space-x-12 w-max"
      >
        {announcements.map((text, idx) => (
          <div 
            key={idx} 
            className="flex items-center space-x-3 text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase px-4"
          >
            <Sparkles className="size-3.5 text-brand-orange" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
