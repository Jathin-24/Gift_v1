import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Basic slug generation if not provided
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }

        // Clean empty category
        if (data.category === "") {
            delete data.category;
        }

        const product = await Product.create(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
