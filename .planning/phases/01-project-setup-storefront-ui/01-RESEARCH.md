# Phase 1: Project Setup & Storefront UI - Research

## RESEARCH COMPLETE

**Phase:** 1 - Project Setup & Storefront UI
**Requirements:** STORE-01, STORE-02, STORE-03

---

## 1. Project Scaffolding (Next.js 15 + Tailwind + Shadcn)

### Approach
- **`npx create-next-app@latest ./`** with TypeScript, Tailwind CSS, App Router, `src/` directory, and Turbopack enabled
- **Shadcn/ui**: Run `npx shadcn@latest init` after project creation for accessible UI primitives (Button, Card, Sheet, DropdownMenu)
- **Folder structure**: `src/app/` for routing, `src/components/` for shared UI, `src/lib/` for utilities, `src/i18n/` for translations

### Key Decisions
- Use `src/` directory to separate app code from config files
- Server Components by default — only add `'use client'` for interactive elements (carousel, map, language toggle)
- Use `next/image` with WebP/AVIF for all product and banner images
- Use Metadata API (`export const metadata`) for SEO on every page

### Fonts
- **Inter** (body) + **Outfit** (headings) from Google Fonts via `next/font/google` for zero-layout-shift loading

---

## 2. Carousel / Hero Banner

### Library: Embla Carousel
- **Why Embla**: Lightweight (~3KB gzipped), excellent touch/swipe support, SSR-friendly, highly customizable, and Shadcn/ui ships a Carousel component built on Embla
- **Alternative rejected**: Swiper.js — heavier bundle (~40KB), more features than needed for a simple banner carousel
- **Implementation**: Use Shadcn's `<Carousel>` component (built on Embla) with auto-play plugin (`embla-carousel-autoplay`)

### Configuration
- Auto-play interval: 5 seconds
- Pause on hover/touch
- Loop enabled
- Dot indicators for slide navigation
- Swipe/drag gestures on mobile
- Each slide: full-width image background + overlay text + CTA button

### Performance
- Preload first slide image with `priority` prop on `next/image`
- Lazy-load remaining slide images
- Use `placeholder="blur"` with generated blur data URLs

---

## 3. Internationalization (English + Telugu)

### Library: next-intl
- **Why next-intl**: Purpose-built for Next.js App Router, lightweight, excellent TypeScript support with auto-completion for translation keys, ICU MessageFormat
- **Alternative rejected**: next-i18next — heavier config, designed for Pages Router originally

### Setup
- Translation files: `src/i18n/messages/en.json` and `src/i18n/messages/te.json`
- Middleware: `src/middleware.ts` for locale detection and routing
- Request config: `src/i18n/request.ts` for loading translations
- Route structure: `src/app/[locale]/` for locale-prefixed URLs (good for SEO)
- Default locale: `en` (no prefix), Telugu: `/te/`

### Scope for Phase 1
- Translate: navbar labels, hero banner text, store locator content, footer text
- Product catalog translations deferred to Phase 2

---

## 4. Google Maps Integration

### Approach: Simple iframe Embed (No API Key Required)
- For showing 2 static store locations, a simple Google Maps iframe embed is sufficient and free
- No need for `@react-google-maps/api` package or API key billing at this stage
- **Format**: `<iframe src="https://www.google.com/maps/embed?pb=..." />` per branch

### Upgrade Path
- If interactive features needed later (e.g., directions, search), upgrade to `@react-google-maps/api` with `useJsApiLoader`
- API key would go in `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## 5. Floating WhatsApp Button

### Implementation
- Custom component: `<WhatsAppFloat />`
- Position: `fixed bottom-6 right-6 z-50`
- Link: `https://wa.me/917829333444?text=Hi%20BSR%20Shopping%20Mall`
- Icon: WhatsApp SVG icon (green circle, no external dependency)
- Animation: Subtle pulse animation on idle, scale on hover
- Accessibility: `aria-label="Chat on WhatsApp"`

---

## 6. Navigation Architecture

### Desktop (Sticky Top Navbar)
- Logo (left) → Category links: Men / Women / Kids (center) → Search icon, Language dropdown, Cart icon, Account icon (right)
- `position: sticky; top: 0` with backdrop blur and shadow on scroll
- Use Shadcn `<NavigationMenu>` for desktop category dropdowns

### Mobile (Bottom Tab Bar)
- 4 tabs: Home / Categories / Cart / Account
- `position: fixed; bottom: 0` with safe-area-inset padding for notched phones
- Active tab indicator with brand color
- Hide on scroll down, show on scroll up (optional, improves content area)

### Responsive Breakpoint
- Desktop navbar: `>= 768px` (md breakpoint)
- Mobile bottom bar: `< 768px`

---

## 7. Brand Color System (Tailwind Config)

```javascript
// tailwind.config.ts colors extension
colors: {
  brand: {
    red: '#DC2626',
    orange: '#EA580C',
    gradient: 'linear-gradient(135deg, #DC2626, #EA580C)',
  },
  // Neutral palette for text and backgrounds
}
```

- Primary CTA buttons: Red-to-Orange gradient
- Hover states: Darken by 10%
- Text on brand backgrounds: White

---

## 8. Dependencies Summary

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `next@15` | Framework | Core |
| `tailwindcss` | Styling | Dev dependency |
| `shadcn/ui` | UI components | Tree-shaken |
| `embla-carousel-react` | Hero carousel | ~3KB |
| `embla-carousel-autoplay` | Auto-play plugin | ~1KB |
| `next-intl` | i18n (EN/Telugu) | ~12KB |
| `lucide-react` | Icons | Tree-shaken |
| `framer-motion` | Micro-animations | ~30KB |

**Total estimated client JS added**: ~46KB gzipped (well within budget for <3s load time on 4G)

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Telugu translations incomplete | Users see English fallback | Use next-intl fallback config; translate Phase 1 strings only |
| Google Maps iframe blocked by CSP | Map doesn't render | Add `frame-src` for google.com in Next.js headers config |
| Carousel images too large | Slow first paint | Use next/image with priority on first slide, lazy-load rest |
| WhatsApp link not working on desktop | Dead button | Fallback to web.whatsapp.com on desktop browsers |

---

*Research completed: 2026-05-04*
*Phase: 01-project-setup-storefront-ui*
