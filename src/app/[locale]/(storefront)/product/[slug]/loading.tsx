export default function ProductDetailLoading() {
  return (
    <div className="py-6 px-4 animate-pulse">
      <div className="container mx-auto">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-10 bg-slate-200 rounded" />
          <div className="h-4 w-4 bg-slate-100 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-4 bg-slate-100 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-slate-200 rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="size-16 bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-full bg-slate-200 rounded" />
            <div className="h-8 w-3/4 bg-slate-100 rounded" />
            <div className="h-6 w-32 bg-slate-200 rounded mt-4" />
            <div className="h-20 w-full bg-slate-100 rounded mt-4" />
            <div className="flex gap-3 mt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="size-12 bg-slate-200 rounded-xl" />
              ))}
            </div>
            <div className="h-14 w-full bg-slate-200 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
