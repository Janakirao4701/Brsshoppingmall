"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchOverlay } from "./SearchOverlay";
import { useCart, useWishlist } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const t = useTranslations("Navbar");
  const cart = useCart();
  const wishlist = useWishlist();
  const [mounted, setMounted] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [announcements, setAnnouncements] = React.useState<string[]>([]);
  const [announcementActive, setAnnouncementActive] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    fetchAnnouncement();
  }, []);

  React.useEffect(() => {
    if (announcements.length > 1 && announcementActive) {
      const interval = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % announcements.length);
      }, 5000); // Switch every 5 seconds
      return () => clearInterval(interval);
    }
  }, [announcements, announcementActive]);

  const fetchAnnouncement = async () => {
    const { data } = await supabase
      .from("settings")
      .select("announcement_text, announcement_active, announcements")
      .eq("id", '00000000-0000-0000-0000-000000000000')
      .single();
    
    if (data) {
      setAnnouncementActive(data.announcement_active);
      const anns = Array.isArray(data.announcements) && data.announcements.length > 0 
        ? data.announcements 
        : (data.announcement_text ? [data.announcement_text] : []);
      setAnnouncements(anns);
    }
  };

  const NAV_LINKS = [
    { name: t("home"), href: "/" },
    { name: t("men"), href: "/men" },
    { name: t("women"), href: "/women" },
    { name: t("kids"), href: "/kids" },
    { name: t("bulk"), href: "/bulk-orders" },
  ];

  return (
    <>
      {mounted && announcementActive && announcements.length > 0 && (
        <div className="bg-brand-red text-white text-center py-2.5 text-nav text-[10px] sm:text-[11px] tracking-widest overflow-hidden whitespace-nowrap">
          <div 
            key={currentIdx}
            className="animate-in fade-in slide-in-from-right duration-700"
          >
            {announcements[currentIdx]}
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/bsr-logo.png"
              alt="BSR Shopping Mall"
              width={200}
              height={80}
              className="h-10 md:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {NAV_LINKS.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link href={link.href} className={navigationMenuTriggerStyle()}>
                      {link.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
              className="size-10 rounded-full"
            >
              <Search className="size-5" />
            </Button>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="hidden sm:inline-flex">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative size-10 rounded-full" 
                aria-label="Wishlist"
              >
                <Heart className="size-5" />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                    {wishlist.items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative size-10 rounded-full" 
              aria-label={t("cart")}
              onClick={() => cart.setIsOpen(true)}
            >
              <ShoppingCart className="size-5" />
              {mounted && cart.getTotalItems() > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                  {cart.getTotalItems()}
                </span>
              )}
            </Button>

            <Link href="/account">
              <Button variant="ghost" size="icon" aria-label={t("account")} className="hidden sm:inline-flex size-10 rounded-full">
                <User className="size-5" />
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu" className="size-10 rounded-full">
                    <Menu className="size-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0">
                  <div className="flex flex-col h-full bg-slate-50">
                    <SheetHeader className="p-6 bg-white border-b border-slate-100 text-left">
                      <SheetTitle className="text-xl font-heading font-semibold text-slate-900">
                        Menu
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto py-6 px-4">
                      <nav className="flex flex-col space-y-2">
                        {NAV_LINKS.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-medium text-slate-700 hover:text-brand-red hover:bg-white bg-slate-50 border border-transparent hover:border-slate-100 px-4 py-3 rounded-2xl transition-all"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
    </>
  );
}
