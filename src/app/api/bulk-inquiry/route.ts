import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, email, product_category, quantity, message } = body;

    // Validate required fields
    if (!name || !phone || !product_category || !quantity) {
      return NextResponse.json(
        { error: "Name, phone, category, and quantity are required." },
        { status: 400 }
      );
    }

    if (quantity < 10) {
      return NextResponse.json(
        { error: "Minimum quantity for bulk orders is 10 pieces." },
        { status: 400 }
      );
    }

    // If Supabase is configured, store in database
    if (supabase) {
      const { error } = await supabase.from("bulk_inquiries").insert({
        name,
        phone,
        email: email || null,
        product_category,
        quantity,
        message: message || null,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to submit inquiry. Please try again." },
          { status: 500 }
        );
      }
    } else {
      // Log locally when Supabase is not configured
      console.log("📦 Bulk Order Inquiry (local):", {
        name,
        phone,
        email,
        product_category,
        quantity,
        message,
      });
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
