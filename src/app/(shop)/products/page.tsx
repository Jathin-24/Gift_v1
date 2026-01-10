import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import { getValidImage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    await dbConnect();

    let query = {};
    let categoryTitle = "Inventory Collection";

    if (searchParams.category) {
        const categoryDoc = await Category.findOne({ slug: searchParams.category });
        if (categoryDoc) {
            query = { category: categoryDoc._id };
            categoryTitle = categoryDoc.title;
        }
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic underline decoration-blue-600 underline-offset-8">{categoryTitle}</h1>
                    <p className="text-muted-foreground mt-4 font-bold uppercase text-[10px] tracking-[0.2em]">Curated High-Performance Modules</p>
                </div>
                <div className="flex gap-4">
                    <select className="px-6 py-3 border rounded-2xl bg-secondary text-[10px] font-black uppercase tracking-widest outline-none transition-all border-border hover:border-blue-600 cursor-pointer">
                        <option>Filtered: New Arrivals</option>
                        <option>Price: Ascending</option>
                        <option>Price: Descending</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {products.map((product) => (
                    <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className="group"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-secondary mb-6 border border-border group-hover:border-blue-600 transition-colors">
                            <Image
                                src={getValidImage(product.images?.[0])}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {product.featured && (
                                <span className="absolute top-6 left-6 bg-background/90 dark:bg-black/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase shadow-2xl border border-white/10">
                                    Featured
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-black group-hover:text-blue-600 transition-colors uppercase tracking-tight mb-2">{product.title}</h3>
                        <p className="text-muted-foreground text-xs line-clamp-1 mb-4 font-bold italic opacity-70">"{product.description}"</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black text-foreground italic tracking-tighter">${product.price.toFixed(2)}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Full Specs →</span>
                        </div>
                    </Link>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-32 bg-secondary/50 rounded-[3.5rem] border-2 border-dashed border-border">
                    <p className="text-muted-foreground mb-6 font-black uppercase tracking-[0.3em] text-xs underline decoration-red-500/30 underline-offset-8">No Modules Registered</p>
                    <Link href="/products" className="px-10 py-4 bg-foreground text-background font-black uppercase tracking-widest text-[10px] rounded-full hover:opacity-90 transition-all shadow-xl">Reset Filter</Link>
                </div>
            )}
        </div>
    );
}
