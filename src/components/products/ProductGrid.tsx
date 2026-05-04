"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/lib/types";
import { getBrands, getSubcategories, getPriceRange } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  categoryTitle: string;
  categoryDescription?: string;
}

const PRICE_RANGES: { label: string; range: [number, number] }[] = [
  { label: "Under ₹500", range: [0, 500] },
  { label: "₹500 – ₹1,000", range: [500, 1000] },
  { label: "₹1,000 – ₹2,000", range: [1000, 2000] },
  { label: "₹2,000 – ₹5,000", range: [2000, 5000] },
  { label: "Above ₹5,000", range: [5000, 100000] },
];

export function ProductGrid({
  products: allProducts,
  categoryTitle,
  categoryDescription,
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (selectedPriceRange) {
      result = result.filter(
        (p) => p.price >= selectedPriceRange[0] && p.price <= selectedPriceRange[1]
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        result.sort((a, b) => {
          const discA = a.original_price
            ? (a.original_price - a.price) / a.original_price
            : 0;
          const discB = b.original_price
            ? (b.original_price - b.price) / b.original_price
            : 0;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedBrand, selectedSubcategory, selectedPriceRange, sortBy]);

  const brands = getBrands(allProducts);
  const subcategories = getSubcategories(allProducts);
  const hasFilters = selectedBrand || selectedSubcategory || selectedPriceRange;

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedSubcategory(null);
    setSelectedPriceRange(null);
  };

  // Reusable filter content
  const filterContent = (
    <div className="space-y-6">
      {hasFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-brand-red hover:text-brand-red/80 text-xs"
          >
            <X className="size-3 mr-1" /> Clear All
          </Button>
        </div>
      )}

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Category</h4>
          <div className="space-y-1.5">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
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
      )}

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Brand</h4>
          <div className="space-y-1.5">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
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
      )}

      {/* Price Filter */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Price</h4>
        <div className="space-y-1.5">
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
                "block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                selectedPriceRange?.[0] === range[0] && selectedPriceRange?.[1] === range[1]
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
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
            {categoryTitle}
          </h1>
          {categoryDescription && (
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {categoryDescription}
            </p>
          )}
        </div>

        {/* Search + Sort + Mobile Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden border-slate-300"
            >
              <SlidersHorizontal className="size-4 mr-2" /> Filters
              {hasFilters && (
                <span className="ml-1.5 size-5 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>

        {/* Main Content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center">
                <SlidersHorizontal className="size-4 mr-2" /> Filters
              </h3>
              {filterContent}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No products found
                </h3>
                <p className="text-slate-500 mb-6">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={handleClearAll}
                  className="text-brand-red font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-3xl p-6 overflow-y-auto animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
              {filterContent}
              <div className="mt-6 pt-4 border-t">
                <Button
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Show {filteredProducts.length} Results
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
