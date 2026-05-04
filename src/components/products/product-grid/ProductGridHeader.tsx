"use client";

interface ProductGridHeaderProps {
  title: string;
  description?: string;
}

export function ProductGridHeader({ title, description }: ProductGridHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
