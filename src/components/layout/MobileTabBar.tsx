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
import { useCart } from "@/lib/store";

export function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const cart = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const LINK_TABS = [
    { name: t("home") || "Home", href: "/", icon: Home },
    { name: t("men") || "Men", href: "/men", icon: LayoutGrid },
    { name: t("account"), href: "/account", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/50 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="grid h-16 grid-cols-4 items-center px-2">
        {/* Home */}
        {LINK_TABS.slice(0, 1).map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-300",
                isActive ? "text-brand-red" : "text-slate-400 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "relative p-1 rounded-full transition-all duration-300 flex items-center justify-center",
                isActive ? "-translate-y-1" : ""
              )}>
                {isActive && (
                  <span className="absolute inset-0 bg-brand-red/10 rounded-full animate-in zoom-in duration-300" />
                )}
                <Icon 
                  className={cn(
                    "size-5 transition-all duration-300 relative z-10", 
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  )} 
                />
              </div>
              <span className={cn(
                "text-[10px] tracking-tight transition-all duration-300 font-medium",
                isActive ? "opacity-100 font-bold" : "opacity-80"
              )}>
                {tab.name}
              </span>
            </Link>
          );
        })}

        {/* Shop (Men category) */}
        {LINK_TABS.slice(1, 2).map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-300",
                isActive ? "text-brand-red" : "text-slate-400 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "relative p-1 rounded-full transition-all duration-300 flex items-center justify-center",
                isActive ? "-translate-y-1" : ""
              )}>
                {isActive && (
                  <span className="absolute inset-0 bg-brand-red/10 rounded-full animate-in zoom-in duration-300" />
                )}
                <Icon 
                  className={cn(
                    "size-5 transition-all duration-300 relative z-10", 
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  )} 
                />
              </div>
              <span className={cn(
                "text-[10px] tracking-tight transition-all duration-300 font-medium",
                isActive ? "opacity-100 font-bold" : "opacity-80"
              )}>
                Shop
              </span>
            </Link>
          );
        })}

        {/* Cart — opens drawer instead of navigating */}
        <button
          type="button"
          onClick={() => cart.setIsOpen(true)}
          className="relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-300 text-slate-400 hover:text-slate-900"
        >
          <div className="relative p-1 rounded-full transition-all duration-300 flex items-center justify-center">
            <ShoppingCart className="size-5 transition-all duration-300 relative z-10 stroke-[2px]" />
            {mounted && cart.getTotalItems() > 0 && (
              <span className="absolute -top-0.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] font-bold text-white">
                {cart.getTotalItems()}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight transition-all duration-300 font-medium opacity-80">
            {t("cart")}
          </span>
        </button>

        {/* Account */}
        {LINK_TABS.slice(2).map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-300",
                isActive ? "text-brand-red" : "text-slate-400 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "relative p-1 rounded-full transition-all duration-300 flex items-center justify-center",
                isActive ? "-translate-y-1" : ""
              )}>
                {isActive && (
                  <span className="absolute inset-0 bg-brand-red/10 rounded-full animate-in zoom-in duration-300" />
                )}
                <Icon 
                  className={cn(
                    "size-5 transition-all duration-300 relative z-10", 
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  )} 
                />
              </div>
              <span className={cn(
                "text-[10px] tracking-tight transition-all duration-300 font-medium",
                isActive ? "opacity-100 font-bold" : "opacity-80"
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
