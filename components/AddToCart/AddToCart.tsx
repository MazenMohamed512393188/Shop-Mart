"use client";
import { Button } from "../ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { addToCartAction } from "@/actions/addToCartAction.action";
import { useRouter } from "next/navigation";

export default function AddToCart({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function addToCart(productId: string) {
    setIsLoading(true);
    try {
      const data = await addToCartAction(productId);
      if (data === null) {
        toast.error("Please login first");
        router.push("/login");
      } else {
        toast.success(data?.message || "Added to cart successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        disabled={isLoading}
        className="w-full cursor-pointer gap-2"
        onClick={() => addToCart(productId)}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </Button>
    </>
  );
}