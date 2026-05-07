# PRD: BSR Shopping Mall

## Task 1: Fix Mobile Responsiveness (Complete ✅)
Fix the admin dashboard layout for mobile screens.
- [x] Drawer navigation on mobile
- [x] Responsive product grid / Card views
- [x] 44x44px touch target compliance

## Task 2: Optimize Supabase Queries (Complete ✅)
Centralize Supabase client and reduce redundant calls.
- [x] Single client instance (@/lib/supabase)
- [x] High-performance ISR caching (3600s)
- [x] Parallel data fetching (Promise.all)

## Task 3: Security Hardening (Complete ✅)
Implement security best practices to protect the application.
- [x] Add Content-Security-Policy (CSP) headers
- [x] Configure security headers (X-Frame-Options, HSTS, etc.)
- [x] Implement API Rate Limiting
- [x] Hardened RLS policies for Orders and Inquiries
- [x] Fixed Bot-Protection Honeypot logic
- [x] Recommendation: Set up a Cloud-based WAF (Cloudflare/Vercel)
