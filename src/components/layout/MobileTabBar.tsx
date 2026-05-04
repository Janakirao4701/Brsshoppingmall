"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Home, 
  LayoutGrid, 
  ShoppingCart, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const TABS = [
    { name: t("home") || "Home", href: "/", icon: Home },
    { name: t("categories") || "Categories", href: "/categories", icon: LayoutGrid },
    { name: t("cart"), href: "/cart", icon: ShoppingCart },
    { name: t("account"), href: "/account", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t pb-safe">
      <div className="grid h-full grid-cols-4 items-center">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-300 active:scale-90",
                isActive ? "text-brand-red" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute inset-x-4 inset-y-2 bg-brand-red/5 rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-300" />
              )}
              <div className={cn(
                "p-1.5 rounded-full transition-all duration-300",
                isActive ? "bg-brand-red/10 scale-110" : "group-active:bg-slate-100"
              )}>
                <Icon className={cn("size-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight transition-all duration-300",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
