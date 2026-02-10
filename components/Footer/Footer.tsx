import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ShopMart
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted online shopping destination for quality products, competitive prices, and excellent customer service.
            </p>
            
            <div className="flex gap-3 pt-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Brands</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sale=true"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Sale</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/profile-page"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">My Account</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/allorders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Order History</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist-page"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Wishlist</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Help Center</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:support@shopmart.com" className="hover:text-primary transition-colors">
                    support@shopmart.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a href="tel:+201234567890" className="hover:text-primary transition-colors">
                    +20 123 456 7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p>Cairo, Egypt</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} ShopMart. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">We accept:</span>
              <div className="flex gap-2">
                <div className="w-12 h-8 rounded bg-secondary flex items-center justify-center text-xs font-semibold">
                  VISA
                </div>
                <div className="w-12 h-8 rounded bg-secondary flex items-center justify-center text-xs font-semibold">
                  MC
                </div>
                <div className="w-12 h-8 rounded bg-secondary flex items-center justify-center text-xs font-semibold">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}