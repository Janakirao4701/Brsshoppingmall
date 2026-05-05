"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useWishlist } from "@/lib/store";
import { Product } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const hasImage = product.images && product.images.length > 0 && product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {/* ... image logic ... */}
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <div className="text-center space-y-2 p-4">
              <div className="size-16 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-2xl">
                  {product.category === "men" ? "👔" : product.category === "women" ? "👗" : "🧒"}
                </span>
              </div>
              <p className="text-xs font-medium">{product.subcategory}</p>
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}

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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-nav text-brand-orange text-[11px]">
          {product.brand}
        </p>
        <h3 className="text-product-name text-slate-900 line-clamp-2 group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg text-price text-slate-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.original_price && (
            <span className="text-sm text-price text-slate-400 line-through">
              ₹{product.original_price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Stock */}
        {!product.in_stock && (
          <p className="text-xs text-red-500 font-medium">Out of Stock</p>
        )}
      </div>
    </Link>
  );
}
