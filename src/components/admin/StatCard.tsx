import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon?: React.ReactNode;
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendValue,
  icon
}: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className={`size-12 rounded-2xl flex items-center justify-center bg-slate-50 transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <div className={`flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
          trend === 'down' ? 'bg-rose-50 text-rose-600' : 
          'bg-slate-50 text-slate-500'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
        </div>
      </div>
      
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
      </div>
    </div>
  );
}
