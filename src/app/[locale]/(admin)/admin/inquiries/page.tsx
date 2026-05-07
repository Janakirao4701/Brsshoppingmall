"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, RefreshCw, Search, Phone, Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  product_category: string;
  quantity: number;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["pending", "contacted", "completed", "cancelled"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bulk_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInquiries(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("bulk_inquiries").update({ status }).eq("id", id);
      if (error) throw error;
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const filtered = inquiries.filter(i => {
    const matchesSearch = !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.phone.includes(search);
    const matchesFilter = filter === "all" || i.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Bulk Inquiries</h1>
        <button onClick={loadInquiries}
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
            placeholder="Search by name or phone..." />
        </div>
        <div className="flex bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-1">
          {["all", ...STATUSES].map(s => (
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
          { label: "Total", value: inquiries.length },
          { label: "Pending", value: inquiries.filter(i => i.status === "pending").length },
          { label: "Contacted", value: inquiries.filter(i => i.status === "contacted").length },
          { label: "Completed", value: inquiries.filter(i => i.status === "completed").length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)]">
            <p className="text-xs text-[#888] font-medium">{s.label}</p>
            <p className="text-lg font-bold text-[#171717] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="size-8 animate-spin text-[#171717]" />
          <p className="text-sm text-[#888]">Loading inquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
          <MessageSquare className="size-12 text-[#ddd] mx-auto mb-3" />
          <p className="text-sm text-[#888]">No inquiries found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fafafa] border-b border-[#eaeaea]">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Category</th>
                  <th className="text-center px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Qty</th>
                  <th className="text-left px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Message</th>
                  <th className="text-center px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Status</th>
                  <th className="text-right px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Date</th>
                  <th className="text-center px-5 py-3 text-[11px] font-medium text-[#888] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea]">
                {filtered.map(inquiry => (
                  <tr key={inquiry.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#171717]">{inquiry.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-[#888]">
                          <Phone className="size-3" /> {inquiry.phone}
                        </span>
                        {inquiry.email && (
                          <span className="flex items-center gap-1 text-xs text-[#888]">
                            <Mail className="size-3" /> {inquiry.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#666]">{inquiry.product_category}</td>
                    <td className="px-5 py-4 text-center font-bold text-[#171717]">{inquiry.quantity}</td>
                    <td className="px-5 py-4 text-[#666] max-w-[200px]">
                      <p className="line-clamp-2 text-xs">{inquiry.message || "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full capitalize", statusColor(inquiry.status))}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-[#888]">{formatDate(inquiry.created_at)}</td>
                    <td className="px-5 py-4 text-center">
                      <select value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-[#eaeaea] text-xs bg-white cursor-pointer min-h-[36px]">
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (UI/UX Pro Max) */}
          <div className="md:hidden divide-y divide-[#eaeaea]">
            {filtered.map(inquiry => (
              <div key={inquiry.id} className="p-5 space-y-4 active:bg-[#fafafa] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#171717]">{inquiry.name}</p>
                    <div className="flex flex-col gap-1 mt-1">
                      <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                        <Phone className="size-3" /> {inquiry.phone}
                      </a>
                      {inquiry.email && (
                        <span className="flex items-center gap-2 text-xs text-[#888]">
                          <Mail className="size-3" /> {inquiry.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest", statusColor(inquiry.status))}>
                    {inquiry.status}
                  </span>
                </div>

                <div className="bg-[#fafafa] rounded-lg p-3 text-xs text-[#666] italic leading-relaxed">
                  &quot;{inquiry.message || "No message provided"}&quot;
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest">Details</span>
                    <span className="text-xs font-semibold text-[#171717]">{inquiry.product_category} • {inquiry.quantity} pcs</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#eaeaea] text-xs bg-white font-bold min-h-[44px]">
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-[#888] text-right">{formatDate(inquiry.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
