"use client";
import { WishlistRes } from "@/interfaces/wishlistInterface";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AddToCart from "../AddToCart/AddToCart";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, X, Heart, ShoppingBag, Star, WifiOff, RefreshCw } from "lucide-react";
import { removeFromWishlistAction } from "@/actions/Removefromwishlistaction.action";

enum ErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  UNKNOWN = 'unknown'
}

export default function WishList({
  wishlistData,
}: {
  wishlistData: WishlistRes | null;
}) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showRetry, setShowRetry] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", {
        id: 'online-status',
        duration: 3000
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial state
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function classifyError(error: any): ErrorType {
    if (!navigator.onLine) return ErrorType.NETWORK;
    
    if (error instanceof TypeError || 
        error.message?.includes('fetch') ||
        error.message?.includes('network')) {
      return ErrorType.NETWORK;
    }
    
    const status = error.response?.status || error.status;
    if (status === 401 || status === 403) return ErrorType.AUTH;
    if (status >= 500) return ErrorType.SERVER;
    
    return ErrorType.UNKNOWN;
  }

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
    // ✅ Check online status first
    if (!isOnline) {
      toast.error("You are offline. Please check your connection before removing items.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }
    
    setRemovingId(productId);
    setShowRetry(null);
    
    // ✅ Timeout بعد 15 ثانية
    const timeout = setTimeout(() => {
      setRemovingId(null);
      toast.error("Request is taking too long. Please try again.", {
        duration: 6000
      });
      setShowRetry(productId);
    }, 15000);

    try {
      const result = await removeFromWishlistAction(productId);
      
      clearTimeout(timeout);

      if (result) {
        toast.success("Removed from wishlist", {
          duration: 3000,
          icon: '💔'
        });
        router.refresh();
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error: any) {
      clearTimeout(timeout);
      
      const errorType = classifyError(error);
      
      console.error("Error removing from wishlist:", error);
      
      // ✅ معالجة الأخطاء حسب النوع
      switch (errorType) {
        case ErrorType.NETWORK:
          toast.error(
            "Connection lost. Please check your internet and try again.",
            { 
              duration: 8000,
              icon: '📡'
            }
          );
          setShowRetry(productId);
          
          // حفظ للمحاولة لاحقاً
          sessionStorage.setItem('pending_wishlist_remove', JSON.stringify({
            productId,
            timestamp: Date.now()
          }));
          break;
          
        case ErrorType.SERVER:
          toast.error(
            "Server is experiencing issues. Please try again in a moment.",
            { 
              duration: 6000,
              icon: '⚠️'
            }
          );
          setShowRetry(productId);
          break;
          
        case ErrorType.AUTH:
          toast.error("Session expired. Please login again.", {
            duration: 5000,
            icon: '🔐'
          });
          router.push("/login");
          break;
          
        default:
          toast.error(
            error.message || "Failed to remove from wishlist. Please try again.",
            { 
              duration: 5000,
              icon: '❌'
            }
          );
          setShowRetry(productId);
      }
    } finally {
      setRemovingId(null);
    }
  };

  // ✅ Auto-retry عند رجوع النت
  useEffect(() => {
    if (isOnline) {
      const pending = sessionStorage.getItem('pending_wishlist_remove');
      if (pending) {
        try {
          const { productId, timestamp } = JSON.parse(pending);
          // Only retry if less than 5 minutes old
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            toast.loading("Retrying remove from wishlist...", { duration: 1000 });
            setTimeout(() => {
              handleRemoveFromWishlist(productId);
              sessionStorage.removeItem('pending_wishlist_remove');
            }, 1000);
          } else {
            sessionStorage.removeItem('pending_wishlist_remove');
          }
        } catch (e) {
          console.error('Error parsing pending remove:', e);
        }
      }
    }
  }, [isOnline]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* ✅ Offline Warning Banner */}
      {!isOnline && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-warning" />
            <div className="flex-1">
              <p className="text-sm font-medium text-warning">
                You are currently offline
              </p>
              <p className="text-xs text-warning/80">
                You cannot remove items from wishlist while offline. Reconnect to continue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-12 h-12 text-destructive fill-destructive" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-destructive to-primary bg-clip-text text-transparent">
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
              {/* ✅ Remove Button with offline check */}
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                disabled={removingId === item.id || !isOnline}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                title={!isOnline ? "Offline - Cannot remove" : "Remove from wishlist"}
              >
                {removingId === item.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : showRetry === item.id ? (
                  <RefreshCw className="w-5 h-5" />
                ) : !isOnline ? (
                  <WifiOff className="w-5 h-5" />
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
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
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

                  {/* Rating */}
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

                {/* Add to Cart Button - already has its own offline handling */}
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