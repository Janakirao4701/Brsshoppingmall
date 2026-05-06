"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useWishlist } from "@/lib/store";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

function isNewArrival(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  return created > fourteenDaysAgo;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const hasImage = product.images && product.images.length > 0 && product.images[0];
  const hasSecondImage = product.images && product.images.length > 1 && product.images[1];
  const isNew = isNewArrival(product.created_at);

  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) ?? 0;
  const isOutOfStock = totalStock === 0 && product.variants && product.variants.length > 0;
  
  // Extract unique sizes from variants
  const availableSizes = [...new Set(product.variants?.map(v => v.size))].filter(Boolean);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {/* Primary Image */}
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              hasSecondImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop"
            alt="Product placeholder"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-80"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Secondary Image (revealed on hover) */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} - alternate view`}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges Row */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <div className="bg-brand-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {discount}% OFF
            </div>
          )}
          {isNew && (
            <div className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              NEW
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              SOLD OUT
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={cn(
            "absolute top-3 right-3 z-10 size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:bg-white",
            isWishlisted ? "opacity-100 bg-white" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(product);
          }}
          aria-label="Add to wishlist"
        >
          <Heart className={cn("size-4 transition-colors", isWishlisted ? "fill-brand-red text-brand-red" : "text-slate-600")} />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-lg shadow-lg">
            <Eye className="size-3.5" />
            Quick View
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-nav text-brand-orange text-[11px] font-bold uppercase tracking-wider">
          {product.brand?.name || "BSR Collection"}
        </p>
        <h3 className="text-product-name text-slate-900 font-semibold line-clamp-2 group-hover:text-brand-red transition-colors h-10">
          {product.name}
        </h3>

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {availableSizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200/50"
              >
                {size}
              </span>
            ))}
            {availableSizes.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">
                +{availableSizes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-slate-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.original_price && (
            <span className="text-sm text-slate-400 line-through">
              ₹{product.original_price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
