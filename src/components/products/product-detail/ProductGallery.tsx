"use client";

import Image from "next/image";
import { useState, useRef } from "react";
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in group/gallery"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {images && images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={images[activeImageIndex]}
              alt={name}
              fill
              className={cn(
                "object-cover transition-transform duration-200 ease-out",
                isZoomed ? "scale-[2.5]" : "scale-100"
              )}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
              }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
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

        {/* Zoom Indicator (Desktop Only) */}
        {!isZoomed && images && images.length > 0 && (
          <div className="absolute bottom-4 right-4 z-10 size-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hidden md:flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-brand-red text-white text-sm font-bold px-3 py-1.5 rounded-full pointer-events-none">
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
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
