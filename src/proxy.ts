import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Handle Locale first (next-intl)
  // This will handle redirects and locale detection
  const response = intlMiddleware(request);

  // 2. Initialize Supabase client with the response from intlMiddleware
  // This allows us to share cookies between next-intl and Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 3. Refresh session if it exists
  // This is critical for keeping the session alive in the browser
  await supabase.auth.getUser();

  // 4. (Optional) Protect admin routes at the middleware level
  // This is a secondary layer of protection besides AdminGuard
  const { pathname } = request.nextUrl;
  
  // We check for /admin (considering locale-free paths handled by next-intl)
  // However, AdminGuard handles the specific 'admin' role check.
  // Here we just ensure we don't block the login page itself.
  const isAdminPath = pathname.includes('/admin') && !pathname.includes('/admin/login');
  
  if (isAdminPath) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login if no user
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 5. Apply security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  // Match all pathnames except for
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
