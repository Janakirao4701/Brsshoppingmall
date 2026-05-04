# Pitfalls Research for BSR Shopping Mall

## 1. Poor Image Optimization
- **Warning Sign**: High-res product images load slowly, pushing load times past the 3-second limit.
- **Prevention**: Strictly enforce Next.js `<Image>` usage with WebP formats, correct sizing, and `placeholder="blur"`.
- **Phase**: MVP Core / Storefront

## 2. Friction in Mobile Checkout
- **Warning Sign**: High cart abandonment rates on mobile devices.
- **Prevention**: Ensure the Razorpay integration is thumb-friendly, inputs have correct `type` attributes (e.g., `tel` for phone numbers), and avoid multi-page redirects during checkout.
- **Phase**: Checkout & Payments

## 3. Inventory Sync Failures
- **Warning Sign**: Customers ordering out-of-stock items because the website isn't synced with the physical store.
- **Prevention**: Implement a clear "Low Stock" indicator and ensure the admin panel allows instant 1-click stock updates.
- **Phase**: Admin Panel / Architecture

## 4. Payment Webhook Misses
- **Warning Sign**: Customer pays via UPI, money is deducted, but the order stays "Pending" in the database.
- **Prevention**: Set up robust Supabase Edge Functions with proper retry logic to handle Razorpay webhooks asynchronously.
- **Phase**: Checkout & Payments
