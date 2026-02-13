"use client";

import { Button } from "../ui/button";
import { Loader2, ShoppingCart, WifiOff, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { addToCartAction } from "@/actions/addToCartAction.action";
import { useRouter } from "next/navigation";

// ✅ أنواع الأخطاء
enum ErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  UNKNOWN = 'unknown'
}

export default function AddToCart({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const router = useRouter();

  // ✅ Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", { duration: 3000 });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline", { duration: 5000 });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ✅ تصنيف الأخطاء
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

  // ✅ Add to Cart مع Error Handling
  async function addToCart(productId: string, isRetry = false) {
    // تحقق من الاتصال أولاً
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }

    setIsLoading(true);
    setShowRetry(false);
    
    // ✅ Timeout بعد 15 ثانية
    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast.error("Request is taking too long. Please try again.", {
        duration: 6000
      });
      setShowRetry(true);
    }, 15000);

    try {
      const data = await addToCartAction(productId);
      
      clearTimeout(timeout);

      // معالجة الحالات المختلفة
      if (data === null) {
        // ✅ User مش مسجل دخول
        toast.error("Please login first to add items to cart", {
          duration: 5000,
          icon: '🔐'
        });
        
        // حفظ المنتج للإضافة بعد Login
        sessionStorage.setItem('pending_cart_add', productId);
        
        router.push("/login");
        
      } else if (data.status === "success" || data.message) {
        // ✅ نجح
        toast.success(data.message || "Added to cart successfully", {
          duration: 4000,
          icon: '🛒'
        });
        
        // إزالة أي pending action
        sessionStorage.removeItem('pending_cart_add');
        
        router.refresh();
        
      } else {
        // ✅ خطأ من الـ Backend
        throw new Error(data.message || 'Failed to add to cart');
      }
      
    } catch (error: any) {
      clearTimeout(timeout);
      
      const errorType = classifyError(error);
      
      console.error("Error adding to cart:", error);
      
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
          setShowRetry(true);
          
          // حفظ للمحاولة لاحقاً
          sessionStorage.setItem('pending_cart_add', productId);
          break;
          
        case ErrorType.SERVER:
          toast.error(
            "Server is experiencing issues. Please try again in a moment.",
            { 
              duration: 6000,
              icon: '⚠️'
            }
          );
          setShowRetry(true);
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
            error.message || "Failed to add to cart. Please try again.",
            { 
              duration: 5000,
              icon: '❌'
            }
          );
          setShowRetry(true);
      }
      
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Auto-retry عند رجوع النت
  useEffect(() => {
    if (isOnline && showRetry) {
      const pendingProduct = sessionStorage.getItem('pending_cart_add');
      if (pendingProduct === productId) {
        toast.loading("Retrying...", { duration: 1000 });
        setTimeout(() => {
          addToCart(productId, true);
        }, 1000);
      }
    }
  }, [isOnline]);

  return (
    <>
      <Button
        disabled={isLoading || !isOnline}
        className="w-full cursor-pointer gap-2"
        onClick={() => addToCart(productId)}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4" />
            Offline
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Adding...
          </>
        ) : showRetry ? (
          <>
            <RefreshCw className="w-4 h-4" />
            Retry
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </Button>
    </>
  );
}