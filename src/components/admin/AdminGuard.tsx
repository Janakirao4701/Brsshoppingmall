"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/admin/login");
  const [authorized, setAuthorized] = useState<boolean | null>(isLoginPage ? true : null);
  const router = useRouter();

  useEffect(() => {
    if (isLoginPage) return;

    // Safety timeout to prevent infinite spinning (10s)
    const timeout = setTimeout(() => {
      if (authorized === null) {
        console.error("Auth verification timed out");
        setAuthorized(false);
        router.replace("/admin/login");
      }
    }, 10000);

    const checkAuth = async () => {
      try {
        // Use getUser() instead of getSession() for better security and server-side sync
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          if (userError) console.error("Session retrieval error:", userError.message);
          setAuthorized(false);
          router.replace("/admin/login");
          return;
        }

        // Verify admin role in profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError.message);
          setAuthorized(false);
          router.replace("/admin/login");
          return;
        }

        if (profile?.role !== "admin") {
          console.error("Unauthorized: Role is", profile?.role);
          setAuthorized(false);
          router.replace("/admin/login");
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Auth check crash:", err);
        setAuthorized(false);
        router.replace("/admin/login");
      } finally {
        clearTimeout(timeout);
      }
    };

    checkAuth();
    
    return () => clearTimeout(timeout);
  }, [router, isLoginPage]);

  if (authorized === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white animate-in fade-in duration-700">
        <div className="relative flex flex-col items-center">
          {/* Premium Logo Placeholder / Spinner */}
          <div className="size-16 relative mb-8">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#f3f3f3]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-[#171717] border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-black tracking-tighter text-[#171717]">BSR</span>
            </div>
          </div>
          
          <div className="space-y-1.5 text-center">
            <h2 className="text-sm font-bold text-[#171717] tracking-tight uppercase">Security Verification</h2>
            <p className="text-[11px] text-[#888] max-w-[200px] leading-relaxed">
              Establishing a secure connection to the admin gateway...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (authorized === false) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 duration-500 fill-mode-both">
      {children}
    </div>
  );
}
