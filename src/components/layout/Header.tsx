"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAdminStore } from "@/store/useAdminStore";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAdminMode, toggleAdminMode } = useAdminStore();
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase group">
                        Store<span className="text-blue-600 group-hover:animate-pulse">.</span>
                    </Link>

                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <ThemeToggle />

                    {session?.user.role === "admin" && (
                        <button
                            onClick={toggleAdminMode}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border-2 group ${isAdminMode
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                                    : 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                                }`}
                            title={isAdminMode ? "Exit Admin Focus" : "Enter Admin Focus"}
                        >
                            <ShieldCheck className={`w-4 h-4 transition-transform ${isAdminMode ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline-block">
                                {isAdminMode ? 'Admin Active' : 'Enable Admin'}
                            </span>
                        </button>
                    )}

                    {!isAdminMode && (
                        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                            <Link href="/products" className="text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">
                                Products
                            </Link>
                            <Link href="/categories" className="text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">
                                Collections
                            </Link>
                        </nav>
                    )}

                    {(!isAdminMode && session) && (
                        <Link href="/cart" className="relative p-3 hover:bg-secondary rounded-2xl transition-all border border-transparent hover:border-border group">
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {session ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            {session.user.role === "admin" && (
                                <Link href="/admin" className="p-3 text-blue-600 hover:bg-secondary rounded-2xl transition-all border border-transparent hover:border-border group" title="Admin Panel">
                                    <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>
                            )}
                            {!isAdminMode && (
                                <Link href="/profile" className="p-3 hover:bg-secondary rounded-2xl transition-all border border-transparent hover:border-border group" title="My Profile">
                                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="hidden md:block p-3 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-500/20 group"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-foreground text-background text-[11px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-black/5"
                        >
                            Log In
                        </Link>
                    )}

                    <button
                        className="md:hidden p-3 hover:bg-secondary rounded-2xl transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl bg-background/95">
                    <Link href="/products" className="text-xs font-black uppercase tracking-[0.2em] py-4 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link href="/categories" className="text-xs font-black uppercase tracking-[0.2em] py-4 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Collections</Link>
                    {session ? (
                        <>
                            {session.user.role === "admin" && (
                                <Link href="/admin" className="text-xs font-black uppercase tracking-[0.2em] py-4 border-b border-border/50 text-blue-600" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                            )}
                            <Link href="/profile" className="text-xs font-black uppercase tracking-[0.2em] py-4 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                            <button
                                onClick={() => signOut()}
                                className="text-xs font-black uppercase tracking-[0.2em] py-4 text-red-600 text-left"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="text-xs font-black uppercase tracking-[0.2em] py-4 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    )}
                </div>
            )}
        </header>
    );
}
