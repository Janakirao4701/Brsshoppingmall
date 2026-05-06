"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";
import { getBrands, getSubcategories } from "@/lib/products";
import { cn } from "@/lib/utils";

// Sub-components from the existing ProductGrid
import { ProductGridToolbar } from "@/components/products/product-grid/ProductGridToolbar";
import { ProductFilters } from "@/components/products/product-grid/ProductFilters";
import { ProductGridList } from "@/components/products/product-grid/ProductGridList";
import { MobileFilterDrawer } from "@/components/products/product-grid/MobileFilterDrawer";

interface ShopPageClientProps {
  menProducts: Product[];
  womenProducts: Product[];
  kidsProducts: Product[];
}

const CATEGORIES = [
  { 
    key: "men", 
    label: "Men", 
    description: "Premium shirts, trousers, ethnic wear & more",
    gradient: "from-slate-900 to-slate-700",
    emoji: "👔",
  },
  { 
    key: "women", 
    label: "Women", 
    description: "Elegant sarees, kurtas, western & ethnic sets",
    gradient: "from-rose-600 to-pink-500",
    emoji: "👗",
  },
  { 
    key: "kids", 
    label: "Kids", 
    description: "Fun, colorful & comfortable outfits",
    gradient: "from-amber-500 to-orange-500",
    emoji: "🧒",
  },
];

export function ShopPageClient({ menProducts, womenProducts, kidsProducts }: ShopPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("men");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get the products for the active category
  const allProducts = useMemo(() => {
    switch (activeCategory) {
      case "women": return womenProducts;
      case "kids": return kidsProducts;
      default: return menProducts;
    }
  }, [activeCategory, menProducts, womenProducts, kidsProducts]);

  // Reset filters when switching category
  const handleCategorySwitch = (key: string) => {
    setActiveCategory(key);
    setSearchQuery("");
    setSelectedBrand(null);
    setSelectedSubcategory(null);
    setSelectedPriceRange(null);
    setSortBy("newest");
  };

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

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory)!;

  const productCounts: Record<string, number> = {
    men: menProducts.length,
    women: womenProducts.length,
    kids: kidsProducts.length,
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
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero header */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 pt-8 pb-6 md:pt-12 md:pb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-normal text-slate-900 tracking-tight mb-2">
            <span className="text-italic-accent">Shop</span> Collections
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl">
            Explore our curated selections of premium garments for the whole family.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="container mx-auto px-4">
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategorySwitch(cat.key)}
                  className={cn(
                    "group relative flex-none rounded-2xl px-5 py-3.5 md:px-8 md:py-4 transition-all duration-300 text-left min-w-[140px] md:min-w-[200px]",
                    "border-2 overflow-hidden",
                    isActive 
                      ? "border-transparent text-white shadow-lg shadow-slate-900/10 scale-[1.02]" 
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-md"
                  )}
                >
                  {/* Active gradient background */}
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                      cat.gradient
                    )} />
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    <span className="text-xl md:text-2xl">{cat.emoji}</span>
                    <div>
                      <div className="font-bold text-sm md:text-base leading-tight">{cat.label}</div>
                      <div className={cn(
                        "text-[10px] md:text-xs mt-0.5 leading-snug",
                        isActive ? "text-white/80" : "text-slate-400"
                      )}>
                        {productCounts[cat.key]} items
                      </div>
                    </div>
                  </div>

                  {/* Bottom indicator line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/40 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active category description */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "hidden md:flex h-10 w-1 rounded-full bg-gradient-to-b",
            activeCat.gradient
          )} />
          <div>
            <h2 className="text-lg md:text-xl font-heading font-semibold text-slate-900">
              {activeCat.label}&apos;s Collection
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">{activeCat.description}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pb-24 md:pb-12">
        <div className="container mx-auto">
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
    </div>
  );
}
