"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  const t = useTranslations("Common");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";
  const message = encodeURIComponent("Hi BSR Shopping Mall, I would like to inquire about your products.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed z-50 flex items-center justify-center size-14 md:size-16 rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 active:scale-95 animate-whatsapp-pulse",
        "bottom-20 right-6 md:bottom-8 md:right-8" // Positioned above mobile tab bar
      )}
      aria-label={t("whatsapp")}
    >
      <MessageCircle className="size-8 md:size-10 fill-current" />
      <span className="sr-only">{t("whatsapp")}</span>
    </a>
  );
}
