"use server";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { WishlistRes } from "@/interfaces/wishlistInterface";

export async function addToWishlistAction(productId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      console.log('No session found - user not authenticated');
      return null;
    }

    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    const res = await fetch(`${process.env.Base_Url}/wishlist`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    // ✅ Handle duplicate case
    if (res.status === 409) {
      // 409 Conflict - Item already in wishlist
      return {
        status: 'error',
        message: 'Product already in wishlist'
      };
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      console.error('Add to wishlist failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorData
      });

      // ✅ Check if backend returns "already exists" message
      if (errorData.message?.toLowerCase().includes('already') ||
          errorData.message?.toLowerCase().includes('exist')) {
        return {
          status: 'error',
          message: 'Product already in wishlist'
        };
      }

      if (res.status === 401 || res.status === 403) {
        return null;
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
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from server');
    }

    return data;
    
  } catch (error: any) {
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