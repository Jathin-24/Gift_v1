"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    User, MapPin, Phone, Mail, Loader2, Save, UserCircle,
    Edit3, X, Map, ShoppingBag, Heart, Package, ArrowRight,
    Search, ExternalLink, Trash2, ShieldCheck, AlertCircle,
    Globe, Landmark
} from "lucide-react";
import { getValidImage } from "@/lib/utils";

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: {
            line1: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
        },
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchAllData();
        }
    }, [status]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Using a timestamp to bypass any aggressive client-side caching
            const timestamp = Date.now();
            const [profileRes, ordersRes, wishlistRes] = await Promise.all([
                fetch(`/api/auth/profile?t=${timestamp}`, { cache: 'no-store' }),
                fetch(`/api/user/orders?t=${timestamp}`, { cache: 'no-store' }),
                fetch(`/api/user/wishlist?t=${timestamp}`, { cache: 'no-store' })
            ]);

            if (profileRes.ok) {
                const data = await profileRes.json();
                console.log("Latest Profile Data from DB:", data);
                setUserData(data);
                setFormData({
                    name: data.name || "",
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

            if (ordersRes.ok) setOrders(await ordersRes.json());
            if (wishlistRes.ok) setWishlist(await wishlistRes.json());

        } catch (error) {
            console.error("Data retrieval failure:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        if (!formData.phone.trim()) newErrors.phone = "Mobile Number is required";
        if (!formData.address.line1.trim()) newErrors.line1 = "Address Details are required";
        if (!formData.address.city.trim()) newErrors.city = "City is required";
        if (!formData.address.state.trim()) newErrors.state = "State is required";
        if (!formData.address.postalCode.trim()) newErrors.postalCode = "PIN Code is required";
        if (!formData.address.country.trim()) newErrors.country = "Country is required";

        const phoneRegex = /^[6-9]\d{9}$/;
        const pinRegex = /^[1-9][0-9]{5}$/;

        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = "Enter a valid 10-digit Indian mobile number";
        }
        if (formData.address.postalCode && !pinRegex.test(formData.address.postalCode.replace(/\s+/g, ''))) {
            newErrors.postalCode = "Enter a valid 6-digit PIN code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form validation failed:", errors);
            return;
        }

        setSaving(true);
        console.log("Submitting Profile Update:", formData);

        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const updatedUser = await res.json();
            console.log("API Response for Profile Update:", updatedUser);

            if (res.ok) {
                // Force a session update
                await update({ name: formData.name });
                // Re-fetch everything to ensure state is in sync
                await fetchAllData();
                setIsEditing(false);
                alert("Profile and Contact details saved successfully!");
            } else {
                alert(`Save Failed: ${updatedUser.message || "Please check console"}`);
            }
        } catch (error) {
            console.error("Critical submission error:", error);
            alert("Network connection failed while saving.");
        } finally {
            setSaving(false);
        }
    };

    const toggleWishlist = async (productId: string) => {
        try {
            const res = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) fetchAllData();
        } catch (error) {
            console.error(error);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse text-foreground">Syncing Indian Registry...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20 max-w-6xl">
            {/* Header / Identity */}
            <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-30"></div>
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="relative group/avatar">
                        <div className="w-36 h-36 bg-secondary rounded-[3rem] flex items-center justify-center border-4 border-background shadow-2xl overflow-hidden">
                            <UserCircle className="w-24 h-24 text-muted-foreground group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute -bottom-2 -right-2 p-4 bg-foreground text-background rounded-[1.5rem] shadow-xl hover:scale-110 transition-all border-4 border-background"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Authenticated Account</p>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 text-foreground">{userData?.name}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-4 py-2 bg-secondary rounded-full flex items-center gap-2 border border-border text-[11px] font-bold">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {userData?.email}
                            </span>
                            <span className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-full flex items-center gap-2 border border-blue-500/20 text-[11px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5" /> {userData?.role} User
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 relative z-10">
                    <div className="bg-secondary/50 backdrop-blur-md p-6 px-10 rounded-[2rem] border border-border text-center min-w-[140px] hover:border-blue-500/50 transition-colors">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-[0.2em]">Orders</p>
                        <p className="text-3xl font-black italic">{orders.length}</p>
                    </div>
                    <div className="bg-secondary/50 backdrop-blur-md p-6 px-10 rounded-[2rem] border border-border text-center min-w-[140px] hover:border-blue-500/50 transition-colors">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-[0.2em]">Wishlist</p>
                        <p className="text-3xl font-black italic">{wishlist.length}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-3 p-2 bg-secondary/30 backdrop-blur-sm rounded-[2rem] border border-border mb-16 w-fit mx-auto md:mx-0">
                {[
                    { id: "overview", label: "My Account", icon: User },
                    { id: "orders", label: "Orders", icon: ShoppingBag },
                    { id: "wishlist", label: "Wishlist", icon: Heart },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-3 transition-all ${activeTab === tab.id
                            ? "bg-foreground text-background shadow-xl scale-105"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-6 duration-700">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-10 bg-card p-12 rounded-[3.5rem] border-2 border-blue-600/30 shadow-2xl relative">
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter underline decoration-blue-600 underline-offset-[12px]">Update Identity</h3>
                                    <button type="button" onClick={() => setIsEditing(false)} className="p-3 bg-secondary hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name *</label>
                                            <input name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-6 py-5 rounded-2xl bg-secondary border outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all ${errors.name ? 'border-red-500' : 'border-border'}`} placeholder="Enter full name" required />
                                            {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number *</label>
                                            <input name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-6 py-5 rounded-2xl bg-secondary border outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all ${errors.phone ? 'border-red-500' : 'border-border'}`} placeholder="10-digit number" required />
                                            {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address *</label>
                                            <input name="address.line1" value={formData.address.line1} onChange={handleInputChange} className={`w-full px-6 py-5 rounded-2xl bg-secondary border outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all ${errors.line1 ? 'border-red-500' : 'border-border'}`} placeholder="Flat / House / Area" required />
                                            {errors.line1 && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.line1}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <input placeholder="City *" name="address.city" value={formData.address.city} onChange={handleInputChange} className={`w-full px-6 py-5 rounded-2xl bg-secondary border outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all ${errors.city ? 'border-red-500' : 'border-border'}`} required />
                                                {errors.city && <p className="text-[10px] text-red-500 font-bold ml-1"><AlertCircle className="w-2 h-2 inline mr-1" />{errors.city}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <input placeholder="State *" name="address.state" value={formData.address.state} onChange={handleInputChange} className={`w-full px-6 py-5 rounded-2xl bg-secondary border outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all ${errors.state ? 'border-red-500' : 'border-border'}`} required />
                                                {errors.state && <p className="text-[10px] text-red-500 font-bold ml-1"><AlertCircle className="w-2 h-2 inline mr-1" />{errors.state}</p>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <input placeholder="PIN Code *" name="address.postalCode" value={formData.address.postalCode} onChange={handleInputChange} className={`w-full px-6 py-5 rounded-2xl bg-secondary border outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all ${errors.postalCode ? 'border-red-500' : 'border-border'}`} required />
                                                {errors.postalCode && <p className="text-[10px] text-red-500 font-bold ml-1"><AlertCircle className="w-2 h-2 inline mr-1" />{errors.postalCode}</p>}
                                            </div>
                                            <input placeholder="Country" name="address.country" value={formData.address.country} disabled className="w-full px-6 py-5 rounded-2xl bg-secondary/50 border border-border outline-none font-bold opacity-60" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={saving} className="w-full py-6 bg-foreground text-background rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:opacity-95 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 relative z-10 text-xs">
                                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6 text-blue-500" /> Save Identity to DB</>}
                                </button>
                            </form>
                        ) : (
                            <>
                                <div className="lg:col-span-2 bg-card p-12 rounded-[3.5rem] border border-border shadow-sm space-y-16 hover:shadow-xl transition-shadow duration-500">
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12 flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-blue-600" /> Account Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-10">
                                                <div className="flex gap-6 items-center group">
                                                    <div className="p-5 bg-secondary rounded-[1.5rem] group-hover:bg-blue-500/10 transition-colors"><Phone className="w-6 h-6 text-blue-600" /></div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Mobile Number</p>
                                                        <p className="text-xl font-black italic tracking-tight">{userData?.phone || "Not Set"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 items-center group">
                                                    <div className="p-5 bg-secondary rounded-[1.5rem] group-hover:bg-blue-500/10 transition-colors"><Mail className="w-6 h-6 text-blue-600" /></div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Email ID</p>
                                                        <p className="text-xl font-black italic tracking-tight">{userData?.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex gap-6 items-start group">
                                                    <div className="p-5 bg-secondary rounded-[1.5rem] group-hover:bg-blue-500/10 transition-colors mt-2"><MapPin className="w-6 h-6 text-blue-600" /></div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3">Delivery Address</p>
                                                        <div className="text-lg font-black italic leading-loose">
                                                            {userData?.address?.line1 ? (
                                                                <ul className="space-y-1">
                                                                    <li className="text-2xl tracking-tighter uppercase">{userData.address.line1}</li>
                                                                    <li className="text-muted-foreground">{userData.address.city}, {userData.address.state}</li>
                                                                    <li className="text-blue-600 tracking-[0.2em] text-xs font-black">{userData.address.postalCode} • {userData.address.country}</li>
                                                                </ul>
                                                            ) : (
                                                                <p className="text-muted-foreground opacity-30 italic">NO ADDRESS ON FILE</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-foreground text-background p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group/box">
                                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                                        <Landmark className="w-48 h-48" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6 relative z-10 underline decoration-blue-600 underline-offset-8">Quick Links</h3>
                                    <p className="text-sm font-bold text-background/60 mb-12 relative z-10 leading-relaxed italic pr-6 group-hover/box:text-background transition-colors">
                                        Your details are securely stored in our Indian data cluster. All logistics are synced for priority delivery.
                                    </p>
                                    <div className="space-y-4 relative z-10">
                                        <Link href="/products" className="w-full flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-white/20 p-5 rounded-2xl transition-all border border-white/5">
                                            Shop Now <ArrowRight className="w-5 h-5 text-blue-500" />
                                        </Link>
                                        <Link href="/cart" className="w-full flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 p-5 rounded-2xl transition-all border border-white/5">
                                            Checkout Cart <ShoppingBag className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-8">
                        {orders.length === 0 ? (
                            <div className="text-center py-40 bg-secondary/20 border-2 border-dashed border-border rounded-[4rem]">
                                <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-8 opacity-20" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">No Orders Found</h3>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] mb-12">Start your shopping journey today.</p>
                                <Link href="/products" className="bg-foreground text-background px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                                    Browse Marketplace <ArrowRight className="w-4 h-4 text-blue-500" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-card border border-border p-10 rounded-[3rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all group overflow-hidden relative border-l-[6px] border-l-blue-600">
                                        <div className="flex flex-col lg:flex-row justify-between gap-12">
                                            <div className="flex-grow">
                                                <div className="flex flex-wrap items-center gap-6 mb-10">
                                                    <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                        }`}>{order.status}</span>
                                                    <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-4 py-2 rounded-xl">ID: {order._id.toString().slice(-12).toUpperCase()}</span>
                                                    <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-6">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-5 bg-secondary/40 p-4 rounded-[2rem] border border-border/40 hover:bg-secondary/60 transition-colors">
                                                            <div className="relative w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
                                                                <Image src={getValidImage(item.image)} alt={item.title} fill className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-tight mb-1">{item.title}</p>
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">${item.price} <span className="mx-2 text-blue-500 opacity-30">|</span> Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="lg:w-64 text-right flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border pt-10 lg:pt-0 lg:pl-12">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3">Total Payable</p>
                                                <p className="text-5xl font-black italic tracking-tighter text-foreground">${order.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "wishlist" && (
                    <div>
                        {wishlist.length === 0 ? (
                            <div className="text-center py-40 bg-secondary/20 border-2 border-dashed border-border rounded-[4rem]">
                                <Heart className="w-20 h-20 text-muted-foreground mx-auto mb-8 opacity-20" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">No Saved Items</h3>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] mb-12">Flag items to save them for later.</p>
                                <Link href="/products" className="bg-foreground text-background px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                                    Add Items <ArrowRight className="w-4 h-4 text-blue-500" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {wishlist.map((product) => (
                                    <div key={product._id} className="bg-card border border-border rounded-[3rem] overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all flex flex-col scale-100 hover:scale-[1.02] duration-500">
                                        <div className="relative h-72 overflow-hidden bg-secondary">
                                            <Image
                                                src={getValidImage(product.images?.[0])}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <button
                                                onClick={() => toggleWishlist(product._id)}
                                                className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-xl rounded-[1.5rem] text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/20 shadow-2xl z-20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-10 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-blue-600 transition-colors">{product.title}</h4>
                                                <p className="text-3xl font-black italic mb-10 text-foreground">${product.price.toFixed(2)}</p>
                                            </div>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="flex items-center justify-center gap-4 py-5 bg-foreground text-background text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] group hover:opacity-90 transition-all shadow-xl active:scale-95"
                                            >
                                                View Piece <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
    );
}
