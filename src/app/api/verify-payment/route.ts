import { NextResponse } from "next/server";
import crypto from "crypto";

const secret = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Signature is valid.
      // In a fully-fledged backend system, you would update the database here.
      // For this setup, we confirm validity to the client, which then updates the DB.
      return NextResponse.json({ status: "ok", message: "Payment verified successfully." });
    } else {
      return new NextResponse(JSON.stringify({ error: "Invalid signature." }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
