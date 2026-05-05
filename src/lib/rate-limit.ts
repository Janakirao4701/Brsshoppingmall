/**
 * In-memory rate limiter for Vercel serverless API routes.
 * Uses a sliding window approach per IP address.
 * 
 * Note: In-memory storage resets on cold starts. For true distributed
 * rate limiting at scale, use Vercel KV or Upstash Redis.
 * This is sufficient for startup-scale (~20k users).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

interface RateLimitConfig {
  /** Maximum requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (usually IP address).
 * Returns whether the request should be allowed.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = identifier;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    // First request or window expired — start fresh
    const entry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Extract client IP from a Next.js request.
 * Handles Vercel's x-forwarded-for header and falls back to x-real-ip.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/** Pre-configured rate limits for common API patterns */
export const RATE_LIMITS = {
  /** Payment APIs: 5 requests per 60 seconds per IP */
  PAYMENT: { maxRequests: 5, windowMs: 60_000 },
  /** Order creation: 3 requests per 60 seconds per IP */
  ORDER_CREATE: { maxRequests: 3, windowMs: 60_000 },
  /** General API: 30 requests per 60 seconds per IP */
  GENERAL: { maxRequests: 30, windowMs: 60_000 },
  /** Auth attempts: 5 per 5 minutes per IP */
  AUTH: { maxRequests: 5, windowMs: 300_000 },
  /** Webhook: 100 per 60 seconds (Razorpay sends in bursts) */
  WEBHOOK: { maxRequests: 100, windowMs: 60_000 },
} as const;
