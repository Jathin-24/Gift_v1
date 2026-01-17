import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import AddToCartButton from "@/components/products/AddToCartButton";
import WishlistButton from "@/components/products/WishlistButton";
import { getValidImage, formatPrice, cn } from "@/lib/utils";

import FramePreview from "@/components/products/FramePreview";

import Category from "@/lib/db/models/Category";

// Ensure Category model is registered
const _ = Category;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    await dbConnect();
    const product = await Product.findOne({ slug: params.slug }).populate("category");

    if (!product) {
        notFound();
    }

    const isCustomizable = ["Frames", "Mugs", "Collages"].includes((product.category as any)?.title);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    {isCustomizable ? (
                        <FramePreview
                            productImage={getValidImage(product.images?.[0])}
                            productTitle={product.title}
                            category={product.category?.title}
                            config={product.customizationConfig}
                            price={product.price}
                        />
                    ) : (
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary transition-colors">
                            <Image
                                src={getValidImage(product.images?.[0])}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img: string, i: number) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-secondary cursor-pointer hover:opacity-80 transition-all border border-transparent hover:border-blue-500">
                                <Image src={getValidImage(img)} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase italic text-foreground">{product.title}</h1>
                                <p className="text-3xl font-black text-blue-600 tracking-tight">{formatPrice(product.price)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-8 max-w-none">
                        <p className="text-xl leading-relaxed font-inter font-medium tracking-tight italic">"{product.description}"</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-border">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-3 py-1 rounded-full">Availability</span>
                            <span className="text-sm font-black uppercase text-foreground">{product.stock} units left</span>
                        </div>

                        <AddToCartButton product={{
                            id: product._id.toString(),
                            title: product.title,
                            price: product.price,
                            image: getValidImage(product.images?.[0])
                        }} />

                        <WishlistButton productId={product._id.toString()} />

                        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 bg-secondary border border-border rounded-3xl flex items-center gap-4 group hover:border-blue-500/50 transition-all dark:bg-white">
                                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform dark:bg-zinc-100">
                                    🚚
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight dark:text-black">Free Shipping</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest dark:text-gray-500">Orders over ₹500</p>
                                </div>
                            </div>
                            <div className="p-5 bg-secondary border border-border rounded-3xl flex items-center gap-4 group hover:border-blue-500/50 transition-all dark:bg-white">
                                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-lg dark:bg-zinc-100">
                                    🔒
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight dark:text-black">Secure Payment</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest dark:text-gray-500">Verified in India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

