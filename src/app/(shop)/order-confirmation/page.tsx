import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, PackageSearch, Verified } from "lucide-react";

export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-24 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/30">
                <Verified className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase italic text-foreground">Mission Accomplished</h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed font-bold italic underline decoration-blue-500 underline-offset-8">
                Your order is currently in the dispatch queue. Hardware acquisition and logistics initialization complete.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                    href="/"
                    className="px-10 py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-black/10 group active:scale-95"
                >
                    <ShoppingBag className="w-5 h-5" />
                    Marketplace Home
                </Link>
                <Link
                    href="/products"
                    className="px-10 py-5 bg-secondary text-foreground border border-border rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-border transition-all group active:scale-95"
                >
                    Browse Collections
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="mt-24 p-12 bg-card rounded-[40px] max-w-4xl mx-auto border border-border shadow-sm">
                <h3 className="text-2xl font-black mb-10 uppercase italic tracking-tighter flex items-center justify-center gap-3">
                    <PackageSearch className="w-6 h-6 text-blue-500" />
                    Logistics Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg font-black italic">01</div>
                        <p className="font-black uppercase tracking-widest text-xs">Stage: Queue</p>
                        <p className="text-muted-foreground font-medium italic">Acquiring hardware from secure inventory storage.</p>
                    </div>
                    <div className="space-y-4 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all">
                        <div className="w-10 h-10 bg-secondary text-foreground rounded-full flex items-center justify-center mx-auto shadow-sm font-black italic">02</div>
                        <p className="font-black uppercase tracking-widest text-xs">Stage: Transit</p>
                        <p className="text-muted-foreground font-medium italic">Courier interception and global routing initialized.</p>
                    </div>
                    <div className="space-y-4 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all">
                        <div className="w-10 h-10 bg-secondary text-foreground rounded-full flex items-center justify-center mx-auto shadow-sm font-black italic">03</div>
                        <p className="font-black uppercase tracking-widest text-xs">Stage: Arrival</p>
                        <p className="text-muted-foreground font-medium italic">Final delivery to your specified coordinate matrix.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
