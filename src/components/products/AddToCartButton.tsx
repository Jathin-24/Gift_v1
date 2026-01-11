"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
    product: {
        id: string;
        title: string;
        price: number;
        image: string;
    };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        if (!session) {
            router.push("/login");
            return;
        }

        addItem({ ...product, quantity: 1 });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${added
                ? "bg-green-600 text-white scale-[0.98] shadow-green-600/20"
                : "bg-foreground text-background dark:bg-white dark:text-black hover:opacity-90 shadow-black/5"
                }`}
        >
            {added ? (
                <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                </>
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                </>
            )}
        </button>
    );
}
