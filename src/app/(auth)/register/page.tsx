"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-[400px] space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tight uppercase">Register</h1>
                    <p className="text-muted-foreground text-sm font-medium">Create your credentials to join us.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold text-center uppercase tracking-wider">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-black/5 mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-xs font-bold text-muted-foreground tracking-tight">
                    Already have an account?{" "}
                    <Link href="/login" className="text-foreground hover:underline uppercase underline-offset-4">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
