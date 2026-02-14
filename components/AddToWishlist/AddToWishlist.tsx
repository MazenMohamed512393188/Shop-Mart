"use client";
import { Button } from "../ui/button";
import { Heart, Loader2, WifiOff, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addToWishlistAction } from "@/actions/addToWishlistAction.action";

enum ErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  AUTH = 'auth',
  UNKNOWN = 'unknown'
}

export default function AddToWishlist({
  productId,
  isInWishlist = false,
}: {
  productId: string;
  isInWishlist?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [isOnline, ] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const [, setLastAction] = useState<'add' | 'remove' | null>(null);
  const router = useRouter();

  // ✅ Online/Offline Detection
  // في كل component
useEffect(() => {
  const handleOffline = () => {
    toast.error("You are offline", {
      id: 'offline-status', // ✅ Same ID = only one toast
      duration: 5000
    });
  };
  
  const handleOnline = () => {
    toast.success("Connection restored", {
      id: 'online-status', // ✅ Same ID
      duration: 3000
    });
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
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

  // ✅ Toggle Wishlist مع Error Handling
  async function toggleWishlist(productId: string, isRetry = false) {
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }

    setIsLoading(true);
    setShowRetry(false);
    
    // حفظ الحالة الحالية للـ rollback لو فشل
    const previousState = inWishlist;
    const action = inWishlist ? 'remove' : 'add';
    setLastAction(action);
    
    // ✅ Optimistic Update
    if (!isRetry) {
      setInWishlist(!inWishlist);
    }
    
    // ✅ Timeout بعد 15 ثانية
    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast.error("Request is taking too long. Please try again.", {
        duration: 6000
      });
      setShowRetry(true);
      // Rollback
      setInWishlist(previousState);
    }, 15000);

    try {
      const data = await addToWishlistAction(productId);
      
      clearTimeout(timeout);

      if (data === null) {
        // ✅ User مش مسجل دخول
        toast.error("Please login first to add items to wishlist", {
          duration: 5000,
          icon: '🔐'
        });
        
        // Rollback
        setInWishlist(previousState);
        
        // حفظ المنتج للإضافة بعد Login
        sessionStorage.setItem('pending_wishlist_add', JSON.stringify({
          productId,
          action
        }));
        
        router.push("/login");
        
      } else if (data.status === "success" || data.status) {
        // ✅ نجح
        const successMessage = action === 'add' 
          ? data.status || "Added to wishlist ❤️"
          : "Removed from wishlist";
          
        toast.success(successMessage, {
          duration: 3000,
          icon: action === 'add' ? '❤️' : '💔'
        });
        
        // تأكيد الحالة الجديدة
        setInWishlist(!previousState);
        
        // إزالة أي pending action
        sessionStorage.removeItem('pending_wishlist_add');
        
        router.refresh();
        
      } else {
        // ✅ خطأ من الـ Backend
        throw new Error(data.status || 'Failed to update wishlist');
      }
      
    } catch (error: any) {
      clearTimeout(timeout);
      
      const errorType = classifyError(error);
      
      console.error("Error updating wishlist:", error);
      
      // ✅ Rollback للحالة السابقة
      setInWishlist(previousState);
      
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
          sessionStorage.setItem('pending_wishlist_add', JSON.stringify({
            productId,
            action
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
            error.message || "Failed to update wishlist. Please try again.",
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
      const pendingAction = sessionStorage.getItem('pending_wishlist_add');
      if (pendingAction) {
        try {
          const { productId: savedProductId } = JSON.parse(pendingAction);
          if (savedProductId === productId) {
            toast.loading("Retrying...", { duration: 1000 });
            setTimeout(() => {
              toggleWishlist(productId, true);
            }, 1000);
          }
        } catch (e) {
          console.error('Error parsing pending action:', e);
        }
      }
    }
  }, [isOnline]);

  return (
    <>
      <Button
        onClick={() => toggleWishlist(productId)}
        disabled={isLoading || !isOnline}
        variant="outline"
        size="icon"
        className="border-2 hover:bg-red-50 transition-all"
        title={
          !isOnline 
            ? "Offline" 
            : showRetry 
            ? "Retry" 
            : inWishlist 
            ? "Remove from wishlist" 
            : "Add to wishlist"
        }
      >
        {!isOnline ? (
          <WifiOff className="w-5 h-5 text-gray-400" />
        ) : isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : showRetry ? (
          <RefreshCw className="w-5 h-5 text-orange-500" />
        ) : (
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              inWishlist
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-600 hover:text-red-500 hover:scale-110"
            }`}
          />
        )}
      </Button>
    </>
  );
}