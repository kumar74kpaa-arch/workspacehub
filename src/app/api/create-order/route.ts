
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const { totalAmount, bookingId, officeId } = await req.json();
    
    if (!totalAmount || totalAmount <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (!bookingId || typeof bookingId !== 'string') {
        return NextResponse.json({ error: "Invalid bookingId" }, { status: 400 });
    }
     if (!officeId || typeof officeId !== 'string') {
        return NextResponse.json({ error: "Invalid officeId" }, { status: 400 });
    }

    const options: any = {
      amount: Math.round(totalAmount * 100), // convert to paise and round to integer
      currency: "INR",
      notes: {
          bookingId: bookingId,
          officeId: officeId
      }
    };
    
    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("[RAZORPAY_CREATE_ORDER_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
