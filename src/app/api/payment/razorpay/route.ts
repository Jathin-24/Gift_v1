import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!process.env.RAZORPAY_KEY_ID) {
            return NextResponse.json({ message: "Razorpay keys not configured" }, { status: 500 });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in paisa, must be integer
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        return NextResponse.json({ message: "Payment initialization failed" }, { status: 500 });
    }
}
