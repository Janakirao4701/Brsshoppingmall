"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";
import { getBrands, getSubcategories } from "@/lib/products";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Apply filters & sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand?.name || "").toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand?.name === selectedBrand);
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
          const discA = a.original_price ? (a.original_price - a.price) / a.original_price : 0;
          const discB = b.original_price ? (b.original_price - b.price) / b.original_price : 0;
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
  const hasFilters = !!(selectedBrand || selectedSubcategory || selectedPriceRange || searchQuery);

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedSubcategory(null);
    setSelectedPriceRange(null);
  };

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
