import { useState, useMemo } from "react";
import { Product } from "@/lib/types";

export function useProductGrid(allProducts: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");

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
      case "newest":
      default:
        // Assuming there's a created_at or id that correlates with recency
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedBrand, selectedSubcategory, selectedPriceRange, sortBy]);

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedSubcategory(null);
    setSelectedPriceRange(null);
  };

  const hasFilters = !!(selectedBrand || selectedSubcategory || selectedPriceRange || searchQuery);

  return {
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
  };
}
