"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PRICE_RANGES: { label: string; range: [number, number] }[] = [
  { label: "Under ₹500", range: [0, 500] },
  { label: "₹500 – ₹1,000", range: [500, 1000] },
  { label: "₹1,000 – ₹2,000", range: [1000, 2000] },
  { label: "₹2,000 – ₹5,000", range: [2000, 5000] },
  { label: "Above ₹5,000", range: [5000, 100000] },
];

interface ProductFiltersProps {
  brands: string[];
  subcategories: string[];
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (sub: string | null) => void;
  selectedPriceRange: [number, number] | null;
  setSelectedPriceRange: (range: [number, number] | null) => void;
  onClearAll: () => void;
  hasFilters: boolean;
  resultCount: number;
}

export function ProductFilters({
  brands,
  subcategories,
  selectedBrand,
  setSelectedBrand,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedPriceRange,
  setSelectedPriceRange,
  onClearAll,
  hasFilters,
  resultCount
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {hasFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-brand-red hover:text-brand-red/80 text-xs h-auto p-0"
          >
            <X className="size-3 mr-1" /> Clear All
          </Button>
        </div>
      )}

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">Category</h4>
          <div className="space-y-1">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                className={cn(
                  "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all",
                  selectedSubcategory === sub
                    ? "bg-brand-red/10 text-brand-red font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">Brand</h4>
          <div className="space-y-1">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                className={cn(
                  "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all",
                  selectedBrand === brand
                    ? "bg-brand-red/10 text-brand-red font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3">Price Range</h4>
        <div className="space-y-1">
          {PRICE_RANGES.map(({ label, range }) => (
            <button
              key={label}
              onClick={() =>
                setSelectedPriceRange(
                  selectedPriceRange?.[0] === range[0] && selectedPriceRange?.[1] === range[1]
                    ? null
                    : range
                )
              }
              className={cn(
                "block w-full text-left text-sm px-4 py-3 rounded-xl transition-all",
                selectedPriceRange?.[0] === range[0] && selectedPriceRange?.[1] === range[1]
                  ? "bg-brand-red/10 text-brand-red font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
