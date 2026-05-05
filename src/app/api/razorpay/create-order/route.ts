import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { validateCheckoutPayload } from "@/lib/validation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/razorpay/create-order
 * 
 * Production-grade order creation with:
 * - Rate limiting (3 req/min per IP)
 * - Input validation & sanitization
 * - Idempotency key support (prevents duplicate orders on retry)
 * - Unique constraint on razorpay_order_id
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`create-order:${clientIp}`, RATE_LIMITS.ORDER_CREATE);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Validate Razorpay configuration
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials not configured");
      return NextResponse.json(
        { error: "Payment system is not configured." },
        { status: 503 }
      );
    }

    // 3. Validate & sanitize input
    const body = await request.json();
    const validation = validateCheckoutPayload(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid request data." },
        { status: 400 }
      );
    }

    const {
      amount,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      items,
      subtotal,
      shippingCost,
      idempotencyKey,
    } = validation.data;

    // 4. Idempotency: Check if this order was already created
    if (idempotencyKey && supabase) {
      const { data: existing } = await supabase
        .from("orders")
        .select("order_number, razorpay_order_id, total")
        .eq("idempotency_key", idempotencyKey)
        .single();

      if (existing) {
        // Return the existing order — safe retry
        return NextResponse.json({
          orderId: existing.razorpay_order_id,
          orderNumber: existing.order_number,
          amount: existing.total * 100,
          currency: "INR",
          keyId,
          idempotent: true,
        });
      }
    }

    // 5. Generate unique order number with collision resistance
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `BSR-${timestamp}-${random}`;

    // 6. Create Razorpay order
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise — round to avoid float errors
      currency: "INR",
      receipt: orderNumber,
      notes: {
        customer_name: customerName,
        customer_phone: customerPhone,
        order_number: orderNumber,
      },
    });

    // 7. Save order to database with PENDING status
    if (supabase) {
      const { error: insertError } = await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_pincode: shippingPincode,
        items,
        subtotal,
        shipping_cost: shippingCost,
        total: amount,
        payment_method: "razorpay",
        payment_status: "pending",
        order_status: "pending",
        razorpay_order_id: razorpayOrder.id,
        idempotency_key: idempotencyKey || null,
      });

      if (insertError) {
        // If unique constraint violation on razorpay_order_id — race condition, fetch existing
        if (insertError.code === "23505") {
          const { data: existing } = await supabase
            .from("orders")
            .select("order_number, razorpay_order_id, total")
            .eq("razorpay_order_id", razorpayOrder.id)
            .single();

          if (existing) {
            return NextResponse.json({
              orderId: existing.razorpay_order_id,
              orderNumber: existing.order_number,
              amount: existing.total * 100,
              currency: "INR",
              keyId,
              idempotent: true,
            });
          }
        }

        console.error("Order insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save order. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      orderNumber,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order.";
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
