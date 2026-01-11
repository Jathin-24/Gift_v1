import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Gift Shop",
    description: "Curated gifts for every occasion. Find the perfect present for your loved ones.",
};

import AdminGuard from "@/components/layout/AdminGuard";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.className} bg-background text-foreground`}>
                <ThemeProvider>
                    <AuthProvider>
                        <Header />
                        <main className="min-h-[calc(100vh-64px)]">
                            <AdminGuard>
                                {children}
                            </AdminGuard>
                        </main>
                        <Footer />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
