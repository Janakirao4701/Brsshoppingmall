"use client";

import * as React from "react";
import gsap from "gsap";

interface Announcement {
  emoji: string;
  text: string;
}

interface OfferTickerProps {
  /** Server-fetched announcement data from settings table */
  initialData?: {
    announcements?: string[];
    announcement_active?: boolean;
    announcement_text?: string;
  } | null;
}

// Default announcements shown when no server data is available
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { emoji: "🚚", text: "FREE DELIVERY ON ORDERS ABOVE ₹999" },
  { emoji: "📞", text: "ORDER ON WHATSAPP: +91 78293 33444" },
  { emoji: "🕙", text: "OPEN DAILY: 9:00 AM – 9:00 PM" },
];

/**
 * Parse raw announcement strings into emoji + text pairs.
 * Format: "emoji@@@text" or plain text (gets ✨ emoji).
 */
function parseAnnouncements(raw: string[]): Announcement[] {
  return raw.map((ann) => {
    if (ann.includes("@@@")) {
      const [emoji, ...textParts] = ann.split("@@@");
      return { emoji, text: textParts.join("@@@") };
    }
    return { emoji: "✨", text: ann };
  });
}

export function OfferTicker({ initialData }: OfferTickerProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  // Derive announcements from server data
  const { active, announcements } = React.useMemo(() => {
    if (!initialData || !initialData.announcement_active) {
      return { active: false, announcements: [] as Announcement[] };
    }

    const annsRaw =
      Array.isArray(initialData.announcements) && initialData.announcements.length > 0
        ? initialData.announcements
        : initialData.announcement_text
          ? [initialData.announcement_text]
          : [];

    const parsed = parseAnnouncements(annsRaw);
    const final = parsed.length > 0 ? parsed : DEFAULT_ANNOUNCEMENTS;

    return { active: true, announcements: final };
  }, [initialData]);

  React.useEffect(() => {
    if (!scrollerRef.current || announcements.length === 0) return;

    // Clone children for seamless infinite loop
    const scroller = scrollerRef.current;
    const originalChildren = Array.from(scroller.children);

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
    <div className="bg-slate-900 text-white overflow-hidden whitespace-nowrap py-2.5 border-b border-white/5">
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
