/**
 * Centralized Environment Configuration
 *
 * This file provides:
 * 1. Type-safe environment variables
 * 2. Runtime validation
 * 3. Helpful error messages
 * 4. Single source of truth
 *
 * Usage:
 * import { env } from '@/lib/env'
 *
 * fetch(`${env.API_URL}/products`)
 */

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];

  if (value !== undefined && value !== "") {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  // في السيرفر فقط نرمي خطأ (لأن المتغيرات مطلوبة)
  if (typeof window === "undefined") {
    throw new Error(
      `Missing required environment variable: ${key}\n\n` +
      `Please add it to:\n` +
      `- Local development: .env.local file\n` +
      `- Production: Your hosting platform (Vercel/Netlify) dashboard\n\n` +
      `Example: ${key}=https://your-api-url.com`,
    );
  }

  // في العميل، نكتفي بتحذير ونرجع سلسلة فارغة
  console.warn(`Environment variable ${key} is not defined in client. Using empty string.`);
  return "";
}

function validateUrl(url: string, varName: string): string {
  try {
    // Try to create URL object to validate
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(
      `Invalid URL for ${varName}: "${url}"\n` +
        `Please provide a valid URL like: https://your-api-url.com`,
    );
  }
}

// Export typed and validated environment variables
export const env = {
  API_URL: (() => {
    if (typeof window === "undefined") {
      // server: نتحقق بدقة
      return validateUrl(getEnvVar("NEXT_PUBLIC_BASE_URL"), "NEXT_PUBLIC_BASE_URL");
    } else {
      // client: نستخدم القيمة المحقونة أو fallback ثابت
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      if (!url) {
        console.warn("NEXT_PUBLIC_BASE_URL missing in client, using fallback");
        return "https://ecommerce.routemisr.com/api/v1"; // ضع الرابط المناسب
      }
      return validateUrl(url, "NEXT_PUBLIC_BASE_URL");
    }
  })(),

  // باقي المتغيرات بنفس الطريقة (إذا كنت تريد حماية NEXTAUTH_URL أيضاً)
  NEXTAUTH_SECRET: getEnvVar("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: getEnvVar("NEXTAUTH_URL", 
    typeof window === "undefined" ? "http://localhost:3000" : window.location.origin
  ),
  // ...
} as const;

// Validate all required variables on module load
if (typeof window === "undefined") {
  // Only validate on server (not in browser)
  console.log("✅ Environment variables validated successfully");
  console.log("📍 API URL:", env.API_URL);
}

/**
 * Helper function to build API URLs
 */
export function apiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Combine base URL with path
  return `${env.API_URL}/${cleanPath}`;
}

/**
 * Type-safe API endpoints
 */
export const API_ENDPOINTS = {
  products: (page = 1, limit = 20) =>
    apiUrl(`products?page=${page}&limit=${limit}`),

  productDetails: (id: any) => apiUrl(`products/${id}`),

  wishlist: () => apiUrl("wishlist"),

  cart: () => apiUrl("cart"),

  categories: () => apiUrl("categories"),

  categoryDetails: (id: any) => apiUrl(`categories/${id}`),

  CategoryProducts: (id: any) => apiUrl(`products?category=${id}`),

  brands: () => apiUrl("brands"),

  brandDetails: (id: any) => apiUrl(`brands/${id}`),

  BrandProducts: (id: any) => apiUrl(`products?brand=${id}`),

  getUser: () => apiUrl("users/getMe"),

  orders: (id: any) => apiUrl(`orders/user/${id}`),

  address: () => apiUrl("addresses"),

  deleteAddress: (id: any) => apiUrl(`addresses/${id}`),

  signIn: () => apiUrl("auth/signin"),

  cartAction: (id: any) => apiUrl(`cart/${id}`),

  changePassword: () => apiUrl("users/changeMyPassword"),

  onlinePayment: () => apiUrl("orders/checkout-session"),

  cashPayment: (id: any) => apiUrl(`orders/${id}`),

  signUp: () => apiUrl("auth/signUp"),

  removeFromWishlist: (id: any) => apiUrl(`wishlist/${id}`),

  forgotPasswords: () => apiUrl("auth/forgotPasswords"),

  verifyResetCode: () => apiUrl("auth/verifyResetCode"),

  resetPassword: () => apiUrl("auth/resetPassword"),

  updateUser: () => apiUrl("users/updateMe"),
} as const;
