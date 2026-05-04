"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  brands: string[];
  subcategories: string[];
  priceRange: { min: number; max: number };
  selectedBrand: string | null;
  selectedSubcategory: string | null;
  selectedPriceRange: [number, number] | null;
  onBrandChange: (brand: string | null) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  onPriceRangeChange: (range: [number, number] | null) => void;
  onClearAll: () => void;
  totalResults: number;
}

const PRICE_RANGES: { label: string; range: [number, number] }[] = [
  { label: "Under ₹500", range: [0, 500] },
  { label: "₹500 – ₹1,000", range: [500, 1000] },
  { label: "₹1,000 – ₹2,000", range: [1000, 2000] },
  { label: "₹2,000 – ₹5,000", range: [2000, 5000] },
  { label: "Above ₹5,000", range: [5000, 100000] },
];

export function ProductFilters({
  brands,
  subcategories,
  priceRange,
  selectedBrand,
  selectedSubcategory,
  selectedPriceRange,
  onBrandChange,
  onSubcategoryChange,
  onPriceRangeChange,
  onClearAll,
  totalResults,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasFilters = selectedBrand || selectedSubcategory || selectedPriceRange;

  const filterContent = (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {totalResults} result{totalResults !== 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-brand-red hover:text-brand-red/80 text-xs"
          >
            <X className="size-3 mr-1" /> Clear All
          </Button>
        </div>
      )}

      {/* Subcategory Filter */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Category</h4>
        <div className="space-y-1.5">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() =>
                onSubcategoryChange(selectedSubcategory === sub ? null : sub)
              }
              className={cn(
                "block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                selectedSubcategory === sub
                  ? "bg-brand-red/10 text-brand-red font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Brand</h4>
        <div className="space-y-1.5">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() =>
                onBrandChange(selectedBrand === brand ? null : brand)
              }
              className={cn(
                "block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                selectedBrand === brand
                  ? "bg-brand-red/10 text-brand-red font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Price</h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(({ label, range }) => (
            <button
              key={label}
              onClick={() =>
                onPriceRangeChange(
                  selectedPriceRange?.[0] === range[0] &&
                    selectedPriceRange?.[1] === range[1]
                    ? null
                    : range
                )
              }
              className={cn(
                "block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                selectedPriceRange?.[0] === range[0] &&
                  selectedPriceRange?.[1] === range[1]
                  ? "bg-brand-red/10 text-brand-red font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center">
            <SlidersHorizontal className="size-4 mr-2" /> Filters
          </h3>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="border-slate-300"
        >
          <SlidersHorizontal className="size-4 mr-2" /> Filters
          {hasFilters && (
            <span className="ml-1.5 size-5 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-3xl p-6 overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            {filterContent}
            <div className="mt-6 pt-4 border-t">
              <Button
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
                onClick={() => setMobileOpen(false)}
              >
                Show {totalResults} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
