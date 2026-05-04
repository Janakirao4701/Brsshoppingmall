"use client";

import * as React from "react";
import { Search, X, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, images, category")
        .ilike("name", `%${query}%`)
        .limit(5);

      setResults(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="size-5 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, categories..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Products</p>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    router.push(`/product/${product.slug}`);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <div className="size-12 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <Package className="size-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{product.category} • ₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-12 text-center text-slate-500">No products found for "{query}"</div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">Type at least 2 characters to search...</div>
          )}
        </div>
      </div>
    </div>
  );
}
