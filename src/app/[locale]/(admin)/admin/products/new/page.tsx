"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { 
  Package, Save, ArrowLeft, Loader2, Image as ImageIcon, 
  Tag, Info, Settings, Search, Megaphone, Shield, Eye, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantGenerator } from "@/components/admin/VariantGenerator";
import { Category, Brand } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    original_price: 0,
    category_id: "",
    subcategory: "",
    brand_id: "",
    collection: "",
    material: "",
    fit: "",
    images: [""] as string[],
    featured: false,
    status: "active" as "draft" | "active" | "archived",
    meta_title: "",
    meta_description: ""
  });

  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [catRes, brandRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("brands").select("*").order("name")
      ]);
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
    };
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert Product
      const { data: product, error: pError } = await supabase
        .from("products")
        .insert([{
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: formData.price,
          original_price: formData.original_price,
          category_id: formData.category_id,
          subcategory: formData.subcategory,
          brand_id: formData.brand_id,
          collection: formData.collection,
          material: formData.material,
          fit: formData.fit,
          images: formData.images.filter(img => img.trim() !== ""),
          featured: formData.featured,
          status: formData.status,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description
        }])
        .select()
        .single();

      if (pError) throw pError;

      // 2. Insert Variants
      if (variants.length > 0) {
        const { error: vError } = await supabase
          .from("product_variants")
          .insert(variants.map(v => ({
            product_id: product.id,
            sku: v.sku || `${formData.slug}-${v.color}-${v.size}`.toLowerCase(),
            size: v.size,
            color: v.color,
            color_code: v.color_code,
            stock: v.stock,
            price_override: v.price_override
          })));

        if (vError) throw vError;
      }

      router.push("/admin/products");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => setFormData(p => ({ ...p, images: [...p.images, ""] }));
  const removeImageField = (idx: number) => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  const updateImageField = (idx: number, val: string) => {
    const newImages = [...formData.images];
    newImages[idx] = val;
    setFormData(p => ({ ...p, images: newImages }));
  };

  return (
    <form onSubmit={handleSave} className="max-w-[1000px] mx-auto space-y-8 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-[#fafafa]/80 backdrop-blur-md z-40 py-4 -mx-4 px-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-xl font-bold text-[#171717]">New Fashion Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} className="bg-white text-slate-600 border border-slate-200">Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-[#171717] text-white px-8 shadow-lg shadow-slate-200">
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />} Save Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-6">
            <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2 uppercase tracking-wider">
              <Info className="size-4 text-slate-400" /> General Details
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Product Name</label>
                <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="e.g. Premium Silk Saree" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Slug (URL)</label>
                  <input required value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm bg-slate-50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Subcategory</label>
                  <input value={formData.subcategory} onChange={e => setFormData(p => ({ ...p, subcategory: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="e.g. Banarasi" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="Describe the material, craft, and style..." />
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2 uppercase tracking-wider">
                <Settings className="size-4 text-slate-400" /> Fashion Variants
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Size/Color Matrix</span>
            </div>
            
            <VariantGenerator onGenerate={setVariants} />
          </div>

          {/* Media Gallery */}
          <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-6">
            <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon className="size-4 text-slate-400" /> Media Gallery
            </h2>
            
            <div className="space-y-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-[#888]" />
                    <input value={img} onChange={e => updateImageField(idx, e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#eaeaea] text-xs" placeholder={`Image URL ${idx + 1}`} />
                  </div>
                  <div className="size-10 rounded-lg bg-slate-50 border border-[#eaeaea] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {img ? <img src={img} className="w-full h-full object-cover" /> : <ImageIcon className="size-4 text-slate-200" />}
                  </div>
                  {idx > 0 && (
                    <button type="button" onClick={() => removeImageField(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImageField} className="w-full py-2 border border-dashed border-[#eaeaea] rounded-xl text-xs font-bold text-[#888] hover:bg-[#fafafa]">
                + Add Another Image
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Status & Category */}
          <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Status</label>
              <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm bg-white">
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Brand</label>
              <select value={formData.brand_id} onChange={e => setFormData(p => ({ ...p, brand_id: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm bg-white">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Category</label>
              <select required value={formData.category_id} onChange={e => setFormData(p => ({ ...p, category_id: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#eaeaea] text-sm bg-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-6">
            <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2 uppercase tracking-wider">
              <Tag className="size-4 text-slate-400" /> Pricing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Sale Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#888]">₹</span>
                  <input type="number" required value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#eaeaea] text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">MRP</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#888]">₹</span>
                  <input type="number" value={formData.original_price} onChange={e => setFormData(p => ({ ...p, original_price: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#eaeaea] text-sm" />
                </div>
              </div>
            </div>
            {formData.original_price > formData.price && (
              <p className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
                Customer saves ₹{(formData.original_price - formData.price).toLocaleString("en-IN")} ({Math.round(((formData.original_price - formData.price) / formData.original_price) * 100)}% Off)
              </p>
            )}
          </div>

          {/* Logistics */}
          <div className="bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-4">
            <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2 uppercase tracking-wider">
              <Globe className="size-4 text-slate-400" /> Attributes
            </h2>
            <div className="space-y-3">
              <input value={formData.material} onChange={e => setFormData(p => ({ ...p, material: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-xs" placeholder="Material (e.g. Cotton)" />
              <input value={formData.fit} onChange={e => setFormData(p => ({ ...p, fit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-xs" placeholder="Fit (e.g. Slim Fit)" />
              <input value={formData.collection} onChange={e => setFormData(p => ({ ...p, collection: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-xs" placeholder="Collection (e.g. Summer '24)" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
