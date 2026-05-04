"use client";

interface ProductInfoProps {
  brand: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description: string;
}

export function ProductInfo({ brand, name, price, originalPrice, description }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-brand-orange font-semibold uppercase tracking-wider mb-1">
          {brand}
        </p>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
          {name}
        </h1>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-slate-900">
          ₹{price.toLocaleString("en-IN")}
        </span>
        {originalPrice && (
          <>
            <span className="text-lg text-slate-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              Save ₹
              {(originalPrice - price).toLocaleString("en-IN")}
            </span>
          </>
        )}
      </div>

      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
