"use client";

import { useCart } from "@/lib/store";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;

    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";
    
    let message = "*🛍️ NEW ORDER INQUIRY* \n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (item.selectedSize) message += `   Size: ${item.selectedSize}\n`;
      if (item.selectedColor) message += `   Color: ${item.selectedColor}\n`;
      message += `   Qty: ${item.quantity}\n`;
      message += `   Price: ₹${item.product.price * item.quantity}\n\n`;
    });

    message += `*Total Estimate: ₹${getTotalPrice()}*\n\n`;
    message += `Please confirm availability and delivery details.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 font-heading font-medium text-lg">
            <ShoppingBag className="size-5" />
            Your Cart ({items.length})
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingBag className="size-16 text-slate-200" />
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} 
                className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
              >
                <div className="relative w-20 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.product.images?.[0] ? item.product.images[0] : "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=200&auto=format&fit=crop"} 
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-brand-red">
                      ₹{item.product.price}
                    </span>
                    
                    <div className="flex items-center gap-2 bg-slate-50 border rounded-lg p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="p-1 hover:bg-white hover:shadow-sm rounded transition-all"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="p-1 hover:bg-white hover:shadow-sm rounded transition-all"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-slate-50">
            <div className="flex justify-between items-center mb-4 text-lg font-bold">
              <span>Total</span>
              <span>₹{getTotalPrice().toLocaleString("en-IN")}</span>
            </div>
            <Button 
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-12 text-base mb-2"
              onClick={() => { setIsOpen(false); window.location.href = "/en/checkout"; }}
            >
              Proceed to Checkout
            </Button>
            <Button 
              variant="outline"
              className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-bold h-10 text-sm"
              onClick={handleCheckout}
            >
              Quick Order via WhatsApp
            </Button>
            <p className="text-center text-xs text-slate-500 mt-3">
              Free shipping on orders above ₹2,000
            </p>
          </div>
        )}
      </div>
    </>
  );
}
