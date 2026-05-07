"use client";

import { cn } from "@/lib/utils";
import { Ruler } from "lucide-react";

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
    <div className="space-y-8">
      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div role="radiogroup" aria-label="Choose color">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
              Color: <span className="font-normal text-slate-500 ml-1">{selectedColor}</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => (
              <button
                key={color}
                role="radio"
                aria-checked={selectedColor === color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 min-h-[44px]",
                  selectedColor === color
                    ? "border-brand-red bg-brand-red/5 text-brand-red shadow-sm ring-1 ring-brand-red/10"
                    : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
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
        <div role="radiogroup" aria-label="Choose size">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
              Size:{" "}
              <span className={cn(
                "font-normal ml-1",
                selectedSize ? "text-slate-500" : "text-brand-red italic"
              )}>
                {selectedSize || "Select one"}
              </span>
            </h3>
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest group">
              <Ruler className="size-3.5 group-hover:scale-110 transition-transform" />
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2.5">
            {sizes.map((size) => (
              <button
                key={size}
                role="radio"
                aria-checked={selectedSize === size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex items-center justify-center min-w-[56px] min-h-[48px] px-4 py-3 rounded-xl border text-sm font-bold transition-all duration-200",
                  selectedSize === size
                    ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                )}
              >
                {size}
              </button>
            ))}
          </div>
          
          {/* Trust indicator */}
          <p className="mt-4 text-[10px] text-slate-400 flex items-center gap-1.5 font-medium uppercase tracking-wider">
            <span className="size-1 rounded-full bg-green-500" />
            Standard Indian Sizing applies
          </p>
        </div>
      )}
    </div>
  );
}
