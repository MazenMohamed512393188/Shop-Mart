"use client";
import { Button } from "../ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addToWishlistAction } from "@/actions/addToWishlistAction.action";

export default function AddToWishlist({
  productId,
  isInWishlist = false,
}: {
  productId: string;
  isInWishlist?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const router = useRouter();

  async function toggleWishlist(productId: string) {
    setIsLoading(true);
    try {
      const data = await addToWishlistAction(productId);
      if (data === null) {
        toast.error("Please login first");
        router.push("/login");
      } else {
        setInWishlist(!inWishlist);
        toast.success(
          inWishlist
            ? "Removed from wishlist"
            : data?.status || "Added to wishlist"
        );
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Error updating wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => toggleWishlist(productId)}
        disabled={isLoading}
        variant="outline"
        size="icon"
        className="border-2 hover:bg-red-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart
            className={`w-5 h-5 transition-colors ${
              inWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        )}
      </Button>
    </>
  );
}