"use client";
import { WishlistRes } from "@/interfaces/wishlistInterface";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AddToCart from "../AddToCart/AddToCart";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, X, Heart, ShoppingBag, Star } from "lucide-react";
import { removeFromWishlistAction } from "@/actions/Removefromwishlistaction.action";

export default function WishList({
  wishlistData,
}: {
  wishlistData: WishlistRes | null;
}) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  const formatCurrency = (
    amount: number,
    currency = "EGP",
    locale = "en-US"
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingId(productId);
    try {
      const result = await removeFromWishlistAction(productId);
      if (result) {
        toast.success("Removed from wishlist");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-12 h-12 text-destructive fill-destructive" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
          My Wishlist
        </h1>
        <p className="text-muted-foreground">
          {wishlistData?.count || 0} {wishlistData?.count === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {wishlistData && wishlistData.count > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistData.data.map((item) => (
            <div
              key={item.id}
              className="group relative glass rounded-2xl overflow-hidden hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
            >
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                disabled={removingId === item.id}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {removingId === item.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </button>

              {/* Product Image */}
              <Link href={`/products/${item.id}`}>
                <div className="relative h-80 overflow-hidden bg-secondary cursor-pointer">
                  <Image
                    src={item.imageCover}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Out of Stock Overlay */}
                  {!item.quantity && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Quick View Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-muted-foreground">Click to view details</p>
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                      {item.title}
                    </h3>
                  </Link>
                  
                  {/* Brand */}
                  <p className="text-sm text-muted-foreground">
                    {item.brand.name}
                  </p>

                  {/* Rating (if available) */}
                  {item.ratingsAverage && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-semibold text-foreground">
                        {item.ratingsAverage}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.ratingsQuantity || 0})
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <AddToCart productId={item.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <Heart className="w-12 h-12 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start adding items you love to keep track of them and buy them later
            </p>
          </div>

          <Link href="/products">
            <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
      )}

      {/* Summary Stats */}
      {wishlistData && wishlistData.count > 0 && (
        <div className="glass rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-destructive fill-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold text-foreground">
                {wishlistData.count}
              </p>
            </div>
          </div>

          <Link href="/products">
            <button className="px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-secondary transition-all duration-300 hover:scale-105">
              Add More Items
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}