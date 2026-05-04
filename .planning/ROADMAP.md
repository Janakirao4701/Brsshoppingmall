# Roadmap: BSR Shopping Mall

## Overview

This roadmap defines the end-to-end journey for building the BSR Shopping Mall e-commerce website. We begin with the core storefront UI and project setup, move into the product catalog and search functionalities, construct the complete checkout and payment flow, add user accounts, and finally build the administrative tools to manage the platform.

## Phases

- [ ] **Phase 1: Project Setup & Storefront UI** - Scaffold the application and build the landing page, navigation, and contact elements.
- [ ] **Phase 2: Product Catalog** - Implement the product browsing experience including categories, search, filtering, and detail pages.
- [ ] **Phase 3: Checkout & Payments** - Build the shopping cart, checkout flow, Razorpay integration, and shipping calculators.
- [ ] **Phase 4: User Accounts** - Implement authentication, profile management, and order history viewing.
- [ ] **Phase 5: Admin Panel** - Create protected routes for managing products, inventory, and viewing orders/inquiries.

## Phase Details

### Phase 1: Project Setup & Storefront UI
**Goal**: Scaffold Next.js application, configure Tailwind/Shadcn, and build the core storefront UI including Hero banner and Store Locator.
**Depends on**: Nothing (first phase)
**Requirements**: STORE-01, STORE-02, STORE-03
**Success Criteria**:
  1. User can view the Hero banner and Store Hours on the homepage.
  2. User can interact with the Branch Locator and see Google Maps embeds.
  3. User can toggle between English and Telugu languages.
**Plans**: 3 plans

Plans:
- [x] 01-01: Next.js Setup & Global Layout
- [ ] 01-02: Hero Banner & Store Locator Sections
- [ ] 01-03: Language Toggle Implementation

### Phase 2: Product Catalog
**Goal**: Implement dynamic product listing, search capabilities, and detailed product views.
**Depends on**: Phase 1
**Requirements**: CATL-01, CATL-02, CATL-03, CATL-04
**Success Criteria**:
  1. User can browse products by categories (Men, Women, Kids).
  2. User can filter products by brand, price, and size.
  3. User can view individual product details, including images and size charts.
  4. User can submit a bulk order inquiry form.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Database Schema & Supabase connection
- [ ] 02-02: Product Listing & Filtering UI
- [ ] 02-03: Product Detail Page & Bulk Inquiry Form

### Phase 3: Checkout & Payments
**Goal**: Enable users to add items to cart, proceed through checkout, and make payments via Razorpay.
**Depends on**: Phase 2
**Requirements**: ECOMM-01, ECOMM-02, ECOMM-03, ECOMM-04, ECOMM-05
**Success Criteria**:
  1. User can add products to their cart and view the summary.
  2. User can navigate through a 3-step checkout process.
  3. User can successfully pay via Razorpay.
  4. User receives shipping estimates based on delivery address.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Cart State Management
- [ ] 03-02: Checkout Flow & Shipping Estimates
- [ ] 03-03: Razorpay Integration & Webhooks

### Phase 4: User Accounts
**Goal**: Implement secure authentication and user profile management.
**Depends on**: Phase 3
**Requirements**: USER-01, USER-02, USER-03
**Success Criteria**:
  1. User can register, login, and recover password securely.
  2. User can view their past order history and tracking status.
  3. User can save multiple shipping addresses for faster checkout.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Supabase Auth & Session Management
- [ ] 04-02: User Profile & Saved Addresses
- [ ] 04-03: Order History & Tracking UI

### Phase 5: Admin Panel
**Goal**: Provide store owners with a secure dashboard to manage the platform's inventory and orders.
**Depends on**: Phase 1, Phase 2
**Requirements**: ADMN-01, ADMN-02, ADMN-03, ADMN-04
**Success Criteria**:
  1. Admin can add, update, and delete products from the catalog.
  2. Admin can adjust inventory levels for each product SKU.
  3. Admin can view incoming orders and update shipping statuses.
  4. Admin can view and respond to bulk order inquiries.
**Plans**: 3 plans

Plans:
- [ ] 05-01: Admin Middleware & Layout
- [ ] 05-02: Product & Inventory Management
- [ ] 05-03: Order & Inquiry Management

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup & Storefront UI | 0/3 | Not started | - |
| 2. Product Catalog | 0/3 | Not started | - |
| 3. Checkout & Payments | 0/3 | Not started | - |
| 4. User Accounts | 0/3 | Not started | - |
| 5. Admin Panel | 0/3 | Not started | - |
