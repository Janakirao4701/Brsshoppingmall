# Phase 8: Engagement Features

## Goal
Increase customer retention, conversion rates, and trust by implementing a user Wishlist system and automated order confirmation emails.

## Scope
1. **Wishlist System**: Build out the UI and logic for users to manage their saved items, allowing them to quickly transition high-intent products into the shopping cart.
2. **Automated Order Notifications**: Integrate an email provider (Resend) to automatically dispatch professional order confirmations to customers and alert store administrators of new paid orders.

## Plans

### 08-01: Wishlist System & UI
*   **File:** `src/app/[locale]/(storefront)/wishlist/page.tsx`, `src/lib/store.ts`
*   **Action:** 
    *   [x] Create a dedicated `/wishlist` route that reads from the existing `useWishlist` Zustand store.
    *   [x] Build a responsive grid layout displaying saved `ProductCard`s.
    *   [x] Add "Move to Cart" functionality allowing one-click transfer from wishlist to cart.
    *   [x] Ensure the Wishlist icon in the Navbar correctly links to this new page.
*   **Dependencies:** None.

### 08-02: Automated Order Notifications (Email)
*   **File:** `package.json`, `src/app/api/razorpay/webhook/route.ts`, `src/lib/email.ts`
*   **Action:** 
    *   [x] Install `resend` for transactional email delivery.
    *   [x] Create a reusable email utility in `lib/email.ts` to construct professional HTML email templates for order confirmations.
    *   [x] Hook into the existing Razorpay webhook (`webhook/route.ts`); upon `payment.captured`, trigger the email to the customer using the email address stored in the order data.
    *   [x] Trigger an internal alert email to the admin email address.
*   **Dependencies:** `resend` package.

## Review Checkpoints
- [x] Can users navigate to their wishlist and successfully move items to the cart?
- [x] Is `resend` successfully installed and configured with API keys?
- [x] Does the Razorpay webhook successfully dispatch an email upon capturing a payment?
