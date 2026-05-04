"use client";

import { useState } from "react";
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

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "Default");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

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
    if (!selectedSize) return;
    addItem(product, quantity, selectedSize, selectedColor);
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
          <Link href={`/${product.category}`} className="hover:text-brand-red transition-colors capitalize">
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
              colors={product.colors}
              sizes={product.sizes}
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
              isSizeSelected={!!selectedSize || !(product.sizes && product.sizes.length > 0)}
              whatsappUrl={whatsappUrl}
            />

            <TrustBadges />
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">
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
