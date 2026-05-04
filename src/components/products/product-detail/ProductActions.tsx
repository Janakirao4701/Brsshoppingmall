"use client";

import { ShoppingCart, MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  quantity: number;
  setQuantity: (q: number) => void;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
  onShare: () => void;
  isWishlisted: boolean;
  isSizeSelected: boolean;
  whatsappUrl: string;
}

export function ProductActions({
  quantity,
  setQuantity,
  onAddToCart,
  onWishlistToggle,
  onShare,
  isWishlisted,
  isSizeSelected,
  whatsappUrl
}: ProductActionsProps) {
  return (
    <div className="space-y-6">
      {/* Quantity */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="size-10 rounded-lg border border-slate-200 flex items-center justify-center text-lg font-medium hover:bg-slate-50"
          >
            −
          </button>
          <span className="w-12 text-center font-semibold text-lg">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="size-10 rounded-lg border border-slate-200 flex items-center justify-center text-lg font-medium hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          size="lg"
          className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white py-6 text-base font-bold shadow-lg shadow-brand-red/20 active:scale-95 transition-all"
          disabled={!isSizeSelected}
          onClick={onAddToCart}
        >
          <ShoppingCart className="size-5 mr-2" /> Add to Cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-green-500 text-green-600 hover:bg-green-50 py-6 text-base font-bold active:scale-95 transition-all"
          asChild
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-5 mr-2" /> Order via WhatsApp
          </a>
        </Button>
      </div>

      {/* Action Icons */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={onWishlistToggle}
          className={cn(
            "flex items-center text-sm transition-colors",
            isWishlisted ? "text-brand-red font-bold" : "text-slate-500 hover:text-brand-red"
          )}
        >
          <Heart className={cn("size-4 mr-1.5", isWishlisted && "fill-brand-red")} />
          {isWishlisted ? "In Wishlist" : "Wishlist"}
        </button>
        <button
          onClick={onShare}
          className="flex items-center text-sm text-slate-500 hover:text-brand-red transition-colors"
        >
          <Share2 className="size-4 mr-1.5" /> Share
        </button>
      </div>
    </div>
  );
}
