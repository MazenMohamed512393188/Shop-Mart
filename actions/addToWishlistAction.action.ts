"use server";

import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { WishlistRes } from "@/interfaces/wishlistInterface";

export async function addToWishlistAction(productId: string) {
  try {
    const session = await getServerSession(authOptions);

    // ✅ التحقق من الـ session
    if (!session) {
      console.log('No session found - user not authenticated');
      return null;
    }

    // ✅ Validation
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    // ✅ API Call مع Error Handling
    const res = await fetch(`${process.env.Base_Url}/wishlist`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      // ✅ Timeout بعد 10 ثواني
      signal: AbortSignal.timeout(10000),
    });

    // ✅ التحقق من الـ response
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      console.error('Add to wishlist failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorData
      });

      // إرجاع خطأ واضح حسب الـ status
      if (res.status === 401 || res.status === 403) {
        return null; // Session expired
      }
      
      if (res.status === 404) {
        return {
          status: 'error',
          message: 'Product not found'
        };
      }
      
      if (res.status === 400) {
        return {
          status: 'error',
          message: errorData.message || 'Invalid request'
        };
      }
      
      if (res.status >= 500) {
        return {
          status: 'error',
          message: 'Server error. Please try again later.'
        };
      }

      throw new Error(errorData.message || 'Failed to update wishlist');
    }

    const data: WishlistRes = await res.json();
    
    // ✅ التحقق من صحة البيانات المرجعة
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from server');
    }

    return data;
    
  } catch (error: any) {
    // ✅ معالجة أنواع الأخطاء المختلفة
    if (error.name === 'AbortError') {
      console.error('Request timeout - add to wishlist');
      return {
        status: 'error',
        message: 'Request timeout. Please try again.'
      };
    }
    
    if (error.message?.includes('fetch')) {
      console.error('Network error - add to wishlist:', error);
      return {
        status: 'error',
        message: 'Network error. Please check your connection.'
      };
    }

    console.error('Unexpected error in addToWishlistAction:', error);
    
    return {
      status: 'error',
      message: error.message || 'An unexpected error occurred'
    };
  }
}