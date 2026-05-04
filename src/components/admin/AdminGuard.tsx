"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// List of allowed admin emails
const ADMIN_EMAILS = ["bsrshoppingmall@gmail.com", "janakirao4701@gmail.com"];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        router.push("/login?redirect=/admin");
        return;
      }

      const userEmail = session.user.email;
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.push("/"); // Redirect non-admins to home
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
