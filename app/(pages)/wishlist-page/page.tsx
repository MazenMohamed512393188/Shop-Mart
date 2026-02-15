import WishList from "@/components/WishList/WishList";
import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/actions/authOptions";

function WishlistSkeleton() {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-20">
          <div className="h-16 bg-gray-200 dark:bg-gray-900 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-900 rounded w-32 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-gray-200 dark:border-gray-900 py-5">
              <div className="h-96 bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-900 rounded w-24 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-900 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function WishlistData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Please Login</h2>
          <p className="text-lg text-gray-800 mb-8">
            You need to login to view your wishlist
          </p>
          <a
            href="/login"
            className="bg-black text-white px-12 py-4 font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-black border-2 border-black transition-all duration-300 inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const response = await fetch(`${process.env.Base_Url}/wishlist`, {
    headers: {
      token: session?.token as string,
      "content-type": "application/json",
    },
  });

  const data = await response.json();

  return <WishList wishlistData={data.count === 0 ? null : data} />;
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistData />
    </Suspense>
  );
}
