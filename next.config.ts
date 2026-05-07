import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Production security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.googleapis.com https://checkout.razorpay.com https://*.razorpay.com https://*.vercel-scripts.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://*.supabase.co https://*.googleusercontent.com https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://*.supabase.co https://*.google.com https://checkout.razorpay.com; connect-src 'self' https://*.supabase.co https://*.googleapis.com https://*.razorpay.com https://vitals.vercel-insights.com https://va.vercel-scripts.com; base-uri 'self'; object-src 'none';",
          },
        ],
      },
      {
        // API routes: prevent caching of sensitive data
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
    ];
  },

  // Block access to sensitive files
  async redirects() {
    return [
      {
        source: "/:path*((?:\\.env|\\.git|\\.config|\\.php|\\.exe|\\.sh|\\.py).*)",
        destination: "/404",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
