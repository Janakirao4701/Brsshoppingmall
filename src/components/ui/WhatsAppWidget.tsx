"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 3 seconds, hide after 8
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";
  const message = "Hi BSR Shopping Mall! I'd like to inquire about your products.";

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="bg-white px-4 py-2 rounded-xl shadow-2xl border border-slate-100 text-sm font-medium text-slate-900 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-500">
          Need help? Chat with us! 👋
        </div>
      )}

      {/* Chat Bubble (when open) */}
      {isOpen && (
        <div className="bg-white w-72 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#25D366] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="size-6" />
              </div>
              <div>
                <p className="font-bold">BSR Support</p>
                <p className="text-[10px] opacity-90">Usually replies in minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full">
              <X className="size-4" />
            </button>
          </div>
          <div className="p-4 bg-slate-50">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm text-slate-700 mb-4 border border-slate-100">
              Hi there! How can we help you today? Feel free to ask about orders, sizes, or availability.
            </div>
            <button 
              onClick={handleOpenWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="size-5" />
              Start WhatsApp Chat
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "pointer-events-auto size-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95",
          isOpen ? "bg-slate-900" : "bg-[#25D366]"
        )}
      >
        {isOpen ? <X className="size-6" /> : <MessageCircle className="size-7" />}
      </button>
    </div>
  );
}
