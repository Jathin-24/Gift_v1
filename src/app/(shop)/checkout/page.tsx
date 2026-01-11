"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Lock, Truck, ShieldCheck, ArrowRight, Loader2, MapPin, Phone } from "lucide-react";

import Script from "next/script";

export default function CheckoutPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
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
        // Fetch user profile to pre-fill address and phone
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/auth/profile");
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || prev.name,
                        phone: data.phone || "",
                        address: {
                            line1: data.address?.line1 || "",
                            city: data.address?.city || "",
                            state: data.address?.state || "",
                            postalCode: data.address?.postalCode || "",
                            country: "India",
                        }
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev: any) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple Phone Validation for India
        if (formData.phone.length < 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        // Simple PIN Code Validation
        if (formData.address.postalCode.length !== 6) {
            alert("Please enter a valid 6-digit PIN code");
            return;
        }

        setLoading(true);

        try {
            // 1. Sync Profile Data
            const profileRes = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!profileRes.ok) throw new Error("Failed to save profile details");

            // Update session name if changed
            await update({ name: formData.name });

            // 2. Initialize Razorpay Order
            const orderRes = await fetch("/api/payment/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });

            if (!orderRes.ok) throw new Error("Failed to initialize payment");

            const orderData = await orderRes.json();

            // 3. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: "INR",
                name: "Store System",
                description: "Order Transaction",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        // 4. Create Order in DB on Success
                        const saveOrderRes = await fetch("/api/user/orders", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                items,
                                total,
                                shippingAddress: {
                                    name: formData.name, // Explicitly passing name from formData
                                    email: formData.email,
                                    phone: formData.phone,
                                    address: formData.address.line1,
                                    city: formData.address.city,
                                    state: formData.address.state,
                                    postalCode: formData.address.postalCode,
                                    country: formData.address.country,
                                },
                                paymentInfo: {
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                },
                            }),
                        });

                        if (!saveOrderRes.ok) throw new Error("Failed to save order");

                        clearCart();
                        router.push("/order-confirmation");
                    } catch (err) {
                        console.error(err);
                        alert("Payment successful but order saving failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#2563eb",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Transaction failed. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Checkout Form */}
                <div className="lg:w-2/3">
                    <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 shadow-2xl shadow-blue-600/20 dark:bg-zinc-900">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Delivery Details</h1>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-blue-600 outline-none font-bold transition-all dark:bg-white dark:text-black"
                                        placeholder="Receiver's Name"
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
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-20 pr-6 py-4 rounded-2xl bg-secondary border border-border focus:border-blue-600 outline-none font-bold transition-all dark:bg-white dark:text-black"
                                            placeholder="10-digit number"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shipping Address</label>
                                <input
                                    name="address.line1"
                                    value={formData.address.line1}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-blue-600 outline-none font-bold transition-all dark:bg-white dark:text-black"
                                    placeholder="House No., Street, Area"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                    <input
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-blue-600 outline-none font-bold transition-all dark:bg-white dark:text-black"
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</label>
                                    <input
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-blue-600 outline-none font-bold transition-all dark:bg-white dark:text-black"
                                        placeholder="State"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">PIN Code</label>
                                    <input
                                        name="address.postalCode"
                                        value={formData.address.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-secondary border border-border focus:border-blue-600 outline-none font-bold transition-all dark:bg-white dark:text-black"
                                        placeholder="6 digits"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6 space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-4 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Processing Order...
                                        </>
                                    ) : (
                                        <>
                                            Pay & Confirm Order
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        // Mimic Success
                                        if (formData.phone.length < 10) return alert("Enter valid phone");
                                        if (formData.address.postalCode.length !== 6) return alert("Enter valid PIN");

                                        setLoading(true);
                                        try {
                                            const saveOrderRes = await fetch("/api/user/orders", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    items,
                                                    total,
                                                    shippingAddress: {
                                                        name: formData.name,
                                                        email: formData.email,
                                                        phone: formData.phone,
                                                        address: formData.address.line1,
                                                        city: formData.address.city,
                                                        state: formData.address.state,
                                                        postalCode: formData.address.postalCode,
                                                        country: formData.address.country,
                                                    },
                                                    paymentInfo: {
                                                        razorpayOrderId: "test_order_" + Date.now(),
                                                        razorpayPaymentId: "test_pay_" + Date.now(),
                                                        razorpaySignature: "test_sig",
                                                    },
                                                }),
                                            });
                                            const errorData = await saveOrderRes.json();
                                            if (!saveOrderRes.ok) throw new Error(errorData.message || "Processing failed");
                                            clearCart();
                                            router.push("/order-confirmation");
                                        } catch (e: any) {
                                            alert("Test failed: " + e.message);
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full py-4 bg-secondary text-muted-foreground hover:text-foreground rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-border transition-all"
                                >
                                    Test Payment (No Gateway)
                                </button>

                                <div className="flex items-center justify-center gap-3 mt-6 text-muted-foreground italic font-bold text-xs uppercase tracking-tight">
                                    <Lock className="w-4 h-4" />
                                    <span>Secure SSL Checkout Enabled</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary Cart */}
                <div className="lg:w-1/3">
                    <div className="bg-secondary border border-border rounded-[2.5rem] p-10 sticky top-24 dark:bg-zinc-900 shadow-2xl shadow-blue-600/20">
                        <h2 className="text-2xl font-black italic uppercase mb-8 border-b-2 border-border pb-4">Order Summary</h2>
                        <div className="space-y-6 mb-10 max-h-[40vh] overflow-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-card border border-border rounded-xl flex-shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-xs font-black uppercase line-clamp-1">{item.title}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border">
                            <div className="flex justify-between text-muted-foreground font-bold text-xs uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-foreground">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground font-bold text-xs uppercase tracking-widest">
                                <span>Shipping</span>
                                <span className="text-foreground">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-border">
                                <span className="text-lg font-black uppercase italic">Total</span>
                                <span className="text-3xl font-black text-blue-600 tracking-tighter">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border group hover:border-blue-500 transition-colors dark:bg-zinc-800">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                                <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                    India Shipping <br /> Available
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
