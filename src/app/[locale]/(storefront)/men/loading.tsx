export default function CategoryLoading() {
  return (
    <div className="py-8 md:py-12 px-4 animate-pulse">
      <div className="container mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-72 bg-slate-200 rounded mb-3" />
          <div className="h-4 w-96 bg-slate-100 rounded" />
        </div>

        {/* Toolbar Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-64 bg-slate-200 rounded-xl" />
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        </div>

        {/* Grid Skeleton */}
        <div className="flex gap-10">
          {/* Sidebar Skeleton (desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-slate-100 rounded-3xl p-6 space-y-4">
              <div className="h-5 w-20 bg-slate-200 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-full bg-slate-200 rounded-lg" />
              ))}
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="aspect-[3/4] bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-4 w-full bg-slate-200 rounded" />
                  <div className="h-4 w-3/4 bg-slate-100 rounded" />
                  <div className="h-5 w-20 bg-slate-200 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
