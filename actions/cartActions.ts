"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";



export async function deleteProductAction(productId: string) {

    const session = await getServerSession(authOptions);

    const response = await fetch(`${process.env.Base_Url}/cart/${productId}`, {
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

    const response = await fetch(`${process.env.Base_Url}/cart`, {
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

    const response = await fetch(`${process.env.Base_Url}/cart/${productId}`, {
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