"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
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
  CheckCircle,
  Loader2,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Lakshadweep", "Puducherry"
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "whatsapp">("razorpay");
  const [paying, setPaying] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState("");
  const [completedPaymentMethod, setCompletedPaymentMethod] = useState("");

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
    setCompletedPaymentMethod("whatsapp");
    setStep("complete");
    clearCart();
  };

  const handleRazorpayCheckout = async () => {
    setPaying(true);
    try {
      // Create order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: address.fullName,
          customerPhone: address.phone,
          customerEmail: address.email,
          shippingAddress: address.address,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          items: items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
          })),
          subtotal,
          shippingCost: shipping,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      // Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "BSR Shopping Mall",
        description: `Order ${data.orderNumber}`,
        order_id: data.orderId,
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: address.email || undefined,
        },
        theme: { color: "#DC2626" },
        handler: async (response: any) => {
          // Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_number: data.orderNumber,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            setOrderPlaced(true);
            setCompletedOrderNumber(data.orderNumber);
            setCompletedPaymentMethod("razorpay");
            setStep("complete");
            clearCart();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(error.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
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
        <h2 className="text-2xl font-heading font-normal text-slate-900 mb-2">
          {completedPaymentMethod === "razorpay" ? "Payment Successful!" : "Order Sent!"}
        </h2>
        {completedOrderNumber && (
          <p className="text-sm font-mono bg-slate-100 px-4 py-2 rounded-lg mb-4">
            Order #{completedOrderNumber}
          </p>
        )}
        <p className="text-slate-500 max-w-md mb-8">
          {completedPaymentMethod === "razorpay"
            ? "Your payment has been received and your order is confirmed. We'll start processing it right away!"
            : "Your order details have been sent via WhatsApp. Our team will confirm availability and share payment details shortly."}
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
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                      <select 
                        required
                        value={address.state}
                        onChange={(e) => setAddress(p => ({ ...p, state: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red appearance-none bg-white"
                      >
                        <option value="" disabled>Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
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
                            <Image src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=200&auto=format&fit=crop" alt="Placeholder" fill className="object-cover grayscale opacity-80" />
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
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Choose Payment Method</h3>

                  {/* Payment method selector */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() => setPaymentMethod("razorpay")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium",
                        paymentMethod === "razorpay"
                          ? "border-brand-red bg-brand-red/5 text-brand-red"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <CreditCard className="size-5" />
                      Pay Online
                      <span className="text-[10px] font-normal text-slate-400">UPI, Cards, NetBanking</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("whatsapp")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium",
                        paymentMethod === "whatsapp"
                          ? "border-[#25D366] bg-[#25D366]/5 text-[#25D366]"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <MessageCircle className="size-5" />
                      WhatsApp
                      <span className="text-[10px] font-normal text-slate-400">Confirm & pay later</span>
                    </button>
                  </div>

                  {/* Action button */}
                  {paymentMethod === "razorpay" ? (
                    <>
                      <Button
                        onClick={handleRazorpayCheckout}
                        disabled={paying}
                        className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold h-14 text-base rounded-xl gap-3 disabled:opacity-70"
                      >
                        {paying ? <Loader2 className="size-5 animate-spin" /> : <Wallet className="size-5" />}
                        {paying ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                      </Button>
                      <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                        <Shield className="size-3" /> Secured by Razorpay
                      </p>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleWhatsAppCheckout}
                        className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold h-14 text-base rounded-xl gap-3"
                      >
                        <MessageCircle className="size-5" />
                        Order via WhatsApp
                      </Button>
                      <p className="text-center text-xs text-slate-400 mt-3">
                        Order details sent to WhatsApp. Pay on delivery or via link.
                      </p>
                    </>
                  )}
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

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
