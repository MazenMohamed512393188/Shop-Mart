"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { revalidatePath } from "next/cache";
import { AddAddressResponse, GetAddressesResponse } from "@/interfaces/addressInterface";


export async function addAddressAction(
  details: string,
  phone: string,
  city: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      status: "error",
      message: "Not authenticated",
    };
  }

  try {
    const response = await fetch(`${process.env.Base_Url}/addresses`, {
      method: "POST",
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Home", 
        details,
        phone,
        city,
      }),
    });

    const data: AddAddressResponse = await response.json();

    console.log("Add Address Response:", {
      status: response.status,
      data: data,
      ok: response.ok
    });

    if (!response.ok) {
      return {
        status: "error",
        message: data.message || `Failed to add address (Status: ${response.status})`,
      };
    }

    revalidatePath("/profile-page");
    revalidatePath("/add-address-page");

    return data;
  } catch (error) {
    console.error("Add address error:", error);
    return {
      status: "error",
      message: "Network error. Please try again.",
    };
  }
}

export async function getAddressesAction() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      status: "error",
      message: "Not authenticated",
      data: [],
    };
  }

  try {
    const response = await fetch(`${process.env.Base_Url}/addresses`, {
      headers: {
        token: session.token as string,
        "Content-Type": "application/json",
      },
    });

    const data: GetAddressesResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        message: data.status || "Failed to fetch addresses",
        data: [],
      };
    }

    return {
      status: "success",
      data: data.data || [],
    };
  } catch (error) {
    console.error("Get addresses error:", error);
    return {
      status: "error",
      message: "Network error. Please try again.",
      data: [],
    };
  }
}

export async function deleteAddressAction(addressId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return {
      status: "error",
      message: "Not authenticated",
    };
  }

  try {
    const response = await fetch(
      `${process.env.Base_Url}/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          token: session.token as string,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        message: data.message || "Failed to delete address",
      };
    }

    revalidatePath("/profile-page");

    return {
      status: "success",
      message: "Address deleted successfully",
    };
  } catch (error) {
    console.error("Delete address error:", error);
    return {
      status: "error",
      message: "Network error. Please try again.",
    };
  }
}