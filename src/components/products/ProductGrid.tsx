"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";
import { getBrands, getSubcategories } from "@/lib/products";
import { useProductGrid } from "@/hooks/useProductGrid";

// Sub-components
import { ProductGridHeader } from "./product-grid/ProductGridHeader";
import { ProductGridToolbar } from "./product-grid/ProductGridToolbar";
import { ProductFilters } from "./product-grid/ProductFilters";
import { ProductGridList } from "./product-grid/ProductGridList";
import { MobileFilterDrawer } from "./product-grid/MobileFilterDrawer";

interface ProductGridProps {
  products: Product[];
  categoryTitle: string;
  categoryDescription?: string;
}

export function ProductGrid({
  products: allProducts,
  categoryTitle,
  categoryDescription,
}: ProductGridProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedPriceRange,
    setSelectedPriceRange,
    sortBy,
    setSortBy,
    filteredProducts,
    handleClearAll,
    hasFilters,
  } = useProductGrid(allProducts);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = getBrands(allProducts);
  const subcategories = getSubcategories(allProducts);

  const filters = (
    <ProductFilters 
      brands={brands}
      subcategories={subcategories}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
      selectedSubcategory={selectedSubcategory}
      setSelectedSubcategory={setSelectedSubcategory}
      selectedPriceRange={selectedPriceRange}
      setSelectedPriceRange={setSelectedPriceRange}
      onClearAll={handleClearAll}
      hasFilters={hasFilters}
      resultCount={filteredProducts.length}
    />
  );

  return (
    <div className="py-8 md:py-12 px-4">
      <div className="container mx-auto">
        <ProductGridHeader title={categoryTitle} description={categoryDescription} />

        <ProductGridToolbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          hasFilters={hasFilters}
        />

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm shadow-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <SlidersHorizontal className="size-4 mr-2 text-brand-red" /> Filters
              </h3>
              {filters}
            </div>
          </aside>

          {/* Grid List */}
          <main className="flex-1">
            <ProductGridList 
              products={filteredProducts} 
              onClearFilters={handleClearAll} 
            />
          </main>
        </div>

        <MobileFilterDrawer 
          isOpen={mobileFiltersOpen} 
          onClose={() => setMobileFiltersOpen(false)}
          resultCount={filteredProducts.length}
        >
          {filters}
        </MobileFilterDrawer>
      </div>
    </div>
  );
}
