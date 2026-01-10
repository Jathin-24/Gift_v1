"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Users, Package, ArrowLeft, Tags } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && session?.user && session.user.role !== "admin")) {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black uppercase tracking-widest text-[10px]">Verifying Authority...</p>
            </div>
        </div>
    );

    if (status === "authenticated" && session?.user?.role !== "admin") {
        return null; // Brief exit while redirection happens
    }

    return (
        <div className="flex min-h-screen bg-secondary/50 transition-colors">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0 h-screen transition-colors">
                <div className="p-8">
                    <h2 className="text-xl font-black tracking-tighter italic uppercase text-foreground">Admin <span className="text-blue-500">Center</span></h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Version 1.1.0</p>
                </div>

                <nav className="flex-grow px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-5 py-3.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl font-black uppercase tracking-tighter text-xs transition-all">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-5 py-3.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl font-black uppercase tracking-tighter text-xs transition-all">
                        <Package className="w-4 h-4" />
                        Inventory
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-5 py-3.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl font-black uppercase tracking-tighter text-xs transition-all">
                        <Tags className="w-4 h-4" />
                        Categories
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-5 py-3.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl font-black uppercase tracking-tighter text-xs transition-all">
                        <ShoppingCart className="w-4 h-4" />
                        Orders
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-5 py-3.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-2xl font-black uppercase tracking-tighter text-xs transition-all">
                        <Users className="w-4 h-4" />
                        Customers
                    </Link>
                </nav>

                <div className="p-6 border-t border-border">
                    <Link href="/" className="flex items-center gap-3 px-5 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        Main Shop
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
