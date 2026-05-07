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
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/95 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8 lg:px-12">
          {/* Mobile Menu Trigger & Search (Left side on mobile) */}
          <div className="flex items-center gap-2 md:hidden flex-1 order-1 md:order-none">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu" className="size-10 rounded-full hover:bg-slate-50 text-slate-900">
                  <Menu className="size-5" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 border-r-0">
                <div className="flex flex-col h-full bg-white">
                  <SheetHeader className="p-6 border-b border-slate-100 text-left">
                    <SheetTitle className="text-xl font-serif italic text-slate-900">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col justify-between">
                    <nav className="flex flex-col space-y-6">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="text-[13px] tracking-[0.1em] uppercase font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col space-y-6">
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-4 text-[13px] tracking-wide uppercase font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Heart className="size-5" strokeWidth={1.5} />
                        {t("wishlist")}
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center gap-4 text-[13px] tracking-wide uppercase font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <User className="size-5" strokeWidth={1.5} />
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
              className="size-10 rounded-full hover:bg-slate-50 text-slate-900"
            >
              <Search className="size-5" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Logo (Left on desktop, Center on mobile) */}
          <Link href="/" className="flex flex-1 md:flex-none items-center justify-center md:justify-start order-2 md:order-1">
            <Image
              src="/bsr-logo.png"
              alt="BSR Shopping Mall"
              width={240}
              height={96}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation (Center on desktop) */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 order-none md:order-2">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-medium text-slate-500 hover:text-slate-900 transition-colors py-2 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Right Icons (Desktop & Mobile) */}
          <div className="flex flex-1 items-center justify-end gap-1 md:gap-3 order-3">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={t("search")}
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex size-10 rounded-full hover:bg-slate-50 text-slate-900"
            >
              <Search className="size-5" strokeWidth={1.5} />
            </Button>

            <Link href="/account" className="hidden md:inline-flex">
              <Button variant="ghost" size="icon" aria-label={t("account")} className="size-10 rounded-full hover:bg-slate-50 text-slate-900">
                <User className="size-5" strokeWidth={1.5} />
              </Button>
            </Link>

            <Link href="/wishlist" className="hidden sm:inline-flex">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative size-10 rounded-full hover:bg-slate-50 text-slate-900" 
                aria-label="Wishlist"
              >
                <Heart className="size-5" strokeWidth={1.5} />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                    {wishlist.items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative size-10 rounded-full hover:bg-slate-50 text-slate-900" 
              aria-label={t("cart")}
              onClick={() => cart.setIsOpen(true)}
            >
              <ShoppingCart className="size-5" strokeWidth={1.5} />
              {mounted && cart.getTotalItems() > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-red text-[9px] font-bold text-white">
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
