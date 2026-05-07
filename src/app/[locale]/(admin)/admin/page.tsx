"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatCard } from "@/components/admin/StatCard";
import Link from "next/link";
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  product_category: string;
  quantity: number;
  status: string;
  created_at: string;
}

interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  lowStockCount: number;
  activeCategories: number;
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalInquiries: 0,
    lowStockCount: 0,
    activeCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [inquiryRes, productRes, categoryRes, variantRes] = await Promise.all([
          supabase.from("bulk_inquiries").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("categories").select("id", { count: "exact", head: true }),
          supabase.from("product_variants").select("stock")
        ]);

        const lowStockCount = variantRes.data?.filter(v => v.stock > 0 && v.stock < 10).length || 0;

        setInquiries(inquiryRes.data || []);
        setStats({
          totalProducts: productRes.count || 0,
          totalInquiries: inquiryRes.count || 0,
          lowStockCount,
          activeCategories: categoryRes.count || 0
        });

        // Get total inquiry count separately
        const { count: totalInquiries } = await supabase.from("bulk_inquiries").select("id", { count: "exact", head: true });
        setStats(prev => ({ ...prev, totalInquiries: totalInquiries || 0 }));

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffHrs < 48) return "Yesterday";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Store Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-sm font-bold text-slate-700 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Package size={16} />
            Manage Inventory
          </Link>
          <Link 
            href="/admin/products/new" 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-sm font-bold text-white rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={loading ? "..." : String(stats.totalProducts)} 
          trend="up" 
          trendValue="Live in catalog"
          icon={<Package className="text-blue-500" size={20} />}
        />
        <StatCard 
          title="Bulk Inquiries" 
          value={loading ? "..." : String(stats.totalInquiries)} 
          trend="up" 
          trendValue="New leads" 
          icon={<ShoppingCart className="text-emerald-500" size={20} />}
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={loading ? "..." : String(stats.lowStockCount)} 
          trend={stats.lowStockCount > 0 ? "down" : "up"} 
          trendValue="Needs attention" 
          icon={<AlertTriangle className={stats.lowStockCount > 0 ? "text-amber-500" : "text-slate-400"} size={20} />}
        />
        <StatCard 
          title="Product Categories" 
          value={loading ? "..." : String(stats.activeCategories)} 
          trend="up" 
          trendValue="Organized departments" 
          icon={<Layers className="text-purple-500" size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-orange" />
                Store Performance
              </h2>
              <p className="text-xs text-slate-400 mt-1">Growth overview over the last 7 days</p>
            </div>
            <div className="flex bg-slate-50 rounded-xl p-1.5 border border-slate-100">
              <button className="px-4 py-1.5 text-[11px] font-bold text-slate-900 bg-white shadow-sm rounded-lg">7D</button>
              <button className="px-4 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 rounded-lg transition-colors">30D</button>
              <button className="px-4 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 rounded-lg transition-colors">ALL</button>
            </div>
          </div>
          
          <div className="h-[280px] flex items-end justify-between gap-3 px-2">
            {[45, 65, 50, 85, 70, 95, 100].map((height, i) => (
              <div key={i} className="w-full bg-slate-50 rounded-2xl relative group h-full flex items-end overflow-hidden">
                <div 
                  className="w-full bg-slate-900 rounded-2xl transition-all duration-700 ease-out group-hover:bg-brand-red cursor-pointer" 
                  style={{ height: `${height}%` }}
                />
                {/* Tooltip on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none">
                  {height}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Clock size={14} className="text-slate-400" />
              Quick Tasks
            </h2>
            <div className="space-y-4">
              {[
                { label: "Add New Product", href: "/admin/products/new", color: "bg-blue-50 text-blue-600" },
                { label: "Update Hero Banners", href: "/admin/banners", color: "bg-purple-50 text-purple-600" },
                { label: "Check Bulk Orders", href: "/admin/inquiries", color: "bg-emerald-50 text-emerald-600" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50 transition-all group"
                >
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <div className={`size-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${item.color}`}>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-brand-red/5 border border-brand-red/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-brand-red font-bold text-sm">Pro Tip</h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Check the <strong>Low Stock Alerts</strong> daily to ensure your best-selling sizes don&apos;t run out during peak hours.
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 size-24 bg-brand-red/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Inquiries Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Inquiries</h2>
            <p className="text-xs text-slate-400 mt-1">Latest bulk order requests from the website</p>
          </div>
          <Link 
            href="/admin/inquiries" 
            className="text-xs font-bold text-brand-red hover:underline self-start sm:self-auto"
          >
            View All
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Qty</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium">Loading...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium">No inquiries yet.</td></tr>
              ) : (
                inquiries.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-brand-red transition-colors">{row.name}</span>
                        <span className="text-xs text-slate-400">{row.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                        {row.product_category}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700">{row.quantity}</td>
                    <td className="px-8 py-5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-8 py-5 text-slate-400 text-right font-medium">{formatDate(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (UI/UX Pro Max: No horizontal scroll) */}
        <div className="md:hidden divide-y divide-slate-50">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No inquiries yet.</div>
          ) : (
            inquiries.map((row) => (
              <div key={row.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{row.name}</span>
                    <span className="text-xs text-slate-400">{row.phone}</span>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product / Qty</span>
                    <span className="text-xs font-semibold text-slate-600">{row.product_category} • {row.quantity} pcs</span>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                    <span className="text-xs text-slate-500">{formatDate(row.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean status badges
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
      status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
      status === 'contacted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
      status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
      'bg-rose-50 text-rose-600 border border-rose-100'
    }`}>
      {status}
    </span>
  );
}
