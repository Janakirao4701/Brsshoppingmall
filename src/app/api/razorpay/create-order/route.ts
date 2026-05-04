import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
        { status: 500 }
      );
    }

    const body = await request.json();
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
    } = body;

    if (!amount || !customerName || !customerPhone || !shippingAddress || !items) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Generate order number
    const orderNumber = `BSR-${Date.now().toString(36).toUpperCase()}`;

    // Create Razorpay order
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: orderNumber,
      notes: {
        customer_name: customerName,
        customer_phone: customerPhone,
        order_number: orderNumber,
      },
    });

    // Save order to database with pending payment status
    if (supabase) {
      await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState || "Andhra Pradesh",
        shipping_pincode: shippingPincode,
        items,
        subtotal,
        shipping_cost: shippingCost,
        total: amount,
        payment_method: "razorpay",
        payment_status: "pending",
        razorpay_order_id: razorpayOrder.id,
        order_status: "pending",
      });
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      orderNumber,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
    });
  } catch (error: any) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order." },
      { status: 500 }
    );
  }
}
