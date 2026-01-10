import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import User from "@/lib/db/models/User"; // Needed for ref
import { Package, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
    await dbConnect();
    const orders = await Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "processing": return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
            case "shipped": return "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400";
            case "delivered": return "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400";
            case "cancelled": return "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-green-500 underline-offset-8">Incoming Orders</h1>
                <p className="text-muted-foreground mt-4 font-medium uppercase text-xs tracking-widest">Global Order Fulfillment Tracker</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all group">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">#{order._id.toString().slice(-12).toUpperCase()}</span>
                                    <span className="text-xs text-muted-foreground font-bold">•</span>
                                    <span className="text-xs text-muted-foreground font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-6">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-2xl border border-border/50">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight">{item.title}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold">QTY: {item.quantity} • ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                            <Package className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Customer</p>
                                            <p className="text-sm font-bold">{order.shippingAddress.name}</p>
                                            <p className="text-xs text-muted-foreground">{order.shippingAddress.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Shipping To</p>
                                            <p className="text-xs font-semibold leading-relaxed">
                                                {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                                {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/50 pt-8 lg:pt-0 lg:pl-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Order Value</p>
                                    <p className="text-4xl font-black tracking-tighter italic text-foreground">${order.total.toFixed(2)}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                        Payment: {order.paymentStatus}
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-col gap-2">
                                    <button className="w-full py-3 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all">
                                        Update Status
                                    </button>
                                    <button className="w-full py-3 border border-border text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary transition-all">
                                        Print Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-24 bg-card border border-dashed border-border rounded-3xl">
                        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-black uppercase tracking-widest">No active orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
