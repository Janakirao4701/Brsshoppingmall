"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Plus, Search, RefreshCw, Loader2, Edit2, Trash2, FolderTree, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    parent_id: ""
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        parent_id: formData.parent_id === "" ? null : formData.parent_id
      };

      if (editingCategory) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "", image: "", parent_id: "" });
      loadCategories();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will not delete subcategories but might break relationships.")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      loadCategories();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Categories</h1>
          <p className="text-sm text-[#888] mt-1">Manage product classification and hierarchy.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadCategories} className="p-2 bg-white border border-[#eaeaea] rounded-lg hover:bg-[#fafafa] transition-colors">
            <RefreshCw className="size-4" />
          </button>
          <Button onClick={() => { setEditingCategory(null); setFormData({ name: "", slug: "", description: "", image: "", parent_id: "" }); setIsModalOpen(true); }} className="bg-[#171717] text-white">
            <Plus className="size-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#888]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            placeholder="Search categories..." />
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#171717]" />
          <p className="text-sm text-[#888]">Loading categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 bg-white rounded-xl border border-dashed border-[#eaeaea] text-center">
          <FolderTree className="size-12 text-[#ddd] mx-auto mb-3" />
          <p className="text-sm text-[#888]">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cat => (
            <div key={cat.id} className="bg-white p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] group">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-lg bg-slate-50 border border-[#eaeaea] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <FolderTree className="size-5 text-slate-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#171717] truncate">{cat.name}</h3>
                    {cat.parent_id && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-medium">Sub</span>
                    )}
                  </div>
                  <p className="text-xs text-[#888] mt-0.5 font-mono">/{cat.slug}</p>
                  <p className="text-xs text-[#666] line-clamp-1 mt-2">{cat.description || "No description"}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#fafafa] opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, slug: cat.slug, description: cat.description || "", image: cat.image || "", parent_id: cat.parent_id || "" }); setIsModalOpen(true); }}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                  <Edit2 className="size-4" />
                </button>
                <button onClick={() => deleteCategory(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#eaeaea] flex items-center justify-between">
              <h2 className="font-bold text-lg">{editingCategory ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Name</label>
                  <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm" placeholder="e.g. Sarees" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Slug</label>
                  <input required value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm" placeholder="sarees" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Parent Category</label>
                <select value={formData.parent_id} onChange={e => setFormData(p => ({ ...p, parent_id: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm bg-white">
                  <option value="">None (Top Level)</option>
                  {parentCategories.filter(c => c.id !== editingCategory?.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Image URL</label>
                <div className="flex gap-2">
                  <input value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm" placeholder="https://..." />
                  <div className="size-9 bg-slate-50 rounded border border-[#eaeaea] flex items-center justify-center overflow-hidden">
                    {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="size-4 text-slate-300" />}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm resize-none" placeholder="Brief details about this category..." />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-50 text-slate-900 border border-[#eaeaea] hover:bg-slate-100">Cancel</Button>
                <Button type="submit" className="flex-1 bg-[#171717] text-white">Save Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>; }
