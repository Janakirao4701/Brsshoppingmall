import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_number } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay not configured." }, { status: 500 });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      // Mark payment as failed
      if (supabase && order_number) {
        await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("order_number", order_number);
      }

      return NextResponse.json({ error: "Invalid payment signature.", verified: false }, { status: 400 });
    }

    // Payment verified — update order
    if (supabase && order_number) {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "confirmed",
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq("order_number", order_number);
    }

    return NextResponse.json({
      verified: true,
      message: "Payment verified successfully.",
      orderNumber: order_number,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed." },
      { status: 500 }
    );
  }
}
