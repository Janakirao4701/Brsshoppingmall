"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  category: string;
  subcategory: string;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
  discount: number;
}

export function ProductGallery({
  images,
  name,
  category,
  subcategory,
  activeImageIndex,
  setActiveImageIndex,
  discount
}: ProductGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
        {images && images.length > 0 ? (
          <Image
            src={images[activeImageIndex]}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <div className="text-center space-y-4">
              <div className="size-24 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-5xl">
                  {category === "men" ? "👔" : category === "women" ? "👗" : "🧒"}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-400">
                {subcategory}
              </p>
            </div>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-brand-red text-white text-sm font-bold px-3 py-1.5 rounded-full">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={cn(
                "relative size-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                activeImageIndex === index
                  ? "border-brand-red shadow-md"
                  : "border-transparent hover:border-slate-300"
              )}
            >
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
