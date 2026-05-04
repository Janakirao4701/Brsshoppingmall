"use client";

import { cn } from "@/lib/utils";

interface ProductVariantsProps {
  colors: string[];
  sizes: string[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
}

export function ProductVariants({
  colors,
  sizes,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize
}: ProductVariantsProps) {
  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Color: <span className="font-normal text-slate-600">{selectedColor}</span>
          </h3>
          <div className="flex gap-2">
            {colors.map((color) => (
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
      )}

      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Size:{" "}
            <span className="font-normal text-slate-600">
              {selectedSize || "Select a size"}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
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
      )}
    </div>
  );
}
