import { OrderRes } from "@/interfaces/userOrdersInterface";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/actions/authOptions";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Package, CheckCircle, Clock, Truck, MapPin, Calendar, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function AllOrdersModern() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    redirect("/login");
  }

  try {
    let userId = null;
    
    try {
      const cartResponse = await fetch(`${process.env.Base_Url}/cart`, {
        headers: {
          token: session.token as string,
          "content-type": "application/json",
        },
        next: { revalidate: 60 },
      });

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        userId = cartData?.data?.cartOwner || cartData?.data?.user?._id;
      }
    } catch (error) {
      console.log("Cart is empty or unavailable");
    }

    if (!userId) {
      try {
        const userResponse = await fetch(`${process.env.Base_Url}/users/getMe`, {
          headers: {
            token: session.token as string,
            "content-type": "application/json",
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData?.data?._id;
        }
      } catch (error) {
        console.log("Could not fetch user profile");
      }
    }

    if (!userId) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
          <div className="container mx-auto px-4 py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                <Package className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Unable to Identify User</h1>
              <p className="text-muted-foreground dark:text-slate-300 mb-8">
                Please try again or contact support
              </p>
          </div>
        </div>
      );
    }

    const ordersResponse = await fetch(
      `${process.env.Base_Url}/orders/user/${userId}`,
      {
        headers: {
          token: session.token as string,
          "content-type": "application/json",
        },
        next: { revalidate: 60 },
        cache: "no-store",
      }
    );    

    const ordersData = await ordersResponse.json();
    const orders = ordersData?.data || ordersData || [];

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:bg-slate-900">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
          <div className="container mx-auto px-4 py-24 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <Package className="w-8 h-8" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
                Track and manage all your purchases in one place
              </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="container mx-auto px-4 mt-8 pb-24">
          {orders.length === 0 ? (
            <div>
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-bold mb-4">No Orders Found</h3>
              <p className="text-muted-foreground mb-8">
                Your orders will appear here after you make a purchase
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                Start Shopping
              </Link>
                </div>
          ) : (
            <div className="space-y-6">
              {orders.reverse().map((order: OrderRes) => (
                <div key={order._id} className="border">
                  {/* Order Header */}
                  <div className="p-6 border-b border-border dark:border-slate-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold mb-2">
                          Order #{order._id?.slice(-8) || "N/A"}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {order.createdAt.slice(0,10)}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            {order.paymentMethodType || "Not specified"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          order.isPaid
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}>
                          {order.isPaid ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          order.isDelivered
                            ? "bg-success/10 text-success"
                            : "bg-accent/10 text-accent"
                        }`}>
                          {order.isDelivered ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Delivered
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3" />
                              In Transit
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Total Amount:
                      </div>
                      <div className="text-2xl font-bold">
                        {order.totalOrderPrice || 0} EGP
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="p-6 border-b border-border dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold">Shipping Address</h3>
                      </div>
                      <div className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-4">
                        <p className="font-medium mb-1">{order.shippingAddress.details || "No details provided"}</p>
                        <p>{order.shippingAddress.city || "No city specified"}</p>
                        {order.shippingAddress.phone && (
                          <p className="mt-2">📞 {order.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">
                      Order Items ({order.cartItems?.length || 0})
                    </h3>
                    
                    {order.cartItems && order.cartItems.length > 0 ? (
                      <div className="space-y-3">
                        {order.cartItems.map((item) => (
                          <div
                            key={item._id || item.product?._id}
                            className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            {item.product?.imageCover && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-secondary to-accent/10 flex-shrink-0">
                                <Image
                                  src={item.product.imageCover}
                                  alt={item.product.title || "Product"}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {item.product?.title || "Unknown Product"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Quantity: {item.count || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{item.price || 0} EGP</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-warning/10 text-warning rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-sm">No items found in this order</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  {order.updatedAt && (
                    <div className="px-6 py-4 bg-secondary/30 border-t border-border dark:border-slate-700">
                      <div className="text-sm text-muted-foreground text-right">
                        Last updated:{" "}
                        {(order.updatedAt.slice(0,10))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );

  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
        <div className="container mx-auto px-4 py-24">

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Failed to Load Orders</h1>
            <p className="text-muted-foreground dark:text-slate-300 mb-4">
              {error instanceof Error
                ? error.message
                : "Unable to connect to the server"}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Please try refreshing the page or contact support if the problem persists
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
        </div>
      </div>
    );
  }
}