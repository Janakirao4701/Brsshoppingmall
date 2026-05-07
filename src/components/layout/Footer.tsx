import * as React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="main-footer" className="bg-[#111111] text-white pb-20 md:pb-0">
      {/* Top CTA Band */}
      <div className="border-b border-white/[0.08]">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-normal tracking-tight">
                Stay in <span className="text-italic-accent !text-brand-orange">Style</span>
              </h2>
              <p className="text-sm text-white/50 mt-1.5 max-w-md">
                Visit us in-store or shop online. Premium garments delivered across India.
              </p>
            </div>
            <a
              href="https://wa.me/917829333444?text=Hi%20BSR%2C%20I%27d%20like%20to%20know%20more%20about%20your%20collections."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-white text-[#111111] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-brand-orange hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with us
              <span className="inline-block transition-transform group-hover:translate-x-1 duration-300">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/bsr-logo.png"
                alt="BSR Shopping Mall"
                width={180}
                height={72}
                className="h-12 w-auto object-contain rounded-lg"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-white/40 max-w-xs">
              A unit of Baratam Group. Serving families in Sompeta &amp; Palasa with premium readymade garments since 2004.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.instagram.com/bsrshoppingmall"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="size-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-all duration-300 group"
              >
                <svg className="size-[18px] text-white/60 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/bsrshoppingmall"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="size-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-all duration-300 group"
              >
                <svg className="size-[18px] text-white/60 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/917829333444"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="size-10 rounded-full bg-white/[0.06] hover:bg-[#25D366]/20 flex items-center justify-center transition-all duration-300 group"
              >
                <svg className="size-[18px] text-white/60 group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">Shop</h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/men" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Men</Link>
              <Link href="/women" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Women</Link>
              <Link href="/kids" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Kids</Link>
              <Link href="/shop" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">All Collections</Link>
              <Link href="/bulk-orders" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Bulk Orders</Link>
            </nav>
          </div>

          {/* Company Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">Company</h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/privacy" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Terms of Service</Link>
              <Link href="/bulk-orders" className="text-[13px] text-white/60 hover:text-white transition-colors duration-200">Contact Us</Link>
            </nav>
          </div>

          {/* Store Locations */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">Our Stores</h4>
            <div className="space-y-5">
              {/* Sompeta */}
              <div className="group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  <span className="text-[13px] font-semibold text-white/90">Sompeta</span>
                </div>
                <p className="text-[12px] text-white/40 leading-relaxed pl-3.5">
                  Main Road, Sompeta<br />
                  Srikakulam Dist, AP – 532284
                </p>
                <a href="tel:+917829333444" className="text-[12px] text-white/40 hover:text-brand-orange transition-colors pl-3.5 mt-1 inline-block">
                  +91 78293 33444
                </a>
              </div>
              {/* Palasa */}
              <div className="group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span className="text-[13px] font-semibold text-white/90">Palasa</span>
                </div>
                <p className="text-[12px] text-white/40 leading-relaxed pl-3.5">
                  K T Road, Palasa<br />
                  Srikakulam Dist, AP – 532221
                </p>
                <a href="tel:+917829333444" className="text-[12px] text-white/40 hover:text-brand-orange transition-colors pl-3.5 mt-1 inline-block">
                  +91 78293 33444
                </a>
              </div>
              {/* Hours */}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] text-white/50">Open daily · 9 AM – 9 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Trust Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-[10px] text-white/25 uppercase tracking-widest mr-2">We accept</span>
              {/* UPI */}
              <div className="h-7 px-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/50">UPI</span>
              </div>
              {/* Visa */}
              <div className="h-7 px-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/50">VISA</span>
              </div>
              {/* Mastercard */}
              <div className="h-7 px-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/50">MC</span>
              </div>
              {/* Razorpay */}
              <div className="h-7 px-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/50">RAZORPAY</span>
              </div>
              {/* COD */}
              <div className="h-7 px-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/50">COD</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-[10px] text-white/25">
              <span className="flex items-center gap-1.5">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure Payments
              </span>
              <span className="hidden md:inline">·</span>
              <span className="flex items-center gap-1.5">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                All India Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/20">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> BSR Shopping Mall. All rights reserved. A unit of Baratam Group.
            </p>
            <p className="text-[11px] text-white/20">
              Made with care in Srikakulam, India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
