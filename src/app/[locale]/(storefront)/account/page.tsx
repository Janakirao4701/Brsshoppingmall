"use client";

import { useState, useEffect } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Heart,
  LogOut, 
  Loader2, 
  Plus, 
  Trash2, 
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/products/ProductCard";

type Tab = "profile" | "orders" | "addresses" | "wishlist";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  order_number: string;
  total: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  items: any[];
  created_at: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Andhra Pradesh",
    pincode: "",
  });

  const wishlist = useWishlist();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/en/login";
        return;
      }
      setUser(data.user);
      setLoading(false);
      loadOrders(data.user.email || "");
      loadAddresses(data.user.id);
    });
  }, []);

  const loadOrders = async (email: string) => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false })
      .limit(20);
    setOrders(data || []);
  };

  const loadAddresses = async (userId: string) => {
    const saved = localStorage.getItem(`bsr-addresses-${userId}`);
    if (saved) setAddresses(JSON.parse(saved));
  };

  const saveAddress = () => {
    if (!user) return;
    const newAddress: Address = { ...addressForm, id: Date.now().toString() };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem(`bsr-addresses-${user.id}`, JSON.stringify(updated));
    setShowAddressForm(false);
    setAddressForm({ label: "Home", fullName: "", phone: "", address: "", city: "", state: "Andhra Pradesh", pincode: "" });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem(`bsr-addresses-${user.id}`, JSON.stringify(updated));
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    window.location.href = "/en";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": case "delivered": case "paid": return "bg-green-100 text-green-800";
      case "processing": case "shipped": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": case "failed": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-red" />
      </div>
    );
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: UserIcon },
    { id: "orders" as const, label: "My Orders", icon: Package },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
  ];

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-heading font-normal text-slate-900 mb-8">My Account</h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                tab === t.id
                  ? "bg-brand-red text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}>
              <t.icon className={cn("size-4", tab === "wishlist" && t.id === "wishlist" && "fill-white")} /> 
              {t.label}
              {t.id === "wishlist" && wishlist.items.length > 0 && (
                <span className={cn("ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold", tab === "wishlist" ? "bg-white text-brand-red" : "bg-brand-red text-white")}>
                  {wishlist.items.length}
                </span>
              )}
            </button>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 ml-auto transition-colors">
            <LogOut className="size-4" /> Logout
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-16 rounded-full bg-brand-red/10 flex items-center justify-center">
                  <UserIcon className="size-8 text-brand-red" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {user?.user_metadata?.full_name || "User"}
                  </h2>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-slate-900">{user?.user_metadata?.full_name || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900">{user?.email || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{user?.user_metadata?.phone || "—"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Member Since</p>
                  <p className="text-sm font-medium text-slate-900">{user?.created_at ? formatDate(user.created_at) : "—"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <Package className="size-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-1">No orders yet</h3>
                  <p className="text-sm text-slate-500 mb-4">Your order history will appear here.</p>
                  <Button onClick={() => router.push("/men")} variant="outline" size="sm">Start Shopping</Button>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-mono font-bold text-slate-900">#{order.order_number}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusColor(order.order_status))}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                        <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusColor(order.payment_status))}>
                          {order.payment_status === "paid" ? "✓ Paid" : order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Items summary */}
                    <div className="space-y-2 mb-4">
                      {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm text-slate-600">
                          <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                      {(order.items || []).length > 3 && (
                        <p className="text-xs text-slate-400">+{order.items.length - 3} more items</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500 uppercase">
                        {order.payment_method === "razorpay" ? "💳 Online Payment" : "💬 WhatsApp Order"}
                      </span>
                      <span className="font-bold text-slate-900">₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {tab === "addresses" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Existing addresses */}
              {addresses.map(addr => (
                <div key={addr.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">{addr.label}</span>
                      <span className="text-sm font-medium text-slate-900">{addr.fullName}</span>
                    </div>
                    <p className="text-sm text-slate-600">{addr.address}</p>
                    <p className="text-sm text-slate-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-slate-400 mt-1">📞 {addr.phone}</p>
                  </div>
                  <button onClick={() => deleteAddress(addr.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}

              {/* Add address form */}
              {showAddressForm ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">New Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Label</label>
                      <select value={addressForm.label} onChange={(e) => setAddressForm(p => ({ ...p, label: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                      <input value={addressForm.fullName} onChange={(e) => setAddressForm(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    <input value={addressForm.phone} onChange={(e) => setAddressForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                    <textarea rows={2} value={addressForm.address} onChange={(e) => setAddressForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                      <input value={addressForm.city} onChange={(e) => setAddressForm(p => ({ ...p, city: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                      <input value={addressForm.state} onChange={(e) => setAddressForm(p => ({ ...p, state: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label>
                      <input maxLength={6} value={addressForm.pincode}
                        onChange={(e) => setAddressForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                    <Button size="sm" className="bg-brand-red hover:bg-brand-red/90 text-white" onClick={saveAddress}>Save Address</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddressForm(true)}
                  className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center hover:bg-slate-50 transition-colors">
                  <Plus className="size-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Add New Address</p>
                </button>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {tab === "wishlist" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {wishlist.items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <Heart className="size-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-1">Your wishlist is empty</h3>
                  <p className="text-sm text-slate-500 mb-4">Save products you love to find them later.</p>
                  <Button onClick={() => router.push("/men")} variant="outline" size="sm">Explore Collections</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlist.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
