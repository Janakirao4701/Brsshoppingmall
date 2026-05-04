"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu 
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

import { useCart } from "@/lib/store";

export function Navbar() {
  const t = useTranslations("Navbar");
  const cart = useCart();
  const [mounted, setMounted] = React.useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
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
          <Button variant="ghost" size="icon" aria-label={t("search")}>
            <Search className="size-5" />
          </Button>
          
          <LanguageToggle />

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

          <Button variant="ghost" size="icon" aria-label={t("account")} className="hidden sm:inline-flex">
            <User className="size-5" />
          </Button>

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
                  <SheetTitle className="text-brand-gradient">BSR Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium hover:text-brand-red transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/account"
                    className="text-lg font-medium hover:text-brand-red transition-colors flex items-center"
                  >
                    <User className="mr-2 size-5" /> {t("account")}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
