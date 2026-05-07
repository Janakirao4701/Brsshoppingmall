"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, ChevronDown, Search, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  razorpay_payment_id: string | null;
  created_at: string;
}

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, revenue: 0 });
  const ITEMS_PER_PAGE = 15;

  const loadOrders = async () => {
    setLoading(true);
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase.from("orders").select("*", { count: 'exact' });

      if (search) {
        query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);
      }
      if (filter !== "all") {
        query = query.eq("order_status", filter);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      setOrders(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const { count: total } = await supabase.from("orders").select("*", { count: 'exact', head: true });
    const { count: pending } = await supabase.from("orders").select("*", { count: 'exact', head: true }).eq("order_status", "pending");
    const { count: paidCount } = await supabase.from("orders").select("*", { count: 'exact', head: true }).eq("payment_status", "paid");
    
    // Revenue sum query
    const { data: revenueData } = await supabase.from("orders").select("total").eq("payment_status", "paid");
    const revenue = revenueData?.reduce((s, o) => s + o.total, 0) || 0;

    setStats({ 
      total: total || 0, 
      pending: pending || 0, 
      paid: paidCount || 0, 
      revenue 
    });
  };

  useEffect(() => { 
    loadOrders(); 
  }, [page, filter]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadOrders();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const updateOrderStatus = async (orderId: string, field: string, value: string) => {
    try {
      const { error } = await supabase.from("orders").update({ [field]: value }).eq("id", orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, [field]: value } : o));
      loadStats(); // Update totals if status changed
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update status.");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": case "delivered": case "paid": return "bg-green-100 text-green-800";
      case "processing": case "shipped": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": case "failed": case "refunded": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  // We use server-side filtering now
  const filtered = orders;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Orders</h1>
        <button onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white text-sm font-medium text-[#171717] rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-[#fafafa] transition-colors">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#888]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            placeholder="Search by order #, name, or phone..." />
        </div>
        <div className="flex bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-1">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors",
                filter === s ? "bg-[#171717] text-white" : "text-[#666] hover:text-[#171717]"
              )}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-[#171717]" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "Paid", value: stats.paid, color: "text-green-600" },
          { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, color: "text-[#171717]" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)]">
            <p className="text-xs text-[#888] font-medium">{s.label}</p>
            <p className={cn("text-lg font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="size-8 animate-spin text-[#171717]" />
          <p className="text-sm text-[#888]">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
          <Package className="size-12 text-[#ddd] mx-auto mb-3" />
          <p className="text-sm text-[#888]">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Summary row */}
              <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#fafafa] transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-mono font-bold text-[#171717]">#{order.order_number}</p>
                    <p className="text-xs text-[#888] mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="text-sm font-medium text-[#171717] truncate">{order.customer_name}</p>
                    <p className="text-xs text-[#888]">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[11px] font-medium px-2 py-1 rounded-full", statusColor(order.order_status))}>
                    {order.order_status}
                  </span>
                  <span className={cn("text-[11px] font-medium px-2 py-1 rounded-full hidden sm:inline", statusColor(order.payment_status))}>
                    {order.payment_status}
                  </span>
                  <span className="text-sm font-bold text-[#171717]">₹{order.total.toLocaleString("en-IN")}</span>
                  <ChevronDown className={cn("size-4 text-[#888] transition-transform", expandedId === order.id && "rotate-180")} />
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-[#eaeaea] p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Customer */}
                    <div>
                      <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2">Customer</p>
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-sm text-[#666]">📞 {order.customer_phone}</p>
                      {order.customer_email && <p className="text-sm text-[#666]">✉️ {order.customer_email}</p>}
                    </div>
                    {/* Shipping */}
                    <div>
                      <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2">Shipping Address</p>
                      <p className="text-sm text-[#666]">{order.shipping_address}</p>
                      <p className="text-sm text-[#666]">{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                    </div>
                    {/* Payment */}
                    <div>
                      <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2">Payment</p>
                      <p className="text-sm">{order.payment_method === "razorpay" ? "💳 Online (Razorpay)" : "💬 WhatsApp"}</p>
                      {order.razorpay_payment_id && (
                        <p className="text-xs font-mono text-[#888] mt-1">ID: {order.razorpay_payment_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2">Items</p>
                    <div className="bg-[#fafafa] rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[#eaeaea]">
                          <th className="text-left px-4 py-2 text-[11px] font-medium text-[#888]">Product</th>
                          <th className="text-center px-4 py-2 text-[11px] font-medium text-[#888]">Size</th>
                          <th className="text-center px-4 py-2 text-[11px] font-medium text-[#888]">Qty</th>
                          <th className="text-right px-4 py-2 text-[11px] font-medium text-[#888]">Price</th>
                        </tr></thead>
                        <tbody>
                          {(order.items || []).map((item: any, i: number) => (
                            <tr key={i} className="border-b border-[#eaeaea] last:border-0">
                              <td className="px-4 py-3 text-[#171717]">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <div className="size-10 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <span className="font-medium">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-[#666]">{item.size || "—"}</td>
                              <td className="px-4 py-3 text-center text-[#666]">{item.quantity}</td>
                              <td className="px-4 py-3 text-right font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end gap-6 mt-3 text-sm">
                      <span className="text-[#888]">Subtotal: ₹{order.subtotal.toLocaleString("en-IN")}</span>
                      <span className="text-[#888]">Shipping: {order.shipping_cost === 0 ? "FREE" : `₹${order.shipping_cost}`}</span>
                      <span className="font-bold">Total: ₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Status controls */}
                  <div className="flex flex-wrap gap-4 pt-3 border-t border-[#eaeaea]">
                    <div>
                      <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-1">Order Status</label>
                      <select value={order.order_status}
                        onChange={(e) => updateOrderStatus(order.id, "order_status", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[#eaeaea] text-sm bg-white">
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-1">Payment Status</label>
                      <select value={order.payment_status}
                        onChange={(e) => updateOrderStatus(order.id, "payment_status", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[#eaeaea] text-sm bg-white">
                        {PAYMENT_STATUSES.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Pagination Controls */}
          {totalCount > ITEMS_PER_PAGE && (
            <div className="px-6 py-4 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] flex items-center justify-between">
              <p className="text-xs text-[#888] font-medium">
                Showing <span className="text-[#171717] font-bold">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[#171717] font-bold">{Math.min(page * ITEMS_PER_PAGE, totalCount)}</span> of <span className="text-[#171717] font-bold">{totalCount}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#eaeaea] text-xs font-bold bg-white text-[#171717] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
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
