"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Category {
    _id: string;
    title: string;
    slug: string;
}

export default function ProductFilters({ categories }: { categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const sortOptions = [
        { value: "newest", label: "Sort: New Arrivals" },
        { value: "price-asc", label: "Price: Lowest First" },
        { value: "price-desc", label: "Price: Highest First" },
        { value: "oldest", label: "Sort: Oldest First" },
    ];

    const currentSortLabel = sortOptions.find(o => o.value === activeSort)?.label || "Sort Products";

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-6 py-3 border rounded-2xl bg-secondary dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest outline-none transition-all border-border hover:border-blue-600 min-w-[200px] justify-between"
                >
                    {currentSortLabel}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full min-w-[220px] bg-card dark:bg-zinc-900 border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    router.push("/products?" + createQueryString("sort", option.value));
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white flex items-center justify-between group ${activeSort === option.value ? "bg-secondary text-blue-600" : "text-muted-foreground"
                                    }`}
                            >
                                {option.label}
                                {activeSort === option.value && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
