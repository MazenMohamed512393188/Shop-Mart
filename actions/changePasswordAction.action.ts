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
    return {
      error: "Not authenticated",
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
      body: JSON.stringify({
        currentPassword,
        password,
        rePassword
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        error: data.message || data.errors?.msg || "Failed to change password",
        message: "error"
      };
    }

    return data;
  } catch (error) {
    console.error("Change password error:", error);
    return {
      error: "Network error. Please try again.",
      message: "error"
    };
  }
}