"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot deterrent
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot check
    if (honeypot) {
      console.warn("Honeypot filled. Bot detected.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        if (profileError.code === "PGRST116") {
          throw new Error("No profile found. Please run the SQL guide to set up the profiles table.");
        }
        throw new Error(`Profile check failed: ${profileError.message}`);
      }

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error(`Unauthorized. Your role is '${profile?.role || 'none'}', but 'admin' is required.`);
      }

      router.push("/admin");
    } catch (err: any) {
      console.error("Login Error Details:", err);
      // Subtle delay on failure to slow down bots
      await new Promise(resolve => setTimeout(resolve, 800));
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-black text-slate-900 text-4xl leading-none tracking-tighter">BSR</span>
            <div className="size-2.5 rounded-full bg-brand-red animate-pulse mt-1" />
          </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black opacity-60">Administrative Portal</p>
          <p className="text-slate-400 text-xs mt-6">Secure access for authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 space-y-6">
          {/* Honeypot Field (Invisible to users) */}
          <div className="sr-only" aria-hidden="true">
            <input 
              type="text" 
              name="website_url" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red focus:bg-white transition-all"
                placeholder="admin@bsrshoppingmall.com" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red focus:bg-white transition-all"
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 text-sm rounded-xl disabled:opacity-70 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="size-5 animate-spin mr-2" /> : null}
            {loading ? "Authenticating..." : "Sign In to Console"}
          </Button>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
              Protected by BSR Security Engine
            </p>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-brand-red transition-colors"
          >
            ← Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
