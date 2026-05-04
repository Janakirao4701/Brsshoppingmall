"use client";

import { useState } from "react";
import { Upload, X, Loader2, Crop } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ImageCropper } from "./ImageCropper";

export function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    category: "men",
    subcategory: "",
    brand: "",
    sizes: "",
    colors: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name
    if (name === "name") {
      setFormData(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
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
    const file = new File([croppedBlob], "product_image.jpg", { type: "image/jpeg" });
    setImageFile(file);
    setImagePreview(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
    setRawImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      let imageUrl = "/images/bsr-placeholder.jpg";

      // 1. Upload Image to Supabase Storage if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error("Failed to upload image. Please ensure you have created a 'products' bucket in Supabase and made it public. Error: " + uploadError.message);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // 2. Insert into Database
      const sizesArray = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);
      const colorsArray = formData.colors.split(",").map(s => s.trim()).filter(Boolean);

      const newProduct = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseInt(formData.price),
        original_price: formData.original_price ? parseInt(formData.original_price) : null,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        sizes: sizesArray.length > 0 ? sizesArray : ["Default"],
        colors: colorsArray.length > 0 ? colorsArray : ["Default"],
        images: [imageUrl],
        in_stock: true,
        featured: false
      };

      const { error: dbError } = await supabase
        .from("products")
        .insert([newProduct]);

      if (dbError) throw new Error("Database Error: " + dbError.message);

      setSuccess(true);
      
      // Reset form
      setFormData({
        name: "", slug: "", description: "", price: "", original_price: "",
        category: "men", subcategory: "", brand: "", sizes: "", colors: "",
      });
      setImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => {
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-md text-sm border border-green-100">
          Product successfully added!
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Product Name</label>
          <input 
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">URL Slug (Auto)</label>
          <input 
            required
            name="slug"
            value={formData.slug}
            onChange={handleChange}
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
          onChange={handleChange}
          rows={3}
          className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
        />
      </div>

      {/* Pricing & Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Price (₹)</label>
          <input 
            required
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Original Price (₹) Optional</label>
          <input 
            type="number"
            name="original_price"
            value={formData.original_price}
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Category</label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Brand</label>
          <input 
            required
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Sizes (comma separated)</label>
          <input 
            name="sizes"
            placeholder="S, M, L, XL"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#171717]">Colors (comma separated)</label>
          <input 
            name="colors"
            placeholder="Red, Blue, Black"
            value={formData.colors}
            onChange={handleChange}
            className="w-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] text-sm rounded-md px-3 py-2 focus:outline-none focus:shadow-[0_0_0_2px_#171717] transition-shadow"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#171717]">Product Image</label>
        <div className="border-2 border-dashed border-[#eaeaea] rounded-xl p-8 flex flex-col items-center justify-center bg-[#fafafa] relative hover:bg-[#f5f5f5] transition-colors">
          {imagePreview ? (
            <div className="relative w-32 h-40 group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setRawImage(imagePreview);
                    setShowCropper(true);
                  }}
                  className="bg-white text-brand-red rounded-full p-2 hover:bg-slate-50 transition-colors"
                  title="Edit Crop"
                >
                  <Crop size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="bg-white text-red-500 rounded-full p-2 hover:bg-slate-50 transition-colors"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="size-8 text-[#888888] mb-3" />
              <p className="text-sm font-medium text-[#171717]">Click to upload or drag and drop</p>
              <p className="text-xs text-[#888888] mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-[#eaeaea] flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2.5 bg-[#171717] text-sm font-medium text-white rounded-md hover:bg-[#333333] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.12)] disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Uploading..." : "Save Product"}
        </button>
      </div>

      {showCropper && rawImage && (
        <ImageCropper 
          image={rawImage}
          aspect={3/4}
          onCropComplete={handleCropComplete}
          onCancel={() => { setShowCropper(false); setRawImage(null); }}
        />
      )}
    </form>
  );
}
