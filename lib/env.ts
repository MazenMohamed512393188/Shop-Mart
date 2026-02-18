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
  // Try to get from environment
  const value = process.env[key];
  
  if (value !== undefined && value !== '') {
    return value;
  }
  
  // Use fallback if provided
  if (fallback !== undefined) {
    return fallback;
  }
  
  // Throw error if required variable is missing
  throw new Error(
    `Missing required environment variable: ${key}\n\n` +
    `Please add it to:\n` +
    `- Local development: .env.local file\n` +
    `- Production: Your hosting platform (Vercel/Netlify) dashboard\n\n` +
    `Example: ${key}=https://your-api-url.com`
  );
}

function validateUrl(url: string, varName: string): string {
  try {
    // Try to create URL object to validate
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(
      `Invalid URL for ${varName}: "${url}"\n` +
      `Please provide a valid URL like: https://your-api-url.com`
    );
  }
}

// Export typed and validated environment variables
export const env = {
  /**
   * API Base URL - Used for all API requests
   * Must be set in production!
   */
  API_URL: validateUrl(
    getEnvVar('NEXT_PUBLIC_BASE_URL'),
    'NEXT_PUBLIC_BASE_URL'
  ),
  
  /**
   * NextAuth Configuration
   */
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  
  /**
   * App URL (used for OAuth callbacks, etc.)
   */
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 
    typeof window === 'undefined' 
      ? 'http://localhost:3000' 
      : window.location.origin
  ),
  
  /**
   * Environment detection
   */
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Validate all required variables on module load
if (typeof window === 'undefined') {
  // Only validate on server (not in browser)
  console.log('✅ Environment variables validated successfully');
  console.log('📍 API URL:', env.API_URL);
}

/**
 * Helper function to build API URLs
 */
export function apiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Combine base URL with path
  return `${env.API_URL}/${cleanPath}`;
}

/**
 * Type-safe API endpoints
 */
export const API_ENDPOINTS = {
  products: (page = 1, limit = 20) => 
    apiUrl(`products?page=${page}&limit=${limit}`),
  
  productDetails: (id: any) => 
    apiUrl(`products/${id}`),
  
  wishlist: () => 
    apiUrl('wishlist'),
  
  cart: () => 
    apiUrl('cart'),
} as const;