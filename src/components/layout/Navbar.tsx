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
import { LanguageToggle } from "./LanguageToggle";
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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/bsr-logo.png"
              alt="BSR Shopping Mall"
              width={300}
              height={120}
              className="h-[88px] w-auto object-contain"
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
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>
            
            <LanguageToggle />

            {/* Wishlist Icon */}
            <Link href="/account" className="hidden sm:inline-flex">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                aria-label="Wishlist"
              >
                <Heart className="size-5" />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                    {wishlist.items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              aria-label={t("cart")}
              onClick={() => cart.setIsOpen(true)}
            >
              <ShoppingCart className="size-5" />
              {mounted && cart.getTotalItems() > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                  {cart.getTotalItems()}
                </span>
              )}
            </Button>

            <Link href="/account">
              <Button variant="ghost" size="icon" aria-label={t("account")} className="hidden sm:inline-flex">
                <User className="size-5" />
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="size-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="text-brand-gradient text-left">BSR Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-8">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-lg font-heading font-normal hover:text-brand-red transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <div className="h-px bg-slate-100 my-2" />
                    <Link
                      href="/account"
                      className="text-lg font-heading font-normal hover:text-brand-red transition-colors flex items-center"
                    >
                      <User className="mr-3 size-5" /> {t("account")}
                    </Link>
                    <Link
                      href="/account"
                      className="text-lg font-heading font-normal hover:text-brand-red transition-colors flex items-center"
                    >
                      <Heart className="mr-3 size-5" /> Wishlist
                    </Link>
                  </nav>
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
