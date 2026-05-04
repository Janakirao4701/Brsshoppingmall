"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  ArrowLeft,
  MessageCircle,
  Truck,
  Shield,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "address" | "review" | "complete";

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("address");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Andhra Pradesh",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="size-16 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Add some products before checking out.</p>
        <Button onClick={() => router.push("/men")} className="bg-brand-red hover:bg-brand-red/90 text-white">
          Browse Products
        </Button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleWhatsAppCheckout = () => {
    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917829333444";

    let message = "🛍️ *NEW ORDER*\n\n";
    message += `*Customer:* ${address.fullName}\n`;
    message += `*Phone:* ${address.phone}\n`;
    if (address.email) message += `*Email:* ${address.email}\n`;
    message += `\n*Delivery Address:*\n${address.address}\n${address.city}, ${address.state} - ${address.pincode}\n\n`;
    message += `*--- ORDER ITEMS ---*\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (item.selectedSize) message += `   Size: ${item.selectedSize}\n`;
      if (item.selectedColor) message += `   Color: ${item.selectedColor}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.product.price.toLocaleString("en-IN")} = ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}\n\n`;
    });

    message += `*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}\n`;
    message += `*Shipping:* ${shipping === 0 ? "FREE" : `₹${shipping}`}\n`;
    message += `*Total:* ₹${total.toLocaleString("en-IN")}\n\n`;
    message += `Please confirm availability and payment details. 🙏`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setOrderPlaced(true);
    setStep("complete");
    clearCart();
  };

  const isAddressValid = 
    address.fullName.trim() && 
    address.phone.trim().length >= 10 && 
    address.address.trim() && 
    address.city.trim() && 
    address.pincode.trim().length === 6;

  // Step indicators
  const steps = [
    { id: "address" as const, label: "Address", icon: MapPin },
    { id: "review" as const, label: "Review & Pay", icon: CreditCard },
  ];

  if (step === "complete") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="size-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Order Sent!</h2>
        <p className="text-slate-500 max-w-md mb-8">
          Your order details have been sent via WhatsApp. Our team will confirm availability 
          and share payment details shortly.
        </p>
        <Button onClick={() => router.push("/")} className="bg-brand-red hover:bg-brand-red/90 text-white">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Back button */}
        <button onClick={() => { setIsOpen(true); router.back(); }} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="size-4" /> Back to cart
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                step === s.id || (step === "review" && s.id === "address")
                  ? "bg-brand-red text-white"
                  : "bg-slate-100 text-slate-400"
              )}>
                <s.icon className="size-4" />
                {s.label}
              </div>
              {i < steps.length - 1 && <ChevronRight className="size-4 text-slate-300" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {step === "address" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Delivery Address</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input required value={address.fullName}
                        onChange={(e) => setAddress(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                      <input required type="tel" value={address.phone}
                        onChange={(e) => setAddress(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (Optional)</label>
                    <input type="email" value={address.email}
                      onChange={(e) => setAddress(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      placeholder="For order updates" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Address *</label>
                    <textarea rows={3} required value={address.address}
                      onChange={(e) => setAddress(p => ({ ...p, address: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none"
                      placeholder="House no., Street, Landmark" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                      <input required value={address.city}
                        onChange={(e) => setAddress(p => ({ ...p, city: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        placeholder="Sompeta" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                      <input value={address.state}
                        onChange={(e) => setAddress(p => ({ ...p, state: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode *</label>
                      <input required maxLength={6} value={address.pincode}
                        onChange={(e) => setAddress(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        placeholder="532284" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button disabled={!isAddressValid} onClick={() => setStep("review")}
                    className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-3 font-bold disabled:opacity-40">
                    Continue to Review <ChevronRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                {/* Address summary */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="size-4 text-brand-red" /> Delivering to
                    </h3>
                    <button onClick={() => setStep("address")} className="text-xs font-medium text-brand-red hover:underline">Change</button>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{address.fullName}</p>
                  <p className="text-sm text-slate-500">{address.address}</p>
                  <p className="text-sm text-slate-500">{address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-sm text-slate-500 mt-1">📞 {address.phone}</p>
                </div>

                {/* Order items */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Order Items ({getTotalItems()})</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                        <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {item.product.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && " · "}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                            <span className="text-sm font-bold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Complete Your Order</h3>
                  <Button onClick={handleWhatsAppCheckout}
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold h-14 text-base rounded-xl gap-3">
                    <MessageCircle className="size-5" />
                    Order via WhatsApp
                  </Button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    Your order details will be sent via WhatsApp. Our team will confirm and share payment options.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-28">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-slate-400">Free shipping on orders above ₹2,000</p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-slate-900 text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-5 border-t space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Truck className="size-4 text-brand-red flex-shrink-0" />
                  <span>All India delivery available</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="size-4 text-brand-red flex-shrink-0" />
                  <span>Quality guaranteed on all products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
