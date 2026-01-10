"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WishlistButton({ productId }: { productId: string }) {
    const { data: session } = useSession();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchWishlistStatus();
        }
    }, [session]);

    const fetchWishlistStatus = async () => {
        try {
            const res = await fetch("/api/user/wishlist");
            if (res.ok) {
                const wishlist = await res.json();
                setIsWishlisted(wishlist.some((p: any) => p._id === productId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleWishlist = async () => {
        if (!session) {
            alert("Please login to use your wishlist node.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (res.ok) {
                const data = await res.json();
                setIsWishlisted(data.isWishlisted);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={`w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${isWishlisted
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-secondary text-foreground border-border hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                }`}
        >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            {isWishlisted ? "In Matrix" : "Add to Wishlist"}
        </button>
    );
}
