import React from 'react'
import Cart from '@/components/Cart/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/actions/authOptions';
export default async function cartPage() {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.Base_Url}/cart`, {
    headers: {
      token: session?.token as string,
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  
  return <>
  
  <Cart cartData = {data.numOfCartItem===0 ? null : data}/>
  
  </>
}
