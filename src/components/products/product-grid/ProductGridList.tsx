"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "../ProductCard";

interface ProductGridListProps {
  products: Product[];
  onClearFilters: () => void;
}

export function ProductGridList({ products, onClearFilters }: ProductGridListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="text-7xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          No matches found
        </h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          We couldn't find any products matching your current filters. Try resetting them.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/10 active:scale-95"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 animate-in fade-in duration-500">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
