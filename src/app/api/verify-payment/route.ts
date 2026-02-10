
import { NextResponse } from "next/server";
import crypto from "crypto";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
  } else {
      console.error("Firebase admin initialization failed: Missing environment variables.");
  }
}

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
     if (!admin.apps.length) {
        console.error("Firebase admin is not initialized.");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    const db = getFirestore();
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

    if (!bookingId) {
        return NextResponse.json({ error: "Booking ID is missing" }, { status: 400 });
    }
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await db.collection("bookings").doc(bookingId).update({
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "confirmed",
    });

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
