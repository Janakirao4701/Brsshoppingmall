"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";
  const whatsappMessage = encodeURIComponent(
    `Hi BSR, I'm interested in: ${product.name} (₹${product.price}). Size: ${selectedSize || "Not selected"}, Color: ${selectedColor}.`
  );

  return (
    <div className="py-6 px-4">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 mb-6 space-x-2">
          <Link href="/" className="hover:text-brand-red transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href={`/${product.category}`}
            className="hover:text-brand-red transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-slate-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <div className="text-center space-y-4">
                  <div className="size-24 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-5xl">👕</span>
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    {product.subcategory}
                  </p>
                </div>
              </div>

              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-brand-red text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-sm text-brand-orange font-semibold uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ₹{product.original_price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save ₹
                    {(product.original_price - product.price).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Color: <span className="font-normal text-slate-600">{selectedColor}</span>
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                      selectedColor === color
                        ? "border-brand-red bg-brand-red/5 text-brand-red"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Size:{" "}
                <span className="font-normal text-slate-600">
                  {selectedSize || "Select a size"}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[48px] px-4 py-2.5 rounded-lg border text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-10 rounded-lg border border-slate-200 flex items-center justify-center text-lg font-medium hover:bg-slate-50"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-10 rounded-lg border border-slate-200 flex items-center justify-center text-lg font-medium hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white py-6 text-base font-bold"
                disabled={!selectedSize}
              >
                <ShoppingCart className="size-5 mr-2" /> Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-green-500 text-green-600 hover:bg-green-50 py-6 text-base font-bold"
                asChild
              >
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-5 mr-2" /> Order via WhatsApp
                </a>
              </Button>
            </div>

            {/* Action Icons */}
            <div className="flex gap-4 pt-2">
              <button className="flex items-center text-sm text-slate-500 hover:text-brand-red transition-colors">
                <Heart className="size-4 mr-1.5" /> Wishlist
              </button>
              <button className="flex items-center text-sm text-slate-500 hover:text-brand-red transition-colors">
                <Share2 className="size-4 mr-1.5" /> Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="text-center space-y-1">
                <Truck className="size-5 mx-auto text-brand-orange" />
                <p className="text-xs text-slate-600 font-medium">All India Delivery</p>
              </div>
              <div className="text-center space-y-1">
                <RotateCcw className="size-5 mx-auto text-brand-orange" />
                <p className="text-xs text-slate-600 font-medium">Easy Returns</p>
              </div>
              <div className="text-center space-y-1">
                <Shield className="size-5 mx-auto text-brand-orange" />
                <p className="text-xs text-slate-600 font-medium">100% Genuine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
