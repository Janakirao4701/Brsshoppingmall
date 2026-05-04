"use client";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    slug: string;
    description: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicInfoFields({ formData, onChange }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Product Name</label>
          <input 
            required
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter product name"
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">URL Slug (Auto)</label>
          <input 
            required
            name="slug"
            value={formData.slug}
            onChange={onChange}
            className="w-full bg-[#fafafa] text-[#666666] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#171717]">Description</label>
        <textarea 
          required
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={3}
          placeholder="Describe the product materials, fit, and style..."
          className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
        />
      </div>
    </>
  );
}
