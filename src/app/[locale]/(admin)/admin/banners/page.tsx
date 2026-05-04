"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, X, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Crop } from "lucide-react";
import Link from "next/link";
import { ImageCropper } from "@/components/admin/ImageCropper";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  discount_text: string | null;
  cta_text: string;
  cta_link: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    discount_text: "",
    cta_text: "Shop Now",
    cta_link: "/",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("hero_banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setBanners(data || []);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "banner_image.jpg", { type: "image/jpeg" });
    setImageFile(file);
    setImagePreview(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
    setRawImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const supabase = getSupabase();
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `banner_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(`banners/${fileName}`, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(`banners/${fileName}`);
        imageUrl = publicUrl;
      } else {
        throw new Error("Please select an image for the banner.");
      }

      const { error: dbError } = await supabase.from("hero_banners").insert([{
        title: form.title,
        subtitle: form.subtitle || null,
        discount_text: form.discount_text || null,
        cta_text: form.cta_text,
        cta_link: form.cta_link,
        image_url: imageUrl,
        sort_order: banners.length,
        is_active: true,
      }]);

      if (dbError) throw new Error("Database error: " + dbError.message);

      setSuccess("Banner added successfully!");
      setForm({ title: "", subtitle: "", discount_text: "", cta_text: "Shop Now", cta_link: "/" });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      fetchBanners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const supabase = getSupabase();
    await supabase.from("hero_banners").update({ is_active: !currentState }).eq("id", id);
    fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const supabase = getSupabase();
    await supabase.from("hero_banners").delete().eq("id", id);
    fetchBanners();
  };

  const moveOrder = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex(b => b.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === banners.length - 1)) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const supabase = getSupabase();

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
          onClick={() => setShowForm(!showForm)}
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
          <h2 className="text-lg font-semibold text-[#171717]">New Banner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#171717]">Title *</label>
              <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
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

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#171717]">Banner Image *</label>
            <div className="border-2 border-dashed border-[#eaeaea] rounded-xl p-6 flex flex-col items-center justify-center bg-[#fafafa] relative hover:bg-[#f5f5f5] transition-colors">
              {imagePreview ? (
                <div className="relative w-full max-w-md h-40 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        setRawImage(imagePreview);
                        setShowCropper(true);
                      }}
                      className="bg-white text-brand-red rounded-full p-2.5 hover:bg-slate-50 transition-colors"
                      title="Edit Crop"
                    >
                      <Crop size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="bg-white text-red-500 rounded-full p-2.5 hover:bg-slate-50 transition-colors"
                      title="Remove Image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="size-8 text-[#888888] mb-3" />
                  <p className="text-sm font-medium text-[#171717]">Click to upload banner image</p>
                  <p className="text-xs text-[#888888] mt-1">Recommended: 1920×600px (PNG, JPG, WEBP)</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eaeaea]">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#171717]">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors disabled:opacity-70 flex items-center gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {saving ? "Uploading..." : "Save Banner"}
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

      {showCropper && rawImage && (
        <ImageCropper 
          image={rawImage}
          aspect={21/9}
          onCropComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); setRawImage(null); }}
        />
      )}
    </div>
  );
}
