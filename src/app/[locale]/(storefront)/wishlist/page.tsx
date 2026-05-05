"use client";

import { useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ShoppingBag, HeartCrack } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
          <HeartCrack className="size-12" />
        </div>
        <h1 className="text-3xl font-heading font-normal mb-4">Your Wishlist is Empty</h1>
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
          Looks like you haven't saved any items yet. Explore our collections and click the heart icon to save your favorites for later!
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 bg-brand-red hover:bg-brand-red-dark shadow-lg shadow-brand-red/20 transition-all hover:scale-105">
            <ShoppingBag className="mr-2 size-5" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-normal mb-2 text-slate-900 tracking-tight">
            My <span className="text-italic-accent text-brand-red">Wishlist</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base">You have {items.length} {items.length === 1 ? 'item' : 'items'} saved.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={clearWishlist}
          className="rounded-full border-slate-200 text-slate-600 hover:text-brand-red hover:bg-brand-red/5 w-full md:w-auto"
        >
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
