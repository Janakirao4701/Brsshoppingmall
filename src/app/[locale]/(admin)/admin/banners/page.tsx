"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Crop, Pencil, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ImageCropper } from "@/components/admin/ImageCropper";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  discount_text: string | null;
  cta_text: string;
  cta_link: string;
  image_url: string;
  mobile_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  text_position: "left" | "center" | "right";
}

const TEXT_POSITIONS = [
  { value: "left" as const, label: "Left", icon: AlignLeft },
  { value: "center" as const, label: "Center", icon: AlignCenter },
  { value: "right" as const, label: "Right", icon: AlignRight },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperConfig, setCropperConfig] = useState<{ type: 'desktop' | 'mobile', image: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    discount_text: "",
    cta_text: "Shop Now",
    cta_link: "/",
    text_position: "left" as "left" | "center" | "right",
    show_text: true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("hero_banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setBanners(data || []);
    setLoading(false);
  };

  const startAddNew = () => {
    setForm({
      title: "",
      subtitle: "",
      discount_text: "",
      cta_text: "Shop Now",
      cta_link: "/",
      text_position: "left",
      show_text: true,
    });
    setImagePreview(null);
    setImageFile(null);
    setMobilePreview(null);
    setMobileFile(null);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (banner: any) => {
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      discount_text: banner.discount_text || "",
      cta_text: banner.cta_text || "Shop Now",
      cta_link: banner.cta_link || "/",
      text_position: banner.text_position || "left",
      show_text: banner.show_text ?? true,
    });
    setImagePreview(banner.image_url);
    setMobilePreview(banner.mobile_image_url);
    setEditingId(banner.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropperConfig({ type, image: reader.result as string });
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    if (!cropperConfig) return;
    const isDesktop = cropperConfig.type === 'desktop';
    const file = new File([croppedBlob], isDesktop ? "banner_desktop.jpg" : "banner_mobile.jpg", { type: "image/jpeg" });
    
    if (isDesktop) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(croppedBlob));
    } else {
      setMobileFile(file);
      setMobilePreview(URL.createObjectURL(croppedBlob));
    }
    
    setShowCropper(false);
    setCropperConfig(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = imagePreview || "";
      let mobileImageUrl = mobilePreview || "";

      // Upload Desktop
      if (imageFile) {
        const fileName = `banner_d_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(`banners/${fileName}`, imageFile);
        if (uploadError) throw new Error("Desktop upload failed: " + uploadError.message);
        imageUrl = supabase.storage.from("products").getPublicUrl(`banners/${fileName}`).data.publicUrl;
      }

      // Upload Mobile
      if (mobileFile) {
        const fileName = `banner_m_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(`banners/${fileName}`, mobileFile);
        if (uploadError) throw new Error("Mobile upload failed: " + uploadError.message);
        mobileImageUrl = supabase.storage.from("products").getPublicUrl(`banners/${fileName}`).data.publicUrl;
      }

      if (!imageUrl) throw new Error("Please select a desktop image.");

      const bannerData = {
        title: form.title,
        subtitle: form.subtitle || null,
        discount_text: form.discount_text || null,
        cta_text: form.cta_text,
        cta_link: form.cta_link,
        image_url: imageUrl,
        mobile_image_url: mobileImageUrl || null,
        text_position: form.text_position,
        show_text: form.show_text,
        sort_order: editingId ? banners.find(b => b.id === editingId)?.sort_order : banners.length,
        is_active: true,
      };

      if (editingId) {
        const { error: dbError } = await supabase
          .from("hero_banners")
          .update(bannerData)
          .eq("id", editingId);
        if (dbError) throw new Error("Database error: " + dbError.message);
        setSuccess("Banner updated successfully!");
      } else {
        const { error: dbError } = await supabase
          .from("hero_banners")
          .insert([bannerData]);
        if (dbError) throw new Error("Database error: " + dbError.message);
        setSuccess("Banner added successfully!");
      }

      setForm({ 
        title: "", 
        subtitle: "", 
        discount_text: "", 
        cta_text: "Shop Now", 
        cta_link: "/", 
        text_position: "left",
        show_text: true 
      });
      setImageFile(null);
      setImagePreview(null);
      setMobileFile(null);
      setMobilePreview(null);
      setShowForm(false);
      setEditingId(null);
      fetchBanners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    await supabase.from("hero_banners").update({ is_active: !currentState }).eq("id", id);
    fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("hero_banners").delete().eq("id", id);
    fetchBanners();
  };

  const moveOrder = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex(b => b.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === banners.length - 1)) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;

    await Promise.all([
      supabase.from("hero_banners").update({ sort_order: swapIdx }).eq("id", banners[idx].id),
      supabase.from("hero_banners").update({ sort_order: idx }).eq("id", banners[swapIdx].id),
    ]);
    fetchBanners();
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Hero Banners</h1>
          <p className="text-sm text-[#666666] mt-1">Manage homepage slider images</p>
        </div>
        <button
          onClick={startAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-600 rounded-md text-sm border border-green-100">{success}</div>}

      {/* Add Banner Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-8 space-y-6">
          <h2 className="text-lg font-semibold text-[#171717]">{editingId ? "Edit Banner" : "New Banner"}</h2>
          
          <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-slate-900">Show Text Overlay?</label>
              <p className="text-xs text-slate-500">Disable if your image already contains text.</p>
            </div>
            <button 
              type="button"
              onClick={() => setForm(p => ({ ...p, show_text: !p.show_text }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.show_text ? 'bg-[#171717]' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.show_text ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {form.show_text && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#171717]">Title *</label>
                  <input required={form.show_text} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
                    placeholder="Summer Collection 2026" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#171717]">Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                    className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
                    placeholder="Premium Readymade Garments" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#171717]">Discount Text</label>
                  <input value={form.discount_text} onChange={e => setForm(p => ({ ...p, discount_text: e.target.value }))}
                    className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
                    placeholder="Up to 50% Off" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#171717]">Button Text</label>
                  <input value={form.cta_text} onChange={e => setForm(p => ({ ...p, cta_text: e.target.value }))}
                    className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#171717]">Button Link</label>
                  <input value={form.cta_link} onChange={e => setForm(p => ({ ...p, cta_link: e.target.value }))}
                    className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
                    placeholder="/men" />
                </div>
              </div>
            </div>
          )}

          {/* Text Position Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#171717]">Text Overlay Position</label>
            <div className="flex gap-3">
              {TEXT_POSITIONS.map(pos => (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, text_position: pos.value }))}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.text_position === pos.value
                      ? "border-[#171717] bg-[#171717]/5 shadow-sm"
                      : "border-[#eaeaea] hover:border-[#ccc] bg-white"
                  }`}
                >
                  <pos.icon size={20} className={form.text_position === pos.value ? "text-[#171717]" : "text-[#888]"} />
                  <span className={`text-xs font-medium ${form.text_position === pos.value ? "text-[#171717]" : "text-[#888]"}`}>{pos.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Banner */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#888] uppercase tracking-wider">Desktop Asset (16:9) *</label>
              <div className="border-2 border-dashed border-[#eaeaea] rounded-xl p-4 flex flex-col items-center justify-center bg-[#fafafa] relative hover:bg-[#f5f5f5] transition-colors h-48">
                {imagePreview ? (
                  <div className="relative w-full h-full group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md gap-3">
                      <button type="button" onClick={() => { setCropperConfig({ type: 'desktop', image: imagePreview }); setShowCropper(true); }}
                        className="bg-white text-brand-red rounded-full p-2.5 hover:bg-slate-50 transition-colors shadow-lg"><Crop size={18} /></button>
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="bg-white text-red-500 rounded-full p-2.5 hover:bg-slate-50 transition-colors shadow-lg"><X size={18} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="size-6 text-[#888888] mb-2" />
                    <p className="text-[10px] font-bold text-[#171717] uppercase">Upload Desktop</p>
                    <p className="text-[10px] text-[#888888] mt-1">1920×1080px Recommended</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'desktop')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            {/* Mobile Banner */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#888] uppercase tracking-wider">Mobile Asset (4:5)</label>
              <div className="border-2 border-dashed border-[#eaeaea] rounded-xl p-4 flex flex-col items-center justify-center bg-[#fafafa] relative hover:bg-[#f5f5f5] transition-colors h-48">
                {mobilePreview ? (
                  <div className="relative w-full h-full group">
                    <div className="w-32 h-full mx-auto relative">
                      <img src={mobilePreview} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm border border-slate-200" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md gap-3">
                        <button type="button" onClick={() => { setCropperConfig({ type: 'mobile', image: mobilePreview }); setShowCropper(true); }}
                          className="bg-white text-brand-red rounded-full p-2 hover:bg-slate-50 transition-colors shadow-lg"><Crop size={16} /></button>
                        <button type="button" onClick={() => { setMobileFile(null); setMobilePreview(null); }}
                          className="bg-white text-red-500 rounded-full p-2 hover:bg-slate-50 transition-colors shadow-lg"><X size={16} /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="size-6 text-[#888888] mb-2" />
                    <p className="text-[10px] font-bold text-[#171717] uppercase">Upload Mobile</p>
                    <p className="text-[10px] text-[#888888] mt-1">1080×1350px Recommended</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'mobile')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eaeaea]">
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#171717]">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors disabled:opacity-70 flex items-center gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {saving ? "Saving..." : editingId ? "Update Banner" : "Save Banner"}
            </button>
          </div>
        </form>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center">
            <div className="size-8 border-2 border-[#eaeaea] border-t-[#171717] rounded-full animate-spin mx-auto" />
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-16 text-center">
            <p className="text-sm font-medium text-[#171717]">No banners yet</p>
            <p className="text-xs text-[#888888] mt-1">Click "Add Banner" to create your first hero slide.</p>
          </div>
        ) : (
          banners.map((banner, i) => (
            <div key={banner.id} className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden flex">
              {/* Thumbnail */}
              <div className="w-48 h-28 flex-shrink-0 bg-slate-100 relative">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500" />
                )}
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">HIDDEN</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#171717] text-sm">{banner.title}</h3>
                  {banner.subtitle && <p className="text-xs text-[#888888] mt-0.5">{banner.subtitle}</p>}
                  {banner.discount_text && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{banner.discount_text}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button onClick={() => moveOrder(banner.id, "up")} disabled={i === 0}
                    className="p-2 text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] rounded-md transition-colors disabled:opacity-30" title="Move up">
                    <ArrowUp size={15} />
                  </button>
                  <button onClick={() => moveOrder(banner.id, "down")} disabled={i === banners.length - 1}
                    className="p-2 text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] rounded-md transition-colors disabled:opacity-30" title="Move down">
                    <ArrowDown size={15} />
                  </button>
                  <button onClick={() => toggleActive(banner.id, banner.is_active)}
                    className={`p-2 rounded-md transition-colors ${banner.is_active ? 'text-green-600 hover:bg-green-50' : 'text-[#888888] hover:bg-[#fafafa]'}`}
                    title={banner.is_active ? "Hide" : "Show"}>
                    {banner.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => startEdit(banner)}
                    className="p-2 text-[#888888] hover:text-brand-red hover:bg-slate-50 rounded-md transition-colors" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteBanner(banner.id)}
                    className="p-2 text-[#888888] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCropper && cropperConfig && (
        <ImageCropper 
          image={cropperConfig.image}
          aspect={cropperConfig.type === 'desktop' ? 16/9 : 4/5}
          onCropComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); setCropperConfig(null); }}
        />
      )}
    </div>
  );
}
