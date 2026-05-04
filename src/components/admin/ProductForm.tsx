"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ImageCropper } from "./ImageCropper";
import { BasicInfoFields } from "./product-form/BasicInfoFields";
import { PricingCategoryFields } from "./product-form/PricingCategoryFields";
import { AttributesFields } from "./product-form/AttributesFields";
import { ImageUploadSection } from "./product-form/ImageUploadSection";

export function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.images?.[0] || null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    original_price: initialData?.original_price?.toString() || "",
    category: initialData?.category || "men",
    subcategory: initialData?.subcategory || "",
    brand: initialData?.brand || "",
    sizes: initialData?.sizes?.join(", ") || "",
    colors: initialData?.colors?.join(", ") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name (only if not editing or slug is empty)
    if (name === "name" && !initialData) {
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

      let imageUrl = imagePreview || "/images/bsr-placeholder.jpg";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error("Failed to upload image. Error: " + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const sizesArray = formData.sizes.split(",").map((s: string) => s.trim()).filter(Boolean);
      const colorsArray = formData.colors.split(",").map((s: string) => s.trim()).filter(Boolean);

      const productData = {
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
        featured: initialData?.featured || false
      };

      if (initialData) {
        const { error: dbError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id);
        
        if (dbError) throw new Error("Database Error: " + dbError.message);
        setSuccess(true);
      } else {
        const { error: dbError } = await supabase
          .from("products")
          .insert([productData]);

        if (dbError) throw new Error("Database Error: " + dbError.message);
        setSuccess(true);
        
        setFormData({
          name: "", slug: "", description: "", price: "", original_price: "",
          category: "men", subcategory: "", brand: "", sizes: "", colors: "",
        });
        setImageFile(null);
        setImagePreview(null);
      }
      
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-md text-sm border border-green-100">
          Product successfully saved!
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#171717] border-b pb-2">Basic Information</h3>
        <BasicInfoFields formData={formData} onChange={handleChange} />
      </div>

      {/* Pricing & Classification Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#171717] border-b pb-2">Pricing & Category</h3>
        <PricingCategoryFields formData={formData} onChange={handleChange} />
      </div>

      {/* Attributes Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#171717] border-b pb-2">Product Attributes</h3>
        <AttributesFields formData={formData} onChange={handleChange} />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#171717] border-b pb-2">Media</h3>
        <ImageUploadSection 
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onEditCrop={() => {
            setRawImage(imagePreview);
            setShowCropper(true);
          }}
          onRemoveImage={() => {
            setImageFile(null);
            setImagePreview(null);
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-[#eaeaea] flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 bg-[#171717] text-sm font-semibold text-white rounded-md hover:bg-[#333333] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-70 flex items-center gap-2 active:scale-95"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Processing..." : "Save Product Details"}
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
