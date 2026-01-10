"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, Loader2, CheckCircle, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function CheckoutPage() {
    const { data: session, status, update } = useSession();
    const { items, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            line1: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
        }
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        } else if (status === "authenticated") {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/auth/profile?t=" + Date.now());
            if (res.ok) {
                const data = await res.json();
                console.log("Verified Profile Data for Checkout:", data);
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: {
                        line1: data.address?.line1 || "",
                        city: data.address?.city || "",
                        state: data.address?.state || "",
                        postalCode: data.address?.postalCode || "",
                        country: data.address?.country || "India",
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching profile on checkout:", error);
        } finally {
            setFetchingProfile(false);
        }
    };

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const pinRegex = /^[1-9][0-9]{5}$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
            alert("Please enter a valid 10-digit Indian mobile number.");
            return;
        }
        if (!formData.address.postalCode || !pinRegex.test(formData.address.postalCode.replace(/\s+/g, ''))) {
            alert("Please enter a valid 6-digit PIN code.");
            return;
        }

        setLoading(true);

        try {
            console.log("STEP 1: Syncing Profile & Contact Details...");
            const profileUpdate = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address
                })
            });

            if (!profileUpdate.ok) {
                const error = await profileUpdate.json();
                throw new Error(error.message || "Profile sync failure");
            }

            // Update session name if it changed
            await update({ name: formData.name });

            console.log("STEP 2: Initializing Database Order Record...");
            const orderRes = await fetch("/api/user/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        product: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    total,
                    shippingAddress: {
                        name: formData.name,
                        email: formData.email,
                        address: formData.address.line1,
                        city: formData.address.city,
                        state: formData.address.state,
                        postalCode: formData.address.postalCode,
                        country: formData.address.country
                    },
                    paymentStatus: "paid"
                })
            });

            if (!orderRes.ok) {
                const error = await orderRes.json();
                throw new Error(error.message || "Order recording failure");
            }

            console.log("STEP 3: Checkout Finalized.");
            setLoading(false);
            setSuccess(true);
            clearCart();

            setTimeout(() => {
                router.push("/profile");
            }, 3000);

        } catch (error: any) {
            console.error("CRITICAL Checkout Error:", error);
            setLoading(false);
            alert(`Checkout Error: ${error.message}. Contact system admin if details are missing.`);
        }
    };

    if (status === "loading" || fetchingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Indian Logistics...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container mx-auto px-4 py-24 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                    <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">India Logistics Dispatched</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto font-medium italic">
                    Your details are verified and order is permanently recorded in MongoDB. Redirecting to your dashboard...
                </p>
                <div className="w-48 h-1 bg-secondary mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 animate-progress origin-left"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground mb-12 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Bag
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8 underline decoration-blue-600 underline-offset-8">Delivery Details</h2>
                        <form onSubmit={handlePayment} className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <input
                                    className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Indian Mobile (+91)</label>
                                    <input
                                        className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="10-digit mobile"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registered Email ID</label>
                                    <input
                                        className="w-full px-5 py-4 rounded-2xl bg-secondary opacity-60 border border-border outline-none font-bold"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Building / Area / Street</label>
                                <input
                                    className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                    value={formData.address.line1}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                    <input
                                        className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                        value={formData.address.city}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</label>
                                    <input
                                        className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                        value={formData.address.state}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">PIN Code</label>
                                    <input
                                        className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none font-bold transition-all"
                                        value={formData.address.postalCode}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                                        placeholder="6-digit PIN"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-10 py-6 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                ) : (
                                    <>
                                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                                        Complete Trade & Secure Details
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-secondary/50 border border-border rounded-[40px] p-10 h-fit sticky top-24">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Order Summary</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded-full">{items.length} Modules</span>
                    </div>

                    <div className="space-y-6 mb-10 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border bg-background flex-shrink-0">
                                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">UNIT x{item.quantity}</p>
                                        <p className="font-black uppercase tracking-tight text-foreground">{item.title}</p>
                                    </div>
                                </div>
                                <span className="font-black italic">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-border space-y-4 mb-10">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            <span>Sub-Total</span>
                            <span className="text-foreground">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            <span>Delivery Fee</span>
                            <span className="text-foreground">
                                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-end pt-6 border-t border-border mt-4">
                            <span className="text-xl font-black uppercase italic tracking-tighter">Net Total</span>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase text-blue-600 tracking-widest mb-1">Secure Indian Transaction</p>
                                <p className="text-4xl font-black tracking-tighter italic text-foreground">${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[9px] text-muted-foreground mt-8 uppercase tracking-widest font-bold">
                        Indian Secured Transaction Cluster v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
