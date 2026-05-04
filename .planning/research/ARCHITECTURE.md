# Architecture Research for BSR Shopping Mall

## Component Boundaries

### 1. Storefront (Client-facing)
- **Catalog Viewer**: Fetches and caches product lists from Supabase.
- **Cart Manager**: Uses local storage or a Zustand store for fast, optimistic cart updates.
- **Checkout Flow**: Interfaces with Razorpay SDK and Supabase to finalize orders.

### 2. Admin Panel (Internal)
- **Inventory Controller**: Protected routes (Next.js Middleware) for managing products, prices, and stock.
- **Order Dashboard**: Interface for viewing and updating order statuses (Processing, Shipped).

### 3. Backend Services (Supabase)
- **Auth**: Manages user sessions, customer profiles, and admin roles.
- **Database**: Stores `Products`, `Orders`, `Users`, and `BulkInquiries`.
- **Edge Functions**: Webhooks for Razorpay payment confirmations to securely update order status.

## Data Flow
1. **Browsing**: Next.js fetches cached products from Supabase.
2. **Checkout**: User submits order -> Next.js creates pending order in DB -> Razorpay initiates payment -> Webhook confirms payment -> Order status updates to "Confirmed".

## Build Order Implication
1. Database Schema & Auth Setup
2. Admin Product Management (so data exists)
3. Storefront UI (Catalog & Search)
4. Cart & Checkout Flow
5. Payment Integration & Order Tracking
