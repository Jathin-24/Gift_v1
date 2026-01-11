"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Users, Package, ArrowLeft, Tags, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && session?.user && session.user.role !== "admin")) {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black uppercase tracking-widest text-[10px]">Loading Admin...</p>
            </div>
        </div>
    );

    if (status === "authenticated" && session?.user?.role !== "admin") {
        return null; // Brief exit while redirection happens
    }

    const navLinks = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/categories", label: "Categories", icon: Tags },
        { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { href: "/admin/users", label: "Customers", icon: Users },
    ];

    return (
        <div className="flex min-h-screen bg-secondary/50 transition-colors relative">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Admin Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                md:sticky md:top-0 md:h-screen md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter italic uppercase text-foreground">Admin <span className="text-blue-500">Center</span></h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Version 1.1.0</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-secondary rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-border mt-auto">
                    <Link href="/" className="flex items-center gap-3 px-5 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all hover:bg-secondary rounded-xl">
                        <ArrowLeft className="w-4 h-4" />
                        Main Shop
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow w-full md:w-auto">
                {/* Mobile Toggle Bar */}
                <div className="md:hidden p-4 bg-background border-b border-border flex items-center gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-secondary rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-black uppercase tracking-tighter text-sm">Admin Menu</span>
                </div>

                <div className="p-4 md:p-10 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
