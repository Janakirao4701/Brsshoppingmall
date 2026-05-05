import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeString, isValidPhone, isValidEmail } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * POST /api/bulk-inquiry
 * 
 * Hardened bulk order inquiry submission with:
 * - Rate limiting (30 req/min per IP)
 * - Input validation & sanitization
 * - XSS prevention
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`bulk-inquiry:${clientIp}`, RATE_LIMITS.GENERAL);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, email, product_category, quantity, message, website_url } = body;

    // 1.5. Honeypot check (Bot prevention)
    if (website_url) {
      console.warn("🍯 Honeypot triggered by IP:", clientIp);
      // Return 200 OK so bots think it worked
      return NextResponse.json(
        { success: true, message: "Inquiry submitted successfully." },
        { status: 200 }
      );
    }

    // 2. Validate required fields
    if (!name || !phone || !product_category || !quantity) {
      return NextResponse.json(
        { error: "Name, phone, category, and quantity are required." },
        { status: 400 }
      );
    }

    // 3. Validate input formats
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid Indian phone number." },
        { status: 400 }
      );
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const numQuantity = Number(quantity);
    if (!Number.isFinite(numQuantity) || numQuantity < 10 || numQuantity > 100_000) {
      return NextResponse.json(
        { error: "Minimum quantity for bulk orders is 10 pieces." },
        { status: 400 }
      );
    }

    // 4. Sanitize inputs
    const sanitized = {
      name: sanitizeString(name),
      phone: phone.replace(/[\s\-()]/g, ""),
      email: email ? sanitizeString(email) : null,
      product_category: sanitizeString(product_category),
      quantity: numQuantity,
      message: message ? sanitizeString(message).substring(0, 2000) : null,
    };

    // 5. Store in database
    if (supabase) {
      const { error } = await supabase.from("bulk_inquiries").insert(sanitized);

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to submit inquiry. Please try again." },
          { status: 500 }
        );
      }
    } else {
      console.log("📦 Bulk Order Inquiry (local):", sanitized);
    }

    return NextResponse.json(
      { success: true, message: "Inquiry submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
