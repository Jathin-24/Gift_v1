import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ title: 1 });
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const category = await Category.create(data);
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
