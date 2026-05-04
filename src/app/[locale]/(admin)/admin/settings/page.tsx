"use client";

import { useEffect, useState } from "react";
import { Save, Shield, Phone, MapPin, Globe, CreditCard, Loader2, Megaphone, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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
    announcements: [] as string[],
    announcement_active: false,
    razorpay_key: "rzp_test_...",
    free_shipping_threshold: 2000,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
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
        announcements: Array.isArray(data.announcements) ? data.announcements : (data.announcement_text ? [data.announcement_text] : []),
        announcement_active: data.announcement_active || false,
        razorpay_key: data.razorpay_key || "",
        free_shipping_threshold: data.free_shipping_threshold || 0,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ 
          id: SETTINGS_ID,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const addAnnouncement = () => {
    if (settings.announcements.length < 5) {
      setSettings(p => ({ ...p, announcements: [...p.announcements, ""] }));
    }
  };

  const removeAnnouncement = (index: number) => {
    setSettings(p => ({
      ...p,
      announcements: p.announcements.filter((_, i) => i !== index)
    }));
  };

  const updateAnnouncement = (index: number, value: string) => {
    const newAnns = [...settings.announcements];
    newAnns[index] = value;
    setSettings(p => ({ ...p, announcements: newAnns }));
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <textarea rows={1} value={settings.store_address} onChange={(e) => setSettings(p => ({ ...p, store_address: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 resize-none" />
              </div>
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
              <Megaphone className="size-4 text-[#888]" /> Announcement Bar
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
          
          <div className="space-y-3">
            {settings.announcements.map((ann, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  value={ann} 
                  onChange={(e) => updateAnnouncement(idx, e.target.value)}
                  placeholder={`Announcement ${idx + 1}`} 
                  className="flex-1 px-3 py-2 rounded-lg border border-[#eaeaea] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10" 
                />
                <button 
                  onClick={() => removeAnnouncement(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            
            {settings.announcements.length < 5 && (
              <button 
                onClick={addAnnouncement}
                className="w-full py-2 border border-dashed border-[#eaeaea] rounded-lg text-xs font-medium text-[#888] hover:bg-[#fafafa] transition-colors"
              >
                + Add Announcement (Up to 5)
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Shield className="size-4 text-slate-400" /> Admin Security
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This dashboard is protected by <span className="font-bold text-slate-700">AdminGuard</span>. 
            Only authorized profiles with the 'admin' role can modify these settings.
          </p>
        </div>
      </div>
    </div>
  );
}
