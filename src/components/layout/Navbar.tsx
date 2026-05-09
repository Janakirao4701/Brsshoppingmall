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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchOverlay } from "./SearchOverlay";
import { useCart, useWishlist } from "@/lib/store";
import { OfferTicker } from "./OfferTicker";

interface NavbarProps {
  /** Server-fetched announcement settings data */
  announcementData?: any;
}

export function Navbar({ announcementData }: NavbarProps) {
  const t = useTranslations("Navbar");
  const cart = useCart();
  const wishlist = useWishlist();
  const [mounted, setMounted] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const NAV_LINKS = [
    { name: t("home"), href: "/" },
    { name: t("men"), href: "/men" },
    { name: t("women"), href: "/women" },
    { name: t("kids"), href: "/kids" },
    { name: t("bulk"), href: "/bulk-orders" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/97 backdrop-blur-md">
        {/* ─── Desktop: 3-column grid for perfect center alignment ─── */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center h-[72px] px-8 lg:px-12 xl:px-16 max-w-[1440px] mx-auto">
          
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/bsr-logo.png"
                alt="BSR Shopping Mall"
                width={200}
                height={80}
                className="h-9 lg:h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex items-center justify-center gap-8 lg:gap-10 xl:gap-12 px-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-[11px] lg:text-[11.5px] uppercase tracking-[0.18em] font-normal text-slate-600 hover:text-slate-900 transition-colors duration-200 py-2 relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute bottom-0.5 left-0 w-full h-px bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Right: Utility Icons */}
          <div className="flex items-center justify-end gap-1.5 lg:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
              className="size-9 rounded-full hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </Button>

            <Link href="/account" className="inline-flex">
              <Button variant="ghost" size="icon" aria-label={t("account")} className="size-9 rounded-full hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors">
                <User className="size-[18px]" strokeWidth={1.5} />
              </Button>
            </Link>

            <Link href="/wishlist" className="inline-flex">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative size-9 rounded-full hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors" 
                aria-label="Wishlist"
              >
                <Heart className="size-[18px]" strokeWidth={1.5} />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 text-[8px] font-semibold text-white leading-none">
                    {wishlist.items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative size-9 rounded-full hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors" 
              aria-label={t("cart")}
              onClick={() => cart.setIsOpen(true)}
            >
              <ShoppingCart className="size-[18px]" strokeWidth={1.5} />
              {mounted && cart.getTotalItems() > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-red text-[8px] font-semibold text-white leading-none">
                  {cart.getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* ─── Mobile: Flex layout — [Menu+Search | Logo | Cart] ─── */}
        <div className="flex md:hidden items-center justify-between h-14 px-4">
          
          {/* Left: Hamburger + Search */}
          <div className="flex items-center gap-0.5 min-w-[80px]">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu" className="size-9 rounded-full hover:bg-slate-50 text-slate-800">
                  <Menu className="size-[20px]" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 border-r-0">
                <div className="flex flex-col h-full bg-white">
                  <SheetHeader className="p-6 border-b border-slate-100 text-left">
                    <SheetTitle className="text-lg font-serif italic text-slate-900 tracking-wide">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col justify-between">
                    <nav className="flex flex-col space-y-7">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="text-[12px] tracking-[0.14em] uppercase font-normal text-slate-500 hover:text-slate-900 transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col space-y-6">
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-4 text-[12px] tracking-[0.12em] uppercase font-normal text-slate-500 hover:text-slate-900 transition-colors duration-200"
                      >
                        <Heart className="size-[18px]" strokeWidth={1.5} />
                        {t("wishlist")}
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center gap-4 text-[12px] tracking-[0.12em] uppercase font-normal text-slate-500 hover:text-slate-900 transition-colors duration-200"
                      >
                        <User className="size-[18px]" strokeWidth={1.5} />
                        {t("account")}
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
              className="size-9 rounded-full hover:bg-slate-50 text-slate-800"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 inline-flex items-center">
            <Image
              src="/bsr-logo.png"
              alt="BSR Shopping Mall"
              width={200}
              height={80}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right: Wishlist + Cart */}
          <div className="flex items-center gap-0.5 min-w-[80px] justify-end">
            <Link href="/wishlist" className="inline-flex">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative size-9 rounded-full hover:bg-slate-50 text-slate-800" 
                aria-label="Wishlist"
              >
                <Heart className="size-[18px]" strokeWidth={1.5} />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 text-[8px] font-semibold text-white leading-none">
                    {wishlist.items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative size-9 rounded-full hover:bg-slate-50 text-slate-800" 
              aria-label={t("cart")}
              onClick={() => cart.setIsOpen(true)}
            >
              <ShoppingCart className="size-[18px]" strokeWidth={1.5} />
              {mounted && cart.getTotalItems() > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-red text-[8px] font-semibold text-white leading-none">
                  {cart.getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>

        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
      <OfferTicker initialData={announcementData} />
    </>
  );
}
