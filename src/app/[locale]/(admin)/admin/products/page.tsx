"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Plus, Search, RefreshCw, Loader2, Edit2, Trash2, Tag, Filter, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 15;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("products")
        .select(`
          *,
          brands(name),
          categories(name),
          product_variants(stock)
        `, { count: 'exact' });

      if (search) {
        query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
      }
      
      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, drafts: 0 });

  const loadStats = async () => {
    const { count: total } = await supabase.from("products").select("*", { count: 'exact', head: true });
    const { count: active } = await supabase.from("products").select("*", { count: 'exact', head: true }).eq("status", "active");
    const { count: drafts } = await supabase.from("products").select("*", { count: 'exact', head: true }).eq("status", "draft");
    
    // For low stock, we need a slightly more complex query or a rough estimate
    const { count: lowStock } = await supabase.from("product_variants").select("*", { count: 'exact', head: true }).lt("stock", 10);

    setStats({ 
      total: total || 0, 
      active: active || 0, 
      drafts: drafts || 0, 
      lowStock: lowStock || 0 
    });
  };

  useEffect(() => { loadStats(); }, []);

  useEffect(() => { loadProducts(); }, [page, filter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure? This will delete all variants and images for this product.")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      loadProducts();
      loadStats();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // We use server-side filtering now
  const filtered = products;

  const getStockStatus = (p: any) => {
    const totalStock = p.product_variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
    if (totalStock === 0) return { label: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (totalStock < 10) return { label: `Low Stock (${totalStock})`, color: "text-orange-600 bg-orange-50" };
    return { label: `In Stock (${totalStock})`, color: "text-green-600 bg-green-50" };
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Products</h1>
          <p className="text-sm text-[#888] mt-1">Manage your fashion catalog and inventory levels.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { loadProducts(); loadStats(); }} className="p-2 bg-white border border-[#eaeaea] rounded-lg hover:bg-[#fafafa] transition-colors shadow-sm">
            <RefreshCw className="size-4" />
          </button>
          <Link href="/admin/products/new">
            <Button className="bg-[#171717] text-white rounded-xl px-5 h-11 font-bold shadow-lg shadow-slate-200">
              <Plus className="size-4 mr-2" /> Create Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.total, icon: <Package className="size-4" /> },
          { label: "Active", value: stats.active, icon: <Tag className="size-4" /> },
          { label: "Low Stock Items", value: stats.lowStock, icon: <BarChart3 className="size-4" /> },
          { label: "Drafts", value: stats.drafts, icon: <Edit2 className="size-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2 text-[#888] mb-1">
              {s.icon} <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-[#171717]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#888]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 bg-white"
            placeholder="Search by name, slug or SKU..." />
        </div>
        <div className="flex bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-1">
          {["all", "active", "draft", "archived"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                filter === s ? "bg-[#171717] text-white shadow-md" : "text-[#888] hover:text-[#171717]"
              )}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-3">
          <Loader2 className="size-10 animate-spin text-[#171717]" />
          <p className="text-sm text-[#888] font-medium tracking-tight">Loading catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 bg-white rounded-2xl border border-dashed border-[#eaeaea] text-center shadow-sm">
          <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Package className="size-8 text-[#ddd]" />
          </div>
          <p className="text-sm font-bold text-slate-900">No products found</p>
          <p className="text-xs text-[#888] mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fafafa] border-b border-[#eaeaea]">
                <tr>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-[#888] uppercase tracking-[0.1em]">Product</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-[#888] uppercase tracking-[0.1em]">Brand/Vendor</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-[#888] uppercase tracking-[0.1em]">Category</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-[#888] uppercase tracking-[0.1em]">Stock Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-[#888] uppercase tracking-[0.1em]">Price</th>
                  <th className="text-center px-6 py-4 text-[10px] font-bold text-[#888] uppercase tracking-[0.1em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea]">
                {filtered.map(product => {
                  const stock = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-[#fafafa]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-slate-50 border border-[#eaeaea] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : <Package className="size-5 text-slate-200" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#171717] truncate">{product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", 
                                product.status === 'active' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                              )}>{product.status}</span>
                              <p className="text-[10px] text-[#888] font-mono truncate">{product.slug}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#171717] font-medium">{product.brands?.name || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#666]">{product.categories?.name || "—"}</span>
                        {product.subcategory && <p className="text-[10px] text-[#888] mt-0.5">{product.subcategory}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", stock.color)}>
                          {stock.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-[#171717]">₹{product.price.toLocaleString("en-IN")}</p>
                        {product.original_price > product.price && (
                          <p className="text-[10px] text-[#888] line-through">₹{product.original_price.toLocaleString("en-IN")}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                              <Edit2 className="size-4" />
                            </button>
                          </Link>
                          <button onClick={() => deleteProduct(product.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalCount > ITEMS_PER_PAGE && (
            <div className="px-6 py-4 bg-[#fafafa] border-t border-[#eaeaea] flex items-center justify-between">
              <p className="text-xs text-[#888] font-medium">
                Showing <span className="text-[#171717] font-bold">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[#171717] font-bold">{Math.min(page * ITEMS_PER_PAGE, totalCount)}</span> of <span className="text-[#171717] font-bold">{totalCount}</span> products
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#eaeaea] text-xs font-bold bg-white text-[#171717] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(totalCount / ITEMS_PER_PAGE) }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "size-8 rounded-lg text-xs font-bold transition-all",
                        page === i + 1 ? "bg-[#171717] text-white shadow-md" : "text-[#888] hover:text-[#171717] hover:bg-slate-50"
                      )}
                    >
                      {i + 1}
                    </button>
                  )).slice(Math.max(0, page - 3), Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), page + 2))}
                </div>
                <button 
                  disabled={page === Math.ceil(totalCount / ITEMS_PER_PAGE)}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-[#eaeaea] text-xs font-bold bg-white text-[#171717] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
