# Tech Stack Research for BSR Shopping Mall

## Core Stack

### Frontend: Next.js 15 (App Router) + React
- **Rationale**: Next.js provides excellent SEO capabilities (crucial for "readymade garments Sompeta" queries) and server-side rendering for fast initial loads (< 3 seconds). The App Router simplifies nested layouts and data fetching.
- **Confidence**: High

### Styling: Tailwind CSS + Shadcn/ui + Framer Motion
- **Rationale**: Tailwind ensures rapid, responsive design (mobile-first). Shadcn provides accessible UI primitives. Framer Motion will be used for subtle, premium interactions.
- **Confidence**: High

### Backend & Database: Supabase (PostgreSQL + Auth)
- **Rationale**: Supabase provides a scalable PostgreSQL database, out-of-the-box Auth (essential for User Accounts), and Edge Functions. It's much faster to build a custom solution with Supabase than managing custom Node.js/Express infrastructure from scratch.
- **Confidence**: High

### E-commerce & Payments: Stripe / Razorpay Integration
- **Rationale**: Razorpay is specifically requested for India (UPI, PhonePe, GPay, COD). It provides pre-built checkout modules that integrate well with Next.js.
- **Confidence**: High

## What NOT to Use
- **Heavy CMS platforms (like Magento)**: Overkill for this scale and budget, will negatively impact the 3s performance goal.
- **Standard Create React App (CRA)**: Poor SEO and performance compared to Next.js.
