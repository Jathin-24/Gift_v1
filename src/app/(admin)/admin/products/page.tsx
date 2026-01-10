import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Link from "next/link";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Image from "next/image";
import { getValidImage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase text-foreground underline decoration-blue-500 underline-offset-8">Inventory Management</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10"
                >
                    <Plus className="w-4 h-4" />
                    New Product
                </Link>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-border flex items-center gap-4 bg-secondary/30">
                    <div className="flex-grow flex items-center gap-3 px-5 py-3 bg-secondary rounded-2xl border border-border">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filter by title, slug, or price..."
                            className="bg-transparent outline-none text-sm w-full font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-[10px] uppercase tracking-widest font-black">
                                <th className="px-8 py-5">Product</th>
                                <th className="px-8 py-5">Price</th>
                                <th className="px-8 py-5">Inventory</th>
                                <th className="px-8 py-5">Visibility</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.map((product) => (
                                <tr key={product._id} className="text-sm group hover:bg-secondary/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-secondary border border-border shadow-sm">
                                                <Image src={getValidImage(product.images?.[0])} alt={product.title} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground uppercase tracking-tight">{product.title}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold tracking-wider">/{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-base text-foreground">${product.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-bold uppercase text-[10px] tracking-widest ${product.stock < 10 ? 'text-red-500' : 'text-foreground'}`}>
                                                {product.stock} Units
                                            </span>
                                            <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {product.featured ? (
                                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/50">Featured</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-[9px] font-black uppercase tracking-widest border border-border">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/products/${product._id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-black/5"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Configure
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {products.length === 0 && (
                <div className="text-center py-24 bg-card border border-dashed border-border rounded-3xl mt-8">
                    <p className="text-muted-foreground font-black uppercase tracking-widest">Warehouse is empty</p>
                    <Link href="/admin/products/new" className="text-blue-500 font-bold mt-2 inline-block">Initialize Inventory</Link>
                </div>
            )}
        </div>
    );
}
