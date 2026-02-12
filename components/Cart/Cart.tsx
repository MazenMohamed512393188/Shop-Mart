"use client";

import { useRef, useState } from "react";
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
  DialogClose,
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

export default function CartModern({ cartData }: { cartData: CartRes | null }) {
  const detailsInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);

  const [cart, setCart] = useState<CartRes | null>(cartData || null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isCashLoading, setIsCashLoading] = useState(false);

  const router = useRouter();

  async function deleteCartProduct(productId: string) {
    setLoadingId(productId);
    const response: CartRes = await deleteProductAction(productId);
    if (response.status === "success") {
      setCart(response);
    }
    setLoadingId(null);
  }

  async function clearCart() {
    setLoadingId("clear");
    const response: CartRes = await clearCartAction();
    if (response.message === "success") {
      setCart(null);
    }
    setLoadingId(null);
  }

  async function updateCart(count: number, productId: string) {
    setLoadingId(productId);
    const response: CartRes = await updateCartAction(count, productId);
    if (response.status === "success") {
      setCart(response);
      toast.success("Cart updated successfully");
    }
    setLoadingId(null);
  }

  async function handleCheckOut() {
    const details = detailsInput.current?.value?.trim();
    const city = cityInput.current?.value?.trim();
    const phone = phoneInput.current?.value?.trim();

    if (!details || !city || !phone) {
      toast.error("Please fill all shipping address fields");
      return;
    }

    if (!cart?.data._id) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setIsCheckoutLoading(true);

      const response = await checkOutAction(
        cart.data._id,
        details,
        city,
        phone,
      );

      if (response.status === "success" || response.statusMsg === "success") {
        if (response.session?.url) {
          toast.success("Redirecting to payment...");
          window.location.href = response.session.url;
        } else {
          toast.error("Payment URL not found in response");
        }
      } else {
        toast.error("Checkout failed");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error( "An error occurred during checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  }

  async function handleCash() {
    const details = detailsInput.current?.value?.trim();
    const city = cityInput.current?.value?.trim();
    const phone = phoneInput.current?.value?.trim();

    if (!details || !city || !phone) {
      toast.error("Please fill all shipping address fields");
      return;
    }

    if (!cart?.data._id) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setIsCashLoading(true);

      const response = await cashAction(cart.data._id, details, city, phone);

      if (response.status === "success" || response.statusMsg === "success") {
        toast.success("Order created successfully!");
        router.push("/allorders");
      } else {
        toast.error("Order creation failed");
      }
    } catch (error: any) {
      console.error("Cash payment error:", error);
      toast.error("An error occurred during cash payment");
    } finally {
      setIsCashLoading(false);
    }
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
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
              Looks like you haven't added any items to your cart yet.
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
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/30 dark:from-slate-900 dark:to-slate-800/30">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-muted-foreground dark:text-slate-300">
            {cart.numOfCartItems} item{cart.numOfCartItems !== 1 ? "s" : ""} in
            your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.data.products.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="group bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-4 hover:border-primary/50 hover:shadow-lg transition-all">
                      {loadingId === item.product.id && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center rounded-xl z-10">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}

                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-linear-to-br from-secondary to-accent/10 shrink-0">
                          <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent z-10" />
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="100px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={`/products/${item.product.id}`}>
                                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                  {item.product.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mb-3">
                                {item.product.brand.name}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteCartProduct(item.product.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                                <button
                                  onClick={() =>
                                    updateCart(item.count - 1, item.product._id)
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-background transition-colors"
                                  disabled={
                                    item.count === 1 ||
                                    loadingId === item.product.id
                                  }
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {item.count}
                                </span>
                                <button
                                  onClick={() =>
                                    updateCart(item.count + 1, item.product._id)
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

            {/* Continue Shopping */}
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-8"
            >
              <div className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-border dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Price Breakdown */}
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

                {/* Checkout Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-6">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
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
                        />
                      </Field>
                      <Field>
                        <Label>Details</Label>
                        <Input
                          id="details"
                          ref={detailsInput}
                          placeholder="Street address, building, etc."
                          required
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
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleCheckOut}
                        disabled={isCheckoutLoading}
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
                        disabled={isCashLoading}
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
                      <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Benefits */}
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

                {/* Clear Cart */}
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
