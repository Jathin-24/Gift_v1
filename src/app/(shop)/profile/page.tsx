"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User, MapPin, Package, Heart, LogOut, Edit2, ShieldCheck, Loader2, Phone, ArrowRight, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { getValidImage, formatPrice } from "@/lib/utils";

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: {
        line1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

interface Order {
    _id: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);

    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        phone: "",
        address: {
            line1: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
        },
    });

    useEffect(() => {
        if (status === "authenticated") {
            fetchProfile();
            fetchOrders();
            fetchWishlist();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/auth/profile?t=" + Date.now(), {
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: {
                        line1: data.address?.line1 || "",
                        city: data.address?.city || "",
                        state: data.address?.state || "",
                        postalCode: data.address?.postalCode || "",
                        country: data.address?.country || "India",
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/user/orders?t=" + Date.now());
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await fetch("/api/user/wishlist?t=" + Date.now());
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(profile.phone)) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        if (!/^\d{6}$/.test(profile.address.postalCode)) {
            alert("Please enter a valid 6-digit PIN code");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                await update({ name: profile.name });
                setIsEditing(false);
                fetchProfile();
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            alert("Operation failed due to network error");
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setProfile((prev: any) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setProfile((prev) => ({ ...prev, [name]: value }));
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse text-foreground">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="container mx-auto px-4 py-32 text-center text-foreground">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                    <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">Access Denied</h1>
                <p className="text-muted-foreground mb-8 font-medium">Please sign in to view your profile.</p>
                <Link href="/login" className="px-10 py-4 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl">Login Now</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 text-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-card border-2 border-border p-8 rounded-[2.5rem] shadow-xl shadow-black/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all" />
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 border-4 border-background shadow-lg overflow-hidden">
                                <span className="text-4xl font-black italic text-blue-600 uppercase">
                                    {(session?.user?.name?.[0] || profile.name?.[0] || 'U')}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-center">{session?.user?.name || profile.name}</h2>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 bg-blue-600/10 px-4 py-1.5 rounded-full border border-blue-600/20">Verified</p>
                        </div>
                    </div>

                    <nav className="bg-card border-2 border-border rounded-[2.5rem] p-4 flex flex-col gap-2 shadow-xl shadow-black/5">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all ${activeTab === "profile" ? "bg-foreground text-background" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all ${activeTab === "orders" ? "bg-foreground text-background" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}
                        >
                            <Package className="w-4 h-4" />
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("wishlist")}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all ${activeTab === "wishlist" ? "bg-foreground text-background" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}
                        >
                            <Heart className="w-4 h-4" />
                            Wishlist
                        </button>
                        <hr className="my-2 border-border" />
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-tighter text-xs text-red-500 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === "profile" && (
                        <div className="bg-card border-2 border-border rounded-[3rem] p-12 shadow-2xl shadow-black/5 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter underline decoration-blue-500 underline-offset-8">Profile</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-6">Review your account details</p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-3 px-8 py-4 bg-secondary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-md group border border-border"
                                    >
                                        <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                            <input
                                                name="name"
                                                value={profile.name}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                                                    <span className="text-xs font-black text-muted-foreground">+91</span>
                                                </div>
                                                <input
                                                    name="phone"
                                                    value={profile.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-20 pr-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                                    placeholder="10-digit number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10 pt-8 border-t border-border">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight italic text-blue-500">Address Details</h3>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Default shipping address</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shipping Address</label>
                                            <input
                                                name="address.line1"
                                                value={profile.address.line1}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                                placeholder="Street, Building, Area"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                                <input
                                                    name="address.city"
                                                    value={profile.address.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</label>
                                                <input
                                                    name="address.state"
                                                    value={profile.address.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">PIN Code</label>
                                                <input
                                                    name="address.postalCode"
                                                    value={profile.address.postalCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                                    placeholder="6 digits"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-8">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-grow py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-10 py-5 bg-secondary text-foreground rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-red-500 hover:text-white transition-all shadow-md border border-border"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-6 p-6 bg-secondary rounded-[2rem] border border-border/50">
                                                <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center shadow-sm">
                                                    <User className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Full Name</p>
                                                    <p className="text-xl font-black uppercase tracking-tight">{profile.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 p-6 bg-secondary rounded-[2rem] border border-border/50">
                                                <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center shadow-sm">
                                                    <Phone className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Mobile Number</p>
                                                    <p className="text-xl font-black uppercase tracking-tight">{profile.phone ? `+91 ${profile.phone}` : "Not Linked"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-secondary rounded-[2.5rem] border border-border/50 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <MapPin className="w-5 h-5 text-blue-600" />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Default Address</h3>
                                                </div>
                                                {profile.address.line1 ? (
                                                    <div className="space-y-4">
                                                        <p className="text-lg font-black uppercase leading-tight italic">{profile.address.line1}</p>
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                                            {profile.address.city}, {profile.address.state} <br />
                                                            India - {profile.address.postalCode}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs font-bold text-muted-foreground italic uppercase">No address saved yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="p-6 bg-blue-600/5 border border-blue-600/10 rounded-3xl flex items-center gap-4 group">
                                        <ShieldCheck className="w-6 h-6 text-blue-600 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/80">
                                            This identity is verified for Indian Secure Transactions.
                                            Data is stored with 256-bit encryption.
                                        </p>
                                    </div> */}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                            <div>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter underline decoration-blue-500 underline-offset-8">Orders</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-6">Track your recent purchases</p>
                            </div>

                            {orders.length === 0 ? (
                                <div className="p-20 text-center bg-card border-2 border-border border-dashed rounded-[3rem]">
                                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No orders found</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order._id} className="bg-card border-2 border-border rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-blue-500/30 transition-all group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-600/10 text-blue-600 border-blue-600/20'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                                                <div className="space-y-2">
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleDateString()} / ID: {order._id.slice(-8).toUpperCase()}</p>
                                                    <div className="flex -space-x-4 mb-4 mt-2">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <div key={idx} className="w-12 h-12 rounded-xl border-2 border-background bg-secondary overflow-hidden shadow-lg">
                                                                <img src={getValidImage(item.image)} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-xl border-2 border-background bg-foreground text-background flex items-center justify-center text-[10px] font-black shadow-lg">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col justify-end">
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
                                                    <p className="text-3xl font-black italic tracking-tighter">{formatPrice(order.total)}</p>
                                                </div>
                                            </div>
                                            <button className="w-full mt-8 py-4 bg-secondary group-hover:bg-blue-600 group-hover:text-white rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-3 border border-border/50">
                                                View Order Details
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "wishlist" && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                            <div>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter underline decoration-blue-500 underline-offset-8">Wishlist</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-6">Review your saved items</p>
                            </div>

                            {wishlist.length === 0 ? (
                                <div className="p-20 text-center bg-card border-2 border-border border-dashed rounded-[3rem]">
                                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Your wishlist is empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {wishlist.map((product) => (
                                        <div key={product._id} className="bg-card border-2 border-border rounded-[2.5rem] p-6 flex gap-6 group hover:shadow-2xl transition-all border-border">
                                            <div className="w-24 h-24 bg-secondary rounded-2xl overflow-hidden flex-shrink-0 border border-border/50">
                                                <Image src={getValidImage(product.images?.[0])} alt={product.title} width={100} height={100} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-tight line-clamp-1">{product.title}</h3>
                                                    <p className="text-lg font-black italic tracking-tight text-blue-600 mt-1">{formatPrice(product.price)}</p>
                                                </div>
                                                <Link href={`/products/${product.slug}`} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground underline decoration-blue-500/30 underline-offset-4 transition-all">
                                                    Buy Now →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
