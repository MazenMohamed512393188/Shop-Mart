"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  CreditCard,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { CartRes } from "@/interfaces/cartInterface";
import {
  clearCartAction,
  deleteProductAction,
  updateCartAction,
} from "@/actions/cartActions";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkOutAction, cashAction } from "@/actions/paymentAction.action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const formatCurrency = (amount: number, currency = "EGP", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const benefits = [
  {
    icon: <Package />,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: <Shield />,
    title: "2-Year Warranty",
    description: "Quality guaranteed",
  },
  { icon: <Truck />, title: "Fast Delivery", description: "2-3 business days" },
  { icon: <CreditCard />, title: "Secure Payment", description: "100% secure" },
];

enum ErrorType {
  NETWORK = "network",
  SERVER = "server",
  VALIDATION = "validation",
  PAYMENT = "payment",
  CART_EMPTY = "cart_empty",
  UNKNOWN = "unknown",
}

// ✅ رسائل خطأ واضحة
const ERROR_MESSAGES = {
  [ErrorType.NETWORK]:
    "Connection lost. Please check your internet and try again.",
  [ErrorType.SERVER]:
    "Our servers are experiencing issues. Your cart is saved. Please try again in a few moments.",
  [ErrorType.VALIDATION]: "Please check your information and try again.",
  [ErrorType.PAYMENT]:
    "Payment service is temporarily unavailable. You can still use Cash on Delivery.",
  [ErrorType.CART_EMPTY]: "Your cart is empty. Please add items first.",
  [ErrorType.UNKNOWN]: "Something went wrong. Please try again.",
};

export default function CartModern({ cartData }: { cartData: CartRes | null }) {
  const [isOnline, setIsOnline] = useState(true);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const detailsInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);
  const [cart, setCart] = useState<CartRes | null>(cartData || null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isCashLoading, setIsCashLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored");

      // محاولة إعادة الـ action اللي فشل
      if (pendingAction) {
        retryPendingAction();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Please check your connection.", {
        duration: 8000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // تحقق من الحالة الحالية
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingAction]);

  // ✅ تصنيف الأخطاء
  function classifyError(error: any): ErrorType {
    // فحص الاتصال بالإنترنت
    if (!navigator.onLine) return ErrorType.NETWORK;

    // فحص أخطاء الـ fetch
    if (error instanceof TypeError || error.message?.includes("fetch")) {
      return ErrorType.NETWORK;
    }

    // فحص HTTP status codes
    const status = error.response?.status || error.status;
    if (status >= 500) return ErrorType.SERVER;
    if (status >= 400) return ErrorType.VALIDATION;

    // فحص أخطاء محددة
    const code = error.code || error.response?.data?.code;
    if (code === "CART_NOT_FOUND" || code === "EMPTY_CART") {
      return ErrorType.CART_EMPTY;
    }
    if (code?.includes("PAYMENT") || code?.includes("STRIPE")) {
      return ErrorType.PAYMENT;
    }

    return ErrorType.UNKNOWN;
  }

  // ✅ عرض الأخطاء بشكل مناسب
  function handleError(error: any, context: string = "") {
    console.error(`Error in ${context}:`, error);

    const errorType = classifyError(error);
    const message = ERROR_MESSAGES[errorType];

    // عرض رسالة الخطأ
    toast.error(message, {
      duration: errorType === ErrorType.NETWORK ? 8000 : 5000,
    });

    // معالجة خاصة حسب نوع الخطأ
    switch (errorType) {
      case ErrorType.NETWORK:
        setShowRetryButton(true);
        break;

      case ErrorType.CART_EMPTY:
        setCart(null);
        setIsDialogOpen(false);
        router.refresh();
        break;

      case ErrorType.PAYMENT:
        // نعرض خيار الدفع Cash
        toast("You can still use Cash on Delivery", {
          icon: "💡",
          duration: 6000,
        });
        break;
    }
  }

  // ✅ إعادة المحاولة
  async function retryPendingAction() {
    if (!pendingAction) return;

    try {
      await pendingAction.action();
      setPendingAction(null);
      setShowRetryButton(false);
      toast.success("Action completed successfully");
    } catch (error) {
      handleError(error, "Retry");
    }
  }

  // ✅ Delete Product مع Error Handling
  async function deleteCartProduct(productId: string) {
    // تحقق من الاتصال
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.");
      return;
    }

    setLoadingId(productId);

    try {
      const response: CartRes = await deleteProductAction(productId);

      if (response.status === "success") {
        setCart(response);

        if (!response.data?.products || response.data.products.length === 0) {
          toast.success("Last item removed from cart");
          router.refresh();
          setCart(null);
        } else {
          toast.success("Item removed from cart");
        }
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (error) {
      handleError(error, "deleteCartProduct");

      // حفظ الـ action للمحاولة لاحقاً
      setPendingAction({
        type: "delete",
        productId,
        action: () => deleteCartProduct(productId),
      });
    } finally {
      setLoadingId(null);
    }
  }

  // ✅ Update Cart مع Error Handling
  async function updateCart(count: number, productId: string) {
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.");
      return;
    }

    setLoadingId(productId);

    try {
      const response: CartRes = await updateCartAction(count, productId);

      if (response.status === "success") {
        setCart(response);
        toast.success("Cart updated successfully");
      } else {
        throw new Error(response.message || "Failed to update cart");
      }
    } catch (error) {
      handleError(error, "updateCart");

      // إرجاع الـ UI للحالة السابقة
      toast.error("Update failed. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  // ✅ Checkout مع Error Handling شامل
  async function handleCheckOut() {
    const details = detailsInput.current?.value?.trim();
    const city = cityInput.current?.value?.trim();
    const phone = phoneInput.current?.value?.trim();

    // Validation
    if (!details || !city || !phone) {
      toast.error("Please fill all shipping address fields");
      return;
    }

    // تحقق من الـ Cart
    if (
      !cart?.data?._id ||
      !cart?.data?.products ||
      cart.data.products.length === 0
    ) {
      toast.error("Your cart is empty");
      setIsDialogOpen(false);
      router.refresh();
      return;
    }

    // تحقق من الاتصال
    if (!isOnline) {
      toast.error(
        "You are offline. Please check your connection before checkout.",
      );
      return;
    }

    setIsCheckoutLoading(true);

    // ✅ Timeout بعد 30 ثانية
    const timeout = setTimeout(() => {
      setIsCheckoutLoading(false);
      toast.error(
        "Request is taking too long. Please check your connection and try again.",
        { duration: 8000 },
      );
    }, 30000);

    try {
      const response = await checkOutAction(
        cart.data._id,
        details,
        city,
        phone,
      );

      clearTimeout(timeout);

      if (response.status === "success" || response.statusMsg === "success") {
        if (response.session?.url) {
          sessionStorage.setItem("payment_in_progress", "true");

          // حفظ بيانات الـ checkout للـ recovery
          sessionStorage.setItem(
            "checkout_data",
            JSON.stringify({
              cartId: cart.data._id,
              details,
              city,
              phone,
              timestamp: Date.now(),
            }),
          );

          toast.success("Redirecting to payment...");
          window.location.href = response.session.url;
        } else {
          throw new Error("Payment URL not found");
        }
      } else if (response.code === "PAYMENT_SERVICE_UNAVAILABLE") {
        // ✅ Stripe غير متاح
        toast.error(
          "Online payment is temporarily unavailable. You can use Cash on Delivery instead.",
          { duration: 10000 },
        );
        setIsCheckoutLoading(false);
      } else {
        throw new Error(response.message || "Checkout failed");
      }
    } catch (error: any) {
      clearTimeout(timeout);
      handleError(error, "handleCheckOut");

      // حفظ للمحاولة لاحقاً
      setPendingAction({
        type: "checkout",
        data: { details, city, phone },
        action: () => handleCheckOut(),
      });

      setIsCheckoutLoading(false);
    }
  }

  // ✅ Cash Payment مع Error Handling
  async function handleCash() {
    const details = detailsInput.current?.value?.trim();
    const city = cityInput.current?.value?.trim();
    const phone = phoneInput.current?.value?.trim();

    if (!details || !city || !phone) {
      toast.error("Please fill all shipping address fields");
      return;
    }

    if (
      !cart?.data?._id ||
      !cart?.data?.products ||
      cart.data.products.length === 0
    ) {
      toast.error("Your cart is empty");
      setIsDialogOpen(false);
      router.refresh();
      return;
    }

    if (!isOnline) {
      toast.error("You are offline. Please check your connection.");
      return;
    }

    setIsCashLoading(true);

    const timeout = setTimeout(() => {
      setIsCashLoading(false);
      toast.error("Request is taking too long. Please try again.");
    }, 30000);

    try {
      const response = await cashAction(cart.data._id, details, city, phone);

      clearTimeout(timeout);

      if (response.status === "success" || response.statusMsg === "success") {
        toast.success("Order created successfully!");
        setIsDialogOpen(false);
        router.push("/allorders");
      } else if (response.code === "INSUFFICIENT_STOCK") {
        // ✅ منتج معين out of stock
        toast.error(
          `${response.productName || "A product"} is out of stock. Please update your cart.`,
          { duration: 8000 },
        );
        setIsCashLoading(false);
        setIsDialogOpen(false);
        router.refresh();
      } else {
        throw new Error(response.message || "Order creation failed");
      }
    } catch (error: any) {
      clearTimeout(timeout);
      handleError(error, "handleCash");

      // حفظ للمحاولة لاحقاً
      setPendingAction({
        type: "cash",
        data: { details, city, phone },
        action: () => handleCash(),
      });

      setIsCashLoading(false);
    }
  }

  // ✅ Clear Cart مع Error Handling
  async function clearCart() {
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.");
      return;
    }

    setLoadingId("clear");

    try {
      const response: CartRes = await clearCartAction();

      if (response.message === "success") {
        setCart(null);
        toast.success("Cart cleared successfully");
        router.refresh();
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      handleError(error, "clearCart");
    } finally {
      setLoadingId(null);
    }
  }
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/10 text-warning mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-4">You Are Offline</h1>
            <p className="text-muted-foreground mb-8">
              Please check your internet connection and try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.data?.products || cart.data.products.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
        {/* ✅ Retry Banner */}
        {showRetryButton && pendingAction && (
          <div className="bg-warning/10 border-b border-warning/20 py-3">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <p className="text-sm text-warning">
                An action failed. Click retry to try again.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={retryPendingAction}
                disabled={!isOnline}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground dark:text-slate-300 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/30 dark:bg-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 leading-relaxed">
              {cart.numOfCartItems}{" "}
              {cart.numOfCartItems === 1 ? "item" : "items"} ready for checkout
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.data.products.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-linear-to-br from-secondary to-accent/10 shrink-0">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                {item.product.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded">
                                  {item.product.brand?.name || "No brand"}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded">
                                  ⭐{" "}
                                  {item.product.ratingsAverage?.toFixed(1) ||
                                    "N/A"}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteCartProduct(item.product.id)}
                              disabled={loadingId === item.product.id}
                              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                            >
                              {loadingId === item.product.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-1">
                                <button
                                  onClick={() =>
                                    updateCart(item.count - 1, item.product.id)
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-background transition-colors"
                                  disabled={
                                    item.count === 1 ||
                                    loadingId === item.product.id
                                  }
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-semibold">
                                  {loadingId === item.product.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin inline-block" />
                                  ) : (
                                    item.count
                                  )}
                                </span>
                                <button
                                  onClick={() =>
                                    updateCart(item.count + 1, item.product.id)
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-background transition-colors"
                                  disabled={
                                    item.count === item.product.quantity ||
                                    loadingId === item.product.id
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)} each
                              </span>
                            </div>
                            <div className="text-lg font-bold">
                              {formatCurrency(item.price * item.count)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border dark:border-slate-600 rounded-lg font-semibold hover:bg-accent/10 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-8"
            >
              <div className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(cart.data.totalCartPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="h-px bg-border dark:bg-slate-700 my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrency(cart.data.totalCartPrice)}
                    </span>
                  </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-6">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-sm"
                    onInteractOutside={(e) => {
                      if (isCheckoutLoading || isCashLoading) {
                        e.preventDefault();
                      }
                    }}
                    onEscapeKeyDown={(e) => {
                      if (isCheckoutLoading || isCashLoading) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Add Shipping Address</DialogTitle>
                      <DialogDescription>
                        Make sure that you entered the correct address
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>City</Label>
                        <Input
                          id="city"
                          ref={cityInput}
                          placeholder="Enter your city"
                          required
                          disabled={isCheckoutLoading || isCashLoading}
                        />
                      </Field>
                      <Field>
                        <Label>Details</Label>
                        <Input
                          id="details"
                          ref={detailsInput}
                          placeholder="Street address, building, etc."
                          required
                          disabled={isCheckoutLoading || isCashLoading}
                        />
                      </Field>
                      <Field>
                        <Label>Phone</Label>
                        <Input
                          id="phone"
                          ref={phoneInput}
                          placeholder="Your phone number"
                          type="tel"
                          required
                          disabled={isCheckoutLoading || isCashLoading}
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleCheckOut}
                        disabled={isCheckoutLoading || isCashLoading}
                        className="w-full sm:w-auto"
                      >
                        {isCheckoutLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Pay with Visa"
                        )}
                      </Button>
                      <Button
                        onClick={handleCash}
                        disabled={isCashLoading || isCheckoutLoading}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-500/90 dark:bg-green-500/90"
                      >
                        {isCashLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Pay with Cash"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isCheckoutLoading || isCashLoading}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {benefit.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {benefit.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-6">
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        remove all items from your cart.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearCart}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Clear Cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
