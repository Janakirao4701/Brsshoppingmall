import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin" 
          className="p-2 text-[#666666] hover:text-[#171717] hover:bg-[#fafafa] rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Add New Product</h1>
          <p className="text-sm text-[#666666] mt-1">Create a new product listing with images and variants.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.08)] p-8">
        <ProductForm />
      </div>
    </div>
  );
}
