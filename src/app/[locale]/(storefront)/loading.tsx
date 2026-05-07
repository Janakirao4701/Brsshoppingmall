export default function StorefrontLoading() {
  return (
    <div className="flex flex-col w-full animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-[85vh] md:h-[600px] lg:h-[700px] bg-slate-200" />

      {/* Quick Categories Skeleton */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 md:gap-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="size-20 md:size-24 rounded-full bg-slate-200" />
                <div className="h-3 w-14 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Cards Skeleton */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="h-8 w-64 bg-slate-200 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
