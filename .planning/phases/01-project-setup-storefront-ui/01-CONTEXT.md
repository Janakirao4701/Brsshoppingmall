# Phase 1: Project Setup & Storefront UI - Context

**Gathered:** 2026-05-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Next.js application with Tailwind CSS and Shadcn/ui, then build the core storefront homepage including a carousel hero banner, sticky navigation with mobile bottom tab bar, branch locator with embedded Google Maps, floating WhatsApp CTA, and an English/Telugu language toggle.

</domain>

<decisions>
## Implementation Decisions

### Hero Banner
- **D-01:** Carousel/slideshow format with rotating banners (like Amazon/Flipkart style)
- **D-02:** Slides showcase: seasonal offers & discounts, category highlights (Men/Women/Kids), "All India Delivery" trust-building banner, and festival/bulk order promotions
- **D-03:** Each slide should have a clear CTA button linking to the relevant section or category

### Navigation & Layout
- **D-04:** Sticky top navbar on desktop — logo left, category links center, cart/account/language icons right
- **D-05:** Fixed bottom tab bar on mobile with 4 tabs: Home, Categories, Cart, Account
- **D-06:** Brand colors from the BSR logo: vibrant Red (#DC2626) and Orange (#EA580C) gradient for primary accents

### Store Locator & Contact
- **D-07:** Embedded interactive Google Map showing both Sompeta and Palasa branch pins with contact details alongside
- **D-08:** Floating WhatsApp chat button (bottom-right corner, always visible) that opens WhatsApp with a pre-filled message to +91 78293 33444
- **D-09:** Click-to-call phone button for +91 78293 33444
- **D-10:** Display store hours: Daily 9:00 AM – 9:00 PM

### Language Toggle
- **D-11:** Globe icon with "EN / తెలుగు" dropdown in the header navbar (next to account icons)
- **D-12:** Default language is English; Telugu available via dropdown toggle
- **D-13:** Use next-intl or similar i18n library for managing translations

### Agent's Discretion
- Carousel transition animation style and timing (auto-play interval, swipe gestures)
- Footer content and layout structure
- SEO meta tags and Open Graph configuration
- Font selection (Inter/Outfit recommended per project rules)
- Specific Tailwind color palette mapping for the Red/Orange brand system

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Project Files
- `.planning/PROJECT.md` — Core value, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — STORE-01, STORE-02, STORE-03 requirements for this phase
- `.planning/research/STACK.md` — Technology stack rationale (Next.js + Tailwind + Supabase)
- `.planning/research/ARCHITECTURE.md` — Component boundaries and data flow
- `.planning/research/PITFALLS.md` — Known risks (image optimization, mobile friction)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing codebase — this is a greenfield project (Phase 1)

### Established Patterns
- None yet — this phase establishes the foundational patterns for all subsequent phases

### Integration Points
- Next.js App Router will define the routing structure used by all future phases
- Tailwind config will set the brand color tokens used site-wide
- Layout components (Navbar, Footer, BottomTabBar) will be shared across all pages

</code_context>

<specifics>
## Specific Ideas

- BSR Shopping Mall logo provided by the user (Red/Orange swirl "S" with "BSR Shopping Mall - Baratam Group" text) — must be used in the navbar and footer
- Phone number: +91 78293 33444 (for click-to-call and WhatsApp)
- Store addresses: Sompeta (WHVM+6X2, Sompeta - Baruva Rd, Mandapam, Rapakaputtuga, Sompeta, AP 532284) and Palasa branch
- Operating hours: Daily 9:00 AM – 9:00 PM

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-setup-storefront-ui*
*Context gathered: 2026-05-04*
