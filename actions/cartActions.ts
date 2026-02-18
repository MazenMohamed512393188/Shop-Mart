"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { API_ENDPOINTS } from "@/lib/env";



export async function deleteProductAction(productId: string) {

    const session = await getServerSession(authOptions);
    const cartActionUrl = API_ENDPOINTS.cartAction(productId);

    const response = await fetch(cartActionUrl, {
        method: "DELETE",
        headers: {
            token: session?.token as string,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
}

export async function clearCartAction() {

    const session = await getServerSession(authOptions);
    const cartUrl = API_ENDPOINTS.cart();

    const response = await fetch(cartUrl, {
        method: "DELETE",
        headers: {
            token: session?.token as string,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
}

export async function updateCartAction(count: number, productId: string) {

    const session = await getServerSession(authOptions);
    const cartActionUrl = API_ENDPOINTS.cartAction(productId);

    const response = await fetch(cartActionUrl, {
        method: "PUT",
        headers: {
            token: session?.token as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            count: count,
            productId: productId,
        }),
    });

    const data = await response.json();
    return data;
}