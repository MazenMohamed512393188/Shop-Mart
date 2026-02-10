"use server";
import { authOptions } from "./authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function removeFromWishlistAction(productId: string) {
  const session = await getServerSession(authOptions);

  if (session) {
    const res = await fetch(`${process.env.Base_Url}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        token: session?.token as string,
        "Content-Type": "application/json",
      },
    });
    
    const data = await res.json();

    revalidatePath('/wishlist');
    
    return data;
  } else {
    return null;
  }
}