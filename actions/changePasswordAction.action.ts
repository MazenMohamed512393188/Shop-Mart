"use server";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";

export async function changePasswordAction(
  currentPassword: string,
  password: string,
  rePassword: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return { error: "Not authenticated", message: "error" };
  }

  // ✅ Input validation
  if (!currentPassword || !password || !rePassword) {
    return { error: "All fields are required", message: "error" };
  }

  if (password !== rePassword) {
    return { error: "New passwords do not match", message: "error" };
  }

  // ✅ FIX 5: التحقق من أن الباسورد الجديد مختلف عن القديم
  if (currentPassword === password) {
    return { 
      error: "New password must be different from current password", 
      message: "error" 
    };
  }

  // ✅ FIX 6: التحقق من قوة الباسورد (server-side validation)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
  if (!passwordRegex.test(password)) {
    return {
      error: "Password must contain at least one uppercase, lowercase, number and special character",
      message: "error"
    };
  }

  try {
    const res = await fetch(`${process.env.Base_Url}/users/changeMyPassword`, {
      method: "PUT",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, password, rePassword }),
      // ✅ Timeout
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();

    if (!res.ok) {
      // ✅ Specific error handling
      if (res.status === 401) {
        return { error: "Current password is incorrect", message: "error" };
      }
      if (res.status === 400) {
        return { error: data.message || "Invalid password format", message: "error" };
      }
      if (res.status >= 500) {
        return { error: "Server error. Please try again.", message: "error" };
      }
      return { error: data.message || data.errors?.msg || "Failed to change password", message: "error" };
    }

    // ✅ FIX 7: التأكد من وجود token جديد أو رسالة نجاح
    if (data.message === "success" || data.token) {
      return { 
        message: "success", 
        token: data.token,
        // يمكن إرجاع بيانات إضافية إذا لزم الأمر
      };
    }

    return { error: "Unexpected response from server", message: "error" };
    
  } catch (error: any) {
    console.error("Change password error:", error);
    
    // ✅ Error classification
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return { error: "Request timeout. Please try again.", message: "error" };
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return { error: "Network error. Please check your connection.", message: "error" };
    }
    return { error: "An unexpected error occurred", message: "error" };
  }
}