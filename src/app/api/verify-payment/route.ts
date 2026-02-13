import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/firebase/admin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = await req.json();

    console.log(`[RAZORPAY_VERIFY] Received bookingId: ${bookingId} for amount: ${amount}`);

    // Validate bookingId
    if (!bookingId || typeof bookingId !== 'string' || bookingId.includes('/')) {
        console.error("[RAZORPAY_VERIFY_ERROR] Invalid bookingId received:", bookingId);
        return new NextResponse("Invalid Booking ID", { status: 400 });
    }
    
    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
        console.error("[RAZORPAY_VERIFY_ERROR] Invalid amount received:", amount);
        return new NextResponse("Invalid Amount", { status: 400 });
    }

    // HMAC Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[RAZORPAY_VERIFY_ERROR] Invalid signature.");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Update Firestore document
    const bookingRef = adminDb.collection("bookings").doc(bookingId);
    
    await bookingRef.update({
      paymentStatus: "paid",
      status: "confirmed",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paidAmount: amount / 100, // Save amount in rupees
    });
    
    console.log(`[RAZORPAY_VERIFY] Successfully updated booking: ${bookingId} with paid amount: ${amount / 100}`);

    return NextResponse.json({ status: "ok" });

  } catch (error: any) {
    console.error("[RAZORPAY_VERIFY_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
