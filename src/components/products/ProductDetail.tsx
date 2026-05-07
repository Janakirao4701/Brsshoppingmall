"use client";

import { useState, useMemo, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { useCart, useWishlist } from "@/lib/store";

// Sub-components
import { ProductGallery } from "./product-detail/ProductGallery";
import { ProductInfo } from "./product-detail/ProductInfo";
import { ProductVariants } from "./product-detail/ProductVariants";
import { ProductActions } from "./product-detail/ProductActions";
import { TrustBadges } from "./product-detail/TrustBadges";
import { ShoppingCart, MessageCircle, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  // Extract unique colors and sizes from variants
  const availableColors = useMemo(() => {
    return [...new Set(product.variants?.map(v => v.color))].filter(Boolean) as string[];
  }, [product.variants]);

  const availableSizes = useMemo(() => {
    return [...new Set(product.variants?.map(v => v.size))].filter(Boolean) as string[];
  }, [product.variants]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "Default");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 600;
      setIsStickyVisible(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on BSR Shopping Mall!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && availableSizes.length > 0) {
      alert("Please select a size");
      return;
    }
    addItem(product, quantity, selectedSize || undefined, selectedColor);
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi BSR, I'm interested in: ${product.name} (₹${product.price}). Size: ${selectedSize || "Not selected"}, Color: ${selectedColor}.`
  )}`;

  return (
    <div className="py-6 px-4">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 mb-8 space-x-2">
          <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
          <ChevronRight className="size-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-red transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Media */}
          <ProductGallery 
            images={product.images}
            name={product.name}
            category={product.category}
            subcategory={product.subcategory}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
            discount={discount}
          />

          {/* Right: Details & Purchase */}
          <div className="space-y-8">
            <ProductInfo 
              brand={product.brand}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price}
              description={product.description}
            />

            <ProductVariants 
              colors={availableColors}
              sizes={availableSizes}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />

            <ProductActions 
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              onWishlistToggle={() => toggleItem(product)}
              onShare={handleShare}
              isWishlisted={isWishlisted}
              isSizeSelected={!!selectedSize || availableSizes.length === 0}
              whatsappUrl={whatsappUrl}
            />

            {/* Delivery & Returns - New Section */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Truck className="size-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Free Delivery</h4>
                  <p className="text-xs text-slate-500">Free shipping on all orders above ₹999. Delivered in 3-5 business days.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <RefreshCcw className="size-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">7-Day Returns</h4>
                  <p className="text-xs text-slate-500">Easy returns and exchanges within 7 days of delivery. No questions asked.</p>
                </div>
              </div>
            </div>

            <TrustBadges />
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-4 transition-transform duration-300 lg:hidden",
          isStickyVisible ? "translate-y-0" : "translate-y-full"
        )}>
          <div className="container mx-auto flex gap-3">
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{product.brand?.name}</p>
              <p className="text-sm font-bold text-slate-900 truncate">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
            <Button
              className="flex-[2] bg-brand-red text-white font-bold h-12"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="size-4 mr-2" /> Add to Cart
            </Button>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t">
            <h2 className="text-2xl font-heading font-normal text-slate-900 mb-8">
              You May <span className="text-italic-accent">Also</span> Like
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
