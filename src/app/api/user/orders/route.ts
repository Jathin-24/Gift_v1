import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        console.log("Creating Order in DB with Payload:", JSON.stringify(data, null, 2));

        await dbConnect();

        // Create new order in MongoDB
        const newOrder = await Order.create({
            user: session.user.id,
            items: data.items,
            total: data.total,
            shippingAddress: {
                name: data.shippingAddress.name,
                email: data.shippingAddress.email,
                phone: data.shippingAddress.phone, // Adding phone here
                address: data.shippingAddress.address,
                city: data.shippingAddress.city,
                state: data.shippingAddress.state,
                postalCode: data.shippingAddress.postalCode,
                country: data.shippingAddress.country || "India",
            },
            paymentStatus: data.paymentStatus || "paid",
            status: "processing"
        });

        console.log("Order successfully persisted to MongoDB:", newOrder._id);

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
        console.error("Order persistence CRITICAL error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
