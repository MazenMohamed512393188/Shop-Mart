"use server";

// Step 1: Send Code
export async function sendResetCode(email: string) {
  try {
    if (!email || !email.includes('@')) {
      throw new Error("Please enter a valid email address");
    }

    const res = await fetch(`${process.env.Base_Url}/auth/forgotPasswords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Email not found. Please check and try again.");
      }
      if (res.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      const error = await res.json();
      throw new Error(error.message || "Failed to send reset code");
    }
    
  } catch (error: any) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error("Request timeout. Please try again.");
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

// Step 2: Verify Code
export async function verifyResetCode(code: string) {
  try {
    if (!code || code.length < 4) {
      throw new Error("Please enter a valid code");
    }

    const res = await fetch(`${process.env.Base_Url}/auth/verifyResetCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetCode: code }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Invalid or expired code");
      }
      if (res.status >= 500) {
        throw new Error("Server error. Please try again.");
      }
      throw new Error("Code verification failed");
    }
    
  } catch (error: any) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error("Request timeout. Please try again.");
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

export async function resetPassword(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const res = await fetch(`${process.env.Base_Url}/auth/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Invalid request. Please start over.");
      }
      if (res.status >= 500) {
        throw new Error("Server error. Please try again.");
      }
      const error = await res.json();
      throw new Error(error.message || "Password reset failed");
    }
    
  } catch (error: any) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error("Request timeout. Please try again.");
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}