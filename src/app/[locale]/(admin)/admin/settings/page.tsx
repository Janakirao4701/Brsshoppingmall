"use client";

import { useEffect, useState } from "react";
import { Save, Shield, Phone, MapPin, Globe, CreditCard, Loader2, Megaphone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SETTINGS_ID = '00000000-0000-0000-0000-000000000000';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [settings, setSettings] = useState({
    store_name: "BSR Shopping Mall",
    whatsapp_number: "917829333444",
    store_email: "bsrshoppingmall@gmail.com",
    store_address: "Main Road, Sompeta, Srikakulam District, AP",
    announcement_text: "",
    announcement_active: false,
    razorpay_key: "rzp_test_...",
    free_shipping_threshold: 2000,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const getClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  };

  const fetchSettings = async () => {
    const supabase = getClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .single();

    if (data) {
      setSettings({
        store_name: data.store_name || "",
        whatsapp_number: data.whatsapp_number || "",
        store_email: data.store_email || "",
        store_address: data.store_address || "",
        announcement_text: data.announcement_text || "",
        announcement_active: data.announcement_active || false,
        razorpay_key: data.razorpay_key || "",
        free_shipping_threshold: data.free_shipping_threshold || 2000,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const supabase = getClient();
    if (!supabase) {
      alert("Supabase not configured");
      return;
    }

    setSaving(true);
    setSaveStatus("idle");

    const { error } = await supabase
      .from("settings")
      .upsert({ 
        id: SETTINGS_ID,
        ...settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-[#171717]" />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Store Settings</h1>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && <span className="text-sm text-green-600 font-medium animate-in fade-in slide-in-from-right-2">✓ Saved successfully</span>}
          {saveStatus === "error" && <span className="text-sm text-red-600 font-medium">✕ Failed to save</span>}
          <Button onClick={handleSave} disabled={saving} className="bg-[#171717] text-white hover:bg-[#333]">
            {saving ? "Saving..." : "Save Changes"} <Save className="size-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Contact info */}
        <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
            <Globe className="size-4 text-[#888]" /> Contact Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">Store Name</label>
              <input value={settings.store_name} onChange={(e) => setSettings(p => ({ ...p, store_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-[#888]" />
                <input value={settings.whatsapp_number} onChange={(e) => setSettings(p => ({ ...p, whatsapp_number: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-[#888]" />
              <input type="email" value={settings.store_email} onChange={(e) => setSettings(p => ({ ...p, store_email: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">Store Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-3 text-[#888]" />
              <textarea rows={2} value={settings.store_address} onChange={(e) => setSettings(p => ({ ...p, store_address: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 resize-none" />
            </div>
          </div>
        </div>

        {/* Payments & Shipping */}
        <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
            <CreditCard className="size-4 text-[#888]" /> Payment & Shipping
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">Razorpay Key ID</label>
              <input value={settings.razorpay_key} onChange={(e) => setSettings(p => ({ ...p, razorpay_key: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">Free Shipping Threshold</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#888]">₹</span>
                <input type="number" value={settings.free_shipping_threshold} onChange={(e) => setSettings(p => ({ ...p, free_shipping_threshold: parseInt(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#eaeaea] text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
              <Megaphone className="size-4 text-[#888]" /> Announcement Banner
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888]">Active</span>
              <button 
                onClick={() => setSettings(p => ({ ...p, announcement_active: !p.announcement_active }))}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${settings.announcement_active ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.announcement_active ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <input value={settings.announcement_text} onChange={(e) => setSettings(p => ({ ...p, announcement_text: e.target.value }))}
            placeholder="e.g. Festival Sale is Live! Get 20% off on all ethnic wear." className="w-full px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" />
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Shield className="size-4 text-slate-400" /> Admin Security
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This dashboard is protected by <span className="font-bold text-slate-700">AdminGuard</span>. 
            Only authorized emails can access these settings. Current user session is active.
          </p>
        </div>
      </div>
    </div>
  );
}
