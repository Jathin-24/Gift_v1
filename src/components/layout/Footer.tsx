import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Award, Zap, PackageCheck } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-16">
                {/* Newsletter Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-border pb-16 mb-16">
                    <div className="text-center lg:text-left space-y-2 max-w-lg">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                            Join the <span className="text-blue-600">Gift Club.</span>
                        </h2>
                        <p className="text-muted-foreground font-medium">
                            Subscribe to receive exclusive offers, new arrivals, and gifting tips directly to your inbox.
                        </p>
                    </div>
                    <form className="flex w-full max-w-md gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-grow px-6 py-4 rounded-2xl bg-secondary border-2 border-transparent focus:border-blue-600 outline-none font-bold transition-all"
                        />
                        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/25 flex-shrink-0">
                            Subscribe
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase group block">
                            Gifts<span className="text-blue-600 group-hover:animate-pulse">.</span>
                        </Link>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xs">
                            Discover the perfect gift for every occasion. Curated with love, delivered with care.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Quick Links</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/products" className="hover:text-blue-600 transition-colors">All Products</Link></li>
                            <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Collections</Link></li>
                            <li><Link href="/cart" className="hover:text-blue-600 transition-colors">Shopping Cart</Link></li>
                            <li><Link href="/profile" className="hover:text-blue-600 transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Support</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Headquarters</p>
                                    <p className="text-sm font-bold text-foreground">
                                        123 Innovation Drive,<br />
                                        Tech City, Mumbai 400001
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Email Us</p>
                                    <a href="mailto:hello@gifts.com" className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors">
                                        hello@gifts.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Call Us</p>
                                    <a href="tel:+919876543210" className="text-sm font-bold text-foreground hover:text-blue-600 transition-colors">
                                        +91 98765 43210
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-muted-foreground">
                        © 2024 Gifts Inc. All rights reserved.
                    </p>
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
