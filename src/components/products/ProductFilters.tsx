"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
    _id: string;
    title: string;
    slug: string;
}

export default function ProductFilters({ categories }: { categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "all") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const activeCategory = searchParams.get("category") || "all";
    const activeSort = searchParams.get("sort") || "newest";

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end justify-between w-full">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => router.push("/products?" + createQueryString("category", "all"))}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === "all"
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                        : "bg-secondary text-muted-foreground border-border hover:border-blue-600"
                        }`}
                >
                    All Products
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => router.push("/products?" + createQueryString("category", cat.slug))}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat.slug
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                            : "bg-secondary text-muted-foreground border-border hover:border-blue-600"
                            }`}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                <select
                    value={activeSort}
                    onChange={(e) => router.push("/products?" + createQueryString("sort", e.target.value))}
                    className="px-6 py-3 border rounded-2xl bg-secondary text-[10px] font-black uppercase tracking-widest outline-none transition-all border-border hover:border-blue-600 cursor-pointer"
                >
                    <option value="newest">Sort: New Arrivals</option>
                    <option value="price-asc">Price: Lowest First</option>
                    <option value="price-desc">Price: Highest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                </select>
            </div>
        </div>
    );
}
