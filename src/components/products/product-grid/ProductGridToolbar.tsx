"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGridToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onOpenMobileFilters: () => void;
  hasFilters: boolean;
}

export function ProductGridToolbar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onOpenMobileFilters,
  hasFilters
}: ProductGridToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMobileFilters}
          className="lg:hidden border-slate-300 h-10 px-4 rounded-xl"
        >
          <SlidersHorizontal className="size-4 mr-2" /> Filters
          {hasFilters && (
            <span className="ml-1.5 size-5 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              !
            </span>
          )}
        </Button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="discount">Best Discount</option>
        </select>
      </div>
    </div>
  );
}
