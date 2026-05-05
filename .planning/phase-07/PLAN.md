# Phase 7: Performance & Search Visibility

## Goal
Ensure the BSR Shopping Mall storefront is discoverable on search engines, fully localized for English and Telugu, and performs exceptionally well (Lighthouse SEO/Performance > 90).

## Scope
1. **SEO & Metadata Implementation**: Add dynamic and localized `<title>`, `<meta name="description">`, and OpenGraph tags to all primary pages (Home, Categories, Products) using `next-intl`.
2. **Dynamic Sitemap & Robots.txt**: Implement Next.js App Router native `sitemap.ts` and `robots.ts` to index all static and dynamic product routes.
3. **Performance Optimization**: Audit and strict enforcement of Next.js Image Optimization (`<Image>`), loading priorities, and font loading.

## Plans

### 07-01: SEO & Metadata Implementation
*   **File:** `src/app/[locale]/layout.tsx`, `src/app/[locale]/(storefront)/page.tsx`, `src/app/[locale]/(storefront)/[category]/page.tsx`
*   **Action:** 
    *   Replace static metadata exports with `export async function generateMetadata` to support localized SEO titles and descriptions using `getTranslations`.
    *   Add comprehensive OpenGraph tags for WhatsApp and Facebook sharing.
    *   Implement JSON-LD structured data for Local Business (Sompeta/Palasa details) on the homepage.
*   **Dependencies:** `next-intl` configuration.

### 07-02: Dynamic Sitemap & Robots.txt
*   **File:** `src/app/sitemap.ts`, `src/app/robots.ts`
*   **Action:** 
    *   Create a native `sitemap.ts` file that iterates over supported locales (`en`, `te`) and outputs the index pages.
    *   Fetch dynamic product IDs from Supabase and generate URLs for every product.
    *   Create `robots.ts` allowing indexing of all public pages but blocking `/api`, `/admin`, and `/account`.
*   **Dependencies:** Supabase database access for dynamic product lists.

### 07-03: Performance Optimization & Image Enforcements
*   **File:** `src/components/sections/HeroBanner.tsx`, `src/app/[locale]/(storefront)/page.tsx`, `src/components/products/ProductCard.tsx`
*   **Action:** 
    *   Ensure all above-the-fold images (Hero Banner, top category card) use the `priority` prop.
    *   Ensure all below-the-fold images use native `loading="lazy"`.
    *   Define strict `sizes` props on all `<Image>` tags to prevent oversized downloading on mobile devices.
*   **Dependencies:** None.

## Review Checkpoints
- [ ] Are metadata titles dynamically translating when switching to Telugu?
- [ ] Does `/sitemap.xml` correctly output URLs with language prefixes?
- [ ] Does Lighthouse report >90 for SEO and Performance?
