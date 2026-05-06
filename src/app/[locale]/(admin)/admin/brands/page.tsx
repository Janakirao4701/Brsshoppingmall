"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Plus, Search, RefreshCw, Loader2, Edit2, Trash2, Globe, Mail, Phone, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Brand } from "@/lib/types";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
  });

  const loadBrands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      setBrands(data || []);
    } catch (err) {
      console.error("Error loading brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBrands(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        const { error } = await supabase.from("brands").update(formData).eq("id", editingBrand.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("brands").insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingBrand(null);
      setFormData({ name: "", logo: "", description: "" });
      loadBrands();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm("Are you sure? This will remove the brand reference from all products.")) return;
    try {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
      loadBrands();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filtered = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Brands & Vendors</h1>
          <p className="text-sm text-[#888] mt-1">Manage brand profiles and sourcing partners.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadBrands} className="p-2 bg-white border border-[#eaeaea] rounded-lg hover:bg-[#fafafa] transition-colors">
            <RefreshCw className="size-4" />
          </button>
          <Button onClick={() => { setEditingBrand(null); setFormData({ name: "", logo: "", description: "" }); setIsModalOpen(true); }} className="bg-[#171717] text-white">
            <Plus className="size-4 mr-2" /> Add Brand
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#888]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            placeholder="Search brands..." />
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#171717]" />
          <p className="text-sm text-[#888]">Loading brands...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 bg-white rounded-xl border border-dashed border-[#eaeaea] text-center">
          <Shield className="size-12 text-[#ddd] mx-auto mb-3" />
          <p className="text-sm text-[#888]">No brands found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(brand => (
            <div key={brand.id} className="bg-white p-6 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] group text-center flex flex-col items-center">
              <div className="size-20 rounded-2xl bg-slate-50 border border-[#eaeaea] flex items-center justify-center overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain p-2" /> : <Shield className="size-8 text-slate-300" />}
              </div>
              <h3 className="font-bold text-[#171717] text-lg">{brand.name}</h3>
              <p className="text-xs text-[#888] line-clamp-2 mt-2 min-h-[32px]">{brand.description || "Premium fashion brand partner."}</p>
              
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#fafafa] w-full justify-center">
                <button onClick={() => { setEditingBrand(brand); setFormData({ name: brand.name, logo: brand.logo || "", description: brand.description || "" }); setIsModalOpen(true); }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5">
                  <Edit2 className="size-3" /> Edit
                </button>
                <button onClick={() => deleteBrand(brand.id)}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5">
                  <Trash2 className="size-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-[450px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-[#eaeaea] flex items-center justify-between">
              <h2 className="font-bold text-xl">{editingBrand ? "Edit Brand" : "New Brand"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><X className="size-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888] uppercase tracking-[0.2em] px-1">Brand Name</label>
                <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="e.g. Zara, Manyavar" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888] uppercase tracking-[0.2em] px-1">Logo URL</label>
                <div className="flex gap-3">
                  <input value={formData.logo} onChange={e => setFormData(p => ({ ...p, logo: e.target.value }))}
                    className="flex-1 px-4 py-3 rounded-xl border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="https://..." />
                  <div className="size-12 bg-slate-50 rounded-xl border border-[#eaeaea] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.logo ? <img src={formData.logo} className="w-full h-full object-contain p-1" /> : <ImageIcon className="size-5 text-slate-300" />}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888] uppercase tracking-[0.2em] px-1">About Brand</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="Brief brand history or vendor details..." />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1 bg-[#171717] text-white py-6 rounded-2xl text-base font-bold shadow-xl shadow-slate-200">Save Profile</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
