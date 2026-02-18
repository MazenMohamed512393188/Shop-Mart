"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { revalidatePath } from "next/cache";
import { GetUserResponse, UpdateUserResponse } from "@/interfaces/userInterface";
import { API_ENDPOINTS } from "@/lib/env";

export async function getLoggedUserAction() {
  const session = await getServerSession(authOptions);
  const getUser = API_ENDPOINTS.getUser();

  if (!session?.token) {
    return { message: "Not authenticated", data: null };
  }

  try {
    const response = await fetch(getUser, {
      method: "GET",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      // ✅ Timeout
      signal: AbortSignal.timeout(10000),
    });

    const data: GetUserResponse = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { message: "Session expired. Please login again.", data: null };
      }
      if (response.status >= 500) {
        return { message: "Server error. Please try again.", data: null };
      }
      return { message: data.message || "Failed to fetch user data", data: null };
    }

    return { message: "success", data: data.data };
    
  } catch (error: any) {
    console.error("Get user error:", error);
    
    // ✅ Error classification
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return { message: "Request timeout. Please try again.", data: null };
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return { message: "Network error. Please check your connection.", data: null };
    }
    return { message: "An unexpected error occurred", data: null };
  }
}

export async function updateLoggedUserAction(name: string, email: string, phone: string) {
  const session = await getServerSession(authOptions);
  const updateUser = API_ENDPOINTS.updateUser();

  if (!session?.token) {
    return { message: "Not authenticated", data: null };
  }

  // ✅ Input validation
  if (!name || !email || !phone) {
    return { message: "All fields are required", data: null };
  }

  try {
    const response = await fetch(updateUser, {
      method: "PUT",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone }),
      // ✅ Timeout
      signal: AbortSignal.timeout(10000),
    });

    const data: UpdateUserResponse = await response.json();

    if (!response.ok) {
      // ✅ Specific errors
      if (response.status === 409) {
        return { message: "Email already in use by another account", data: null };
      }
      if (response.status === 400) {
        return { message: data.message || "Invalid data provided", data: null };
      }
      if (response.status === 401 || response.status === 403) {
        return { message: "Session expired. Please login again.", data: null };
      }
      if (response.status >= 500) {
        return { message: "Server error. Please try again.", data: null };
      }
      return { message: data.message || "Failed to update profile", data: null };
    }

    // ✅ Revalidate
    revalidatePath("/profile-page");

    return { message: "success", data: data.data };
    
  } catch (error: any) {
    console.error("Update user error:", error);
    
    // ✅ Error classification
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return { message: "Request timeout. Please try again.", data: null };
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return { message: "Network error. Please check your connection.", data: null };
    }
    return { message: "An unexpected error occurred", data: null };
  }
}