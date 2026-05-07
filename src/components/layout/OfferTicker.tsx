import * as React from "react";

interface Announcement {
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

// Default announcements (clean, title case, premium tone)
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { text: "Complimentary delivery on orders above ₹999" },
  { text: "Personalized styling via WhatsApp: +91 78293 33444" },
  { text: "Boutique hours: 9:00 AM – 9:00 PM" },
];

/**
 * Parse raw announcement strings. Strips any old emoji formatting.
 */
function parseAnnouncements(raw: string[]): Announcement[] {
  return raw.map((ann) => {
    // If the database still has the old "emoji@@@text" format, strip the emoji.
    if (ann.includes("@@@")) {
      const [, ...textParts] = ann.split("@@@");
      return { text: textParts.join("@@@").trim() };
    }
    return { text: ann.trim() };
  });
}

export function OfferTicker({ initialData }: OfferTickerProps) {
  // Derive announcements from server data
  const { active, announcements } = React.useMemo(() => {
    if (initialData && initialData.announcement_active === false) {
      return { active: false, announcements: [] as Announcement[] };
    }

    const annsRaw =
      Array.isArray(initialData?.announcements) && (initialData?.announcements?.length ?? 0) > 0
        ? initialData.announcements
        : initialData?.announcement_text
          ? [initialData.announcement_text]
          : [];

    const parsed = parseAnnouncements(annsRaw);
    const final = parsed.length > 0 ? parsed : DEFAULT_ANNOUNCEMENTS;

    return { active: true, announcements: final };
  }, [initialData]);

  if (!active || announcements.length === 0) return null;

  return (
    <div className="w-full bg-[#111111] text-white/80 py-2.5 px-4 z-40 relative">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
          {announcements.map((ann, idx) => (
            <React.Fragment key={idx}>
              <div 
                className={`text-[10px] md:text-[11px] font-medium tracking-[0.08em] ${
                  idx > 0 ? "hidden md:block" : "block"
                }`}
              >
                {/* 
                  Use subtle title casing if possible, but trust the database content. 
                  We remove 'uppercase' class to maintain typographic restraint. 
                */}
                {ann.text}
              </div>
              {/* Minimalist separator, hidden after the last item and hidden on mobile for secondary items */}
              {idx < announcements.length - 1 && (
                <span className="hidden md:block text-white/30 text-[10px] mx-2">
                  &bull;
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
