"use client";

interface AttributesFieldsProps {
  formData: {
    sizes: string;
    colors: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AttributesFields({ formData, onChange }: AttributesFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#171717]">Sizes <span className="text-[#888888] font-normal text-xs">(comma separated)</span></label>
        <input 
          name="sizes"
          placeholder="S, M, L, XL"
          value={formData.sizes}
          onChange={onChange}
          className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#171717]">Colors <span className="text-[#888888] font-normal text-xs">(comma separated)</span></label>
        <input 
          name="colors"
          placeholder="Red, Blue, Black"
          value={formData.colors}
          onChange={onChange}
          className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
        />
      </div>
    </div>
  );
}
