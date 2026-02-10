"use server";

// Step 1: Send Code
export async function sendResetCode(email: string) {
  const res = await fetch(`${process.env.Base_Url}/auth/forgotPasswords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Email not found");
  }
}

// Step 2: Verify Code
export async function verifyResetCode(code: string) {
  const res = await fetch(`${process.env.Base_Url}/auth/verifyResetCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resetCode: code }),
  });

  if (!res.ok) {
    throw new Error("Invalid code");
  }
}

// Step 3: Reset Password
export async function resetPassword(email: string, password: string) {
  const res = await fetch(`${process.env.Base_Url}/auth/resetPassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      newPassword: password,
    }),
  });

  if (!res.ok) {
    throw new Error("Reset failed");
  }
}