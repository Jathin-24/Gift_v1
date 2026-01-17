import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, ShieldCheck, Truck, Star } from "lucide-react";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import { getValidImage, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();
  const latestProducts = await Product.find({}).sort({ createdAt: -1 }).limit(4);
  const featuredCategories = await Category.find({}).limit(6);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Elevated Premium Look */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-500">
            UNBOX <br /> <span className="text-blue-500 italic decoration-wavy underline underline-offset-8 animate-pulse">JOY.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 font-black italic uppercase tracking-tight">
            Hand-picked treasures for your loved ones. Make every moment special with our curated gift collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-16 duration-700">
            <Link
              href="/products"
              className="px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 group"
            >
              Shop Now
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/categories"
              className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/20 hover:scale-105 transition-all"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Ticker - Infinite Scroll */}
      <div className="bg-blue-600 py-4 overflow-hidden relative z-20 -mt-1 shadow-2xl">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Premium Quality</span>
              <Star className="w-3 h-3 text-black fill-black" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Express Delivery</span>
              <Star className="w-3 h-3 text-black fill-black" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Secure Packaging</span>
              <Star className="w-3 h-3 text-black fill-black" />
            </div>
          ))}
        </div>
      </div>

      {/* Curated Collections Showcase */}
      {featuredCategories.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500 mb-3">Explore</h2>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Curated <span className="text-foreground">Collections</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCategories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className={`group relative overflow-hidden rounded-[2.5rem] border-2 border-border ${index === 0 ? 'md:col-span-2' : ''} h-[400px]`}
                >
                  <Image
                    src={getValidImage(category.image)}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">{category.title}</h3>
                    <p className="text-white/80 font-medium text-sm line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">{category.description || "Discover the collection"}</p>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section - The "Soul" of the Store */}
      {latestProducts.length > 0 && (
        <section className="py-20 bg-background relative overflow-hidden">
          {/* Ambient Background Glow for Dark Mode */}
          <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-20 right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Fresh <span className="text-blue-600">Drops</span></h2>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-4">Just arrived in store</p>
              </div>
              <Link href="/products" className="hidden md:flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs hover:translate-x-2 transition-transform">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="group bg-card hover:bg-white border-2 border-border rounded-3xl p-4 shadow-sm dark:shadow-white/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary mb-4 border border-border/50 group-hover:border-blue-500/20">
                    <Image
                      src={getValidImage(product.images?.[0])}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20">
                        Hot
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-2 line-clamp-1 group-hover:text-black transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black italic tracking-tighter text-blue-600">
                      {formatPrice(product.price)}
                    </p>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300 dark:text-black group-hover:text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Zero Grey Policy */}
      <section className="py-16 md:py-32 bg-gradient-to-b from-background via-secondary/30 to-background transition-colors">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Global Relay Card */}
            <div className="flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-card hover:bg-white border-2 border-border transition-all hover:border-blue-600 hover:premium-shadow hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-black/5 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl shadow-blue-500/20 relative z-10 group-hover:bg-black">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-6 italic tracking-tight text-foreground group-hover:text-black transition-colors uppercase relative z-10">Express Gifting</h3>
              <p className="text-muted-foreground group-hover:text-black transition-colors leading-relaxed font-black text-[10px] tracking-[0.2em] uppercase relative z-10 italic">
                Last minute surprise? Get your gifts delivered in record time with our <span className="text-blue-600 group-hover:text-black">pan-India</span> express network.
              </p>
            </div>

            {/* Secure Link Card */}
            <div className="flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-card hover:bg-white border-2 border-border transition-all hover:border-blue-600 hover:premium-shadow hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-black/5 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-xl shadow-blue-500/20 relative z-10 group-hover:bg-black">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-6 italic tracking-tight text-foreground group-hover:text-black transition-colors uppercase relative z-10">Secure Payments</h3>
              <p className="text-muted-foreground group-hover:text-black transition-colors leading-relaxed font-black text-[10px] tracking-[0.2em] uppercase relative z-10 italic">
                Your data is protected by industry-leading <span className="text-blue-600 group-hover:text-black">encryption</span> and secure payment gateways. Zero Risk.
              </p>
            </div>

            {/* Assurance Card */}
            <div className="flex flex-col items-center text-center p-12 rounded-[3.5rem] bg-card hover:bg-white border-2 border-border transition-all hover:border-blue-600 hover:premium-shadow hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-black/5 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl shadow-blue-500/20 relative z-10 group-hover:bg-black">
                <Gift className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-6 italic tracking-tight text-foreground group-hover:text-black transition-colors uppercase relative z-10">Premium Wrap</h3>
              <p className="text-muted-foreground group-hover:text-black transition-colors leading-relaxed font-black text-[10px] tracking-[0.2em] uppercase relative z-10 italic">
                Every order comes with our signature <span className="text-blue-600 group-hover:text-black">gift packaging</span> options. Ready to impress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-black text-white p-12 md:p-24 text-center border-2 border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32 mix-blend-screen animate-pulse duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] -ml-20 -mb-20 mix-blend-screen" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 italic tracking-tighter uppercase leading-[0.9]">
                NEVER MISS <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 decoration-wavy underline underline-offset-8 decoration-blue-500/30">A MOMENT.</span>
              </h2>
              <p className="text-lg md:text-2xl text-neutral-400 mb-12 max-w-2xl font-medium leading-relaxed">
                Subscribe for exclusive access to limited drops and special member rewards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-8 py-5 rounded-2xl bg-white/10 border-2 border-white/10 text-white placeholder:text-neutral-500 font-bold focus:outline-none focus:border-blue-500 focus:bg-white/5 transition-all text-sm backdrop-blur-xl uppercase tracking-wider"
                  title="Newsletter Email"
                />
                <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
