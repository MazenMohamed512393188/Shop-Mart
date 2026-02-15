"use server";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function removeFromWishlistAction(productId: string) {
  const session = await getServerSession(authOptions);

  // ✅ Session validation
  if (!session?.token) {
    console.log('No session found - user not authenticated');
    return null;
  }

  // ✅ Input validation
  if (!productId || typeof productId !== 'string') {
    throw new Error('Invalid product ID');
  }

  try {
    const res = await fetch(`${process.env.Base_Url}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      // ✅ Timeout بعد 10 ثواني
      signal: AbortSignal.timeout(10000),
    });

    // ✅ Check response status
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      console.error('Remove from wishlist failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorData
      });

      // ✅ Specific error messages based on status
      if (res.status === 401 || res.status === 403) {
        return null; // Session expired
      }
      
      if (res.status === 404) {
        throw new Error('Product not found in wishlist');
      }
      
      if (res.status === 400) {
        throw new Error(errorData.message || 'Invalid request');
      }
      
      if (res.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      throw new Error(errorData.message || 'Failed to remove from wishlist');
    }

    const data = await res.json();

    // ✅ Revalidate wishlist page
    revalidatePath('/wishlist-page');
    
    // ✅ Verify data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from server');
    }

    return data;
    
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    
    // ✅ Error classification
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error('Network error. Please check your connection.');
    }

    // Re-throw with original message
    throw error;
  }
}