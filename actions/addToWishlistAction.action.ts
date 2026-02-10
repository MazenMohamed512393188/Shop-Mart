"use server";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { WishlistRes } from "@/interfaces/wishlistInterface";

export async function addToWishlistAction(productId: string) {
  const session = await getServerSession(authOptions);

  if (session) {
    const res = await fetch(`${process.env.Base_Url}/wishlist`, {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        token: session?.token as string,
        "Content-Type": "application/json",
      },
    });
    const data: WishlistRes = await res.json();

    return data;
  } else {
    return null;
  }
}
