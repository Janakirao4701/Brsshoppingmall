"use client";

import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, LayoutDashboard, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Advanced Analytics</h1>
          <p className="text-sm text-[#888] mt-1">Deep insights into your store's performance and customer behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-[#eaeaea] shadow-sm flex items-center gap-3">
            <Calendar className="size-4 text-[#888]" />
            <span className="text-sm font-medium text-[#171717]">Last 30 Days</span>
          </div>
          <Button variant="outline" className="rounded-xl border-[#eaeaea]">Export Report</Button>
        </div>
      </div>

      {/* Analytics Placeholder State */}
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#f0f0f0] p-12 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
          <BarChart3 size={400} />
        </div>
        
        <div className="max-w-md mx-auto space-y-6 relative z-10">
          <div className="size-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-slate-200">
            <TrendingUp className="size-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#171717]">Engine Intelligence Loading</h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              We are currently calibrating the BSR Intelligence engine to provide real-time sales forecasting and customer segmentation. 
              Live data visualization will be available shortly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Coming Next</p>
              <p className="text-xs font-bold text-slate-700">Predictive Inventory</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Coming Next</p>
              <p className="text-xs font-bold text-slate-700">Customer LTV Maps</p>
            </div>
          </div>

          <Link href="/admin">
            <Button className="mt-8 bg-slate-900 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-slate-200">
              <LayoutDashboard className="size-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Mini Previews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
        <StatPreview label="Customer Acquisition" icon={<Users className="size-4" />} />
        <StatPreview label="Conversion Rate" icon={<TrendingUp className="size-4" />} />
        <StatPreview label="Avg. Order Value" icon={<DollarSign className="size-4" />} />
      </div>
    </div>
  );
}

function StatPreview({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#eaeaea]">
      <div className="flex items-center justify-between mb-4">
        <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
          <ArrowUpRight size={14} /> 12%
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
        <div className="h-full w-2/3 bg-slate-200" />
      </div>
    </div>
  );
}
