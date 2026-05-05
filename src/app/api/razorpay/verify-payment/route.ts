import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { supabaseServer as supabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * POST /api/razorpay/verify-payment
 * 
 * Production-grade payment verification with:
 * - Rate limiting (5 req/min per IP)
 * - HMAC SHA256 signature verification (timing-safe comparison)
 * - Payment ID deduplication (prevents double-processing)
 * - Server-side only — never trust frontend payment confirmation
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`verify-payment:${clientIp}`, RATE_LIMITS.PAYMENT);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many verification attempts." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_number } = body;

    // 2. Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_number) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET not configured");
      return NextResponse.json(
        { error: "Payment verification not configured." },
        { status: 503 }
      );
    }

    // 3. HMAC SHA256 signature verification (timing-safe)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(razorpay_signature, "hex")
    );

    if (!isValid) {
      console.error("Payment signature mismatch:", {
        order_number,
        razorpay_order_id,
        razorpay_payment_id,
      });

      // Mark as failed in DB
      if (supabase) {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            order_status: "failed",
          })
          .eq("order_number", order_number)
          .eq("razorpay_order_id", razorpay_order_id);
      }

      return NextResponse.json(
        { error: "Invalid payment signature. Possible tampering detected.", verified: false },
        { status: 400 }
      );
    }

    // 4. Payment deduplication — check if already processed
    if (supabase) {
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("payment_status, razorpay_payment_id")
        .eq("order_number", order_number)
        .single();

      if (existingOrder?.payment_status === "paid" && existingOrder?.razorpay_payment_id === razorpay_payment_id) {
        // Already verified — safe idempotent retry
        return NextResponse.json({
          verified: true,
          message: "Payment already verified.",
          orderNumber: order_number,
          idempotent: true,
        });
      }

      // 5. Update order with verified payment
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "confirmed",
          razorpay_payment_id,
          razorpay_signature,
          paid_at: new Date().toISOString(),
        })
        .eq("order_number", order_number)
        .eq("razorpay_order_id", razorpay_order_id)
        .eq("payment_status", "pending"); // Only update if still pending (concurrency guard)

      if (updateError) {
        console.error("Payment status update error:", updateError);
        // Don't fail — the payment was verified, log for manual reconciliation
      }
    }

    return NextResponse.json({
      verified: true,
      message: "Payment verified successfully.",
      orderNumber: order_number,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification failed.";
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
