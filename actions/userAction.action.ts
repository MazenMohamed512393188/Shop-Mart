"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { revalidatePath } from "next/cache";
import { GetUserResponse, UpdateUserResponse } from "@/interfaces/userInterface";

export async function getLoggedUserAction() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      message: "Not authenticated",
      data: null,
    };
  }

  try {
    const response = await fetch(`${process.env.Base_Url}/users/getMe`, {
      method: "GET",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
    });

    const data: GetUserResponse = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Failed to fetch user data",
        data: null,
      };
    }

    return {
      message: "success",
      data: data.data,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return {
      message: "Network error. Please try again.",
      data: null,
    };
  }
}

// Update logged in user data
export async function updateLoggedUserAction(name: string, email: string, phone: string) {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      message: "Not authenticated",
      data: null,
    };
  }

  try {
    const response = await fetch(`${process.env.Base_Url}/users/updateMe`, {
      method: "PUT",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
      }),
    });

    const data: UpdateUserResponse = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Failed to update user data",
        data: null,
      };
    }

    // Revalidate profile page to show updated data
    revalidatePath("/profile");

    return {
      message: "success",
      data: data.data,
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      message: "Network error. Please try again.",
      data: null,
    };
  }
}