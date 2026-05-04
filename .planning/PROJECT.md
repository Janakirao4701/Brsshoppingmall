# BSR Shopping Mall Website

## What This Is

A professional e-commerce and business website for BSR Shopping Mall, a readymade garment retailer based in Sompeta, Andhra Pradesh. The platform enables customers to browse a diverse catalog of clothing (Men's, Women's, Kids'), place online orders with pan-India delivery, and submit bulk order inquiries for festivals and programs.

## Core Value

To provide a seamless, mobile-first shopping experience that expands BSR Shopping Mall's reach beyond local walk-ins to a pan-India customer base, while preserving the family-friendly trust of their physical stores.

## Guiding Principles

- **Intelligence-First**: Use `graphify` and `code_review_graph` before every major code change to ensure architectural alignment and prevent regressions.
- **UI/UX Excellence**: Maintain a premium, high-conversion aesthetic with strict adherence to HSL color palettes and modern motion design.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Interactive Product Catalog with filtering by brand, category, size, and price.
- [ ] Complete E-commerce flow: Shopping Cart, Checkout, and Order Tracking.
- [ ] Integrated Payment Gateway supporting UPI (PhonePe, GPay), Cards, Net Banking, and COD.
- [ ] Shipping integration with live calculators for All-India Home Delivery.
- [ ] Bulk order inquiry forms tailored for schools, organizations, and event planners.
- [ ] Store Locator and Contact section featuring Google Maps embed for Sompeta and Palasa branches.
- [ ] User Account features: Registration/Login, Order History, and Saved Addresses.
- [ ] Admin Panel for Product, Inventory, and Order management.
- [ ] Multi-language support (English and Telugu) for local audience accessibility.

### Out of Scope

- [ ] Standalone native mobile apps (iOS/Android) — We are focusing exclusively on a mobile-responsive web platform for now to optimize the timeline and budget.

## Context

BSR Shopping Mall is an established local business operating physical branches in Sompeta and Palasa. They currently hold a 3.6/5 rating on Justdial and compete with nearby retailers like Bnr Trends and Hello Shopping Mall. Their goal is to leverage digital presence to increase their 5,000+ monthly visitor target and facilitate an average order value of ₹1,500–₹2,500. A heavy emphasis is placed on family shoppers and bulk orders.

## Constraints

- **Performance**: Page load must be under 3 seconds on 4G networks.
- **Timeline**: Estimated 8-10 weeks from planning to post-launch monitoring.
- **Security**: Must include SSL certificate, data encryption, and PCI-DSS compliant payment processing.
- **Accessibility**: WCAG 2.1 Level AA compliance.
- **Budget**: Total project budget ranges between ₹92,000 and ₹3,10,000.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js & Tailwind Stack | Matches the requirement for a highly performant, SEO-friendly, mobile-first application. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-04 after initialization*
