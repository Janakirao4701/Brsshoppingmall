"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show widget after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi BSR Shopping Mall, I'd like to inquire about your products."
  )}`;

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-500 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-110 active:scale-95"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulsing effect */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 group-hover:hidden" />
        
        {/* Label (visible on hover) */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold text-sm transition-all duration-300 group-hover:max-w-xs group-hover:ml-2">
          Chat with us
        </span>
        
        <MessageCircle className="size-7 fill-white/10" />
      </a>
    </div>
  );
}
