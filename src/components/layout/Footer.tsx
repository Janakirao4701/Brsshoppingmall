import * as React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Phone, Mail, MapPin, Globe, Camera, X } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Image
              src="/bsr-logo.png"
              alt="BSR Shopping Mall"
              width={160}
              height={64}
              className="h-14 w-auto object-contain rounded-xl"
            />
            <p className="text-sm leading-relaxed">
              Readymade Garments for Men, Women & Kids. A unit of Baratam Group, serving Sompeta and Palasa since 2004.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-brand-orange transition-colors"><Globe className="size-5" /></a>
              <a href="#" className="hover:text-brand-orange transition-colors"><Camera className="size-5" /></a>
              <a href="#" className="hover:text-brand-orange transition-colors"><X className="size-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-medium text-white">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/men" className="text-sm hover:text-white transition-colors">Men's Wear</Link>
              <Link href="/women" className="text-sm hover:text-white transition-colors">Women's Wear</Link>
              <Link href="/kids" className="text-sm hover:text-white transition-colors">Kids' Wear</Link>
              <Link href="/bulk-orders" className="text-sm hover:text-white transition-colors">Bulk Orders</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h4 className="text-lg font-heading font-medium text-white">Contact & Stores</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-100 flex items-center">
                  <MapPin className="size-4 mr-2 text-brand-red" /> Sompeta Branch
                </p>
                <p className="text-xs">Main Road, Sompeta, Srikakulam Dist, AP - 532284</p>
                <p className="text-xs flex items-center">
                  <Phone className="size-3 mr-2" /> <a href="tel:+917829333444">+91 78293 33444</a>
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-100 flex items-center">
                  <MapPin className="size-4 mr-2 text-brand-orange" /> Palasa Branch
                </p>
                <p className="text-xs">NH-16, Palasa, Srikakulam Dist, AP - 532221</p>
                <p className="text-xs flex items-center">
                  <Phone className="size-3 mr-2" /> <a href="tel:+917829333444">+91 78293 33444</a>
                </p>
              </div>
            </div>
            <p className="text-xs flex items-center pt-2">
              <Mail className="size-3 mr-2" /> contact@bsrshoppingmall.com
            </p>
            <p className="text-xs flex items-center">
              Daily Hours: 9:00 AM – 9:00 PM
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
          <p>© 2026 BSR Shopping Mall. All rights reserved. Part of Baratam Group.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
