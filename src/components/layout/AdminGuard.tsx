"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAdminMode } = useAdminStore();
    const router = useRouter();

    const isAdminRoute = pathname?.startsWith("/admin");

    // Optional: Auto-redirect to admin panel if in admin mode and not on admin route
    useEffect(() => {
        if (isAdminMode && !isAdminRoute) {
            router.push("/admin");
        }
    }, [isAdminMode, isAdminRoute, router]);

    if (isAdminMode && !isAdminRoute) {
        return (
            <div className="h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-background text-foreground animate-in fade-in duration-300">
                <div className="bg-secondary/50 p-12 rounded-[3rem] border-2 border-border/50 text-center max-w-lg mx-4">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-600/20">
                        <ShieldCheck className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Admin Focus Mode</h2>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10 leading-relaxed">
                        User interface is currently hidden. <br />You are in focused administrative mode.
                    </p>
                    <Link
                        href="/admin"
                        className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
