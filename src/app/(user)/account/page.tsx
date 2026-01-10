"use client";

import { useSession, signOut } from "next-auth/react";
import { User, Package, Heart, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-24 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-4">
                    <div className="p-6 bg-gray-50 rounded-3xl mb-8">
                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-black/20">
                            {session?.user?.name?.[0].toUpperCase()}
                        </div>
                        <h2 className="font-bold text-lg">{session?.user?.name}</h2>
                        <p className="text-sm text-gray-500">{session?.user?.email}</p>
                    </div>

                    <nav className="space-y-1">
                        <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-black text-white rounded-2xl font-semibold transition-all shadow-lg shadow-black/10">
                            <User className="w-5 h-5" />
                            Profile
                        </Link>
                        <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl font-semibold transition-all group">
                            <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Orders
                        </Link>
                        <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl font-semibold transition-all group">
                            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Wishlist
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl font-semibold transition-all mt-4 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-grow">
                    <h1 className="text-4xl font-extrabold mb-8 italic tracking-tighter decoration-blue-500 underline underline-offset-8">Account Profile</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">Personal Information</h3>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400">Full Name</p>
                                <p className="font-bold">{session?.user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400">Email Address</p>
                                <p className="font-bold">{session?.user?.email}</p>
                            </div>
                            <button className="pt-4 text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 group">
                                Edit profile
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">Recent Order</h3>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-sm">#ORD-2024-001</p>
                                    <p className="text-xs text-gray-500 mt-1">Status: <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Processing</span></p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                            <button className="pt-4 text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 group">
                                View all orders
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
