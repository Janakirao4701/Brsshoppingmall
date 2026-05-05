You are a senior security engineer and full-stack architect.

I am building a production-grade e-commerce website (BSR Shopping Mall) using:

* Next.js deployed on Vercel
* Supabase (PostgreSQL, Auth, Storage)
* Razorpay for payments

Your task is to design a COMPLETE security architecture and implementation guide.

Requirements:

1. Cover all major risk areas:

   * Authentication & authorization
   * Database security (Row Level Security in Supabase)
   * API security (rate limiting, validation, abuse prevention)
   * Payment security (Razorpay verification + webhook handling)
   * Bot protection & anti-scraping
   * Data protection & encryption
   * File upload security
   * Admin panel protection
   * Secrets & environment variable handling
   * Logging, monitoring, and alerting
   * Backup & disaster recovery
   * Dependency & supply chain security

2. For each section, provide:

   * Clear explanation of the threat
   * Why it matters in real-world attacks
   * Step-by-step implementation
   * Code examples (Next.js API routes + Supabase SQL where applicable)
   * Common mistakes to avoid

3. Must include:

   * Supabase RLS policies (real SQL examples)
   * Secure payment verification logic using Razorpay (HMAC signature)
   * Webhook verification flow (server-side source of truth)
   * Rate limiting strategy for serverless (Vercel)
   * Input validation patterns (prevent SQL injection, XSS)
   * Role-based access control (admin vs user)

4. Follow production best practices:

   * Assume real attackers and bot traffic
   * Prioritize practical, implementable solutions
   * Avoid theoretical or vague advice

5. Output format:

   * Structured sections with headings
   * Code blocks for all critical parts
   * Checklist at the end for deployment readiness

6. Constraints:

   * Do not suggest unnecessary enterprise tools or overengineering
   * Keep it optimized for a startup-scale system (~20k+ users)

Goal:
Deliver a security blueprint that can be directly implemented to protect against:

* hacking attempts
* data leaks
* payment fraud
* API abuse
* bot attacks
* system misuse

Make the solution realistic, actionable, and production-ready.