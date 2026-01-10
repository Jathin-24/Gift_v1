import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const userId = session.user.id;

        console.log("--- START PROFILE UPDATE ---");
        console.log("User ID from Session:", userId);
        console.log("Payload Received:", JSON.stringify(data, null, 2));

        await dbConnect();

        // Find the user first to verify they exist and see current state
        const user = await User.findById(userId);

        if (!user) {
            console.error("User not found in DB with ID:", userId);
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log("Found User in DB. Current Phone:", user.phone);

        // Explicitly set the fields to ensure Mongoose tracks the changes
        // Using direct assignment instead of findByIdAndUpdate to be 100% sure
        if (data.name) user.name = data.name;
        if (data.phone) user.phone = data.phone;

        if (data.address) {
            user.address = {
                line1: data.address.line1 || user.address?.line1,
                city: data.address.city || user.address?.city,
                state: data.address.state || user.address?.state,
                postalCode: data.address.postalCode || user.address?.postalCode,
                country: data.address.country || user.address?.country || "India",
            };
        }

        // Mark as modified just in case
        user.markModified('address');
        user.markModified('phone');
        user.markModified('name');

        console.log("Saving user changes...");
        const updatedUser = await user.save();
        console.log("User saved successfully. New Data:", JSON.stringify(updatedUser, null, 2));
        console.log("--- END PROFILE UPDATE ---");

        // Return the updated user without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        return NextResponse.json(userResponse);
    } catch (error: any) {
        console.error("Profile update CRITICAL error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
