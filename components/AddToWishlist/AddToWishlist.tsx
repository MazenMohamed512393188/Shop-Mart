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
  const [isOnline, setIsOnline] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const [, setLastAction] = useState<'add' | 'remove' | null>(null);
  const router = useRouter();

  // ✅ Sync with prop changes
  useEffect(() => {
    setInWishlist(isInWishlist);
  }, [isInWishlist]);

  // ✅ Online/Offline Detection
  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline", {
        id: 'offline-status',
        duration: 5000
      });
    };
    
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", {
        id: 'online-status',
        duration: 3000
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
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

  // ✅ Toggle Wishlist with Duplicate Prevention
  async function toggleWishlist(productId: string, isRetry = false) {
    // ✅ Prevent action if already in wishlist (Frontend validation)
    if (!isRetry && inWishlist) {
      toast("This item is already in your wishlist", {
        icon: '❤️',
        duration: 3000
      });
      return;
    }

    if (!isOnline) {
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }

    setIsLoading(true);
    setShowRetry(false);
    
    const previousState = inWishlist;
    const action = inWishlist ? 'remove' : 'add';
    setLastAction(action);
    
    // ✅ Optimistic Update
    if (!isRetry) {
      setInWishlist(!inWishlist);
    }
    
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
        // Not authenticated
        toast.error("Please login first to add items to wishlist", {
          duration: 5000,
          icon: '🔐'
        });
        
        setInWishlist(previousState);
        
        sessionStorage.setItem('pending_wishlist_add', JSON.stringify({
          productId,
          action
        }));
        
        router.push("/login");
        return;
      }

      // ✅ Check for duplicate error from backend
      if (data.status === "error") {
        toast("This item is already in your wishlist", {
          icon: '❤️',
          duration: 3000
        });
        
        // Update state to reflect it's in wishlist
        setInWishlist(true);
        sessionStorage.removeItem('pending_wishlist_add');
        return;
      }

      // ✅ Success
      if (data.status === "success") {
        const successMessage = action === 'add' 
          ? "Added to wishlist ❤️"
          : "Removed from wishlist 💔";
          
        toast.success(successMessage, {
          duration: 3000,
          icon: action === 'add' ? '❤️' : '💔'
        });
        
        // Confirm new state
        setInWishlist(!previousState);
        sessionStorage.removeItem('pending_wishlist_add');
        
        router.refresh();
        return;
      }

      // Unknown response
      throw new Error('Unexpected response from server');
      
    } catch (error: any) {
      clearTimeout(timeout);
      
      const errorType = classifyError(error);
      
      console.error("Error updating wishlist:", error);
      
      // Rollback
      setInWishlist(previousState);
      
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

  // ✅ Auto-retry
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
          ? "Add to wishlist" 
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
  );
}