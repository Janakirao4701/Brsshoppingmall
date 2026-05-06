"use client";

import * as React from "react";
import gsap from "gsap";
import { supabase } from "@/lib/supabase";

export function OfferTicker() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [announcements, setAnnouncements] = React.useState<{emoji: string, text: string}[]>([]);
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
      const annsRaw = Array.isArray(data.announcements) && data.announcements.length > 0
        ? data.announcements
        : (data.announcement_text ? [data.announcement_text] : []);
      
      const parsedAnns = annsRaw.map(ann => {
        if (ann.includes('@@@')) {
          const [emoji, ...textParts] = ann.split('@@@');
          return { emoji, text: textParts.join('@@@') };
        }
        return { emoji: "✨", text: ann };
      });
      
      // Fallback if empty
      const finalAnns = parsedAnns.length > 0 ? parsedAnns : [
        { emoji: "🚚", text: "FREE DELIVERY ON ORDERS ABOVE ₹999" },
        { emoji: "📞", text: "ORDER ON WHATSAPP: +91 78293 33444" },
        { emoji: "🕙", text: "OPEN DAILY: 9:00 AM – 9:00 PM" }
      ];
      
      setAnnouncements(finalAnns);
      setActive(true);
    }
  };

  React.useEffect(() => {
    if (!scrollerRef.current || announcements.length === 0) return;

    // Clear and clone for seamless loop
    const scroller = scrollerRef.current;
    const originalChildren = Array.from(scroller.children);
    
    // Safety: don't duplicate if already duplicated (though React re-render usually clears this)
    if (scroller.children.length === announcements.length) {
      originalChildren.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scroller.appendChild(duplicatedItem);
      });
    }

    const anim = gsap.to(scroller, {
      x: `-50%`,
      duration: Math.max(20, announcements.length * 10),
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
      className="bg-slate-900 text-white overflow-hidden whitespace-nowrap py-2.5 border-b border-white/5"
    >
      <div 
        ref={scrollerRef}
        className="flex items-center space-x-12 w-max"
      >
        {announcements.map((ann, idx) => (
          <div 
            key={idx} 
            className="flex items-center space-x-3 text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase px-4"
          >
            <span className="text-sm">{ann.emoji}</span>
            <span>{ann.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
