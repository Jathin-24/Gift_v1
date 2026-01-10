import { Package, ShoppingCart, Users, DollarSign, Clock, ArrowUpRight } from "lucide-react";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Order from "@/lib/db/models/Order";
import User from "@/lib/db/models/User";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    await dbConnect();

    // Fetch real stats
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();

    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    const recentOrders = await Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

    const newestUsers = await User.find({})
        .sort({ createdAt: -1 })
        .limit(5);

    const stats = [
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
        { label: "Total Orders", value: orderCount.toString(), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Active Products", value: productCount.toString(), icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Customers", value: userCount.toString(), icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-foreground underline decoration-blue-500 underline-offset-8">Dashboard Overview</h1>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground bg-secondary px-4 py-2 rounded-full border border-border">
                    <Clock className="w-3.5 h-3.5" />
                    Real-time Data
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card p-8 rounded-3xl border border-border shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-3xl font-black tracking-tighter italic">{stat.value}</p>
                        </div>
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-card p-10 rounded-3xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black uppercase italic tracking-tight">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline flex items-center gap-1">
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground text-[10px] uppercase tracking-widest font-black transition-colors">
                                    <th className="pb-4">Reference</th>
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="text-sm group hover:bg-secondary/30 transition-colors">
                                        <td className="py-5 font-mono text-[10px] text-muted-foreground">#{order._id.toString().slice(-8).toUpperCase()}</td>
                                        <td className="py-5">
                                            <p className="font-black uppercase tracking-tight text-foreground">{order.shippingAddress.name}</p>
                                        </td>
                                        <td className="py-5 font-black italic">${order.total.toFixed(2)}</td>
                                        <td className="py-5 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-secondary text-muted-foreground border-border'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest italic">No orders yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Newest Customers */}
                <div className="bg-card p-10 rounded-3xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black uppercase italic tracking-tight">New Members</h2>
                        <Link href="/admin/users" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline flex items-center gap-1">
                            Directory <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {newestUsers.map((user) => (
                            <div key={user._id} className="flex items-center justify-between group hover:bg-secondary/30 p-2 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary border border-border rounded-full flex items-center justify-center font-black text-foreground group-hover:scale-110 transition-transform">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-tight text-foreground">{user.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold tracking-wider">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {user.role}
                                </div>
                            </div>
                        ))}
                        {newestUsers.length === 0 && (
                            <p className="text-center py-10 text-muted-foreground font-bold uppercase text-[10px] tracking-widest italic">No customers found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
