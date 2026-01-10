import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Product from "@/lib/db/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).populate("wishlist");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.wishlist || []);
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

        const { productId } = await req.json();
        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Robust check for string vs ObjectId equality
        const isWishlisted = user.wishlist?.some((id: any) => id.toString() === productId);

        if (isWishlisted) {
            user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        return NextResponse.json({
            message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            isWishlisted: !isWishlisted
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
