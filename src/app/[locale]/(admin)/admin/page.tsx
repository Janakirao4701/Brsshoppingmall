import { StatCard } from "@/components/admin/StatCard";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Dashboard</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-sm font-medium text-[#171717] rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-[#fafafa] transition-colors">
            Export Report
          </button>
          <Link 
            href="/admin/products/new" 
            className="px-4 py-2 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹2,45,000" trend="up" trendValue="12% from last month" />
        <StatCard title="Active Orders" value="142" trend="up" trendValue="8% from last month" />
        <StatCard title="Bulk Inquiries" value="12" trend="down" trendValue="2% from last month" />
        <StatCard title="Unique Visitors" value="12,450" trend="up" trendValue="24% from last month" />
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
            {/* Mock Chart Bars */}
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

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-[#171717] mb-6">Activity Log</h2>
          <div className="flex-1 overflow-y-auto space-y-4">
            {[
              { action: "INQUIRY_CREATED", target: "Bulk Order #1042", time: "2m ago", status: "pending" },
              { action: "PRODUCT_UPDATED", target: "Men's Casual Shirt", time: "1h ago", status: "success" },
              { action: "ORDER_FULFILLED", target: "Order #8821", time: "3h ago", status: "success" },
              { action: "USER_LOGIN_FAIL", target: "admin@bsrmall.com", time: "5h ago", status: "error" },
              { action: "INQUIRY_RESOLVED", target: "Bulk Order #1040", time: "1d ago", status: "success" },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  log.status === 'pending' ? 'bg-yellow-500' :
                  log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="font-mono text-[#171717] font-medium">{log.action}</div>
                  <div className="text-[#666666] mt-0.5">{log.target}</div>
                  <div className="text-[#888888] mt-1 text-[10px] uppercase tracking-wider">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 border-b border-[#eaeaea] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#171717]">Recent Inquiries</h2>
          <button className="text-xs font-medium text-[#666666] hover:text-[#171717]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafafa] text-[#888888] font-medium border-b border-[#eaeaea]">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea]">
              {[
                { id: "BI-1042", name: "Rahul Kumar", cat: "Men's Wear", qty: 150, status: "Pending", date: "Today, 10:42 AM" },
                { id: "BI-1041", name: "Sneha Reddy", cat: "Mixed", qty: 50, status: "Contacted", date: "Yesterday" },
                { id: "BI-1040", name: "Aarav Sharma", cat: "Kids' Wear", qty: 200, status: "Completed", date: "Oct 12" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4 font-mono text-[#666666]">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-[#171717]">{row.name}</td>
                  <td className="px-6 py-4 text-[#666666]">{row.cat}</td>
                  <td className="px-6 py-4 text-[#666666]">{row.qty}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                      row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      row.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#888888] text-right">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
