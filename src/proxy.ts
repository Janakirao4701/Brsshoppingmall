import { createServerClient, type CookieOptions } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware: handles i18n routing and admin authentication.
 * 
 * Security features:
 * - Graceful fallback when Supabase is not configured (dev mode)
 * - Session refresh on every request (prevents stale tokens)
 * - Admin route protection with auth check
 * - Role verification deferred to AdminGuard (avoids DB query in middleware for performance)
 */
export async function proxy(request: NextRequest) {
  let response = intlMiddleware(request);

  // Skip Supabase auth if not configured (local dev without keys)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    return response;
  }

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  // Check if it's an admin route
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.includes("/admin") && !pathname.includes("/admin/login");

  if (isAdminRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login"; // next-intl will handle locale
      return NextResponse.redirect(url);
    }

    // Role check - for performance, we might want to skip this in middleware 
    // and handle it in the layout/page, but let's do a basic session check here.
    // If you need strict role check in middleware, you'd fetch the profile here.
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
