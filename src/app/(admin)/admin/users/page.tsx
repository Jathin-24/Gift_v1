import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { User as UserIcon, Shield, Mail, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-blue-500 underline-offset-8">Manage Users</h1>
                <p className="text-muted-foreground mt-4 font-medium uppercase text-xs tracking-widest">Customer and Administrator Database</p>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary text-muted-foreground text-[10px] uppercase tracking-widest font-black transition-colors">
                                <th className="px-8 py-5">User Profile</th>
                                <th className="px-8 py-5">Contact Info</th>
                                <th className="px-8 py-5">Access Level</th>
                                <th className="px-8 py-5">Joined Date</th>
                                <th className="px-8 py-5 text-right">Identifier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user._id} className="text-sm group hover:bg-secondary/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground uppercase tracking-tight">{user.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold">CUSTOMER</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span className="font-medium">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {user.role === "admin" ? (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50">
                                                <Shield className="w-3 h-3" />
                                                Admin
                                            </div>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <code className="text-[10px] bg-secondary p-1.5 rounded-lg text-muted-foreground font-mono">
                                            {user._id.toString().slice(-8)}
                                        </code>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
