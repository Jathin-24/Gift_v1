import Link from "next/link";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Elevated Premium Look */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700">
            DEFINE YOUR <br /> <span className="text-blue-500 italic decoration-wavy underline underline-offset-8">STYLE.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 font-black italic uppercase tracking-tight">
            Premium products curated for the modern individual. Experience the next generation of e-commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link
              href="/products"
              className="px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 group"
            >
              Shop Collection
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/categories"
              className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Zero Grey Policy */}
      <section className="py-32 bg-background transition-colors">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Global Relay Card */}
            <div className="flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-card border-2 border-border transition-all hover:border-blue-600 hover:premium-shadow hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-black/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl shadow-blue-500/20 relative z-10">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-6 italic tracking-tight text-foreground uppercase relative z-10">Global Relay</h3>
              <p className="text-foreground leading-relaxed font-black text-[10px] tracking-[0.2em] uppercase relative z-10 italic">
                Get your products delivered in record time with our <span className="text-blue-600">worldwide logistics</span> network. Absolute Speed.
              </p>
            </div>

            {/* Secure Link Card */}
            <div className="flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-card border-2 border-border transition-all hover:border-blue-600 hover:premium-shadow hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-black/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-xl shadow-blue-500/20 relative z-10">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-6 italic tracking-tight text-foreground uppercase relative z-10">Secure Link</h3>
              <p className="text-foreground leading-relaxed font-black text-[10px] tracking-[0.2em] uppercase relative z-10 italic">
                Your data is protected by industry-leading <span className="text-blue-600">encryption</span> and decentralized protocols. Zero Risk.
              </p>
            </div>

            {/* Assurance Card */}
            <div className="flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-card border-2 border-border transition-all hover:border-blue-600 hover:premium-shadow hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-black/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl shadow-blue-500/20 relative z-10">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-6 italic tracking-tight text-foreground uppercase relative z-10">Assurance</h3>
              <p className="text-foreground leading-relaxed font-black text-[10px] tracking-[0.2em] uppercase relative z-10 italic">
                Every piece is inspected to meet our <span className="text-blue-600">obsidian standards</span> of finish and craftsmanship. Pure Build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-foreground text-background overflow-hidden relative border-t border-border">
        <div className="absolute top-0 right-0 w-full h-full bg-blue-600 opacity-10 skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black mb-10 italic tracking-tighter leading-none uppercase">
              JOIN THE <br /> <span className="text-blue-600">OBSIDIAN HUB.</span>
            </h2>
            <p className="text-xl text-background mb-14 max-w-xl leading-relaxed italic font-black uppercase tracking-widest opacity-100">
              Subscribe for exclusive access to limited drops and zero-gravity member rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <input
                type="email"
                placeholder="Secure Email Identity"
                className="flex-grow max-w-md px-10 py-6 bg-background text-foreground border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition-all font-black uppercase text-xs tracking-widest shadow-2xl"
                title="Newsletter Email"
              />
              <button className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40">
                Activate Access
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
