import React from 'react';

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendValue 
}: { 
  title: string; 
  value: string; 
  trend: 'up' | 'down' | 'neutral'; 
  trendValue: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)]">
      <h3 className="text-[13px] font-medium text-[#666666] mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-[#171717] tracking-tight">{value}</span>
        <span className={`text-[13px] font-medium ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-[#888888]'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
        </span>
      </div>
    </div>
  );
}
