import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/razorpay/webhook
 * 
 * Razorpay webhook handler — the SOURCE OF TRUTH for payment status.
 * 
 * Production-grade features:
 * - Webhook signature verification (HMAC SHA256)
 * - Idempotent processing (safe for repeated delivery)
 * - Handles delayed and out-of-order events
 * - Rate limited to prevent abuse
 * 
 * Configure in Razorpay Dashboard → Webhooks:
 * URL: https://your-domain.com/api/razorpay/webhook
 * Secret: Set RAZORPAY_WEBHOOK_SECRET env var
 * Events: payment.captured, payment.failed, order.paid
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting (generous — Razorpay sends bursts)
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`webhook:${clientIp}`, RATE_LIMITS.WEBHOOK);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    // 2. Read raw body for signature verification
    const rawBody = await request.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    // 3. Verify webhook signature
    const receivedSignature = request.headers.get("x-razorpay-signature");
    if (!receivedSignature) {
      console.error("Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(receivedSignature, "hex")
    );

    if (!isValid) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Parse and process the event
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    console.log(`[Webhook] Received: ${eventType}`, {
      payment_id: payload?.payment?.entity?.id,
      order_id: payload?.payment?.entity?.order_id || payload?.order?.entity?.id,
    });

    switch (eventType) {
      case "payment.captured": {
        await handlePaymentCaptured(payload);
        break;
      }
      case "payment.failed": {
        await handlePaymentFailed(payload);
        break;
      }
      case "order.paid": {
        await handleOrderPaid(payload);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event: ${eventType}`);
    }

    // Always return 200 — Razorpay retries on non-2xx
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 even on errors to prevent Razorpay from retrying indefinitely
    // Log the error for manual investigation
    return NextResponse.json({ received: true, error: "Processing error logged" });
  }
}

/**
 * Handle payment.captured event.
 * This is the AUTHORITATIVE confirmation that money was received.
 */
async function handlePaymentCaptured(payload: Record<string, unknown>) {
  const payment = (payload.payment as Record<string, unknown>)?.entity as Record<string, unknown>;
  if (!payment) return;

  const razorpayOrderId = payment.order_id as string;
  const razorpayPaymentId = payment.id as string;
  const amountPaise = payment.amount as number;

  if (!supabase || !razorpayOrderId) return;

  // Idempotent update — only update if not already paid
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      order_status: "confirmed",
      razorpay_payment_id: razorpayPaymentId,
      paid_at: new Date().toISOString(),
      webhook_verified: true,
      webhook_amount_paise: amountPaise,
    })
    .eq("razorpay_order_id", razorpayOrderId)
    .in("payment_status", ["pending", "created"]); // Only update if not already processed

  if (error) {
    console.error("[Webhook] payment.captured update error:", error);
  }
}

/**
 * Handle payment.failed event.
 * Marks the order as failed so the user can retry.
 */
async function handlePaymentFailed(payload: Record<string, unknown>) {
  const payment = (payload.payment as Record<string, unknown>)?.entity as Record<string, unknown>;
  if (!payment) return;

  const razorpayOrderId = payment.order_id as string;
  const errorCode = (payment.error_code as string) || "unknown";
  const errorDescription = (payment.error_description as string) || "Payment failed";

  if (!supabase || !razorpayOrderId) return;

  // Only update if still pending — don't overwrite a successful payment
  await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      order_status: "failed",
      payment_error_code: errorCode,
      payment_error_description: errorDescription,
    })
    .eq("razorpay_order_id", razorpayOrderId)
    .eq("payment_status", "pending");
}

/**
 * Handle order.paid event (backup confirmation).
 * Ensures consistency if payment.captured was missed.
 */
async function handleOrderPaid(payload: Record<string, unknown>) {
  const order = (payload.order as Record<string, unknown>)?.entity as Record<string, unknown>;
  if (!order) return;

  const razorpayOrderId = order.id as string;

  if (!supabase || !razorpayOrderId) return;

  // Only update if still pending
  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      order_status: "confirmed",
      webhook_verified: true,
    })
    .eq("razorpay_order_id", razorpayOrderId)
    .eq("payment_status", "pending");
}
