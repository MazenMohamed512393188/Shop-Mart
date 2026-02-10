"use server";

import { RegisterFormData } from "@/Schema/registerSchema";

export interface RegisterResponse {
  message: string;
  user?: {
    name: string;
    email: string;
  };
  token?: string;
}

export async function sendRegisterRequest(data: RegisterFormData): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${process.env.Base_Url}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        rePassword: data.rePassword,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during registration");
  }
}