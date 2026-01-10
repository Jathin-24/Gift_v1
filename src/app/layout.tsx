import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Next.js Only E-Commerce",
    description: "A premium e-commerce application built with Next.js",
};

import AdminGuard from "@/components/layout/AdminGuard";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-background text-foreground`}>
                <ThemeProvider>
                    <AuthProvider>
                        <Header />
                        <main className="min-h-[calc(100vh-64px)]">
                            <AdminGuard>
                                {children}
                            </AdminGuard>
                        </main>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
