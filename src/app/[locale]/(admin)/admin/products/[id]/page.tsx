"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setProduct(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-[#171717]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[800px] mx-auto p-12 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <Link href="/admin/products" className="text-brand-red mt-4 inline-block">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2 text-[#666666] hover:text-[#171717] hover:bg-[#fafafa] rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Edit Product</h1>
          <p className="text-sm text-[#666666] mt-1">Modify product details, pricing, and images.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-8">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
