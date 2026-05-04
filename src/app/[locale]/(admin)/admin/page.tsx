"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { StatCard } from "@/components/admin/StatCard";
import Link from "next/link";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  product_category: string;
  quantity: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      setLoading(false);
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    Promise.all([
      supabase.from("bulk_inquiries").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("bulk_inquiries").select("id", { count: "exact", head: true }),
    ]).then(([inquiryRes, productRes, countRes]) => {
      setInquiries(inquiryRes.data || []);
      setProductCount(productRes.count || 0);
      setInquiryCount(countRes.count || 0);
      setLoading(false);
    });
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
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white text-sm font-medium text-[#171717] rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-[#fafafa] transition-colors"
          >
            View Products
          </Link>
          <Link 
            href="/admin/products/new" 
            className="px-4 py-2 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={loading ? "..." : String(productCount)} trend="up" trendValue="from catalog" />
        <StatCard title="Bulk Inquiries" value={loading ? "..." : String(inquiryCount)} trend="up" trendValue="total received" />
        <StatCard title="Active Stores" value="2" trend="up" trendValue="Sompeta & Palasa" />
        <StatCard title="Languages" value="2" trend="up" trendValue="English & Telugu" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-semibold text-[#171717]">Revenue Overview</h2>
            <div className="flex bg-[#fafafa] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-md p-1">
              <button className="px-3 py-1 text-xs font-medium text-[#171717] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)] rounded-sm">7D</button>
              <button className="px-3 py-1 text-xs font-medium text-[#666666] hover:text-[#171717] rounded-sm transition-colors">30D</button>
              <button className="px-3 py-1 text-xs font-medium text-[#666666] hover:text-[#171717] rounded-sm transition-colors">3M</button>
            </div>
          </div>
          
          <div className="h-[240px] flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="w-full bg-[#fafafa] rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-[#171717] rounded-t-sm transition-all duration-500 group-hover:opacity-80" 
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[11px] font-medium text-[#888888] px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-[#171717] mb-6">Quick Actions</h2>
          <div className="flex-1 space-y-3">
            {[
              { label: "Add New Product", href: "/admin/products/new", emoji: "📦" },
              { label: "Manage Hero Banners", href: "/admin/banners", emoji: "🖼️" },
              { label: "View All Products", href: "/admin/products", emoji: "📋" },
              { label: "Visit Storefront", href: "/", emoji: "🌐" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#171717] hover:bg-[#fafafa] shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-colors"
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table — Real Inquiries */}
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 border-b border-[#eaeaea] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#171717]">Recent Bulk Inquiries</h2>
          <span className="text-xs font-medium text-[#888888]">{inquiryCount} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] text-[#888888] font-medium border-b border-[#eaeaea]">
              <tr>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea]">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-[#888888]">Loading...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-[#888888]">No inquiries yet. They&apos;ll appear here when customers submit the bulk order form.</td></tr>
              ) : (
                inquiries.map((row) => (
                  <tr key={row.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#171717]">{row.name}</td>
                    <td className="px-6 py-4 text-[#666666]">{row.phone}</td>
                    <td className="px-6 py-4 text-[#666666]">{row.product_category}</td>
                    <td className="px-6 py-4 text-[#666666]">{row.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                        row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        row.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        row.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#888888] text-right">{formatDate(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
