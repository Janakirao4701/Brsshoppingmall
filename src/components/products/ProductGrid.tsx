"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Product } from "@/lib/types";
import { getBrands, getSubcategories, getPriceRange } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";

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
        // newest first (default)
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedBrand, selectedSubcategory, selectedPriceRange, sortBy]);

  const brands = getBrands(allProducts);
  const subcategories = getSubcategories(allProducts);
  const priceRange = getPriceRange(allProducts);

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedSubcategory(null);
    setSelectedPriceRange(null);
  };

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

        {/* Search + Sort Bar */}
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
            {/* Mobile Filter Trigger */}
            <ProductFilters
              brands={brands}
              subcategories={subcategories}
              priceRange={priceRange}
              selectedBrand={selectedBrand}
              selectedSubcategory={selectedSubcategory}
              selectedPriceRange={selectedPriceRange}
              onBrandChange={setSelectedBrand}
              onSubcategoryChange={setSelectedSubcategory}
              onPriceRangeChange={setSelectedPriceRange}
              onClearAll={handleClearAll}
              totalResults={filteredProducts.length}
            />

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

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar (rendered inside ProductFilters) */}
          <div className="hidden lg:block">
            <ProductFilters
              brands={brands}
              subcategories={subcategories}
              priceRange={priceRange}
              selectedBrand={selectedBrand}
              selectedSubcategory={selectedSubcategory}
              selectedPriceRange={selectedPriceRange}
              onBrandChange={setSelectedBrand}
              onSubcategoryChange={setSelectedSubcategory}
              onPriceRangeChange={setSelectedPriceRange}
              onClearAll={handleClearAll}
              totalResults={filteredProducts.length}
            />
          </div>

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
      </div>
    </div>
  );
}
