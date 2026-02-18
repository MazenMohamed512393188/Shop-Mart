import React from "react";
import Cart from "@/components/Cart/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/actions/authOptions";
import { API_ENDPOINTS } from "@/lib/env";
export default async function cartPage() {
  const session = await getServerSession(authOptions);
  const cartUrl = API_ENDPOINTS.cart();
  const response = await fetch(cartUrl, {
    headers: {
      token: session?.token as string,
      "content-type": "application/json",
    },
  });
  const data = await response.json();

  return (
    <>
      <Cart cartData={data.numOfCartItem === 0 ? null : data} />
    </>
  );
}
