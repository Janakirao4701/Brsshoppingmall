"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  brand: string;
  in_stock: boolean;
  featured: boolean;
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    supabase
      .from("products")
      .select("id, name, slug, price, original_price, category, brand, in_stock, featured, images")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Products</h1>
          <p className="text-sm text-[#666666] mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="size-8 border-2 border-[#eaeaea] border-t-[#171717] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#888888] mt-4">Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="size-12 text-[#cccccc] mx-auto mb-4" />
            <p className="text-sm font-medium text-[#171717]">No products yet</p>
            <p className="text-xs text-[#888888] mt-1">Click "Add Product" to create your first listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fafafa] text-[#888888] font-medium border-b border-[#eaeaea]">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Brand</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-[#f5f5f5] rounded-md flex items-center justify-center text-lg flex-shrink-0">
                          {product.category === "men" ? "👔" : product.category === "women" ? "👗" : "🧒"}
                        </div>
                        <div>
                          <p className="font-medium text-[#171717] truncate max-w-[200px]">{product.name}</p>
                          {product.featured && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">FEATURED</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#666666] capitalize">{product.category}</td>
                    <td className="px-6 py-4 text-[#666666]">{product.brand}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-[#171717]">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.original_price && (
                        <span className="text-xs text-[#aaa] line-through ml-2">₹{product.original_price.toLocaleString("en-IN")}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                        product.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-[#888888] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
