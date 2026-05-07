"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * SmoothScroll provider — enables Lenis smooth scrolling on desktop only.
 * On mobile, Lenis is skipped to avoid competing with native touch scrolling,
 * reducing JS overhead by ~40KB on low-end devices.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check once on mount — no resize listener needed since layout doesn't hot-swap
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
  }, []);

  // On mobile, render children directly without Lenis wrapper
  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
