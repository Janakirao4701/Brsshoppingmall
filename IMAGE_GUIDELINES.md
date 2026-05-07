# BSR Shopping Mall: Image Upload & Media Standards

This document defines the enterprise-grade media standards for the BSR Shopping Mall e-commerce platform. Adhering to these guidelines ensures a premium luxury fashion presentation, responsive stability, and optimal performance across all devices.

---

## 1. Product Photography Standards
Product images are the core of the BSR experience. To maintain a consistent, high-end gallery, all product uploads must adhere to the **Portrait 3:4** standard.

### 1.1 Technical Specifications
| Attribute | Specification |
| :--- | :--- |
| **Primary Aspect Ratio** | **3:4 (Portrait)** |
| **Recommended Dimensions** | **1200 x 1600 px** |
| **Minimum Safe Dimensions** | **900 x 1200 px** |
| **Format** | **WebP** (Lossless) or **High-Quality JPEG** |
| **Color Space** | **sRGB** |

### 1.2 Category-Specific Framing
*   **Sarees**: Full-length shots showing the complete drape. Avoid cutting off the *pallu* or the floor-level fall. Ensure the texture and sheen are visible through high-resolution close-ups as secondary images.
*   **Menswear/Ethnic Wear**: Model should be centered. For Kurtas and Sherwanis, ensure the frame captures from mid-thigh to slightly above the head.
*   **Kidswear**: Use a slightly tighter 3:4 crop to ensure the garment details remain clear on smaller mobile grids.
*   **Indo-Western**: Focus on the fusion elements. Ensure the silhouette is clean and not obscured by cluttered accessories.

---

## 2. Homepage Hero Banners
The BSR homepage utilizes a **Dual-Asset Art Direction** strategy. We do not shrink desktop banners for mobile; we require separate, optimized assets to maintain legibility and impact.

### 2.1 Desktop Hero (Cinematic Widescreen)
*   **Aspect Ratio**: **21:9 or 16:9**
*   **Dimensions**: **2560 x 1080 px** (Ultra-wide) or **1920 x 1080 px**.
*   **Composition**: Utilize **Negative Space** (Left or Right) for text overlays. The subject should occupy only 40-50% of the frame to avoid clashing with CTA buttons.
*   **Editorial Quality**: High-dynamic-range photography with soft-focus backgrounds to emphasize the subject.

### 2.2 Mobile Hero (Balanced Portrait)
*   **Aspect Ratio**: **4:5** (Optimized for Fold Balance)
*   **Dimensions**: **1080 x 1350 px** (Recommended) or **1080 x 1440 px**.
*   **Composition**: Focus on **Face & Torso**. The subject should be vertically centered.
*   **CTA Safe Zone**: Keep the bottom 25% and top 15% of the image relatively simple, as buttons and header navigation will overlap these areas.
*   **UX Reasoning**: A 4:5 ratio provides better fold balance on modern smartphones, allowing users to see the start of the next section (Categories/Products) without excessive scrolling. This improves "Information Density" and CTA visibility.

---

## 3. Tablet & Large Screen Behavior
BSR implements adaptive media rules for larger touch devices.

*   **Primary Assets**: Tablets primarily use **Desktop Hero Assets**.
*   **Landscape Tablets**: Utilize standard 16:9 widescreen assets.
*   **Portrait Tablets**: Utilize desktop assets with adaptive center-cropping. Avoid using narrow 4:5 mobile assets on large tablets to prevent pixelation or awkward vertical scaling.
*   **Art Direction**: Large tablets should feel like a "Touch Desktop" experience rather than an "Upscaled Mobile" experience.

---

## 4. Accessibility & Readability Standards
High-end fashion must remain inclusive and legible.

*   **Text-in-Image Prohibited**: Do NOT embed critical promotional text, prices, or CTAs directly into the image file. All text must be rendered as HTML/CSS for screen readers and SEO.
*   **Overlay Readability**: Use CSS-based scrims or gradients (e.g., `bg-black/40`) to ensure white text remains legible over bright areas of a photograph.
*   **WCAG Contrast**: Maintain a minimum contrast ratio of **4.5:1** for all navigational text.
*   **CTA Visibility**: Ensure buttons have sufficient "breathable" space around them in the image composition to remain tappable (44x44px minimum touch target).
*   **Breakpoints**: Verify that text overlays do not obscure the model's face or critical garment details across all standard breakpoints.

---

## 5. Category Icons & Navigational Assets
Category navigation uses circular thumbnails.

*   **Aspect Ratio**: **1:1 (Square)**.
*   **Recommended Size**: **500 x 500 px**.
*   **Circular Safe Zone**: Keep all critical subject matter within the **central 80% circle**. Content in the corners will be masked by the circular UI.
*   **Background**: Use clean, neutral backgrounds (Light Grey or Off-White) to maintain icon clarity on high-density displays.

---

## 4. File Optimization & Delivery
BSR uses **Next.js `<Image />`** with automatic format negotiation. To optimize for Lighthouse scores and fast mobile loading:

*   **Preferred Format**: **WebP** is the standard. **AVIF** is recommended for high-detail embroidery/saree shots (20% better compression).
*   **Compression**: Aim for a file size under **250KB** for product images and **500KB** for desktop hero banners.
*   **Quality Setting**: Export at **80-85% quality**. Anything higher yields diminishing returns in visual quality while significantly increasing load times.

---

## 5. Luxury Photography Direction
To maintain a "Premium Boutique" aesthetic, avoid common amateur photography pitfalls:

### ✅ DO:
*   Use **Natural or Soft-Box Lighting** to highlight fabric textures.
*   Maintain a **Consistent Background** across a collection (Soft Grey, Warm Beige, or Clean White).
*   Use **Editorial Framing**: Off-center subjects for banners to create a high-fashion look.
*   Ensure **High Resolution**: Sharp eyes on models and visible weave on fabrics.

### ❌ DON'T:
*   **No Landscapes**: Do not upload landscape (horizontal) photos for products; they create broken white space in the grid.
*   **No Filters**: Avoid aggressive Instagram-style filters that distort true garment colors.
*   **No Clutter**: Avoid busy backgrounds like street scenes or cluttered rooms unless it is an art-directed lifestyle shoot.
*   **No Distortion**: Avoid extreme wide-angle lenses that distort body proportions.

---

## 6. Performance & Stability (Technical Guidance)
*   **Stable Rendering**: By using fixed aspect ratios (3:4, 16:9, 1:1), we eliminate **Cumulative Layout Shift (CLS)**.
*   **Lazy Loading**: All secondary images should be lazy-loaded. Only the first Hero and the first 4 product images should use the `priority` flag.
*   **Responsive Delivery**: The system automatically serves 640px images to mobile and 1200px to desktops. Ensure the source image is at least the maximum size required.

---

## 7. Quick Reference Table

| Section | Ideal Ratio | Dimensions (Recommended) | Safe Zone Requirement |
| :--- | :---: | :--- | :--- |
| **Product Card** | 3:4 | 1200 x 1600 px | Vertical Center |
| **Desktop Banner**| 16:9 | 1920 x 1080 px | Left/Right Negative Space |
| **Mobile Banner** | 4:5 | 1080 x 1350 px | Top 20% & Bottom 20% Clear |
| **Category Icon** | 1:1 | 500 x 500 px | Center Circular (80%) |
| **Brand Logos** | 3:1 | 600 x 200 px | Centered Horizontal |

---

*Last Updated: May 2026*
*Property of BSR Shopping Mall Digital Operations*
