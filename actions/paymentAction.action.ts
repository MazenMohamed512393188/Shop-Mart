"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { revalidatePath } from "next/cache";
import { API_ENDPOINTS } from "@/lib/env";

export async function checkOutAction(cartId : string , details : string , city : string , phone : string ) {

    const session = await getServerSession(authOptions);
    const onlinePaymentUrl =  API_ENDPOINTS.onlinePayment();

    const shippingAddress = {
        details,
        city,
        phone
    }
    const response = await fetch(`${onlinePaymentUrl}/${cartId}?url=${process.env.LOCALHOST}`, {
        method: "POST",
        headers: {
            token: session?.token as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({shippingAddress}),
    });

    const data = await response.json();
    console.log("Online payment response:", data);
    
    return data;
}

export async function cashAction(cartId : string , details : string , city : string , phone : string ) {

    const session = await getServerSession(authOptions);
    const cashPaymentUrl =  API_ENDPOINTS.cashPayment(cartId);

    const shippingAddress = {
        details,
        city,
        phone
    }
    
    const response = await fetch(cashPaymentUrl, {
        method: "POST",
        headers: {
            token: session?.token as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({shippingAddress}),
    });

    const data = await response.json();
    console.log("Cash payment response:", data);
    
    if (data.status === "success") {

        revalidatePath('/allorders');
        
        revalidatePath('/cart');
        
    }
    
    return data;
}