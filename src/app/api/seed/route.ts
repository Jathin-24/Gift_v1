import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";

const sampleCategories = [
    {
        title: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and tech accessories.",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    },
    {
        title: "Lifestyle",
        slug: "lifestyle",
        description: "Premium items for your daily life.",
        image: "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&q=80",
    },
    {
        title: "Home & Decor",
        slug: "home-decor",
        description: "Elegant pieces for your living space.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    },
];

const sampleProducts = (electronicsId: string, lifestyleId: string, homeId: string) => [
    {
        title: "Minimalist Watch",
        slug: "minimalist-watch",
        description: "A sleek, minimalist watch for everyday wear. Featuring a genuine leather strap and stainless steel case.",
        price: 129.99,
        images: ["https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: lifestyleId,
        featured: true,
        stock: 50,
    },
    {
        title: "Premium Wireless Headphones",
        slug: "wireless-headphones",
        description: "Experience studio-quality sound with our noise-cancelling wireless headphones. 40-hour battery life.",
        price: 299.99,
        images: ["https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: electronicsId,
        featured: true,
        stock: 25,
    },
    {
        title: "Executive Desk Lamp",
        slug: "desk-lamp",
        description: "Elegant adjustable LED desk lamp with multiple brightness levels and USB charging port.",
        price: 89.99,
        images: ["https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: homeId,
        featured: false,
        stock: 100,
    },
];

export async function GET() {
    try {
        await dbConnect();

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});

        // Add categories
        const categories = await Category.insertMany(sampleCategories);

        const electronics = categories.find(c => c.slug === "electronics")?._id;
        const lifestyle = categories.find(c => c.slug === "lifestyle")?._id;
        const home = categories.find(c => c.slug === "home-decor")?._id;

        // Add products
        const products = await Product.insertMany(sampleProducts(electronics, lifestyle, home));

        return NextResponse.json({
            message: "Database seeded successfully",
            categoriesCount: categories.length,
            productsCount: products.length
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
