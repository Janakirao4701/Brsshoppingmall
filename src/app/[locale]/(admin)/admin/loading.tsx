export default function AdminLoading() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-12 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-80 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-slate-200 rounded-xl" />
          <div className="h-10 w-40 bg-slate-900/10 rounded-xl" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8">
          <div className="h-5 w-40 bg-slate-200 rounded mb-10" />
          <div className="h-[280px] bg-slate-100 rounded-2xl" />
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
