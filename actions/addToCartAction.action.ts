"use server";

import { CartRes } from "@/interfaces/cartInterface";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";

export async function addToCartAction(productId: string) {
  const session = await getServerSession(authOptions);

  if (session) {
    const res = await fetch(`${process.env.Base_Url}/cart`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        token: session?.token as string,
        "Content-Type": "application/json",
      },
    });
    const data: CartRes = await res.json();

    return data;
  } else {
    return null;
  }
}
