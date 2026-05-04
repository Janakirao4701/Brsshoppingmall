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
    // If it's the login page, we are already authorized to see it
    if (isLoginPage) return;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        window.location.href = "/admin/login";
        return;
      }

      // Check for admin role in profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        console.error("Admin verification failed:", error || "Not an admin");
        setAuthorized(false);
        window.location.href = "/admin/login"; // Redirect to login for re-auth
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  if (authorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-8 animate-spin rounded-full border-4 border-[#171717] border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-[#171717]">Verifying admin access...</p>
            <p className="text-xs text-[#888] mt-1">If you are not redirected, <a href="/admin/login" className="text-brand-red hover:underline">click here to login</a></p>
          </div>
        </div>
      </div>
    );
  }

  if (authorized === false) return null;

  return <>{children}</>;
}
