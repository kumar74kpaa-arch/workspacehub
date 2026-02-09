import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from '@/firebase/admin';

const secret = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

  if (!bookingId) {
    return new NextResponse(JSON.stringify({ error: "Booking ID is required." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const bookingDocRef = adminDb.collection('bookings').doc(bookingId);

    if (expectedSignature === razorpay_signature) {
      // Signature is valid. Update the booking in Firestore.
      await bookingDocRef.update({
        status: "confirmed",
        paymentStatus: "paid",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
      
      return NextResponse.json({ status: "ok", message: "Payment verified and booking confirmed." });

    } else {
      // Invalid signature. Mark booking as failed.
      await bookingDocRef.update({
        paymentStatus: "failed",
        status: "cancelled",
      });

      return new NextResponse(JSON.stringify({ error: "Invalid signature." }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error verifying payment or updating booking:", error);
    // Try to mark booking as failed if an error occurs.
    if (bookingId) {
        try {
            const bookingDocRef = adminDb.collection('bookings').doc(bookingId);
            await bookingDocRef.update({ paymentStatus: "failed" });
        } catch (updateError) {
            console.error("Failed to update booking status to failed:", updateError);
        }
    }

    return new NextResponse(JSON.stringify({ error: "Internal server error." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
