import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getValidImage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    await dbConnect();
    const categories = await Category.find({}).sort({ title: 1 });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic underline decoration-blue-600 underline-offset-8">Shop by Category</h1>
                <p className="text-muted-foreground mt-2 font-medium">Explore our products organized by collection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${category.slug}`}
                        className="group relative h-80 rounded-3xl overflow-hidden bg-secondary border border-border shadow-sm hover:shadow-xl transition-all"
                    >
                        <Image
                            src={getValidImage(category.image)}
                            alt={category.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{category.title}</h2>
                            {category.description && (
                                <p className="text-sm text-gray-300 font-medium mb-4 line-clamp-2 italic">
                                    "{category.description}"
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs group-hover:text-blue-300 transition-colors">
                                View Collection
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-24 bg-secondary rounded-3xl border border-border">
                    <p className="text-muted-foreground mb-4 font-bold uppercase tracking-widest">No categories available.</p>
                    <Link href="/api/seed" className="text-blue-500 font-bold hover:underline">Seed database</Link>
                </div>
            )}
        </div>
    );
}
