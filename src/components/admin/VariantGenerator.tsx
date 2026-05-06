"use client";

import { useState, useEffect } from "react";
import { Plus, X, RefreshCw, Hash, Package, Palette, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VariantGeneratorProps {
  onGenerate: (variants: any[]) => void;
  existingVariants?: any[];
}

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const COMMON_COLORS = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Red", code: "#EF4444" },
  { name: "Blue", code: "#3B82F6" },
  { name: "Green", code: "#10B981" },
  { name: "Yellow", code: "#F59E0B" },
  { name: "Pink", code: "#EC4899" },
];

export function VariantGenerator({ onGenerate, existingVariants = [] }: VariantGeneratorProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{name: string, code: string}[]>([]);
  const [variants, setVariants] = useState<any[]>(existingVariants);

  const generateMatrix = () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert("Please select at least one size and one color.");
      return;
    }

    const newVariants = [];
    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        newVariants.push({
          id: crypto.randomUUID(),
          sku: "",
          size: size,
          color: color.name,
          color_code: color.code,
          stock: 0,
          price_override: null
        });
      }
    }
    setVariants(newVariants);
    onGenerate(newVariants);
  };

  const updateVariant = (id: string, field: string, value: any) => {
    const updated = variants.map(v => v.id === id ? { ...v, [field]: value } : v);
    setVariants(updated);
    onGenerate(updated);
  };

  const removeVariant = (id: string) => {
    const updated = variants.filter(v => v.id !== id);
    setVariants(updated);
    onGenerate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl border border-[#eaeaea] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Size Picker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#171717]">
              <Ruler className="size-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Select Sizes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_SIZES.map(s => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedSizes.includes(s) ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#171717]">
              <Palette className="size-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Select Colors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_COLORS.map(c => (
                <button 
                  key={c.name} 
                  type="button"
                  onClick={() => setSelectedColors(prev => prev.find(x => x.name === c.name) ? prev.filter(x => x.name !== c.name) : [...prev, c])}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedColors.find(x => x.name === c.name) ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <div className="size-3 rounded-full border border-black/10" style={{ backgroundColor: c.code }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          type="button" 
          onClick={generateMatrix}
          className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-bold h-11 rounded-xl shadow-sm"
        >
          <RefreshCw className="size-4 mr-2" /> Generate Variant Matrix
        </Button>
      </div>

      {variants.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#eaeaea] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#fafafa] border-b border-[#eaeaea]">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-[#888] uppercase tracking-wider">Variant</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-[#888] uppercase tracking-wider">SKU</th>
                <th className="text-center px-4 py-3 text-[10px] font-bold text-[#888] uppercase tracking-wider">Stock</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold text-[#888] uppercase tracking-wider">Price (+/-)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea]">
              {variants.map((v, i) => (
                <tr key={v.id} className="hover:bg-[#fafafa]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full border border-black/10" style={{ backgroundColor: v.color_code }} />
                      <span className="font-bold text-[#171717]">{v.color} / {v.size}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      value={v.sku} 
                      onChange={(e) => updateVariant(v.id, "sku", e.target.value)}
                      placeholder="SKU-001"
                      className="w-full px-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-slate-900 rounded bg-transparent transition-colors font-mono text-xs" 
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="number" 
                      value={v.stock} 
                      onChange={(e) => updateVariant(v.id, "stock", parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-slate-900 rounded bg-transparent transition-colors text-center font-bold" 
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[#888]">₹</span>
                      <input 
                        type="number" 
                        value={v.price_override || ""} 
                        onChange={(e) => updateVariant(v.id, "price_override", parseFloat(e.target.value) || null)}
                        placeholder="Default"
                        className="w-20 px-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-slate-900 rounded bg-transparent transition-colors text-right" 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => removeVariant(v.id)} className="p-1.5 text-slate-300 hover:text-red-500 rounded transition-colors">
                      <X className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 border-t border-[#eaeaea] flex justify-between items-center">
            <span className="text-xs text-[#888] font-medium">{variants.length} combinations generated</span>
            <div className="flex gap-4">
              <span className="text-xs text-[#888] font-medium">Total Stock: <span className="text-[#171717] font-bold">{variants.reduce((s, v) => s + v.stock, 0)}</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
