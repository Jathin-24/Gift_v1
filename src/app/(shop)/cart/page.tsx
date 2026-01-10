"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { getValidImage, formatPrice } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCartStore();

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter italic">Your Bag is empty</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto font-medium">
                    Looks like you haven't added anything to your cart yet.
                    Start exploring our collection and find something you love.
                </p>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-all uppercase tracking-tight"
                >
                    Browse Products
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black mb-12 tracking-tighter uppercase italic">My Shopping Bag</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-6 p-6 bg-card border border-border rounded-3xl group transition-all hover:shadow-md"
                        >
                            <div className="relative w-32 h-32 flex-shrink-0 bg-secondary rounded-2xl overflow-hidden">
                                <Image src={getValidImage(item.image)} alt={item.title} fill className="object-cover" />
                            </div>

                            <div className="flex-grow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 font-medium">Express Delivery</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3 bg-secondary p-1 rounded-full border border-border">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center bg-background hover:bg-secondary rounded-full transition-all shadow-sm"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center font-black text-sm text-foreground">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-background hover:bg-secondary rounded-full transition-all shadow-sm"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <p className="text-xl font-black text-foreground">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary border border-border rounded-3xl p-8 sticky top-24 transition-colors">
                        <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-muted-foreground font-medium">
                                <span>Subtotal</span>
                                <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground font-medium">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-foreground">
                                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                                    Add {formatPrice(500 - subtotal)} more for FREE delivery
                                </p>
                            )}
                        </div>

                        <div className="pt-8 border-t border-border mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-black uppercase tracking-tight">Total Amount</span>
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground underline uppercase tracking-widest decoration-blue-500 font-bold">Inclusive of taxes</p>
                                    <p className="text-3xl font-black tracking-tighter text-foreground">{formatPrice(total)}</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="w-full py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-black/5 group"
                        >
                            Checkout Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 grayscale opacity-50 dark:invert">
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Payments</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

