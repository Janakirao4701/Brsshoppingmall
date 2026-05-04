"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip verification if we are on the login page
    if (pathname?.includes("/admin/login")) {
      setAuthorized(true);
      return;
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        router.push("/admin/login");
        return;
      }

      // Check for admin role in profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        setAuthorized(false);
        router.push("/"); // Redirect non-admins to home
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-[#171717] border-t-transparent" />
          <p className="text-sm font-medium text-[#888]">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (authorized === false) return null;

  return <>{children}</>;
}
