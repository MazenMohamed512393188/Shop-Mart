import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/5 dark:via-background dark:to-accent/5" />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-down">
            <Sparkles className="w-4 h-4" />
            Premium Shopping Experience
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight animate-slide-up">
            Welcome to ShopMart
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-200">
            Discover the latest technology, fashion, and lifestyle products.
            Quality guaranteed with fast shipping and excellent customer service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
            <Link
              href="/products"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-base hover:shadow-glow transition-all duration-300 hover:scale-105 w-full sm:w-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="/categories"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-base border-2 border-border hover:border-primary hover:bg-accent/10 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Fast Shipping
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get your orders delivered quickly and safely to your doorstep with our express shipping service.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Quality Products
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Only the best products from trusted brands and suppliers with quality guarantee.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Headphones className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                24/7 Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our customer service team is always ready to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">10K+</p>
              <p className="text-muted-foreground">Products</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-accent">50K+</p>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-success">100+</p>
              <p className="text-muted-foreground">Brands</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-warning">24/7</p>
              <p className="text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}