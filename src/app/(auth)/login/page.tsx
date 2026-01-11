"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
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
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-background to-background dark:from-blue-950/20 dark:via-background dark:to-background">
            <div className="w-full max-w-[450px] space-y-8 bg-card border-4 border-zinc-200 dark:border-zinc-700 p-10 rounded-[3rem] shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-shadow duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase text-foreground mb-4">
                        Login<span className="text-blue-600">.</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Enter your credentials to continue.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold text-center uppercase tracking-wider">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold dark:bg-white dark:text-black"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                            <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold dark:bg-white dark:text-black"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-blue-500/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-xs font-bold text-muted-foreground tracking-tight">
                    New here?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline uppercase underline-offset-4">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
