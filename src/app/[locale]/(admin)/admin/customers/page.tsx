"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, Search, RefreshCw, Mail, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  name: string;
  phone: string;
  email: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    const supabase = getSupabase();
    
    // Fetch all orders to aggregate customer data
    const { data: orders } = await supabase
      .from("orders")
      .select("customer_name, customer_phone, customer_email, total, created_at")
      .order("created_at", { ascending: false });

    if (orders) {
      const customerMap = new Map<string, Customer>();
      
      orders.forEach(order => {
        const key = order.customer_phone;
        if (customerMap.has(key)) {
          const existing = customerMap.get(key)!;
          existing.orderCount += 1;
          existing.totalSpent += order.total;
        } else {
          customerMap.set(key, {
            name: order.customer_name,
            phone: order.customer_phone,
            email: order.customer_email,
            orderCount: 1,
            totalSpent: order.total,
            lastOrder: order.created_at
          });
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
    }
    setLoading(false);
  };

  useEffect(() => { loadCustomers(); }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Customers</h1>
        <button onClick={loadCustomers}
          className="flex items-center gap-2 px-4 py-2 bg-white text-sm font-medium text-[#171717] rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-[#fafafa] transition-colors">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#888]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
          placeholder="Search by name, phone, or email..." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)]">
          <p className="text-xs text-[#888] font-medium">Total Customers</p>
          <p className="text-lg font-bold text-[#171717] mt-1">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)]">
          <p className="text-xs text-[#888] font-medium">Avg. Value</p>
          <p className="text-lg font-bold text-[#171717] mt-1">
            ₹{customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toLocaleString("en-IN") : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)]">
          <p className="text-xs text-[#888] font-medium">Top Customer</p>
          <p className="text-sm font-bold text-[#171717] mt-1 truncate">
            {customers.length > 0 ? customers.reduce((a, b) => a.totalSpent > b.totalSpent ? a : b).name : "—"}
          </p>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#fafafa] border-b border-[#eaeaea]">
              <tr>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Customer</th>
                <th className="text-center px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Orders</th>
                <th className="text-right px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Total Spent</th>
                <th className="text-right px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea]">
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-[#888]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-[#888]">No customers found.</td></tr>
              ) : (
                filtered.map((customer, i) => (
                  <tr key={i} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#171717]">{customer.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-[#888]">
                          <Phone className="size-3" /> {customer.phone}
                        </span>
                        {customer.email && (
                          <span className="flex items-center gap-1 text-xs text-[#888]">
                            <Mail className="size-3" /> {customer.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-[#171717]">{customer.orderCount}</td>
                    <td className="px-5 py-4 text-right font-bold text-[#171717]">₹{customer.totalSpent.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-right text-xs text-[#888]">
                      {new Date(customer.lastOrder).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
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
