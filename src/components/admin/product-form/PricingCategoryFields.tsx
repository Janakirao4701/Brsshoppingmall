"use client";

interface PricingCategoryFieldsProps {
  formData: {
    price: string;
    original_price: string;
    category: string;
    subcategory: string;
    brand: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function PricingCategoryFields({ formData, onChange }: PricingCategoryFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Price (₹)</label>
          <input 
            required
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Original Price (₹) <span className="text-[#888888] font-normal text-xs">Optional</span></label>
          <input 
            type="number"
            name="original_price"
            value={formData.original_price}
            onChange={onChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Category</label>
          <select 
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          >
            <option value="men">Men's Wear</option>
            <option value="women">Women's Wear</option>
            <option value="kids">Kids' Wear</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Subcategory</label>
          <input 
            required
            name="subcategory"
            placeholder="e.g. Shirts, Sarees, Jeans"
            value={formData.subcategory}
            onChange={onChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Brand</label>
          <input 
            required
            name="brand"
            placeholder="e.g. BSR Premium, Ethnic"
            value={formData.brand}
            onChange={onChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
      </div>
    </>
  );
}
