"use server";

import { RegisterFormData } from "@/Schema/registerSchema";

export interface RegisterResponse {
  message: string;
  user?: { name: string; email: string };
  token?: string;
}

export async function sendRegisterRequest(data: RegisterFormData): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${process.env.Base_Url}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        rePassword: data.rePassword,
      }),
      // ✅ Timeout
      signal: AbortSignal.timeout(15000),
    });

    const result = await res.json();

    if (!res.ok) {
      // ✅ Specific error messages
      if (res.status === 409 || result.message?.includes('duplicate') || result.message?.includes('already exists')) {
        throw new Error("Email already registered");
      }
      if (res.status === 400) {
        throw new Error(result.message || "Invalid registration data");
      }
      if (res.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      throw new Error(result.message || "Registration failed");
    }

    return result;
    
  } catch (error: any) {
    // ✅ Error classification
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error("Request timeout. Please try again.");
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}